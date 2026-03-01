'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, ShoppingBag, Repeat, Package, MapPin,
    Settings, HelpCircle, LogOut, Menu, X, ChevronDown,
    User as UserIcon, Bell
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

const sidebarLinks = [
    { href: '/dashboard', icon: LayoutDashboard, label: '概览' },
    { href: '/dashboard/orders', icon: ShoppingBag, label: '我的订单' },
    { href: '/dashboard/subscriptions', icon: Repeat, label: '订阅管理' },
    { href: '/dashboard/stash', icon: Package, label: '我的库存' },
    { href: '/dashboard/addresses', icon: MapPin, label: '地址管理' },
    { href: '/dashboard/settings', icon: Settings, label: '账户设置' },
    { href: '/dashboard/help', icon: HelpCircle, label: '帮助与支持' },
];

interface DashboardShellProps {
    children: React.ReactNode;
    user: User;
    profile: { full_name?: string; avatar_url?: string } | null;
}

export default function DashboardShell({ children, user, profile }: DashboardShellProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const displayName = profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || '用户';

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="px-6 py-5 border-b border-border-soft">
                <Link href="/" className="flex items-center gap-3">
                    <div className="relative w-9 h-9">
                        <Image src="/photo/ezyrelife-logo-round.png" alt="EzyRelife" fill className="object-contain" />
                    </div>
                    <span className="text-lg font-bold text-herbal-green tracking-tight">EzyRelife</span>
                </Link>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {sidebarLinks.map((link) => {
                    const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-warm-orange/10 text-warm-orange'
                                    : 'text-text-sub hover:bg-ivory hover:text-herbal-green'
                                }`}
                        >
                            <link.icon size={18} />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            {/* User Card */}
            <div className="px-3 py-4 border-t border-border-soft">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:bg-red-50 hover:text-red-500 transition-all w-full"
                >
                    <LogOut size={18} />
                    登出
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-ivory flex">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 bg-white border-r border-border-soft fixed top-0 left-0 h-full z-30">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="fixed top-0 left-0 w-64 h-full bg-white z-50 lg:hidden shadow-2xl"
                        >
                            <div className="absolute top-4 right-4">
                                <button onClick={() => setSidebarOpen(false)} className="p-1 text-text-muted hover:text-herbal-green">
                                    <X size={20} />
                                </button>
                            </div>
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 lg:ml-64">
                {/* Top Header */}
                <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-border-soft">
                    <div className="flex items-center justify-between px-6 py-3">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 -ml-2 text-text-muted hover:text-herbal-green"
                            >
                                <Menu size={20} />
                            </button>
                            <h2 className="text-sm font-semibold text-herbal-green">
                                {sidebarLinks.find(l => l.href === pathname || (l.href !== '/dashboard' && pathname.startsWith(l.href)))?.label || '概览'}
                            </h2>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Notification */}
                            <button className="relative p-2 text-text-muted hover:text-herbal-green transition-colors">
                                <Bell size={18} />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-warm-orange" />
                            </button>

                            {/* User Menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-ivory transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-morning-green/20 flex items-center justify-center text-morning-green-dark">
                                        <UserIcon size={16} />
                                    </div>
                                    <span className="hidden sm:block text-sm font-medium text-herbal-green max-w-[120px] truncate">
                                        {displayName}
                                    </span>
                                    <ChevronDown size={14} className="text-text-muted" />
                                </button>

                                <AnimatePresence>
                                    {userMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 8 }}
                                            className="absolute right-0 top-full mt-2 w-48 bg-white border border-border-soft rounded-xl shadow-lg overflow-hidden z-50"
                                        >
                                            <div className="px-4 py-3 border-b border-border-soft">
                                                <p className="text-sm font-semibold text-herbal-green truncate">{displayName}</p>
                                                <p className="text-xs text-text-muted truncate">{user.email}</p>
                                            </div>
                                            <Link href="/dashboard/settings" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2.5 text-sm text-text-sub hover:bg-ivory transition-colors">
                                                账户设置
                                            </Link>
                                            <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                                                登出
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
