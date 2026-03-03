import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

const getPricePerBox = (totalBoxes: number) => {
    if (totalBoxes >= 3) return 121.00;
    if (totalBoxes === 2) return 130.50;
    return 145.00;
};

// Simple Order Number Generator: ER-YYYYMMDD-XXXX
function generateOrderNumber() {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `ER-${date}-${random}`;
}

const PRODUCT_MAP: Record<string, string> = {
    'Original': 'f37b0dd4-275f-444f-9f79-dd7070d9b644',
    'Apple': 'b60da02a-83db-49f6-ae6b-d84a3ba0f4dd'
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { items, shippingInfo, guestRegister, password } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
        }

        const totalBoxesInCart = items.reduce((sum: number, i: any) => sum + i.boxCount, 0);
        const pricePerBoxCents = Math.round(getPricePerBox(totalBoxesInCart) * 100);

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // 1. Prep line items for Stripe
        let totalAmountCents = 0;
        const lineItems = items.map((item: any) => {
            const lineTotalCents = item.boxCount * pricePerBoxCents;
            totalAmountCents += lineTotalCents;

            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${item.name} (${item.flavor})`,
                        description: `Special Bundle Pricing applied: $${(pricePerBoxCents / 100).toFixed(2)} per box`,
                        images: item.image ? [new URL(item.image, process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').href] : [],
                    },
                    unit_amount: pricePerBoxCents,
                },
                quantity: item.boxCount,
            };
        });

        // 2. Create the parent Order record
        const orderNumber = generateOrderNumber();
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                user_id: user?.id || null,
                order_number: orderNumber,
                guest_email: user ? null : shippingInfo.email,
                total_cents: totalAmountCents,
                subtotal_cents: totalAmountCents,
                status: 'pending',
                payment_status: 'pending',
                payment_provider: 'stripe',
                shipping_address: shippingInfo,
                source: 'web_checkout'
            })
            .select()
            .single();

        if (orderError) throw orderError;

        // 3. Create Order Items
        const orderItemsToInsert = items.map((item: any) => {
            return {
                order_id: order.id,
                product_id: PRODUCT_MAP[item.flavor] || PRODUCT_MAP['Original'],
                flavor: item.flavor,
                quantity: item.boxCount,
                unit_price_cents: pricePerBoxCents,
                total_cents: pricePerBoxCents * item.boxCount
            };
        });

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItemsToInsert);

        if (itemsError) console.error('Error inserting order items:', itemsError);

        // 4. Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${req.headers.get('origin')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('origin')}/checkout/cancel`,
            customer_email: user?.email || shippingInfo.email,
            client_reference_id: order.id.toString(),
            metadata: {
                orderId: order.id.toString(),
                guestRegister: guestRegister ? 'true' : 'false',
                password: password || '',
            },
        });

        // Update with session ID
        await supabase.from('orders').update({ stripe_session_id: session.id }).eq('id', order.id);

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error('Stripe Checkout Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
