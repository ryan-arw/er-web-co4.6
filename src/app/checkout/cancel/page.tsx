'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, ShoppingBag, ShieldAlert } from 'lucide-react';
import Navbar from '@/components/marketing/Navbar';

export default function CancelPage() {
    return (
        <>
            <Navbar />
            <main className="pt-32 pb-20 min-h-screen bg-ivory/30 flex items-center justify-center">
                <div className="max-w-md w-full px-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-[2.5rem] p-10 text-center shadow-xl shadow-warm-orange/5 border border-border-soft"
                    >
                        <div className="w-20 h-20 rounded-full bg-warm-orange/10 flex items-center justify-center text-warm-orange mx-auto mb-6">
                            <ShieldAlert size={40} />
                        </div>

                        <h1 className="text-2xl font-black text-herbal-green mb-2">Payment Cancelled</h1>
                        <p className="text-sm text-text-muted mb-8">
                            Your payment was not completed. No charges were made. If you experienced an issue, please try a different payment method.
                        </p>

                        <div className="grid gap-3">
                            <Link href="/checkout" className="btn-primary text-sm py-3.5 flex items-center justify-center gap-2 shadow-xl shadow-warm-orange/20">
                                <ArrowLeft size={16} /> Back to Checkout
                            </Link>
                            <Link href="/products" className="text-sm font-bold text-text-muted hover:text-herbal-green flex items-center justify-center gap-2 py-2">
                                <ShoppingBag size={16} /> Browse Products
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </main>
        </>
    );
}
