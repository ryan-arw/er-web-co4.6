'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    ArrowLeft, ArrowRight, CreditCard, Shield,
    Lock, Loader2, MapPin, Truck, Package
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Navbar from '@/components/marketing/Navbar';

export default function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCart();
    const router = useRouter();
    const [step, setStep] = useState<'info' | 'payment'>('info');
    const [loading, setLoading] = useState(false);

    // Shipping info
    const [shippingInfo, setShippingInfo] = useState({
        name: '', email: '', phone: '',
        line1: '', line2: '', city: '', state: '', zip: '', country: 'Malaysia',
    });

    const handleInfoSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('payment');
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate Stripe checkout (will be replaced with actual Stripe integration)
        // In production: POST to /api/checkout → Stripe Session → redirect
        await new Promise((r) => setTimeout(r, 2000));

        clearCart();
        router.push('/checkout/success');
    };

    if (items.length === 0) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center pt-20">
                    <div className="text-center">
                        <Package size={48} className="text-text-muted/20 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-herbal-green mb-3">购物车是空的</h2>
                        <Link href="/products" className="btn-primary text-sm px-8 py-3 inline-flex items-center gap-2">
                            浏览产品 <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main className="pt-28 pb-20 min-h-screen">
                <div className="max-w-5xl mx-auto px-6 md:px-8">
                    {/* Steps Indicator */}
                    <div className="flex items-center gap-3 mb-10">
                        <div className={`flex items-center gap-2 ${step === 'info' ? 'text-warm-orange' : 'text-morning-green-dark'}`}>
                            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === 'info' ? 'bg-warm-orange text-white' : 'bg-morning-green text-white'
                                }`}>1</span>
                            <span className="text-sm font-semibold">配送信息</span>
                        </div>
                        <div className="flex-1 h-px bg-border-soft" />
                        <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-warm-orange' : 'text-text-muted'}`}>
                            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === 'payment' ? 'bg-warm-orange text-white' : 'bg-gray-200 text-text-muted'
                                }`}>2</span>
                            <span className="text-sm font-semibold">支付</span>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Form Area */}
                        <div className="lg:col-span-2">
                            {step === 'info' ? (
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                                    <h2 className="text-xl font-bold text-herbal-green mb-6 flex items-center gap-2">
                                        <MapPin size={20} /> 配送信息
                                    </h2>
                                    <form onSubmit={handleInfoSubmit} className="space-y-5">
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-medium text-herbal-green mb-1.5 block">收件人姓名 *</label>
                                                <input
                                                    type="text" required
                                                    value={shippingInfo.name}
                                                    onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-ivory border border-border-soft text-sm focus:outline-none focus:border-warm-orange focus:ring-2 focus:ring-warm-orange/20 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-herbal-green mb-1.5 block">电话 *</label>
                                                <input
                                                    type="tel" required
                                                    value={shippingInfo.phone}
                                                    onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                                                    placeholder="+60 12-345 6789"
                                                    className="w-full px-4 py-3 rounded-xl bg-ivory border border-border-soft text-sm focus:outline-none focus:border-warm-orange focus:ring-2 focus:ring-warm-orange/20 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-herbal-green mb-1.5 block">邮箱 *</label>
                                            <input
                                                type="email" required
                                                value={shippingInfo.email}
                                                onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                                                placeholder="you@example.com"
                                                className="w-full px-4 py-3 rounded-xl bg-ivory border border-border-soft text-sm focus:outline-none focus:border-warm-orange focus:ring-2 focus:ring-warm-orange/20 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-herbal-green mb-1.5 block">地址行 1 *</label>
                                            <input
                                                type="text" required
                                                value={shippingInfo.line1}
                                                onChange={(e) => setShippingInfo({ ...shippingInfo, line1: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-ivory border border-border-soft text-sm focus:outline-none focus:border-warm-orange focus:ring-2 focus:ring-warm-orange/20 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-herbal-green mb-1.5 block">地址行 2</label>
                                            <input
                                                type="text"
                                                value={shippingInfo.line2}
                                                onChange={(e) => setShippingInfo({ ...shippingInfo, line2: e.target.value })}
                                                placeholder="公寓/单元号（可选）"
                                                className="w-full px-4 py-3 rounded-xl bg-ivory border border-border-soft text-sm focus:outline-none focus:border-warm-orange focus:ring-2 focus:ring-warm-orange/20 transition-all"
                                            />
                                        </div>
                                        <div className="grid sm:grid-cols-3 gap-4">
                                            <div>
                                                <label className="text-xs font-medium text-herbal-green mb-1.5 block">城市 *</label>
                                                <input
                                                    type="text" required
                                                    value={shippingInfo.city}
                                                    onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-ivory border border-border-soft text-sm focus:outline-none focus:border-warm-orange focus:ring-2 focus:ring-warm-orange/20 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-herbal-green mb-1.5 block">州/省 *</label>
                                                <input
                                                    type="text" required
                                                    value={shippingInfo.state}
                                                    onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-ivory border border-border-soft text-sm focus:outline-none focus:border-warm-orange focus:ring-2 focus:ring-warm-orange/20 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-herbal-green mb-1.5 block">邮编 *</label>
                                                <input
                                                    type="text" required
                                                    value={shippingInfo.zip}
                                                    onChange={(e) => setShippingInfo({ ...shippingInfo, zip: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-ivory border border-border-soft text-sm focus:outline-none focus:border-warm-orange focus:ring-2 focus:ring-warm-orange/20 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <button type="submit" className="w-full btn-primary text-sm py-3.5 flex items-center justify-center gap-2 mt-6">
                                            继续到支付 <ArrowRight size={16} />
                                        </button>
                                    </form>
                                </motion.div>
                            ) : (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                    <button onClick={() => setStep('info')} className="text-sm text-herbal-green hover:text-warm-orange flex items-center gap-1 mb-6 transition-colors">
                                        <ArrowLeft size={16} /> 返回修改配送信息
                                    </button>

                                    <h2 className="text-xl font-bold text-herbal-green mb-6 flex items-center gap-2">
                                        <CreditCard size={20} /> 支付信息
                                    </h2>

                                    {/* Shipping Summary */}
                                    <div className="p-4 rounded-xl bg-ivory border border-border-soft mb-6">
                                        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">配送至</p>
                                        <p className="text-sm text-herbal-green font-medium">{shippingInfo.name}</p>
                                        <p className="text-sm text-text-sub">{shippingInfo.line1}{shippingInfo.line2 ? `, ${shippingInfo.line2}` : ''}</p>
                                        <p className="text-sm text-text-sub">{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zip}</p>
                                        <p className="text-xs text-text-muted mt-1">{shippingInfo.phone} · {shippingInfo.email}</p>
                                    </div>

                                    <form onSubmit={handlePayment} className="space-y-5">
                                        {/* Stripe Card Element placeholder */}
                                        <div className="p-6 rounded-2xl bg-white border-2 border-border-soft">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Lock size={16} className="text-herbal-green" />
                                                <span className="text-sm font-semibold text-herbal-green">安全支付</span>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-xs font-medium text-herbal-green mb-1.5 block">卡号</label>
                                                    <input
                                                        type="text"
                                                        placeholder="4242 4242 4242 4242"
                                                        className="w-full px-4 py-3 rounded-xl bg-ivory border border-border-soft text-sm focus:outline-none focus:border-warm-orange focus:ring-2 focus:ring-warm-orange/20 transition-all font-mono"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-xs font-medium text-herbal-green mb-1.5 block">有效期</label>
                                                        <input
                                                            type="text"
                                                            placeholder="MM / YY"
                                                            className="w-full px-4 py-3 rounded-xl bg-ivory border border-border-soft text-sm focus:outline-none focus:border-warm-orange focus:ring-2 focus:ring-warm-orange/20 transition-all font-mono"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-medium text-herbal-green mb-1.5 block">CVC</label>
                                                        <input
                                                            type="text"
                                                            placeholder="123"
                                                            className="w-full px-4 py-3 rounded-xl bg-ivory border border-border-soft text-sm focus:outline-none focus:border-warm-orange focus:ring-2 focus:ring-warm-orange/20 transition-all font-mono"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-xs text-text-muted mt-4 flex items-center gap-1">
                                                <Shield size={12} className="text-morning-green-dark" />
                                                由 Stripe 安全处理，我们不存储您的卡片信息。
                                            </p>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full btn-primary text-sm py-4 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <><Loader2 size={18} className="animate-spin" /> 处理中...</>
                                            ) : (
                                                <>确认支付 ${totalPrice.toFixed(2)} <Lock size={14} /></>
                                            )}
                                        </button>
                                    </form>

                                    {/* Accepted */}
                                    <div className="flex items-center justify-center gap-4 mt-6 text-text-muted">
                                        <span className="text-xs">支持</span>
                                        <span className="text-xs font-bold">VISA</span>
                                        <span className="text-xs font-bold">Mastercard</span>
                                        <span className="text-xs font-bold">Amex</span>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="p-6 rounded-2xl bg-white border border-border-soft sticky top-28">
                                <h3 className="text-sm font-bold text-herbal-green mb-4">订单摘要</h3>

                                <div className="space-y-3 pb-4 border-b border-border-soft">
                                    {items.map((item) => (
                                        <div key={`${item.slug}-${item.tier}`} className="flex gap-3">
                                            <div className="relative w-12 h-12 rounded-lg bg-ivory overflow-hidden flex-shrink-0">
                                                <Image src={item.image} alt={item.name} fill className="object-contain p-0.5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-herbal-green truncate">{item.name}</p>
                                                <p className="text-[10px] text-text-muted">{item.tierLabel} × {item.quantity}</p>
                                            </div>
                                            <span className="text-xs font-bold text-herbal-green self-center">
                                                ${(item.pricePerBox * item.boxCount * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-2 py-4 border-b border-border-soft text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-text-muted">小计</span>
                                        <span className="text-text-main">${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-text-muted">配送</span>
                                        <span className="text-morning-green-dark font-medium">免费</span>
                                    </div>
                                </div>

                                <div className="flex justify-between pt-4">
                                    <span className="font-bold text-herbal-green">合计</span>
                                    <span className="text-lg font-extrabold text-herbal-green">${totalPrice.toFixed(2)}</span>
                                </div>

                                <div className="mt-4 flex items-start gap-2 text-xs text-text-muted">
                                    <Truck size={14} className="text-morning-green-dark flex-shrink-0 mt-0.5" />
                                    <span>预计 2-3 个工作日送达</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
