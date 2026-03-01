import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowLeft, ArrowRight, User, Share2 } from 'lucide-react';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';

// Same data source — will be CMS/Supabase later
const postsData: Record<string, { title: string; excerpt: string; image: string; category: string; author: string; date: string; readTime: string; content: string[] }> = {
    'what-is-bio-rhythmic-reset': {
        title: '什么是生物节律重整？为什么你应该关注它',
        excerpt: '现代生活节奏紊乱正在悄悄侵蚀你的健康。',
        image: '/photo/01 vitalic-d-main.jpg',
        category: '核心科学',
        author: 'EzyRelife 研究团队',
        date: '2026-02-25',
        readTime: '6 分钟',
        content: [
            '你有没有这样的感觉：明明睡够了，醒来却依然疲惫？吃得不多，肚子却总觉得胀胀的？情绪像过山车一样起伏不定？',
            '这些看似不相关的症状，其实都指向同一个根源——你的生物节律失调了。',
            '## 什么是生物节律？',
            '生物节律（Bio-Rhythm）不仅仅是昼夜节律那么简单。它是你身体内部所有周期性过程的总和：消化节律、激素分泌节律、细胞修复节律、能量代谢节律……',
            '当这些节律同步运行时，你会感到精力充沛、消化顺畅、思维清晰。但现代生活——不规律的作息、加工食品、长期压力——正在打乱这些精密的内部时钟。',
            '## 节律失调的信号',
            '• 持续性疲劳，即使充足睡眠后仍然感觉累\n• 消化问题：腹胀、便秘或腹泻\n• 皮肤暗沉、痘痘反复\n• 注意力难以集中，脑雾感\n• 免疫力下降，容易生病',
            '## Bio-Rhythmic Reset 如何帮助你',
            'EzyRelife 的 Bio-Rhythmic Reset 不是传统的「排毒」。我们不相信身体需要被「清洗」——它需要被重新校准。',
            '通过 3R 流程（ReAlign → ReSet → ReStore），Vitalic D 帮助你的身体找回自己的自然频率。就像重新调校一件精密乐器，让每个系统重新协调运作。',
            '## 为什么选择 Vitalic D',
            'Vitalic D 不是普通的代餐或补品。它是一个精心设计的 3 天节律校准系统，融合了 30+ 种天然草本精华和营养素，按照你身体的自然节奏精准投放。',
            '没有极端的断食。没有痛苦的饥饿。只有温和而有力的重新校准。',
        ],
    },
    '3r-beginners-guide': {
        title: '3R 入门完全指南：ReAlign → ReSet → ReSet → ReStore',
        excerpt: '第一次尝试 Vitalic D 3 天校准方案？这份指南帮你顺利完成。',
        image: '/photo/1 main.jpg',
        category: '使用指南',
        author: 'EzyRelife 健康顾问',
        date: '2026-02-20',
        readTime: '8 分钟',
        content: [
            '恭喜你决定开始你的 ReSet 旅程！无论你是因为身体发出的信号，还是单纯想给自己一个全面的重启，这份指南将确保你获得最佳体验。',
            '## 开始之前：准备工作',
            '**选择合适的时间**：建议选择一个相对轻松的 3 天周期。不需要请假，但避免在高强度工作或社交活动密集的日子开始。',
            '**准备你的空间**：清理冰箱里的诱惑食物，准备充足的水（建议每天 2-3 升），下载 ReLife Sync App 设定提醒。',
            '## Day 1: ReAlign（重新校准）',
            '这一天的目标是让身体从惯性模式中跳出来。\n\n• 早上：Vitalic D Snack 搭配温水\n• 中午：Vitalic D Meal Replacement 1\n• 晚上：清淡的蔬果沙拉\n• 全天：大量饮水，可以喝花草茶',
            '## Day 2: ReSet（核心重整）',
            '这是整个流程最关键的一天。你的身体开始进入深层修复模式。\n\n• 早上：Vitalic D Snack\n• 中午：Vitalic D Meal Replacement 2（高纤维配方）\n• 晚上：Vitalic D Snack + 温热的蔬菜汤\n• 注意：这天可能会感到轻微的疲倦，这是正常的修复反应',
            '## Day 3: ReStore（修复巩固）',
            '身体开始恢复活力，你可能会感受到前所未有的轻盈感。\n\n• 早上：Vitalic D Snack + 新鲜水果\n• 中午：逐步恢复正常饮食\n• 晚上：正常饮食，but 保持清淡\n• 晚间：记录你的感受在 ReLife Sync App 中',
            '## ReSet 后的维护',
            '完成 3 天 ReSet 后，建议每天继续使用 Vitalic D Snack 维持节律。每季度（90 天）进行一次完整的 3 天 ReSet，保持最佳状态。',
        ],
    },
    'morning-ritual-for-reset': {
        title: '开启高效一天的晨间节律仪式',
        excerpt: '早晨的第一个小时决定了你全天的能量水平。',
        image: '/photo/ezyrelife-logo-round.png',
        category: '生活方式',
        author: 'EzyRelife 健康教练',
        date: '2026-02-18',
        readTime: '5 分钟',
        content: [
            '早晨不仅仅是一天的开始，它是你生物钟重启的信号发生器。一个科学的晨间仪式可以显著优化你的皮质醇曲线，让你全天保持清醒。',
            '## 光线：生命的第一道指令',
            '醒后 20 分钟内接触自然阳光（即使是阴天）是校准生物钟最有效的方式。这会向大脑发送停止分泌褪黑素、开始产生血清素的指令。',
            '## 补水：唤醒每一个细胞',
            '经过一晚的脱水，身体最需要的是温水。加入一小片柠檬或一勺 Vitalic D Snack，温和地唤醒消化系统，启动代谢引擎。',
            '## 移动：低强度的节律激活',
            '不需要高强度运动。简单的拉伸、10 分钟冥想或轻快步走。目标是提高核心体温，告诉身体：我们正在进入「工作模式」。',
            '**ReLife 建议**：尝试在 7:30 AM 前完成你的 Vitalic D Snack，这是校准肠道时钟的最佳时间点。',
        ],
    },
    'science-behind-nourish': {
        title: '深入解析：Nourish（滋养）背后的营养科学',
        excerpt: '为什么 Vitalic D 在清理的同时能让你保持精力？',
        image: '/photo/01 vitalic-d-main.jpg',
        category: '核心科学',
        author: 'Dr. Chen (EzyRelife R&D)',
        date: '2026-02-15',
        readTime: '7 分钟',
        content: [
            '市面上许多清理方案会导致电解质流失、低血糖或极度虚弱。Vitalic D 的「代谢方程式」解决了这个问题。',
            '## 阶梯式能量释放',
            '我们采用复合来源的低 GI 营养素，确保持续平稳地向血液输送能量，而不是陡升陡降。这就是为什么你在 3 天 ReSet 期间依然可以正常办公的原因。',
            '## 微生态修复剂',
            'Nourish 阶段包含 15+ 种浓缩果蔬粉，提供天然抗氧化剂和辅酶。这些营养物质就像肠道细胞的修复工具箱，帮助受损的肠道黏膜找回完整度。',
            '## 零泻药的尊严清理',
            '我们完全拒绝泻药成分。我们依靠的是物理吸附和酶促反应。这是科学，也是对生理规律的尊重。',
        ],
    },
    'fiber-and-gut-health': {
        title: '纤维：不仅是通畅，更是你的第二大脑防御线',
        excerpt: '由于加工食品的流行，我们摄入的纤维远低于祖先。',
        image: '/photo/ezyrelife-logo-round.png',
        category: '营养百科',
        author: 'EzyRelife 营养师',
        date: '2026-02-12',
        readTime: '6 分钟',
        content: [
            '纤维被误解为仅仅是「通大便」的工具。其实，它是你肠道微生态的基石，更是免疫系统的培训师。',
            '## 专利油棕纤维的秘密',
            'Vitalic D 独有的专利油棕纤维具有极佳的吸水性和立体结构。它不仅仅是移动，它是吸附。像清理管道的毛刷一样，温和地带走代谢副产物。',
            '## 与微生物组共舞',
            '可溶性纤维是益生菌的「食物」（益生元）。当你的益生菌吃饱了，它们会产生短链脂肪酸（SCFA），这是保护大脑免受炎症干扰的关键。',
            '**小贴士**：在使用 Vitalic D 期间，每摄入 1 包，请额外配合 300ml 温水。纤维就像海绵，水分是它的载体。',
        ],
    },
    'rethinking-detox': {
        title: '反思「排毒」：为什么我们更愿意称之为「校准」？',
        excerpt: '你的身体并不脏，它只是偶尔会迷失方向。',
        image: '/photo/1 main.jpg',
        category: '品牌哲学',
        author: 'Founders of EzyRelife',
        date: '2026-02-10',
        readTime: '4 分钟',
        content: [
            '「排毒」这个词在流行文化中已经变味了。它听起来像是一个关于惩罚、关于污垢、关于「清零」的概念。',
            '## 身体不是水管，它是生态系统',
            '在 EzyRelife，我们认为身体拥有完美的自净机制（肝脏、肾脏、肠道）。既然已经这么完美，为什么还会出问题？',
            '答案是：**错位**。',
            '当你该睡觉时在进食，当你该排泄时在焦虑。系统由于这些冲突的指令而产生了「阻滞」。',
            '## 调优而非重建',
            '「校准 (Calibration)」意味着尊重现状，只是微调频率。Vitalic D 做的是同步你的节奏。当你与身体同频，它自然会处理掉不再需要的东西。',
            '这是我们创建 EzyRelife 的初心：不再与身体对抗，开始一场协作。',
        ],
    },
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = postsData[slug];

    if (!post) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center pt-20">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-herbal-green mb-4">文章未找到</h1>
                        <Link href="/blog" className="btn-primary text-sm px-8 py-3 inline-flex items-center gap-2">
                            返回博客 <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main className="pt-28 pb-20 min-h-screen">
                <article className="max-w-3xl mx-auto px-6 md:px-8">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-xs text-text-muted mb-6">
                        <Link href="/blog" className="hover:text-herbal-green transition-colors flex items-center gap-1">
                            <ArrowLeft size={12} /> 博客
                        </Link>
                        <span>/</span>
                        <span className="text-herbal-green">{post.category}</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-herbal-green leading-tight mb-5 font-[family-name:var(--font-display)]">
                        {post.title}
                    </h1>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted mb-8 pb-8 border-b border-border-soft">
                        <span className="flex items-center gap-1.5"><User size={14} /> {post.author}</span>
                        <span className="flex items-center gap-1.5"><Calendar size={14} /> {post.date}</span>
                        <span className="flex items-center gap-1.5"><Clock size={14} /> {post.readTime}</span>
                        <span className="px-3 py-0.5 rounded-full bg-herbal-green/10 text-herbal-green text-xs font-semibold">{post.category}</span>
                    </div>

                    {/* Featured Image */}
                    <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-10">
                        <Image src={post.image} alt={post.title} fill className="object-cover" />
                    </div>

                    {/* Content */}
                    <div className="prose prose-lg max-w-none">
                        {post.content.map((block, i) => {
                            if (block.startsWith('## ')) {
                                return <h2 key={i} className="text-xl font-bold text-herbal-green mt-10 mb-4 font-[family-name:var(--font-display)]">{block.replace('## ', '')}</h2>;
                            }
                            if (block.startsWith('**')) {
                                return <p key={i} className="text-text-main leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: block.replace(/\*\*(.*?)\*\*/g, '<strong class="text-herbal-green">$1</strong>') }} />;
                            }
                            if (block.includes('\n')) {
                                return (
                                    <div key={i} className="mb-4">
                                        {block.split('\n').map((line, j) => (
                                            <p key={j} className="text-text-sub leading-relaxed mb-1">{line}</p>
                                        ))}
                                    </div>
                                );
                            }
                            return <p key={i} className="text-text-sub leading-relaxed mb-4">{block}</p>;
                        })}
                    </div>

                    {/* Share + Related */}
                    <div className="mt-12 pt-8 border-t border-border-soft">
                        <div className="flex items-center justify-between mb-8">
                            <button className="flex items-center gap-2 text-sm text-text-muted hover:text-herbal-green transition-colors">
                                <Share2 size={16} /> 分享文章
                            </button>
                            <Link href="/blog" className="text-sm text-warm-orange hover:text-warm-orange-dark font-semibold flex items-center gap-1 transition-colors">
                                更多文章 <ArrowRight size={14} />
                            </Link>
                        </div>

                        {/* CTA */}
                        <div className="p-8 rounded-2xl bg-gradient-to-r from-morning-green/10 to-warm-orange/10 border border-border-soft text-center">
                            <h3 className="text-lg font-bold text-herbal-green mb-2">准备开始你的 ReSet 旅程？</h3>
                            <p className="text-sm text-text-muted mb-5">选择适合你的 Vitalic D 方案，体验 3 天节律校准。</p>
                            <Link href="/products" className="btn-primary text-sm px-8 py-3 inline-flex items-center gap-2">
                                浏览产品 <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </article>
            </main>
            <Footer />
        </>
    );
}
