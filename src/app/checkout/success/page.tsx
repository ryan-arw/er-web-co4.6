'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, ArrowRight, Home, ShoppingBag, Loader2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Navbar from '@/components/marketing/Navbar';

export default function SuccessPage() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const paypalOrderId = searchParams.get('paypal_order_id');
    const { clearCart } = useCart();
    const router = useRouter();
    const [verifying, setVerifying] = useState(true);

    useEffect(() => {
        const verifyAndClear = async () => {
            // Clear cart immediately
            clearCart();

            if (sessionId) {
                try {
                    // Force a server-side check for Stripe
                    await fetch(`/api/stripe/verify-session?session_id=${sessionId}`);
                    setVerifying(false);
                } catch (err) {
                    console.error('Verification failed', err);
                    setVerifying(false);
                }
            } else if (paypalOrderId) {
                // PayPal status is usually updated during capture-order
                setTimeout(() => setVerifying(false), 1500);
            } else {
                setVerifying(false);
            }
        };

        verifyAndClear();
    }, [sessionId, paypalOrderId, clearCart]);

    return (
        <>
            <Navbar />
            <main className="pt-32 pb-20 min-h-screen bg-ivory/30 flex items-center justify-center">
                <div className="max-w-md w-full px-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-[2.5rem] p-10 text-center shadow-xl shadow-herbal-green/5 border border-border-soft"
                    >
                        {verifying ? (
                            <div className="py-10">
                                <Loader2 size={48} className="text-morning-green mx-auto animate-spin mb-4" />
                                <h2 className="text-xl font-bold text-herbal-green">Verifying Payment...</h2>
                                <p className="text-sm text-text-muted mt-2">Just a moment while we process your order.</p>
                            </div>
                        ) : (
                            <>
                                <div className="w-20 h-20 rounded-full bg-morning-green/10 flex items-center justify-center text-morning-green mx-auto mb-6">
                                    <CheckCircle2 size={40} />
                                </div>

                                <h1 className="text-2xl font-black text-herbal-green mb-2">Order Confirmed!</h1>
                                <p className="text-sm text-text-muted mb-8">
                                    Thank you for your purchase. We've sent a confirmation email to your inbox.
                                </p>

                                <div className="bg-ivory/50 rounded-2xl p-4 mb-8 text-left border border-border-soft">
                                    <div className="flex items-center gap-3 text-herbal-green mb-1">
                                        <Package size={16} />
                                        <span className="text-xs font-bold uppercase tracking-widest">Order Status</span>
                                    </div>
                                    <p className="text-sm font-semibold text-herbal-green">Processing & Packing</p>
                                    <p className="text-[10px] text-text-muted mt-1">
                                        Estimated delivery: 3-5 business days.
                                    </p>
                                </div>

                                <div className="grid gap-3">
                                    <Link href="/dashboard/orders" className="btn-primary text-sm py-3.5 flex items-center justify-center gap-2">
                                        View Order History <ArrowRight size={16} />
                                    </Link>
                                    <Link href="/" className="text-sm font-bold text-text-muted hover:text-herbal-green flex items-center justify-center gap-2 py-2">
                                        <Home size={16} /> Return Home
                                    </Link>
                                </div>
                            </>
                        )}
                    </motion.div>
                </div>
            </main>
        </>
    );
}
