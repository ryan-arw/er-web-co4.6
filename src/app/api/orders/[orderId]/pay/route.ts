import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST(
    req: Request,
    { params }: { params: { orderId: string } }
) {
    try {
        const orderId = params.orderId;
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Fetch Order and items
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*, order_items(*, products(*))')
            .eq('id', orderId)
            .eq('user_id', user.id)
            .single();

        if (orderError || !order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        if (order.payment_status === 'paid') {
            return NextResponse.json({ error: 'Order already paid' }, { status: 400 });
        }

        // 2. Determine Payment Provider
        const provider = order.payment_provider || 'stripe';

        if (provider === 'stripe') {
            // Generate Stripe Session
            const lineItems = order.order_items.map((item: any) => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${item.products?.name || 'Vitalic D'} (${item.flavor || 'Original'})`,
                        // description: `Retry payment for order ${order.order_number}`,
                    },
                    unit_amount: item.unit_price_cents,
                },
                quantity: item.quantity,
            }));

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: lineItems,
                mode: 'payment',
                success_url: `${req.headers.get('origin')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${req.headers.get('origin')}/checkout/cancel`,
                customer_email: user.email,
                client_reference_id: order.id.toString(),
                metadata: {
                    orderId: order.id.toString(),
                },
            });

            // Update order with new session ID
            await supabase.from('orders').update({ stripe_session_id: session.id }).eq('id', order.id);

            return NextResponse.json({ url: session.url });
        } else if (provider === 'paypal') {
            // For PayPal, we handle it client-side with the PayPal button usually, 
            // but we could return the paypal_order_id if it's still valid or generate a new one.
            // Simple approach for now: return order info and let client handle UI.
            return NextResponse.json({ provider: 'paypal', paypalOrderId: order.paypal_order_id });
        }

        return NextResponse.json({ error: 'Unsupported provider' }, { status: 400 });

    } catch (err: any) {
        console.error('Retry Payment Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
