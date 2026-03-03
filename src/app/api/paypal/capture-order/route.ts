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
                .eq('paypal_order_id', orderID);

            if (error) {
                console.error('Supabase update PayPal order error:', error);
            }
        }

        return NextResponse.json(captureData);
    } catch (err: any) {
        console.error('PayPal Capture Order Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
