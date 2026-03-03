'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import {
    ArrowRight, Check, Star, ShoppingCart, Repeat, Package,
    Leaf, Shield, Droplets, Zap, Sparkles, ChevronRight, X
} from 'lucide-react';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

function Section({ children, className = '', id = '' }: { children: React.ReactNode; className?: string; id?: string }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });
    return (
        <motion.section ref={ref} id={id} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={stagger} className={`section-gap ${className}`}>
            {children}
        </motion.section>
    );
}

/* ═══ HERO ═══ */
function ProductHero() {
    return (
        <section className="relative pt-32 pb-20 gradient-hero overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 right-[20%] w-72 h-72 bg-morning-green/10 rounded-full blur-3xl animate-breathe" />
            </div>
            <div className="relative max-w-4xl mx-auto px-6 md:px-8 text-center">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-morning-green/15 border border-morning-green/30 text-xs font-semibold text-herbal-green tracking-wide uppercase mb-6">
                        产品系列
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-herbal-green mb-6 font-[family-name:var(--font-display)] leading-[1.1]">
                        选择您的<br />
                        <span className="gradient-text-brand">重启之旅。</span>
                    </h1>
                    <p className="text-lg md:text-xl text-text-sub max-w-2xl mx-auto leading-relaxed">
                        一盒 Vitalic D，一套完整的 3 天生物节律重整方案。<br />
                        搭配 ReLife Sync App，精准卡点，100% 执行到位。
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

/* ═══ WHAT&apos;S IN THE BOX ═══ */
function WhatsInBox() {
    const items = [
        { label: 'Snack', count: '6 包', desc: '唤醒包 — 轻纤维启动信号', color: 'bg-flow-yellow/30' },
        { label: 'Meal 1', count: '9 包', desc: '能量包 — 方程式核心燃料', color: 'bg-warm-orange/10' },
        { label: 'Meal 2', count: '9 包', desc: '修护包 — 蛋白重筑支持', color: 'bg-morning-green/15' },
    ];

    return (
        <Section className="bg-white">
            <div className="max-w-5xl mx-auto px-6 md:px-8">
                <motion.div variants={fadeUp} className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-herbal-green font-[family-name:var(--font-display)]">
                        一盒里有什么？
                    </h2>
                    <p className="text-text-muted mt-2">24 包完整 3 天旅程 · 净含量 354g</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {items.map((item) => (
                        <motion.div key={item.label} variants={fadeUp} className={`${item.color} rounded-2xl p-6 text-center`}>
                            <span className="text-3xl font-extrabold text-herbal-green">{item.count}</span>
                            <h3 className="text-lg font-bold text-herbal-green mt-2">{item.label}</h3>
                            <p className="text-sm text-text-sub mt-1">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Equation mini-row */}
                <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3 text-sm">
                    <span className="px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-semibold">Cleanse 净彻</span>
                    <span className="text-text-muted">+</span>
                    <span className="px-4 py-2 rounded-full bg-warm-orange/10 text-warm-orange font-semibold">Nourish 滋养</span>
                    <span className="text-text-muted">+</span>
                    <span className="px-4 py-2 rounded-full bg-morning-green/15 text-morning-green-dark font-semibold">Repair 修护</span>
                    <span className="text-text-muted">+</span>
                    <span className="px-4 py-2 rounded-full bg-amber-50 text-amber-600 font-semibold">Glow 焕采</span>
                    <span className="text-text-muted">=</span>
                    <span className="px-4 py-2 rounded-full bg-herbal-green text-white font-bold">ReLife 代谢方程式</span>
                </motion.div>
            </div>
        </Section>
    );
}

/* ═══ PRODUCT CARDS ═══ */
function ProductCards() {
    const { addItem } = useCart();
    const [showToast, setShowToast] = useState(false);

    const handleQuickAdd = (product: any) => {
        addItem({
            slug: product.slug,
            name: product.name,
            image: product.image,
            flavor: 'Original',
            boxCount: 3,
        });
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const products = [
        {
            slug: 'vitalic-d',
            name: 'Vitalic D · 生物质子重整系统',
            subtitle: '3 天生物节律重整系统 · 两种口味可选',
            image: '/photo/01 vitalic-d-main.jpg',
            badge: '经典系统',
            badgeColor: 'bg-herbal-green',
            features: ['Cleanse 净彻', 'Nourish 滋养', 'Repair 修护', 'Glow 焕采'],
            flavors: ['Original 原味', 'Apple 苹果味']
        }
    ];

    const pricing = [
        { tier: '单盒', qty: '1 盒', price: '$145.00', perBox: '$145.00', savings: '' },
        { tier: '双盒优惠', qty: '2 盒', price: '$261.00', perBox: '$130.50', savings: '省 $29' },
        { tier: '超值组合', qty: '3 盒', price: '$363.00', perBox: '$121.00', savings: '省 $72', best: true },
    ];

    return (
        <Section id="products">
            <div className="max-w-6xl mx-auto px-6 md:px-8">
                <motion.div variants={fadeUp} className="text-center mb-16">
                    <span className="text-sm font-semibold text-warm-orange tracking-widest uppercase mb-3 block">立即选购</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-herbal-green font-[family-name:var(--font-display)]">
                        一套方程式，多重感官体验
                    </h2>
                </motion.div>

                {/* Product Grid */}
                <div className="max-w-4xl mx-auto mb-16">
                    {products.map((product) => (
                        <motion.div
                            key={product.slug}
                            variants={fadeUp}
                            className="group rounded-[3rem] bg-white border border-border-soft overflow-hidden hover:shadow-2xl hover:shadow-morning-green/10 transition-all duration-500 flex flex-col md:flex-row items-center"
                        >
                            <div className="relative w-full md:w-1/2 aspect-square bg-gradient-to-br from-ivory to-morning-green/5">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-contain p-12 group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className={`absolute top-6 left-6 px-4 py-1.5 rounded-full ${product.badgeColor} text-white text-[10px] font-black uppercase tracking-widest`}>
                                    {product.badge}
                                </div>
                            </div>
                            <div className="p-10 md:p-12 w-full md:w-1/2">
                                <h3 className="text-3xl font-black text-herbal-green mb-2">{product.name}</h3>
                                <p className="text-base text-text-muted mb-6">{product.subtitle}</p>

                                <div className="space-y-4 mb-8">
                                    <div className="flex flex-wrap gap-2">
                                        {product.features.map((f) => (
                                            <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-morning-green/10 text-[10px] font-bold text-herbal-green border border-morning-green/20">
                                                <Check size={10} /> {f}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-text-sub uppercase tracking-widest">提供口味:</span>
                                        <div className="flex gap-2">
                                            <span className="w-3 h-3 rounded-full bg-warm-orange" title="Original" />
                                            <span className="w-3 h-3 rounded-full bg-morning-green" title="Apple" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Link
                                        href={`/products/${product.slug}`}
                                        className="btn-primary py-4 flex items-center justify-center gap-2 group/btn"
                                    >
                                        立即配置 <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
                                    </Link>
                                    <Link
                                        href="#pricing"
                                        className="btn-secondary py-4 flex items-center justify-center gap-2"
                                    >
                                        价格详情
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Toast Notification */}
                <AnimatePresence>
                    {showToast && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, x: '-50%' }}
                            animate={{ opacity: 1, y: 0, x: '-50%' }}
                            exit={{ opacity: 0, y: 20, x: '-50%' }}
                            className="fixed bottom-10 left-1/2 z-50 flex items-center gap-3 px-6 py-4 bg-herbal-green text-white rounded-2xl shadow-2xl border border-white/10"
                        >
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <Check size={18} className="text-morning-green" />
                            </div>
                            <div>
                                <p className="text-sm font-bold">已添加到购物车</p>
                                <p className="text-xs text-white/60">默认选取 3 盒超值装，助力高效重启</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Pricing Table */}
                <motion.div variants={fadeUp} id="pricing">
                    <h3 className="text-2xl font-bold text-herbal-green text-center mb-8 font-[family-name:var(--font-display)]">
                        阶梯定价 · 越多越省
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        {pricing.map((tier) => (
                            <div
                                key={tier.tier}
                                className={`relative p-6 rounded-2xl bg-white border-2 transition-all ${tier.best ? 'border-warm-orange shadow-lg shadow-warm-orange/10' : 'border-border-soft'
                                    }`}
                            >
                                {tier.best && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-warm-orange text-white text-xs font-bold">
                                        最受欢迎
                                    </div>
                                )}
                                <div className="text-center">
                                    <p className="text-sm font-semibold text-text-sub mb-1">{tier.tier}</p>
                                    <p className="text-xs text-text-muted mb-4">{tier.qty}</p>
                                    <p className="text-3xl font-extrabold text-herbal-green mb-1">{tier.perBox}</p>
                                    <p className="text-xs text-text-muted mb-4">/盒</p>
                                    {tier.savings && (
                                        <span className="inline-block px-3 py-1 rounded-full bg-morning-green/15 text-morning-green-dark text-xs font-bold">
                                            {tier.savings}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </Section>
    );
}

/* ═══ SUBSCRIPTION ═══ */
function SubscriptionSection() {
    return (
        <Section id="subscription" className="bg-white">
            <div className="max-w-4xl mx-auto px-6 md:px-8">
                <motion.div variants={fadeUp} className="rounded-3xl bg-gradient-to-br from-herbal-green to-herbal-green-dark text-white p-8 md:p-12 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />

                    <div className="relative grid md:grid-cols-2 gap-10 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 mb-4">
                                <Repeat size={14} className="text-warm-orange" />
                                <span className="text-xs font-semibold text-white/80 uppercase">订阅计划</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 font-[family-name:var(--font-display)]">
                                节律不止一次。<br />订阅再省 10%。
                            </h2>
                            <p className="text-white/60 leading-relaxed mb-6">
                                Vitalic D 设计为"大节律"校准工具——每季度一次完整 ReSet，配合日常维护，构成完整的生物节律生态。
                            </p>
                            <ul className="space-y-3 mb-8">
                                {[
                                    '每月/每季自动配送',
                                    '额外 10% 折扣',
                                    '随时暂停或取消',
                                    '专属 ReLife Sync 进阶功能',
                                    '优先客户支持',
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-2 text-sm text-white/80">
                                        <Check size={16} className="text-warm-orange flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <button className="btn-primary text-sm px-8 py-3">
                                了解订阅详情
                            </button>
                        </div>

                        <div className="flex justify-center">
                            <div className="text-center p-8 rounded-2xl bg-white/10 border border-white/15">
                                <Package size={40} className="text-warm-orange mx-auto mb-4" />
                                <p className="text-sm text-white/60 mb-2">订阅价</p>
                                <p className="text-4xl font-extrabold text-white mb-1">$108.90</p>
                                <p className="text-sm text-white/50 mb-4">/盒（3 盒订阅）</p>
                                <p className="text-xs text-warm-orange font-semibold">
                                    相比零售价省 $108+/年
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </Section>
    );
}

/* ═══ TRUST ═══ */
function TrustSection() {
    return (
        <Section>
            <div className="max-w-5xl mx-auto px-6 md:px-8">
                <motion.div variants={fadeUp} className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-herbal-green font-[family-name:var(--font-display)]">
                        为什么选择 EzyRelife？
                    </h2>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: <Shield size={24} />, title: '临床级品质', desc: 'GMP / SGS / HACCP 多重认证' },
                        { icon: <Leaf size={24} />, title: '清洁配方', desc: '零泻药·零防腐·零重金属' },
                        { icon: <Droplets size={24} />, title: '物理吸附', desc: '温和海绵式清理，不刺激' },
                        { icon: <Star size={24} />, title: '全方位支持', desc: 'App 导航 + 社群 + 客服' },
                    ].map((item) => (
                        <motion.div key={item.title} variants={fadeUp} className="text-center p-6 rounded-2xl bg-white border border-border-soft">
                            <div className="w-12 h-12 rounded-xl bg-morning-green/10 text-morning-green-dark flex items-center justify-center mx-auto mb-4">
                                {item.icon}
                            </div>
                            <h3 className="text-sm font-bold text-herbal-green mb-1">{item.title}</h3>
                            <p className="text-xs text-text-muted">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Section>
    );
}

/* ═══ MAIN ═══ */
export default function ProductsPage() {
    return (
        <>
            <Navbar />
            <main>
                <ProductHero />
                <WhatsInBox />
                <ProductCards />
                <SubscriptionSection />
                <TrustSection />
            </main>
            <Footer />
        </>
    );
}
