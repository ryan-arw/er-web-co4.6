-- Vitalic D Order System Database Patch
-- Safe update for orders table to support Global Payments (Stripe/PayPal)

-- 1. Support Guest Checkout (Allow user_id to be NULL)
-- This is critical! If user_id is NOT NULL, Stripe/PayPal checkouts for guests will fail.
DO $$ 
BEGIN
    ALTER TABLE public.orders ALTER COLUMN user_id DROP NOT NULL;
EXCEPTION
    WHEN others THEN NULL;
END $$;

-- 2. Add missing fields (IF NOT EXISTS)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS guest_email TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_provider TEXT; -- 'stripe' or 'paypal'
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS paypal_order_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';

-- 3. Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session_id ON public.orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_paypal_order_id ON public.orders(paypal_order_id);

-- 4. Set order_number as TEXT if it's currently something else or Ensure it's not NULL
-- Note: Make sure 'order_number' exists based on the base schema.

COMMENT ON COLUMN public.orders.payment_status IS 'Current payment state: pending, paid, failed, refunded';
