-- Add missing columns to support order details and guest checkout flow

-- 1. Update order_items table to include flavor
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS flavor TEXT;

-- 2. Ensure orders table has all necessary fields for tracking
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_provider TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS guest_email TEXT;

-- 3. Add column for subtotal_cents to orders if missing
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS subtotal_cents INTEGER;

-- 4. Add comments for clarity
COMMENT ON COLUMN public.order_items.flavor IS 'The specific flavor selected (e.g., Apple, Original)';
COMMENT ON COLUMN public.orders.stripe_session_id IS 'Stripe Checkout Session ID for status verification';
