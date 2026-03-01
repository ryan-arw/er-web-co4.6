'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Mail, Instagram, Facebook, Youtube, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const footerLinks = {
    产品: [
        { label: 'Vitalic D Original', href: '/products/original' },
        { label: 'Vitalic D Apple', href: '/products/apple' },
        { label: '价格方案', href: '/products#pricing' },
        { label: '订阅计划', href: '/products#subscription' },
    ],
    了解更多: [
        { label: '如何运作', href: '/how-it-works' },
        { label: '核心科技', href: '/how-it-works#science' },
        { label: '关于我们', href: '/about' },
        { label: '博客', href: '/blog' },
    ],
    支持: [
        { label: '常见问题', href: '/#faq' },
        { label: '联系我们', href: 'mailto:hello@ezyrelife.com' },
        { label: '配送政策', href: '/shipping' },
        { label: '退款政策', href: '/refund-policy' },
    ],
    法律: [
        { label: '隐私政策', href: '/privacy' },
        { label: '服务条款', href: '/terms' },
    ],
};

export default function Footer() {
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setIsSubscribed(true);
        setEmail('');
        setTimeout(() => setIsSubscribed(false), 4000);
    };

    return (
        <footer className="bg-herbal-green text-white/90">
            {/* Newsletter CTA */}
            <div className="border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 md:px-8 py-16">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left">
                            <h3 className="text-2xl font-bold text-white mb-2">
                                加入节律社区
                            </h3>
                            <p className="text-white/60 text-sm">
                                获取健康灵感、独家优惠和 ReSet 提醒
                            </p>
                        </div>
                        <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-3">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="您的邮件地址"
                                className="flex-1 md:w-72 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-warm-orange transition-colors"
                                required
                            />
                            <button type="submit" className="btn-primary text-sm px-6 py-3 whitespace-nowrap">
                                订阅
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Subscription Toast */}
            <AnimatePresence>
                {isSubscribed && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed bottom-24 right-6 md:right-12 z-50 bg-white shadow-2xl rounded-2xl p-6 border border-border-soft max-w-sm"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-morning-green/20 text-morning-green-dark flex items-center justify-center flex-shrink-0">
                                <Check size={20} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-herbal-green">订阅成功！</h4>
                                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                                    欢迎加入节律社区。我们将为您发送健康灵感与独家优惠。
                                </p>
                            </div>
                            <button onClick={() => setIsSubscribed(false)} className="text-text-muted hover:text-herbal-green">
                                <X size={16} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer Links */}
            <div className="max-w-7xl mx-auto px-6 md:px-8 py-16">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-3 mb-6">
                            <div className="relative w-10 h-10">
                                <Image
                                    src="/photo/ezyrelife-logo-round.png"
                                    alt="EzyRelife"
                                    fill
                                    className="object-contain brightness-0 invert"
                                />
                            </div>
                            <span className="text-lg font-bold text-white tracking-tight">
                                EzyRelife
                            </span>
                        </Link>
                        <p className="text-white/50 text-sm leading-relaxed mb-6">
                            Reset from Within.<br />
                            ReLife for Real.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-white/40 hover:text-warm-orange transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="text-white/40 hover:text-warm-orange transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="text-white/40 hover:text-warm-orange transition-colors">
                                <Youtube size={20} />
                            </a>
                            <a href="#" className="text-white/40 hover:text-warm-orange transition-colors">
                                <Mail size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Link Columns */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
                                {category}
                            </h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-white/50 hover:text-warm-orange transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="max-w-7xl mx-auto px-6 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-white/30">
                        © 2026 EzyRelife. All rights reserved.
                    </p>
                    <p className="text-xs text-white/30 flex items-center gap-1">
                        以 <Heart size={12} className="text-warm-orange" /> 焕新世界的生命节律
                    </p>
                </div>
            </div>
        </footer>
    );
}
