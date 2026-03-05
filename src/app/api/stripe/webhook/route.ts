import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature') as string;

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        if (!signature || !webhookSecret) {
            return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
        }
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    const { supabaseAdmin } = await import('@/lib/supabase/admin');

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any;
        const orderId = session.client_reference_id;

        if (!orderId) {
            console.error('No orderId found in session client_reference_id');
            return NextResponse.json({ error: 'No orderId' }, { status: 400 });
        }

        // 1. Update the order status to paid - USE ADMIN
        const { data: updatedOrder, error: updateError } = await supabaseAdmin
            .from('orders')
            .update({
                payment_status: 'paid',
                status: 'processing',
                stripe_session_id: session.id,
            })
            .eq('id', orderId)
            .select()
            .single();

        if (updateError) {
            console.error('Supabase update order error:', updateError);
            return NextResponse.json({ error: 'DB Update Error' }, { status: 500 });
        }

        const customerEmail = updatedOrder.guest_email || session.customer_details?.email;

        // 1b. Deduct Inventory
        try {
            const { deductInventoryForOrder } = await import('@/lib/inventory');
            await deductInventoryForOrder(orderId);
        } catch (invErr) {
            console.error('[Webhook] Inventory deduction error:', invErr);
        }

        // 2. Handle Guest register (Auto Account Creation)
        if (session.metadata?.guestRegister === 'true' && session.metadata?.password && customerEmail) {
            try {
                // Check if user already exists to avoid errors
                const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
                const userExists = existingUser.users.find(u => u.email?.toLowerCase() === customerEmail.toLowerCase());

                if (!userExists) {
                    const { data: newUser, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
                        email: customerEmail,
                        password: session.metadata.password,
                        email_confirm: true, // Auto confirm for checkout users
                        user_metadata: {
                            full_name: session.customer_details?.name || '',
                            source: 'checkout_registration'
                        }
                    });

                    if (newUser.user) {
                        // Link order to new user
                        await supabaseAdmin
                            .from('orders')
                            .update({ user_id: newUser.user.id, guest_email: null })
                            .eq('id', orderId);

                        console.log(`[Webhook] Created new user for ${customerEmail}`);
                    }
                } else {
                    // Just link to existing user if not already linked
                    await supabaseAdmin
                        .from('orders')
                        .update({ user_id: userExists.id, guest_email: null })
                        .eq('id', orderId);
                }
            } catch (regError) {
                console.error('Auto-registration failed:', regError);
            }
        }

        // 3. Send Emails
        try {
            const { data: orderWithItems, error: fetchError } = await supabaseAdmin
                .from('orders')
                .select(`
                    *,
                    order_items (
                        *,
                        products (name)
                    )
                `)
                .eq('id', orderId)
                .single();

            if (!fetchError && orderWithItems) {
                if (customerEmail) {
                    const { dispatchEmail } = await import('@/lib/mail');
                    const OrderConfirmationEmail = (await import('@/components/emails/OrderConfirmationEmail')).default;

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
                            shippingAddress: orderWithItems.shipping_address,
                        }),
                        metadata: { order_id: orderId },
                    });

                    // 3b. Send NEW ORDER ALERT to Admin
                    const AdminOrderNotificationEmail = (await import('@/components/emails/AdminOrderNotificationEmail')).default;
                    await dispatchEmail({
                        emailType: 'admin_order_notification' as any,
                        to: 'support@ezyrelife.com',
                        subject: `💰 NEW ORDER Received #${orderWithItems.order_number}`,
                        reactTemplate: AdminOrderNotificationEmail({
                            orderNumber: orderWithItems.order_number,
                            customerEmail: customerEmail,
                            totalAmount: `$${(orderWithItems.total_cents / 100).toFixed(2)}`,
                            orderDate: new Date(orderWithItems.created_at).toLocaleDateString(),
                            items: orderWithItems.order_items.map((item: any) => ({
                                name: item.products?.name || 'Product',
                                quantity: item.quantity,
                                price: `$${(item.total_cents / 100).toFixed(2)}`,
                            })),
                            shippingAddress: orderWithItems.shipping_address,
                        }),
                        metadata: { order_id: orderId },
                        fromName: 'EzyRelife Sales',
                    });
                }
            }
        } catch (mailError) {
            console.error('Error sending confirmation email:', mailError);
        }
    }

    return NextResponse.json({ received: true });
}
