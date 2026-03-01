'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft, Shield } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';

export default function CartPage() {
    const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

    return (
        <>
            <Navbar />
            <main className="pt-28 pb-20 min-h-screen">
                <div className="max-w-5xl mx-auto px-6 md:px-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-herbal-green mb-8 font-[family-name:var(--font-display)]">
                        购物车
                    </h1>

                    {items.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-20"
                        >
                            <ShoppingBag size={64} className="text-text-muted/20 mx-auto mb-6" />
                            <h2 className="text-xl font-bold text-herbal-green mb-3">购物车是空的</h2>
                            <p className="text-sm text-text-muted mb-8">发现适合您的 Vitalic D 方案，开始 ReSet 旅程。</p>
                            <Link href="/products" className="btn-primary text-sm px-10 py-3.5 inline-flex items-center gap-2">
                                浏览产品 <ArrowRight size={16} />
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                {items.map((item) => (
                                    <motion.div
                                        key={`${item.slug}-${item.tier}`}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        className="flex gap-5 p-5 rounded-2xl bg-white border border-border-soft"
                                    >
                                        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl bg-ivory overflow-hidden flex-shrink-0">
                                            <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <h3 className="text-base font-bold text-herbal-green">{item.name}</h3>
                                                    <p className="text-xs text-text-muted mt-0.5">{item.tierLabel} · {item.boxCount} 盒/套</p>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.slug, item.tier)}
                                                    className="p-1.5 text-text-muted hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center border border-border-soft rounded-xl overflow-hidden">
                                                    <button
                                                        onClick={() => updateQuantity(item.slug, item.tier, item.quantity - 1)}
                                                        className="px-3 py-2 hover:bg-ivory transition-colors"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="px-4 py-2 text-sm font-bold text-herbal-green border-x border-border-soft tabular-nums">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.slug, item.tier, item.quantity + 1)}
                                                        className="px-3 py-2 hover:bg-ivory transition-colors"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-extrabold text-herbal-green">
                                                        ${(item.pricePerBox * item.boxCount * item.quantity).toFixed(2)}
                                                    </p>
                                                    <p className="text-xs text-text-muted">${item.pricePerBox.toFixed(2)}/盒</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                <div className="flex items-center justify-between pt-4">
                                    <Link href="/products" className="text-sm text-herbal-green hover:text-warm-orange font-medium flex items-center gap-1 transition-colors">
                                        <ArrowLeft size={16} /> 继续购物
                                    </Link>
                                    <button
                                        onClick={clearCart}
                                        className="text-sm text-text-muted hover:text-red-500 font-medium transition-colors"
                                    >
                                        清空购物车
                                    </button>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="p-6 rounded-2xl bg-white border border-border-soft sticky top-28">
                                    <h2 className="text-base font-bold text-herbal-green mb-5">订单摘要</h2>

                                    <div className="space-y-3 pb-4 border-b border-border-soft">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-text-muted">商品小计</span>
                                            <span className="text-text-main font-medium">${totalPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-text-muted">配送费</span>
                                            <span className="text-morning-green-dark font-medium">免费</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between py-4">
                                        <span className="text-base font-bold text-herbal-green">合计</span>
                                        <span className="text-xl font-extrabold text-herbal-green">${totalPrice.toFixed(2)}</span>
                                    </div>

                                    <Link
                                        href="/checkout"
                                        className="w-full btn-primary text-sm py-3.5 flex items-center justify-center gap-2 mb-4"
                                    >
                                        前往结算 <ArrowRight size={16} />
                                    </Link>

                                    <div className="flex items-center gap-2 text-xs text-text-muted justify-center">
                                        <Shield size={14} className="text-morning-green-dark" />
                                        安全支付 · SSL 加密
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
