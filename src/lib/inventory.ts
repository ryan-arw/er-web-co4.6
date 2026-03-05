import { supabaseAdmin } from './supabase/admin';

/**
 * Deducts inventory for an order by creating entries in inventory_logs.
 * This should be called once the payment is confirmed.
 */
export async function deductInventoryForOrder(orderId: string) {
    console.log(`[Inventory] Deducting stock for order ${orderId}...`);

    try {
        // 1. Fetch order items
        const { data: items, error: itemsError } = await supabaseAdmin
            .from('order_items')
            .select('product_id, quantity, products(name)')
            .eq('order_id', orderId);

        if (itemsError) throw itemsError;
        if (!items || items.length === 0) {
            console.warn(`[Inventory] No items found for order ${orderId}. Skipping deduction.`);
            return;
        }

        // 2. Check if we've already deducted for this order to prevent double deduction
        const { data: existingLogs } = await supabaseAdmin
            .from('inventory_logs')
            .select('id')
            .eq('reason', `Order ${orderId} purchase`)
            .limit(1);

        if (existingLogs && existingLogs.length > 0) {
            console.log(`[Inventory] Stock already deducted for order ${orderId}. Skipping.`);
            return;
        }

        // 3. Process each item
        for (const item of items) {
            // Get current balance
            const { data: latestLog } = await supabaseAdmin
                .from('inventory_logs')
                .select('balance_after')
                .eq('product_id', item.product_id)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            const currentBalance = latestLog?.balance_after ?? 0;
            const newBalance = currentBalance - item.quantity;

            // Insert log entry
            const { error: logError } = await supabaseAdmin
                .from('inventory_logs')
                .insert({
                    product_id: item.product_id,
                    user_id: null, // System action
                    delta: -item.quantity,
                    reason: `Order ${orderId} purchase`,
                    balance_after: newBalance
                });

            if (logError) {
                console.error(`[Inventory] Failed to log deduction for product ${item.product_id}:`, logError);
            } else {
                const productName = (item.products as any)?.name || item.product_id;
                console.log(`[Inventory] Deducted ${item.quantity} for ${productName}. New balance: ${newBalance}`);
            }
        }
    } catch (err) {
        console.error(`[Inventory] Error deducting stock for order ${orderId}:`, err);
    }
}
