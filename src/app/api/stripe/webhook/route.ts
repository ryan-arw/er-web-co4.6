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

    const supabase = await createClient();

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any;
        const orderId = session.client_reference_id;

        if (!orderId) {
            console.error('No orderId found in session client_reference_id');
            return NextResponse.json({ error: 'No orderId' }, { status: 400 });
        }

        // 1. Update the order status to paid
        const { data: updatedOrder, error: updateError } = await supabase
            .from('orders')
            .update({
                payment_status: 'paid',
                status: 'processing',
                stripe_session_id: session.id,
                // total_cents could be updated from session just to be sure
            })
            .eq('id', orderId)
            .select()
            .single();

        if (updateError) {
            console.error('Supabase update order error:', updateError);
            return NextResponse.json({ error: 'DB Update Error' }, { status: 500 });
        }

        // 2. Handle Guest register
        if (session.metadata.guestRegister === 'true' && session.metadata.password) {
            const { email } = session.customer_details;
            // Password logic — here we'd usually use Supabase auth.signUp
            // But from webhook (server side) we can use service role to create user or skip for now
            // and let the success page handled redirect if needed.
            // WARNING: Sending raw passwords in metadata is not ideal but for this sandbox implementation it's what we have.
            // NOTE: Usually we'd create a secure token and send in email instead.
        }
    }

    return NextResponse.json({ received: true });
}
