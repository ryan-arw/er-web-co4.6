import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
        return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
    }

    try {
        const supabase = supabaseAdmin;

        // 1. Retrieve session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            const orderId = session.client_reference_id;

            if (orderId) {
                // 2. Update order status in Supabase - USE ADMIN
                const { data: order, error } = await supabase
                    .from('orders')
                    .update({
                        status: 'processing',
                        payment_status: 'paid',
                        stripe_session_id: session.id,
                    })
                    .eq('id', orderId)
                    .select()
                    .single();

                if (error) throw error;

                const customerEmail = order.guest_email || session.customer_details?.email;

                // 3. FALLBACK: Handle Auto-Registration (If webhook hasn't done it yet)
                if (session.metadata?.guestRegister === 'true' && session.metadata?.password && customerEmail) {
                    try {
                        const { data: existingUser } = await supabase.auth.admin.listUsers();
                        const userExists = existingUser.users.find(u => u.email?.toLowerCase() === customerEmail.toLowerCase());

                        if (!userExists) {
                            const { data: newUser } = await supabase.auth.admin.createUser({
                                email: customerEmail,
                                password: session.metadata.password,
                                email_confirm: true,
                                user_metadata: {
                                    full_name: session.customer_details?.name || '',
                                    source: 'checkout_registration_fallback'
                                }
                            });

                            if (newUser.user) {
                                await supabase.from('orders').update({ user_id: newUser.user.id, guest_email: null }).eq('id', orderId);
                                console.log(`[VerifySession] Created user for ${customerEmail}`);
                            }
                        } else {
                            // Link if not already linked
                            if (!order.user_id) {
                                await supabase.from('orders').update({ user_id: userExists.id, guest_email: null }).eq('id', orderId);
                            }
                        }
                    } catch (regError) {
                        console.error('[VerifySession] Auto-registration fallback failed:', regError);
                    }
                }

                // 4. DEDUCT INVENTORY
                try {
                    const { deductInventoryForOrder } = await import('@/lib/inventory');
                    await deductInventoryForOrder(orderId);
                } catch (invError) {
                    console.error('[VerifySession] Inventory deduction failed:', invError);
                }

                // 5. GET FULL ORDER DATA for UI and Email
                const { data: orderWithItems } = await supabase
                    .from('orders')
                    .select(`*, order_items(*, products(name))`)
                    .eq('id', orderId)
                    .single();

                // 5. FALLBACK: Send Emails (Check logs first to avoid duplicates)
                try {
                    const { data: existingLogs } = await supabase
                        .from('email_logs')
                        .select('id')
                        .eq('to_email', customerEmail)
                        .eq('metadata->>order_id', orderId)
                        .eq('status', 'sent');

                    if ((!existingLogs || existingLogs.length === 0) && orderWithItems && customerEmail) {
                        const { dispatchEmail } = await import('@/lib/mail');
                        const OrderConfirmationEmail = (await import('@/components/emails/OrderConfirmationEmail')).default;
                        const AdminOrderNotificationEmail = (await import('@/components/emails/AdminOrderNotificationEmail')).default;

                        await dispatchEmail({
                            emailType: 'order_confirmation',
                            to: customerEmail,
                            subject: `Confirming Your Order #${orderWithItems.order_number}`,
                            reactTemplate: OrderConfirmationEmail({
                                customerName: session.customer_details?.name || 'Customer',
                                orderNumber: orderWithItems.order_number,
                                orderDate: new Date(orderWithItems.created_at).toLocaleDateString(),
                                items: orderWithItems.order_items.map((item: any) => ({
                                    name: item.products?.name || 'Product',
                                    quantity: item.quantity,
                                    price: `$${(item.total_cents / 100).toFixed(2)}`,
                                })),
                                totalAmount: `$${(orderWithItems.total_cents / 100).toFixed(2)}`,
                                shippingAddress: orderWithItems.shipping_address as any,
                            }),
                            metadata: { order_id: orderId, source: 'verify_session_fallback' },
                        });

                        // Admin Alert
                        await dispatchEmail({
                            emailType: 'admin_order_notification' as any,
                            to: 'support@ezyrelife.com',
                            subject: `💰 NEW ORDER Received #${orderWithItems.order_number}`,
                            reactTemplate: AdminOrderNotificationEmail({
                                orderNumber: orderWithItems.order_number,
                                customerEmail,
                                totalAmount: `$${(orderWithItems.total_cents / 100).toFixed(2)}`,
                                orderDate: new Date(orderWithItems.created_at).toLocaleDateString(),
                                items: orderWithItems.order_items.map((item: any) => ({
                                    name: item.products?.name || 'Product',
                                    quantity: item.quantity,
                                    price: `$${(item.total_cents / 100).toFixed(2)}`,
                                })),
                                shippingAddress: orderWithItems.shipping_address as any,
                            }),
                            metadata: { order_id: orderId },
                            fromName: 'EzyRelife Sales',
                        });
                    }
                } catch (mailError) {
                    console.error('[VerifySession] Email fallback failed:', mailError);
                }

                if (!orderWithItems) {
                    return NextResponse.json({ success: true, status: order.status });
                }

                return NextResponse.json({
                    success: true,
                    status: order.status,
                    order: {
                        order_number: orderWithItems.order_number,
                        total_cents: orderWithItems.total_cents,
                        subtotal_cents: orderWithItems.subtotal_cents,
                        shipping_address: orderWithItems.shipping_address,
                        items: orderWithItems.order_items.map((item: any) => ({
                            name: item.products?.name || 'Product',
                            flavor: item.flavor,
                            quantity: item.quantity,
                            price_cents: item.unit_price_cents
                        }))
                    }
                });
            }
        }

        return NextResponse.json({ success: false, status: 'not_paid' });
    } catch (err: any) {
        console.error('Session verification error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
