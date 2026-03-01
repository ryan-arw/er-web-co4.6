'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { useCart, type CartItem } from '@/contexts/CartContext';
import {
    ArrowRight, Check, Star, ShoppingCart, Minus, Plus,
    Droplets, Zap, Shield, Sparkles, ChevronDown,
    Package, Truck, RotateCcw, Clock, X
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

const productData: Record<string, {
    name: string; subtitle: string; image: string; badge: string; badgeColor: string;
    flavor: string; description: string;
}> = {
    original: {
        name: 'Vitalic D · Original',
        subtitle: '3 天生物节律重整系统 · 原味',
        image: '/photo/01 vitalic-d-main.jpg',
        badge: '热销',
        badgeColor: 'bg-warm-orange',
        flavor: '原味',
        description: '经典配方，温和顺口。适合所有体质的入门与进阶选择。搭载完整的 ReLife 代谢方程式，为您的身体执行精密的四步运算。',
    },
    apple: {
        name: 'Vitalic D · Apple',
        subtitle: '3 天生物节律重整系统 · 苹果味',
        image: '/photo/1 main.jpg',
        badge: '新口味',
        badgeColor: 'bg-morning-green',
        flavor: '苹果味',
        description: '清新苹果风味，更顺口的重启体验。特别适合首次尝试的用户。同样搭载完整 ReLife 代谢方程式，口感升级，配方不减。',
    },
};

const pricing = [
    { qty: 1, label: '单盒', price: 145, perBox: 145, savings: 0 },
    { qty: 2, label: '双盒优惠', price: 261, perBox: 130.5, savings: 29 },
    { qty: 3, label: '超值组合', price: 363, perBox: 121, savings: 72, best: true },
];

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const { addItem, setIsOpen } = useCart();

    const product = productData[slug] || productData['original'];
    const [selectedTier, setSelectedTier] = useState(2); // default 3-box
    const [quantity, setQuantity] = useState(1);
    const [showToast, setShowToast] = useState(false);

    const currentPricing = pricing[selectedTier];

    const handleAddToCart = () => {
        addItem({
            slug: slug,
            name: product.name,
            image: product.image,
            tier: indexToTier(selectedTier),
            tierLabel: currentPricing.label,
            pricePerBox: currentPricing.perBox,
            boxCount: currentPricing.qty,
        });
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleBuyNow = () => {
        addItem({
            slug: slug,
            name: product.name,
            image: product.image,
            tier: indexToTier(selectedTier),
            tierLabel: currentPricing.label,
            pricePerBox: currentPricing.perBox,
            boxCount: currentPricing.qty,
        });
        router.push('/checkout');
    };

    function indexToTier(index: number): 'single' | 'double' | 'triple' {
        if (index === 0) return 'single';
        if (index === 1) return 'double';
        return 'triple';
    }

    return (
        <>
            <Navbar />
            <main>
                {/* Product Hero */}
                <section className="pt-28 pb-16">
                    <div className="max-w-6xl mx-auto px-6 md:px-8">
                        {/* Breadcrumb */}
                        <nav className="flex items-center gap-2 text-sm text-text-muted mb-8">
                            <Link href="/" className="hover:text-herbal-green transition-colors">首页</Link>
                            <span>/</span>
                            <Link href="/products" className="hover:text-herbal-green transition-colors">产品</Link>
                            <span>/</span>
                            <span className="text-herbal-green font-medium">{product.name}</span>
                        </nav>

                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                            {/* Image */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                className="relative"
                            >
                                <div className="relative aspect-square rounded-3xl bg-gradient-to-b from-ivory to-morning-green/5 border border-border-soft overflow-hidden">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-10"
                                        priority
                                    />
                                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full ${product.badgeColor} text-white text-xs font-bold`}>
                                        {product.badge}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Info */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                            >
                                <h1 className="text-3xl md:text-4xl font-extrabold text-herbal-green mb-2 font-[family-name:var(--font-display)]">
                                    {product.name}
                                </h1>
                                <p className="text-text-muted mb-4">{product.subtitle}</p>

                                {/* Stars */}
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <Star key={i} size={16} className="fill-warm-orange text-warm-orange" />
                                        ))}
                                    </div>
                                    <span className="text-sm text-text-muted">4.9 (128 条评价)</span>
                                </div>

                                <p className="text-text-sub leading-relaxed mb-8">{product.description}</p>

                                {/* Tier Selection */}
                                <div className="space-y-3 mb-8">
                                    <p className="text-sm font-semibold text-herbal-green">选择套装：</p>
                                    {pricing.map((tier, index) => (
                                        <button
                                            key={tier.qty}
                                            onClick={() => setSelectedTier(index)}
                                            className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${selectedTier === index
                                                ? 'border-warm-orange bg-warm-orange/5'
                                                : 'border-border-soft hover:border-morning-green/30'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedTier === index ? 'border-warm-orange' : 'border-text-muted'
                                                    }`}>
                                                    {selectedTier === index && <div className="w-2.5 h-2.5 rounded-full bg-warm-orange" />}
                                                </div>
                                                <div className="text-left">
                                                    <span className="text-sm font-semibold text-herbal-green">{tier.label}</span>
                                                    <span className="text-xs text-text-muted ml-2">{tier.qty} 盒</span>
                                                </div>
                                                {tier.best && (
                                                    <span className="px-2 py-0.5 rounded-full bg-warm-orange text-white text-[10px] font-bold">
                                                        最受欢迎
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <span className="text-lg font-bold text-herbal-green">${tier.perBox.toFixed(2)}</span>
                                                <span className="text-xs text-text-muted">/盒</span>
                                                {tier.savings > 0 && (
                                                    <p className="text-xs text-warm-orange font-semibold">省 ${tier.savings}</p>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Quantity */}
                                <div className="flex items-center gap-6 mb-8">
                                    <span className="text-sm font-semibold text-herbal-green">数量：</span>
                                    <div className="flex items-center border border-border-soft rounded-xl overflow-hidden">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-4 py-3 hover:bg-ivory transition-colors"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="px-6 py-3 text-sm font-bold text-herbal-green border-x border-border-soft tabular-nums">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="px-4 py-3 hover:bg-ivory transition-colors"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="flex items-baseline gap-3 mb-6">
                                    <span className="text-sm text-text-muted">总计：</span>
                                    <span className="text-3xl font-extrabold text-herbal-green">
                                        ${(currentPricing.price * quantity).toFixed(2)}
                                    </span>
                                </div>

                                {/* CTA */}
                                <div className="flex gap-4 mb-8">
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-1 btn-primary text-sm py-4 flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart size={18} />
                                        加入购物车
                                    </button>
                                    <button
                                        onClick={handleBuyNow}
                                        className="btn-secondary text-sm py-4 px-6"
                                    >
                                        立即购买
                                    </button>
                                </div>

                                {/* Trust Badges */}
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { icon: <Truck size={16} />, text: '免费配送' },
                                        { icon: <RotateCcw size={16} />, text: '30 天无忧退换' },
                                        { icon: <Shield size={16} />, text: '正品保证' },
                                        { icon: <Clock size={16} />, text: '2-3 天送达' },
                                    ].map((badge) => (
                                        <div key={badge.text} className="flex items-center gap-2 text-xs text-text-muted">
                                            <span className="text-morning-green-dark">{badge.icon}</span>
                                            {badge.text}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Ingredients & Details */}
                <Section className="bg-white">
                    <div className="max-w-5xl mx-auto px-6 md:px-8">
                        <motion.div variants={fadeUp} className="text-center mb-12">
                            <h2 className="text-2xl md:text-3xl font-bold text-herbal-green font-[family-name:var(--font-display)]">
                                产品详情
                            </h2>
                        </motion.div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Package Contents */}
                            <motion.div variants={fadeUp} className="p-6 rounded-2xl bg-ivory border border-border-soft">
                                <div className="flex items-center gap-2 mb-4">
                                    <Package size={20} className="text-herbal-green" />
                                    <h3 className="font-bold text-herbal-green">包装内容</h3>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { name: 'Snack 唤醒包', qty: '6 包', weight: '14g/包', cal: '54 kcal' },
                                        { name: 'Meal 1 能量包', qty: '9 包', weight: '15g/包', cal: '57 kcal' },
                                        { name: 'Meal 2 修护包', qty: '9 包', weight: '15g/包', cal: '59 kcal' },
                                    ].map((item) => (
                                        <div key={item.name} className="flex items-center justify-between py-2 border-b border-border-soft last:border-0">
                                            <span className="text-sm font-medium text-text-main">{item.name}</span>
                                            <div className="flex gap-4 text-xs text-text-muted">
                                                <span>{item.qty}</span>
                                                <span>{item.weight}</span>
                                                <span>{item.cal}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-text-muted mt-4">总净含量：354g · 24 包/盒 · 完整 3 天旅程</p>
                            </motion.div>

                            {/* Key Ingredients */}
                            <motion.div variants={fadeUp} className="p-6 rounded-2xl bg-ivory border border-border-soft">
                                <div className="flex items-center gap-2 mb-4">
                                    <Sparkles size={20} className="text-warm-orange" />
                                    <h3 className="font-bold text-herbal-green">核心成分</h3>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { name: '专利油棕纤维', role: 'Cleanse — 物理吸附阻滞' },
                                        { name: '燕麦β-葡聚糖', role: 'Cleanse — 立体纤维网络' },
                                        { name: '综合植物酵素', role: 'Nourish — 能量供给' },
                                        { name: '功能性果蔬粉', role: 'Nourish — 营养补充' },
                                        { name: '豌豆蛋白', role: 'Repair — 氨基酸重筑' },
                                        { name: '红米提取物', role: 'Repair — 黏膜修护' },
                                        { name: '抗氧化多酚', role: 'Glow — 系统激活' },
                                        { name: 'Omega-3', role: 'Glow — 肠脑轴支持' },
                                    ].map((i) => (
                                        <div key={i.name} className="flex items-start gap-2">
                                            <Check size={14} className="text-morning-green-dark mt-0.5 flex-shrink-0" />
                                            <div>
                                                <span className="text-sm font-medium text-text-main">{i.name}</span>
                                                <span className="text-xs text-text-muted ml-2">{i.role}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </Section>

                {/* Reviews */}
                <Section>
                    <div className="max-w-5xl mx-auto px-6 md:px-8">
                        <motion.div variants={fadeUp} className="text-center mb-12">
                            <h2 className="text-2xl md:text-3xl font-bold text-herbal-green font-[family-name:var(--font-display)]">
                                用户评价
                            </h2>
                            <div className="flex items-center justify-center gap-2 mt-3">
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star key={i} size={18} className="fill-warm-orange text-warm-orange" />
                                    ))}
                                </div>
                                <span className="text-sm text-text-muted">4.9 / 5 · 128 条评价</span>
                            </div>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { name: 'Sarah L.', rating: 5, content: '第一次不是"被掏空"的感觉，而是真正的轻盈。正在准备第二个季度的 ReSet！', date: '2026 年 2 月' },
                                { name: 'James K.', rating: 5, content: 'App 的提醒功能太棒了。每季度一次 ReSet 已经成为我的仪式。整个过程很舒服、很可控。', date: '2026 年 1 月' },
                                { name: 'Mei T.', rating: 5, content: '苹果味很好喝！困扰了多年的排便不规律，3 天后就感受到了那种自然的流动感。强推！', date: '2026 年 1 月' },
                            ].map((review, i) => (
                                <motion.div key={i} variants={fadeUp} className="p-6 rounded-2xl bg-white border border-border-soft">
                                    <div className="flex gap-0.5 mb-3">
                                        {Array.from({ length: review.rating }).map((_, j) => (
                                            <Star key={j} size={14} className="fill-warm-orange text-warm-orange" />
                                        ))}
                                    </div>
                                    <p className="text-sm text-text-main leading-relaxed mb-4 italic">&ldquo;{review.content}&rdquo;</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-herbal-green">{review.name}</span>
                                        <span className="text-xs text-text-muted">{review.date}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </Section>

                {/* CTA */}
                <Section className="gradient-brand">
                    <div className="max-w-3xl mx-auto px-6 md:px-8 text-center">
                        <motion.div variants={fadeUp}>
                            <h2 className="text-2xl md:text-3xl font-bold text-herbal-green mb-6 font-[family-name:var(--font-display)]">
                                准备好开始校准了吗？
                            </h2>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/products" className="btn-secondary text-sm px-8 py-3">
                                    查看所有产品
                                </Link>
                                <Link href="/how-it-works" className="btn-primary text-sm px-8 py-3 flex items-center justify-center gap-2 group">
                                    了解运作原理
                                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </Section>
            </main>
            <Footer />

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
                            <p className="text-xs text-white/60">正在为您准备重启之旅...</p>
                        </div>
                        <button
                            onClick={() => setIsOpen(true)}
                            className="ml-4 px-4 py-2 bg-warm-orange text-white text-xs font-bold rounded-full hover:bg-warm-orange-dark transition-colors"
                        >
                            查看
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
