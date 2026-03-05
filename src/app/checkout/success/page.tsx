'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    CheckCircle2,
    Package,
    ArrowRight,
    Home,
    Loader2,
    Truck,
    ShoppingBag,
    Mail,
    MapPin,
    Calendar,
    ExternalLink
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Navbar from '@/components/marketing/Navbar';
import confetti from 'canvas-confetti';

interface OrderItem {
    name: string;
    flavor?: string;
    quantity: number;
    price_cents: number;
}

interface OrderData {
    order_number: string;
    total_cents: number;
    subtotal_cents: number;
    shipping_address: any;
    items: OrderItem[];
}

export default function SuccessPage() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const paypalOrderId = searchParams.get('paypal_order_id');
    const { clearCart } = useCart();
    const [verifying, setVerifying] = useState(true);
    const [orderData, setOrderData] = useState<OrderData | null>(null);

    useEffect(() => {
        const verifyAndFetch = async () => {
            // Clear cart immediately
            clearCart();

            if (sessionId) {
                try {
                    const res = await fetch(`/api/stripe/verify-session?session_id=${sessionId}`);
                    const data = await res.json();
                    if (data.success) {
                        setOrderData(data.order);
                        triggerConfetti();
                    }
                    setVerifying(false);
                } catch (err) {
                    console.error('Verification failed', err);
                    setVerifying(false);
                }
            } else if (paypalOrderId) {
                // PayPal handling (simplified for now as backend capture handles most)
                setTimeout(() => {
                    setVerifying(false);
                    triggerConfetti();
                }, 2000);
            } else {
                setVerifying(false);
            }
        };

        verifyAndFetch();
    }, [sessionId, paypalOrderId, clearCart]);

    const triggerConfetti = () => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <>
            <Navbar />
            <main className="pt-28 pb-20 min-h-screen bg-[#FDFCF9] flex items-center justify-center">
                <div className="max-w-2xl w-full px-6">
                    {verifying ? (
                        <div className="text-center py-20">
                            <Loader2 size={48} className="text-morning-green mx-auto animate-spin mb-6" />
                            <h2 className="text-2xl font-black text-herbal-green">Securing Your Order...</h2>
                            <p className="text-text-muted mt-2">We're finalizing your payment details.</p>
                        </div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-6"
                        >
                            {/* Success Header Card */}
                            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 text-center shadow-2xl shadow-herbal-green/5 border border-border-soft overflow-hidden relative">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", damping: 12, stiffness: 200 }}
                                    className="w-24 h-24 rounded-full bg-morning-green/10 flex items-center justify-center text-morning-green mx-auto mb-8 relative z-10"
                                >
                                    <CheckCircle2 size={48} />
                                </motion.div>

                                <h1 className="text-3xl md:text-4xl font-black text-herbal-green mb-3 relative z-10">Order Confirmed!</h1>
                                <p className="text-text-muted mb-8 max-w-sm mx-auto z-10 relative">
                                    Woohoo! Your lifestyle upgrade is on its way. We've sent the details to your email.
                                </p>

                                {orderData && (
                                    <div className="inline-flex items-center gap-2 bg-ivory px-4 py-2 rounded-full text-sm font-bold text-herbal-green border border-morning-green/10 mb-2">
                                        Order #{orderData.order_number}
                                    </div>
                                )}
                            </div>

                            {/* Order Progress Card */}
                            <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-herbal-green/5 border border-border-soft">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 rounded-xl bg-morning-green/10 flex items-center justify-center text-morning-green">
                                        <Truck size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-herbal-green">Delivery Status</h3>
                                        <p className="text-xs text-text-muted">Estimated arrival in 3-5 business days</p>
                                    </div>
                                </div>

                                <div className="relative pt-2 pb-6 px-2">
                                    {/* Progress Line */}
                                    <div className="absolute top-[26px] left-8 right-8 h-[2px] bg-border-soft" />
                                    <div className="absolute top-[26px] left-8 w-1/3 h-[2px] bg-morning-green" />

                                    <div className="relative flex justify-between">
                                        <div className="flex flex-col items-center gap-3 text-center">
                                            <div className="w-8 h-8 rounded-full bg-morning-green flex items-center justify-center text-white ring-4 ring-morning-green/10 relative z-10">
                                                <ShoppingBag size={14} />
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-morning-green">Confirmed</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-3 text-center">
                                            <div className="w-8 h-8 rounded-full bg-morning-green flex items-center justify-center text-white ring-4 ring-morning-green/10 relative z-10">
                                                <Package size={14} />
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-morning-green">Processing</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-3 text-center opacity-40">
                                            <div className="w-8 h-8 rounded-full bg-white border-2 border-border-soft flex items-center justify-center text-text-muted relative z-10">
                                                <Truck size={14} />
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Shipped</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-3 text-center opacity-40">
                                            <div className="w-8 h-8 rounded-full bg-white border-2 border-border-soft flex items-center justify-center text-text-muted relative z-10">
                                                <CheckCircle2 size={14} />
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Delivered</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Order Summary Card */}
                                <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-herbal-green/5 border border-border-soft flex flex-col">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-morning-green/10 flex items-center justify-center text-morning-green">
                                            <ShoppingBag size={20} />
                                        </div>
                                        <h3 className="font-bold text-herbal-green">Order Summary</h3>
                                    </div>

                                    <div className="space-y-4 flex-grow mb-6">
                                        {orderData?.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-start gap-4">
                                                <div className="flex-grow">
                                                    <p className="text-sm font-bold text-herbal-green leading-tight">{item.name}</p>
                                                    <p className="text-xs text-text-muted mt-0.5">
                                                        {item.flavor && `${item.flavor} · `}Qty: {item.quantity}
                                                    </p>
                                                </div>
                                                <p className="text-sm font-bold text-herbal-green">${(item.price_cents / 100).toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-4 border-t border-border-soft space-y-2">
                                        <div className="flex justify-between text-xs text-text-muted">
                                            <span>Subtotal</span>
                                            <span>${((orderData?.subtotal_cents || 0) / 100).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-text-muted">
                                            <span>Shipping</span>
                                            <span className="text-morning-green font-medium">calculated at checkout</span>
                                        </div>
                                        <div className="flex justify-between text-base font-black text-herbal-green pt-2">
                                            <span>Total paid</span>
                                            <span>${((orderData?.total_cents || 0) / 100).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Bottom Right Column */}
                                <div className="space-y-6">
                                    {/* Shipping Address Card */}
                                    <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-herbal-green/5 border border-border-soft">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-morning-green/10 flex items-center justify-center text-morning-green">
                                                <MapPin size={20} />
                                            </div>
                                            <h3 className="font-bold text-herbal-green">Shipping To</h3>
                                        </div>

                                        {orderData?.shipping_address ? (
                                            <div className="text-sm text-text-muted leading-relaxed">
                                                <p className="font-bold text-herbal-green mb-1">{orderData.shipping_address.name}</p>
                                                <p>{orderData.shipping_address.line1}</p>
                                                {orderData.shipping_address.line2 && <p>{orderData.shipping_address.line2}</p>}
                                                <p>{orderData.shipping_address.city}, {orderData.shipping_address.state} {orderData.shipping_address.postal_code}</p>
                                                <p>{orderData.shipping_address.country}</p>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-text-muted italic">Details in your confirmation email</p>
                                        )}
                                    </motion.div>

                                    {/* Action Card */}
                                    <motion.div variants={itemVariants} className="bg-herbal-green rounded-[2.5rem] p-8 text-white shadow-xl shadow-herbal-green/20">
                                        <h3 className="font-bold mb-4">Want to track this?</h3>
                                        <p className="text-sm text-white/70 mb-6 leading-relaxed">
                                            Create an account or log in to track your delivery in real-time.
                                        </p>
                                        <Link href="/dashboard/orders" className="w-full bg-morning-green hover:bg-morning-green/90 text-white rounded-2xl py-3 px-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                                            View Order History <ArrowRight size={16} />
                                        </Link>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Footer Links */}
                            <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center justify-center gap-6 pt-4">
                                <Link href="/" className="text-sm font-bold text-text-muted hover:text-herbal-green flex items-center gap-2 transition-colors">
                                    <Home size={16} /> Back to Home
                                </Link>
                                <Link href="/contact" className="text-sm font-bold text-text-muted hover:text-herbal-green flex items-center gap-2 transition-colors">
                                    <Mail size={16} /> Need help?
                                </Link>
                            </motion.div>
                        </motion.div>
                    )}
                </div>
            </main>
        </>
    );
}
