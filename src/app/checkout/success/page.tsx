'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Package, Truck, Smartphone } from 'lucide-react';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';

export default function CheckoutSuccessPage() {
    const orderId = `ER-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;

    return (
        <>
            <Navbar />
            <main className="pt-28 pb-20 min-h-screen">
                <div className="max-w-2xl mx-auto px-6 md:px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        {/* Success Icon */}
                        <div className="w-20 h-20 rounded-full bg-morning-green/15 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={40} className="text-morning-green-dark" />
                        </div>

                        <h1 className="text-2xl md:text-3xl font-extrabold text-herbal-green mb-3 font-[family-name:var(--font-display)]">
                            订单确认成功！ 🎉
                        </h1>
                        <p className="text-text-sub mb-2">
                            感谢您的购买，您的 ReSet 旅程即将启航。
                        </p>
                        <p className="text-sm text-text-muted mb-8">
                            订单号：<span className="font-mono font-bold text-herbal-green">{orderId}</span>
                        </p>

                        {/* Order Status Timeline */}
                        <div className="p-6 rounded-2xl bg-white border border-border-soft mb-8 text-left">
                            <h3 className="text-sm font-bold text-herbal-green mb-4">接下来会发生什么？</h3>
                            <div className="space-y-5">
                                {[
                                    { icon: <Package size={18} />, title: '订单处理', desc: '我们会在 24 小时内确认并开始打包您的订单。', status: '进行中' },
                                    { icon: <Truck size={18} />, title: '发货通知', desc: '包裹发出后，您将收到物流追踪邮件。', status: '等待中' },
                                    { icon: <Smartphone size={18} />, title: '下载 ReLife Sync', desc: '在产品到达前下载 App，提前设置您的校准时间表。', status: '推荐' },
                                ].map((step, index) => (
                                    <div key={index} className="flex gap-4">
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${index === 0 ? 'bg-warm-orange/10 text-warm-orange' : 'bg-ivory text-text-muted'
                                            }`}>
                                            {step.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-semibold text-herbal-green">{step.title}</h4>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${index === 0 ? 'bg-warm-orange/10 text-warm-orange' : 'bg-ivory text-text-muted'
                                                    }`}>{step.status}</span>
                                            </div>
                                            <p className="text-xs text-text-muted mt-0.5">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                            <Link href="/dashboard/orders" className="btn-primary text-sm px-8 py-3 flex items-center justify-center gap-2">
                                查看订单 <ArrowRight size={16} />
                            </Link>
                            <Link href="/how-it-works" className="btn-secondary text-sm px-8 py-3">
                                阅读 3R 指南
                            </Link>
                        </div>

                        {/* Promo */}
                        <div className="p-6 rounded-2xl bg-gradient-to-r from-herbal-green to-herbal-green-dark text-white text-left">
                            <div className="flex items-start gap-4">
                                <div className="relative w-12 h-12 flex-shrink-0">
                                    <Image src="/photo/ezyrelife-logo-round.png" alt="EzyRelife" fill className="object-contain brightness-0 invert" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white mb-1">下一次 ReSet 省 10%</h3>
                                    <p className="text-xs text-white/50 mb-3">订阅计划享受自动配送 + 折扣。保持节律，不错过任何校准窗口。</p>
                                    <Link href="/dashboard/subscriptions" className="text-xs text-warm-orange font-semibold hover:underline">
                                        了解订阅 →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </>
    );
}
