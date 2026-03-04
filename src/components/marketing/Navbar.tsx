'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, User, LayoutDashboard, LogOut } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import MiniCart from '@/components/shared/MiniCart';
import AnimatedLogo from '@/components/shared/AnimatedLogo';
import { createClient } from '@/lib/supabase/client';

const navLinks = [
    { href: '/how-it-works', label: '如何运作' },
    { href: '/products', label: '产品' },
    { href: '/about', label: '关于我们' },
    { href: '/contact', label: '联系我们' },
];

export default function Navbar() {
    const [mounted, setMounted] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const { totalBoxes, setIsOpen } = useCart();
    const supabase = createClient();

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);

        // Check auth status
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        checkUser();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            subscription.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.reload();
    };

    if (!mounted) return null;

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
                                {totalBoxes > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 rounded-full bg-warm-orange text-white text-[10px] font-bold flex items-center justify-center min-w-[18px] h-[18px]">
                                        {totalBoxes}
                                    </span>
                                )}
                            </button>

                            {user ? (
                                <div className="flex items-center gap-4">
                                    <Link
                                        href="/dashboard"
                                        className="text-sm font-bold text-herbal-green hover:text-warm-orange transition-colors flex items-center gap-2"
                                    >
                                        <LayoutDashboard size={18} /> 控制面板
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="text-text-muted hover:text-red-500 transition-colors"
                                        title="退出登录"
                                    >
                                        <LogOut size={18} />
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="text-sm font-bold text-herbal-green hover:text-warm-orange transition-colors"
                                >
                                    登入
                                </Link>
                            )}

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
                                {totalBoxes > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 rounded-full bg-warm-orange text-white text-[10px] font-bold flex items-center justify-center min-w-[18px] h-[18px]">
                                        {totalBoxes}
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
                                    {user ? (
                                        <>
                                            <Link
                                                href="/dashboard"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="block text-center text-sm font-bold text-herbal-green"
                                            >
                                                控制面板
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-center text-sm font-medium text-text-muted"
                                            >
                                                退出登录
                                            </button>
                                        </>
                                    ) : (
                                        <Link
                                            href="/login"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block text-center text-sm font-bold text-herbal-green"
                                        >
                                            登入
                                        </Link>
                                    )}
                                    <Link
                                        href="/products"
                                        onClick={() => setIsMobileMenuOpen(false)}
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
