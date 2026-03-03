import { NextResponse } from "next/server";
import * as paypal from "@/lib/paypal";
import { createClient } from '@/lib/supabase/server';

const getPricePerBox = (totalBoxes: number) => {
    if (totalBoxes >= 3) return 121.00;
    if (totalBoxes === 2) return 130.50;
    return 145.00;
};

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
        const { items, shippingInfo } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        const totalBoxesInCart = items.reduce((sum: number, i: any) => sum + i.boxCount, 0);
        const pricePerBox = getPricePerBox(totalBoxesInCart);
        const totalAmountUSD = totalBoxesInCart * pricePerBox;

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // 2. Create PayPal Order via SDK
        const order = await paypal.createOrder({
            cart: items.map((i: any) => ({
                ...i,
                name: `${i.name} (${i.flavor})`,
                boxCount: i.boxCount,
                price: pricePerBox
            })),
            totalPrice: totalAmountUSD,
        });

        const orderNumber = generateOrderNumber();

        // 3. Store Order record in Supabase
        const { data: dbOrder, error: orderError } = await supabase
            .from('orders')
            .insert({
                user_id: user?.id || null,
                order_number: orderNumber,
                guest_email: user ? null : shippingInfo.email,
                total_cents: Math.round(totalAmountUSD * 100),
                subtotal_cents: Math.round(totalAmountUSD * 100),
                status: 'pending',
                payment_status: 'pending',
                payment_provider: 'paypal',
                paypal_order_id: order.id,
                shipping_address: shippingInfo,
                source: 'web_checkout_paypal'
            })
            .select()
            .single();

        if (orderError) throw orderError;

        // 4. Record Order Items
        const orderItemsToInsert = items.map((item: any) => {
            return {
                order_id: dbOrder.id,
                product_id: PRODUCT_MAP[item.flavor] || PRODUCT_MAP['Original'],
                flavor: item.flavor,
                quantity: item.boxCount,
                unit_price_cents: Math.round(pricePerBox * 100),
                total_cents: Math.round(pricePerBox * 100 * item.boxCount)
            };
        });

        await supabase.from('order_items').insert(orderItemsToInsert);

        return NextResponse.json(order);
    } catch (err: any) {
        console.error('PayPal Create Order Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
