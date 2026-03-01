'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function MiniCart() {
    const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalItems, totalPrice } = useCart();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/30 z-50"
                    />

                    {/* Slide-in Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 28 }}
                        className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border-soft">
                            <div className="flex items-center gap-2">
                                <ShoppingBag size={20} className="text-herbal-green" />
                                <h2 className="text-base font-bold text-herbal-green">购物车</h2>
                                {totalItems > 0 && (
                                    <span className="px-2 py-0.5 rounded-full bg-warm-orange text-white text-xs font-bold">
                                        {totalItems}
                                    </span>
                                )}
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-1 text-text-muted hover:text-herbal-green">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <ShoppingBag size={48} className="text-text-muted/20 mb-4" />
                                    <p className="text-sm text-text-muted mb-4">购物车是空的</p>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="text-sm text-warm-orange font-semibold hover:underline"
                                    >
                                        继续购物
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <div key={`${item.slug}-${item.tier}`} className="flex gap-4 py-3 border-b border-border-soft last:border-0">
                                            <div className="relative w-16 h-16 rounded-xl bg-ivory overflow-hidden flex-shrink-0">
                                                <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-semibold text-herbal-green truncate">{item.name}</h3>
                                                <p className="text-xs text-text-muted">{item.tierLabel} · {item.boxCount} 盒</p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center border border-border-soft rounded-lg overflow-hidden">
                                                        <button
                                                            onClick={() => updateQuantity(item.slug, item.tier, item.quantity - 1)}
                                                            className="px-2 py-1 hover:bg-ivory transition-colors"
                                                        >
                                                            <Minus size={12} />
                                                        </button>
                                                        <span className="px-3 py-1 text-xs font-bold text-herbal-green border-x border-border-soft tabular-nums">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.slug, item.tier, item.quantity + 1)}
                                                            className="px-2 py-1 hover:bg-ivory transition-colors"
                                                        >
                                                            <Plus size={12} />
                                                        </button>
                                                    </div>
                                                    <span className="text-sm font-bold text-herbal-green">
                                                        ${(item.pricePerBox * item.boxCount * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.slug, item.tier)}
                                                className="self-start p-1 text-text-muted hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="border-t border-border-soft px-6 py-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-text-muted">小计</span>
                                    <span className="text-xl font-extrabold text-herbal-green">${totalPrice.toFixed(2)}</span>
                                </div>
                                <Link
                                    href="/checkout"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full btn-primary text-sm py-3.5 flex items-center justify-center gap-2"
                                >
                                    前往结算 <ArrowRight size={16} />
                                </Link>
                                <Link
                                    href="/cart"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full text-center text-sm text-herbal-green hover:text-warm-orange transition-colors font-medium"
                                >
                                    查看购物车
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
