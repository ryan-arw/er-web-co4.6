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
                // 2. Update order status in Supabase
                const { data: order, error } = await supabase
                    .from('orders')
                    .update({
                        status: 'processing',
                        payment_status: 'paid'
                    })
                    .eq('id', orderId)
                    .select()
                    .single();

                if (error) throw error;
                return NextResponse.json({ success: true, status: order.status });
            }
        }

        return NextResponse.json({ success: false, status: 'not_paid' });
    } catch (err: any) {
        console.error('Session verification error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
