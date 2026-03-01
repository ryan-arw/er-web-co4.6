import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '博客 — EzyRelife | 节律健康 · 科学洞察',
    description: '探索节律健康、肠道科学和生活方式的深度文章。了解如何通过 3R 流程重置您的生物节律。',
};

// Blog posts data (will be replaced with CMS/Supabase in future)
const posts = [
    {
        slug: 'what-is-bio-rhythmic-reset',
        title: '什么是生物节律重整？为什么你应该关注它',
        excerpt: '现代生活节奏紊乱正在悄悄侵蚀你的健康。了解 Bio-Rhythmic Reset 如何帮助你找回身体的自然频率。',
        image: '/photo/01 vitalic-d-main.jpg',
        category: '核心科学',
        author: 'EzyRelife 研究团队',
        date: '2026-02-25',
        readTime: '6 分钟',
    },
    {
        slug: '3r-beginners-guide',
        title: '3R 入门完全指南：ReAlign → ReSet → ReStore',
        excerpt: '第一次尝试 Vitalic D 3 天校准方案？这份详细指南将帮助你顺利完成每一步，获得最佳效果。',
        image: '/photo/1 main.jpg',
        category: '使用指南',
        author: 'EzyRelife 健康顾问',
        date: '2026-02-20',
        readTime: '8 分钟',
    },
    {
        slug: 'morning-ritual-for-reset',
        title: '开启高效一天的晨间节律仪式',
        excerpt: '早晨的第一个小时决定了你全天的能量水平。了解如何校准你的皮质醇曲线。',
        image: '/photo/ezyrelife-logo-round.png',
        category: '生活方式',
        author: 'EzyRelife 健康教练',
        date: '2026-02-18',
        readTime: '5 分钟',
    },
    {
        slug: 'science-behind-nourish',
        title: '深入解析：Nourish（滋养）背后的营养科学',
        excerpt: '为什么 Vitalic D 在清理的同时能让你保持精力？探索代谢方程式的秘密。',
        image: '/photo/01 vitalic-d-main.jpg',
        category: '核心科学',
        author: 'Dr. Chen (EzyRelife R&D)',
        date: '2026-02-15',
        readTime: '7 分钟',
    },
    {
        slug: 'fiber-and-gut-health',
        title: '纤维：不仅是通畅，更是你的第二大脑防御线',
        excerpt: '由于加工食品的流行，我们摄入的纤维远低于祖先。了解专利油棕纤维的威力。',
        image: '/photo/ezyrelife-logo-round.png',
        category: '营养百科',
        author: 'EzyRelife 营养师',
        date: '2026-02-12',
        readTime: '6 分钟',
    },
    {
        slug: 'rethinking-detox',
        title: '反思「排毒」：为什么我们更愿意称之为「校准」？',
        excerpt: '你的身体并不脏，它只是偶尔会迷失方向。探索 EzyRelife 的品牌哲学。',
        image: '/photo/1 main.jpg',
        category: '品牌哲学',
        author: 'Founders of EzyRelife',
        date: '2026-02-10',
        readTime: '4 分钟',
    },
];

const categories = ['全部', '核心科学', '使用指南', '生活方式', '营养百科', '品牌哲学'];

export default function BlogPage() {
    return (
        <>
            <Navbar />
            <main className="pt-28 pb-20 min-h-screen">
                {/* Hero */}
                <section className="max-w-6xl mx-auto px-6 md:px-8 mb-12">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-herbal-green mb-4 font-[family-name:var(--font-display)]">
                        节律日志
                    </h1>
                    <p className="text-text-sub max-w-xl">
                        探索节律健康、肠道科学和生活方式的深度文章。用知识驱动你的 ReSet 旅程。
                    </p>
                </section>

                {/* Category Filter */}
                <section className="max-w-6xl mx-auto px-6 md:px-8 mb-10">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${cat === '全部'
                                    ? 'bg-herbal-green text-white'
                                    : 'bg-white border border-border-soft text-text-sub hover:border-herbal-green/30'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Posts Grid */}
                <section className="max-w-6xl mx-auto px-6 md:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <Link
                                key={post.slug}
                                href={`/blog/${post.slug}`}
                                className="group rounded-2xl bg-white border border-border-soft overflow-hidden hover:shadow-xl transition-all duration-300"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-herbal-green/90 text-white text-[10px] font-bold">
                                        {post.category}
                                    </span>
                                </div>
                                <div className="p-5">
                                    <h2 className="text-base font-bold text-herbal-green mb-2 group-hover:text-warm-orange transition-colors line-clamp-2 leading-snug">
                                        {post.title}
                                    </h2>
                                    <p className="text-sm text-text-muted line-clamp-2 mb-4 leading-relaxed">{post.excerpt}</p>
                                    <div className="flex items-center justify-between text-xs text-text-muted">
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                                            <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                                        </div>
                                        <ArrowRight size={14} className="text-warm-orange opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Newsletter CTA */}
                <section className="max-w-6xl mx-auto px-6 md:px-8 mt-16">
                    <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-herbal-green to-herbal-green-dark text-white text-center">
                        <h2 className="text-2xl font-bold mb-3">订阅节律通讯</h2>
                        <p className="text-white/50 max-w-md mx-auto mb-6 text-sm">
                            每周获取健康洞察、产品更新和独家优惠。加入 10,000+ 节律践行者。
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="输入您的邮箱"
                                className="flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-warm-orange"
                            />
                            <button className="px-8 py-3 rounded-full bg-warm-orange text-white text-sm font-semibold hover:bg-warm-orange-dark transition-colors">
                                订阅
                            </button>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
