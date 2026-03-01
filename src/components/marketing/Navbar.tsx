'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import MiniCart from '@/components/shared/MiniCart';
import AnimatedLogo from '@/components/shared/AnimatedLogo';

const navLinks = [
    { href: '/how-it-works', label: '如何运作' },
    { href: '/products', label: '产品' },
    { href: '/about', label: '关于我们' },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { totalItems, setIsOpen } = useCart();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                    ? 'glass shadow-lg shadow-morning-green/5'
                    : 'bg-transparent'
                    }`}
            >
                <nav className="max-w-7xl mx-auto px-6 md:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3">
                            <AnimatedLogo size={40} />
                            <span className="text-xl font-bold font-[family-name:var(--font-display)] text-herbal-green tracking-tight">
                                EzyRelife
                            </span>
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden lg:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm font-medium text-text-sub hover:text-herbal-green transition-colors duration-300 relative group"
                                >
                                    {link.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-warm-orange transition-all duration-300 group-hover:w-full rounded-full" />
                                </Link>
                            ))}
                        </div>

                        {/* Desktop CTA + Cart */}
                        <div className="hidden lg:flex items-center gap-4">
                            <button
                                onClick={() => setIsOpen(true)}
                                className="relative p-2 text-herbal-green hover:text-warm-orange transition-colors"
                            >
                                <ShoppingBag size={20} />
                                {totalItems > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 rounded-full bg-warm-orange text-white text-[10px] font-bold flex items-center justify-center min-w-[18px] h-[18px]">
                                        {totalItems}
                                    </span>
                                )}
                            </button>
                            <Link
                                href="/login"
                                className="text-sm font-medium text-herbal-green hover:text-warm-orange transition-colors"
                            >
                                登入
                            </Link>
                            <Link
                                href="/products"
                                className="btn-primary text-sm px-6 py-2.5"
                            >
                                开始我的重启
                            </Link>
                        </div>

                        {/* Mobile: Cart + Menu */}
                        <div className="lg:hidden flex items-center gap-2">
                            <button
                                onClick={() => setIsOpen(true)}
                                className="relative p-2 text-herbal-green"
                            >
                                <ShoppingBag size={20} />
                                {totalItems > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 rounded-full bg-warm-orange text-white text-[10px] font-bold flex items-center justify-center min-w-[18px] h-[18px]">
                                        {totalItems}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 text-herbal-green"
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden glass-warm border-t border-morning-green/20"
                        >
                            <div className="px-6 py-6 space-y-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block text-base font-medium text-text-main hover:text-warm-orange transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <div className="pt-4 border-t border-morning-green/20 space-y-3">
                                    <Link
                                        href="/login"
                                        className="block text-center text-sm font-medium text-herbal-green"
                                    >
                                        登入
                                    </Link>
                                    <Link
                                        href="/products"
                                        className="block text-center btn-primary text-sm"
                                    >
                                        开始我的重启
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            {/* Mini Cart */}
            <MiniCart />
        </>
    );
}
