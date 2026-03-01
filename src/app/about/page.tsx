'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
    Heart, Activity, Timer, Waves, Shield, Sparkles,
    ArrowRight, Target, Eye, Compass, Users
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
function AboutHero() {
    return (
        <section className="relative pt-32 pb-20 gradient-hero overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-[15%] w-72 h-72 bg-morning-green/10 rounded-full blur-3xl animate-breathe" />
                <div className="absolute bottom-10 right-[10%] w-64 h-64 bg-warm-orange/5 rounded-full blur-3xl animate-breathe" style={{ animationDelay: '2s' }} />
            </div>
            <div className="relative max-w-4xl mx-auto px-6 md:px-8 text-center">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-morning-green/15 border border-morning-green/30 text-xs font-semibold text-herbal-green tracking-wide uppercase mb-6">
                        关于我们
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-herbal-green mb-6 font-[family-name:var(--font-display)] leading-[1.1]">
                        有同理心的<br />
                        <span className="gradient-text-brand">节律架构师。</span>
                    </h1>
                    <p className="text-lg md:text-xl text-text-sub max-w-2xl mx-auto leading-relaxed">
                        我们既有科学家的冷静大脑，也有生活导师的温暖心灵。<br />
                        不制造焦虑，不贩卖恐慌，只提供校准生命的方案。
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

/* ═══ BELIEF ═══ */
function BeliefSection() {
    return (
        <Section className="bg-white">
            <div className="max-w-5xl mx-auto px-6 md:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div variants={fadeUp}>
                        <span className="text-sm font-semibold text-warm-orange tracking-widest uppercase mb-3 block">我们的信仰</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-herbal-green mb-6 font-[family-name:var(--font-display)]">
                            我们不控制身体，<br />我们与身体协作。
                        </h2>
                        <div className="space-y-6">
                            <p className="text-text-sub leading-relaxed text-lg">
                                在一个充满"对抗"的世界里——人们试图用泻药对抗便秘，用断食对抗肥胖，用焦虑对抗失控——EzyRelife 选择了一条不同的路。
                            </p>
                            <p className="text-text-sub leading-relaxed">
                                我们相信，身体的问题，本质上是<strong className="text-herbal-green">节律 (Rhythm)</strong> 的失调。身体不需要被"排空"或"惩罚"，它只需要被
                                <strong className="text-warm-orange">"校准 (Calibrate)"</strong>。
                            </p>
                            <p className="text-text-sub leading-relaxed">
                                我们存在的意义，不是为了制造"更狠"的排毒产品，而是为了提供一套"更懂身体"的节律校准方案。让复杂的代谢科学，回归为像呼吸一样自然的日常生活。
                            </p>
                        </div>
                    </motion.div>

                    <motion.div variants={fadeUp} className="relative">
                        <div className="relative aspect-square rounded-3xl overflow-hidden">
                            <Image
                                src="/photo/-edited_5.png"
                                alt="Vitalic D — 温暖的家居场景"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-herbal-green/20 to-transparent" />
                        </div>
                        <div className="absolute -bottom-4 -left-4 px-6 py-4 rounded-2xl glass shadow-lg">
                            <p className="text-sm font-bold text-herbal-green italic">
                                &ldquo;We collaborate with the body.&rdquo;
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </Section>
    );
}

/* ═══ VALUES ═══ */
function ValuesSection() {
    const values = [
        {
            letter: 'R',
            name: 'Rhythm',
            cn: '节奏即生命',
            description: '我们敬畏身体的生物钟。所有的创新，都是为了让身体回到它应有的节拍上。不做破坏节律的事。',
            icon: <Activity size={24} />,
            color: 'text-warm-orange',
            bg: 'bg-warm-orange/10',
        },
        {
            letter: 'I',
            name: 'Integrity',
            cn: '结构即信任',
            description: '品质源于结构的完整。从 ReLife 代谢方程式的配比到全球认证供应链，我们坚持科学的严谨性。',
            icon: <Shield size={24} />,
            color: 'text-herbal-green',
            bg: 'bg-morning-green/10',
        },
        {
            letter: 'F',
            name: 'Flow',
            cn: '流动即高效',
            description: '真正的健康是流动的。消除身体和生活中的"阻滞 (Stagnation)"，让生命力自由流淌。',
            icon: <Waves size={24} />,
            color: 'text-blue-500',
            bg: 'bg-blue-50',
        },
        {
            letter: 'E',
            name: 'Empathy',
            cn: '共感即责任',
            description: '我们理解"改变"很难。我们提供的不仅是工具，更是温和的陪伴。在用户最脆弱的时候给予最坚定的支持。',
            icon: <Heart size={24} />,
            color: 'text-pink-500',
            bg: 'bg-pink-50',
        },
    ];

    return (
        <Section>
            <div className="max-w-5xl mx-auto px-6 md:px-8">
                <motion.div variants={fadeUp} className="text-center mb-16">
                    <span className="text-sm font-semibold text-warm-orange tracking-widest uppercase mb-3 block">核心价值观</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-herbal-green mb-4 font-[family-name:var(--font-display)]">
                        R · I · F · E
                    </h2>
                    <p className="text-text-sub text-lg">四个不可动摇的原则，构成我们的 DNA。</p>
                </motion.div>

                <div className="grid sm:grid-cols-2 gap-6">
                    {values.map((value) => (
                        <motion.div
                            key={value.letter}
                            variants={fadeUp}
                            className="p-8 rounded-3xl bg-white border border-border-soft hover:shadow-lg hover:shadow-morning-green/5 transition-all duration-500 group"
                        >
                            <div className="flex items-start gap-5">
                                <div className={`w-14 h-14 rounded-2xl ${value.bg} flex items-center justify-center ${value.color} flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                    {value.icon}
                                </div>
                                <div>
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <span className="text-3xl font-extrabold text-herbal-green/15">{value.letter}</span>
                                        <h3 className="text-lg font-bold text-herbal-green">{value.name}</h3>
                                    </div>
                                    <p className="text-sm font-semibold text-warm-orange mb-2">{value.cn}</p>
                                    <p className="text-sm text-text-sub leading-relaxed">{value.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Section>
    );
}

/* ═══ VISION & MISSION ═══ */
function VisionMissionSection() {
    return (
        <Section className="bg-white">
            <div className="max-w-5xl mx-auto px-6 md:px-8">
                <div className="grid md:grid-cols-2 gap-8">
                    <motion.div variants={fadeUp} className="p-8 md:p-10 rounded-3xl bg-herbal-green text-white">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-warm-orange mb-6">
                            <Eye size={24} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">愿景</h3>
                        <p className="text-white/70 leading-relaxed text-lg">
                            成为全球领先的<strong className="text-white">生物节律智能生态</strong>品牌。让每个人都能通过精密的节律校准，活出通畅、高能、有掌控感的生命状态。
                        </p>
                    </motion.div>

                    <motion.div variants={fadeUp} className="p-8 md:p-10 rounded-3xl bg-warm-orange/5 border border-warm-orange/20">
                        <div className="w-12 h-12 rounded-xl bg-warm-orange/10 flex items-center justify-center text-warm-orange mb-6">
                            <Compass size={24} />
                        </div>
                        <h3 className="text-2xl font-bold text-herbal-green mb-4">使命</h3>
                        <p className="text-text-sub leading-relaxed text-lg">
                            <strong className="text-herbal-green">Reset from Within. ReLife for Real.</strong>
                            <br className="mb-2" />
                            从内在重启节律，活出真实生命力。我们通过"软硬结合"的产品 + App 方案，帮助现代人找回身体的掌控感。
                        </p>
                    </motion.div>
                </div>
            </div>
        </Section>
    );
}

/* ═══ TARGET USERS ═══ */
function TargetUsersSection() {
    const personas = [
        {
            emoji: '🔄',
            name: '阻滞者',
            en: 'The Stagnated',
            description: '长期消化不规律、容易腹胀、毒素感明显的人。寻求通畅流动，但不想用暴力泻药。',
        },
        {
            emoji: '⚡',
            name: '超负荷者',
            en: 'The Overloaded',
            description: '商务应酬频繁、饮食不规律的职场人。需要定期"大保养"来校准被打乱的代谢节律。',
        },
        {
            emoji: '🌿',
            name: '节律追寻者',
            en: 'The Rhythm Seeker',
            description: '有一定健康意识、已尝试过不满意方案的人。寻求真正温和、有结构、可持续的校准系统。',
        },
        {
            emoji: '✨',
            name: '焕新者',
            en: 'The Renewal Seeker',
            description: '想要由内而外提升精力与清晰度的人。追求的不是数字的变化，而是内在状态的焕新。',
        },
    ];

    return (
        <Section>
            <div className="max-w-5xl mx-auto px-6 md:px-8">
                <motion.div variants={fadeUp} className="text-center mb-16">
                    <span className="text-sm font-semibold text-warm-orange tracking-widest uppercase mb-3 block">为谁而生</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-herbal-green mb-4 font-[family-name:var(--font-display)]">
                        我们服务的人群
                    </h2>
                    <p className="text-text-sub text-lg">
                        身体不需要"惩罚"，它只需要一个懂它的架构师。
                    </p>
                </motion.div>

                <div className="grid sm:grid-cols-2 gap-6">
                    {personas.map((p) => (
                        <motion.div
                            key={p.name}
                            variants={fadeUp}
                            className="p-6 rounded-2xl bg-white border border-border-soft hover:border-morning-green/30 transition-all duration-500"
                        >
                            <div className="flex items-start gap-4">
                                <span className="text-3xl">{p.emoji}</span>
                                <div>
                                    <h3 className="text-base font-bold text-herbal-green">{p.name}</h3>
                                    <p className="text-xs text-warm-orange font-medium mb-2">{p.en}</p>
                                    <p className="text-sm text-text-sub leading-relaxed">{p.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Section>
    );
}

/* ═══ BRAND OATH ═══ */
function BrandOath() {
    return (
        <Section className="gradient-brand">
            <div className="max-w-3xl mx-auto px-6 md:px-8 text-center">
                <motion.div variants={fadeUp}>
                    <div className="relative w-16 h-16 mx-auto mb-8">
                        <Image src="/photo/ezyrelife-logo-round.png" alt="EzyRelife" fill className="object-contain animate-breathe" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-herbal-green mb-8 font-[family-name:var(--font-display)] italic leading-relaxed">
                        &ldquo;我们不制造焦虑，我们制造同频。<br />
                        我们不强迫改变，我们唤醒本能。<br />
                        让世界找回节奏。&rdquo;
                    </h2>
                    <p className="text-warm-orange font-semibold text-lg mb-10">— The EzyRelife Oath</p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/products" className="btn-primary text-base px-10 py-4 flex items-center justify-center gap-2 group">
                            探索产品
                            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link href="/how-it-works" className="btn-secondary text-base px-10 py-4">
                            了解运作原理
                        </Link>
                    </div>
                </motion.div>
            </div>
        </Section>
    );
}

/* ═══ MAIN ═══ */
export default function AboutPage() {
    return (
        <>
            <Navbar />
            <main>
                <AboutHero />
                <BeliefSection />
                <ValuesSection />
                <VisionMissionSection />
                <TargetUsersSection />
                <BrandOath />
            </main>
            <Footer />
        </>
    );
}
