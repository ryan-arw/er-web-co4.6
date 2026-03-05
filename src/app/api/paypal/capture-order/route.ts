import { NextResponse } from "next/server";
import * as paypal from "@/lib/paypal";
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { orderID } = body;

        if (!orderID) {
            return NextResponse.json({ error: "orderID is missing" }, { status: 400 });
        }

        const captureData = await paypal.captureOrder(orderID);

        // Update database if paid successfully
        if (captureData.status === "COMPLETED") {
            const supabase = await createClient();
            const { data, error } = await supabase
                .from('orders')
                .update({
                    payment_status: 'paid',
                    status: 'processing'
                })
                .eq('paypal_order_id', orderID)
                .select()
                .single();

            if (!error && data) {
                // Deduct Inventory
                try {
                    const { deductInventoryForOrder } = await import('@/lib/inventory');
                    await deductInventoryForOrder(data.id);
                } catch (invErr) {
                    console.error('Inventory deduction error (PayPal Logic):', invErr);
                }

                // Send Email Notification
                try {
                    const { data: orderWithItems, error: fetchError } = await supabase
                        .from('orders')
                        .select(`
                            *,
                            order_items (
                                *,
                                products (name)
                            )
                        `)
                        .eq('id', data.id)
                        .single();

                    if (!fetchError && orderWithItems) {
                        const { dispatchEmail } = await import('@/lib/mail');
                        const OrderConfirmationEmail = (await import('@/components/emails/OrderConfirmationEmail')).default;

                        await dispatchEmail({
                            emailType: 'order_confirmation',
                            to: orderWithItems.guest_email || 'customer@example.com',
                            subject: `Confirming Your Order #${orderWithItems.order_number}`,
                            reactTemplate: OrderConfirmationEmail({
                                customerName: 'Valued Customer',
                                orderNumber: orderWithItems.order_number,
                                orderDate: new Date(orderWithItems.created_at).toLocaleDateString(),
                                items: orderWithItems.order_items.map((item: any) => ({
                                    name: item.products?.name || 'Product',
                                    quantity: item.quantity,
                                    price: `$${(item.total_cents / 100).toFixed(2)}`,
                                })),
                                totalAmount: `$${(orderWithItems.total_cents / 100).toFixed(2)}`,
                                shippingAddress: orderWithItems.shipping_address,
                            }),
                            metadata: { order_id: data.id },
                        });

                        // Send NEW ORDER ALERT to Admin
                        const AdminOrderNotificationEmail = (await import('@/components/emails/AdminOrderNotificationEmail')).default;
                        await dispatchEmail({
                            emailType: 'admin_order_notification' as any,
                            to: 'support@ezyrelife.com',
                            subject: `💰 NEW ORDER Received #${orderWithItems.order_number}`,
                            reactTemplate: AdminOrderNotificationEmail({
                                orderNumber: orderWithItems.order_number,
                                customerEmail: orderWithItems.guest_email || 'customer@example.com',
                                totalAmount: `$${(orderWithItems.total_cents / 100).toFixed(2)}`,
                                orderDate: new Date(orderWithItems.created_at).toLocaleDateString(),
                                items: orderWithItems.order_items.map((item: any) => ({
                                    name: item.products?.name || 'Product',
                                    quantity: item.quantity,
                                    price: `$${(item.total_cents / 100).toFixed(2)}`,
                                })),
                                shippingAddress: orderWithItems.shipping_address,
                            }),
                            metadata: { order_id: data.id },
                            fromName: 'EzyRelife Sales',
                        });
                    }
                } catch (mailError) {
                    console.error('Error sending PayPal confirmation email:', mailError);
                }
            } else if (error) {
                console.error('Supabase update PayPal order error:', error);
            }
        }

        return NextResponse.json(captureData);
    } catch (err: any) {
        console.error('PayPal Capture Order Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
