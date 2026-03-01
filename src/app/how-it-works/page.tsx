'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
    Droplets, Zap, Shield, Sparkles, ArrowRight, Check,
    Clock, Leaf, Sun, Moon, Coffee, Utensils, Sunset,
    ChevronRight, Smartphone, BarChart3, Bell, Activity
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

/* ═══ PAGE HERO ═══ */
function PageHero() {
    return (
        <section className="relative pt-32 pb-20 gradient-hero overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 right-[20%] w-72 h-72 bg-morning-green/10 rounded-full blur-3xl animate-breathe" />
                <div className="absolute bottom-10 left-[10%] w-64 h-64 bg-warm-orange/5 rounded-full blur-3xl animate-breathe" style={{ animationDelay: '2s' }} />
            </div>
            <div className="relative max-w-4xl mx-auto px-6 md:px-8 text-center">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-morning-green/15 border border-morning-green/30 text-xs font-semibold text-herbal-green tracking-wide uppercase mb-6">
                        完整流程指南
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-herbal-green mb-6 font-[family-name:var(--font-display)] leading-[1.1]">
                        不是疗程，<br />
                        <span className="gradient-text-brand">是一段与身体的对话。</span>
                    </h1>
                    <p className="text-lg md:text-xl text-text-sub max-w-2xl mx-auto leading-relaxed">
                        3R 焕新节律将复杂的代谢科学，封装为像呼吸一样自然的生活流。<br />
                        您不需要懂生化反应，只需要跟随这三步乐章。
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

/* ═══ 3R JOURNEY TIMELINE ═══ */
function JourneyTimeline() {
    const phases = [
        {
            phase: 'ReAlign',
            title: '调频 · 减噪',
            subtitle: 'Preparation',
            duration: '准备期 2-3 天',
            color: 'warm-orange',
            bgGradient: 'from-flow-yellow/20 to-flow-yellow/5',
            icon: <Leaf size={28} />,
            description: '给身体腾出空间。降低饮食干扰（噪音），让消化系统安静下来，准备接收校准信号。',
            actions: [
                { icon: <Utensils size={16} />, text: '逐步减少重口味食物' },
                { icon: <Droplets size={16} />, text: '每天 2L 温水，唤醒流动' },
                { icon: <Coffee size={16} />, text: '减少咖啡因和酒精' },
                { icon: <Leaf size={16} />, text: '以清淡蔬食为主' },
            ],
            tip: '把这两天当作一次温和的"数字静音"——只不过静音的不是手机，而是消化道。',
        },
        {
            phase: 'ReSet',
            title: '重启 · 校准',
            subtitle: 'Activation — 72 Hours',
            duration: '核心 72 小时',
            color: 'warm-orange',
            bgGradient: 'from-warm-orange/10 to-warm-orange/5',
            icon: <Zap size={28} />,
            description: '启动 ReLife 代谢方程式的全速运算。遵循身体时钟的节律，定时给予液态代谢燃料。',
            actions: [
                { icon: <Sun size={16} />, text: '06:00 AM — Snack 唤醒引擎' },
                { icon: <Coffee size={16} />, text: '08:00 AM — Meal 能量同频' },
                { icon: <Utensils size={16} />, text: '12:00 PM — Meal 流动维持' },
                { icon: <Sunset size={16} />, text: '06:00 PM — Meal 温和卸载' },
                { icon: <Moon size={16} />, text: '08:00 PM — Snack 安息模式' },
            ],
            tip: '这是"5 点校准法"的核心。每个节点都对应身体不同的代谢窗口。ReLife Sync App 会温柔提醒，您只负责感受。',
        },
        {
            phase: 'ReStore',
            title: '归位 · 新生',
            subtitle: 'Integration',
            duration: '回归期 2-4 天',
            color: 'morning-green-dark',
            bgGradient: 'from-morning-green/15 to-morning-green/5',
            icon: <Sparkles size={28} />,
            description: '带着全新的觉察回归日常。将重启后的洁净节律，整合进你的新生活常态。',
            actions: [
                { icon: <Droplets size={16} />, text: 'Day 4 — 流质：汤、果汁、酸奶' },
                { icon: <Utensils size={16} />, text: 'Day 5 — 软食：粥、燕麦、鱼' },
                { icon: <Leaf size={16} />, text: 'Day 6 — 均衡：蔬果沙拉、清蒸' },
            ],
            tip: '您会发现对食物的选择变了——不是刻意忌口，而是身体自己知道了什么让它舒服。那份轻盈感变成了新的常态。',
        },
    ];

    return (
        <Section id="journey">
            <div className="max-w-5xl mx-auto px-6 md:px-8">
                <motion.div variants={fadeUp} className="text-center mb-16">
                    <span className="text-sm font-semibold text-warm-orange tracking-widest uppercase mb-3 block">三部曲</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-herbal-green font-[family-name:var(--font-display)]">
                        3R 焕新节律
                    </h2>
                </motion.div>

                <div className="space-y-8">
                    {phases.map((phase, index) => (
                        <motion.div
                            key={phase.phase}
                            variants={fadeUp}
                            className={`relative rounded-3xl bg-gradient-to-br ${phase.bgGradient} border border-border-soft overflow-hidden`}
                        >
                            <div className="p-8 md:p-10">
                                {/* Header */}
                                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                                    <div className={`w-14 h-14 rounded-2xl bg-${phase.color}/15 flex items-center justify-center text-${phase.color}`}>
                                        {phase.icon}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-xs font-bold text-warm-orange tracking-widest uppercase">{phase.phase}</span>
                                            <span className="text-xs text-text-muted">·</span>
                                            <span className="text-xs text-text-muted">{phase.subtitle}</span>
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-bold text-herbal-green">{phase.title}</h3>
                                        <span className="text-sm text-text-muted">{phase.duration}</span>
                                    </div>
                                </div>

                                <p className="text-text-sub leading-relaxed mb-8 max-w-2xl">{phase.description}</p>

                                {/* Actions Grid */}
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
                                    {phase.actions.map((action, i) => (
                                        <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/60 border border-white/80">
                                            <span className="text-warm-orange flex-shrink-0">{action.icon}</span>
                                            <span className="text-sm text-text-main">{action.text}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Tip */}
                                <div className="flex gap-3 px-5 py-4 rounded-2xl bg-ivory border border-border-soft">
                                    <span className="text-lg flex-shrink-0">💡</span>
                                    <p className="text-sm text-text-sub italic leading-relaxed">{phase.tip}</p>
                                </div>
                            </div>

                            {/* Step number watermark */}
                            <span className="absolute top-6 right-8 text-8xl font-extrabold text-herbal-green/5">0{index + 1}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Section>
    );
}

/* ═══ METABOLIC EQUATION (DEEP DIVE) ═══ */
function EquationDeepDive() {
    const steps = [
        {
            icon: <Droplets size={24} />,
            name: 'Cleanse', cn: '净彻',
            tagline: '消除阻滞，制造流动',
            mechanism: '物理吸附 (Physical Adsorption)',
            detail: '利用专利油棕纤维与燕麦纤维的立体网状结构，像温和的海绵一样，深入肠道褶皱吸附陈旧积滞。',
            truth: '制造流动 (Flow)，不制造腹痛。是"带走"垃圾，而非用化学成分刺激神经"赶走"垃圾。',
            color: 'blue',
            bgColor: 'bg-blue-50',
        },
        {
            icon: <Zap size={24} />,
            name: 'Nourish', cn: '滋养',
            tagline: '能量同频，清理不掉电',
            mechanism: '能量填补 (Energy Filling)',
            detail: '综合植物酵素与功能性果蔬粉，为身体注入高能燃料，填补能量空窗。',
            truth: '解决"怕饿、怕虚"的痛点。清理的同时供能，身体在校准期间依然精力充沛 (Vitality)，不是在饥饿中宕机。',
            color: 'orange',
            bgColor: 'bg-warm-orange/5',
        },
        {
            icon: <Shield size={24} />,
            name: 'Repair', cn: '修护',
            tagline: '不止是通，更要护',
            mechanism: '屏障重筑 (Barrier Reconstruction)',
            detail: '豌豆蛋白与红米提取物提供氨基酸砖块，修复肠道黏膜屏障。',
            truth: '结构完整性 (Structural Integrity) 是我们的安全底线。不只追求通畅，更要守护肠道的完整结构。',
            color: 'green',
            bgColor: 'bg-morning-green/10',
        },
        {
            icon: <Sparkles size={24} />,
            name: 'Glow', cn: '焕采',
            tagline: '内在通透，外在发光',
            mechanism: '系统激活 (Systemic Activation)',
            detail: '通过肠脑轴支持因子与抗氧化多酚，激活迷走神经信号与抗氧化系统。',
            truth: '内在的代谢通畅，最终折射为外在的清晰度 (Clarity) 与光泽。从肠道到肌肤，由内而外。',
            color: 'amber',
            bgColor: 'bg-amber-50',
        },
    ];

    return (
        <Section id="science" className="bg-white">
            <div className="max-w-5xl mx-auto px-6 md:px-8">
                <motion.div variants={fadeUp} className="text-center mb-16">
                    <span className="text-sm font-semibold text-warm-orange tracking-widest uppercase mb-3 block">核心科技</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-herbal-green mb-4 font-[family-name:var(--font-display)]">
                        ReLife 代谢方程式
                    </h2>
                    <p className="text-text-sub text-lg max-w-2xl mx-auto">
                        每一包产品背后的精密运算。我们不随机堆料，而是执行一套四步生理支持系统。
                    </p>
                </motion.div>

                <div className="space-y-6">
                    {steps.map((step, index) => (
                        <motion.div key={step.name} variants={fadeUp} className={`${step.bgColor} rounded-3xl p-8 md:p-10 border border-border-soft`}>
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="md:w-1/3">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-warm-orange">
                                            {step.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-herbal-green">{step.name}</h3>
                                            <span className="text-sm text-text-muted">({step.cn})</span>
                                        </div>
                                    </div>
                                    <p className="text-sm font-semibold text-warm-orange mb-2">{step.tagline}</p>
                                    <p className="text-xs text-text-muted px-3 py-1.5 rounded-lg bg-white/60 inline-block">
                                        🔬 {step.mechanism}
                                    </p>
                                </div>
                                <div className="md:w-2/3 space-y-4">
                                    <p className="text-text-main leading-relaxed">{step.detail}</p>
                                    <div className="flex gap-3 px-4 py-3 rounded-xl bg-white/70 border border-border-soft">
                                        <Check size={18} className="text-morning-green-dark flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-text-sub leading-relaxed">{step.truth}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Section>
    );
}

/* ═══ 5-POINT CALIBRATION ═══ */
function CalibrationSection() {
    const points = [
        { time: '06:00', label: 'Snack', action: '唤醒', en: 'Wake-Up', desc: '启动代谢引擎。用温和的纤维信号唤醒沉睡的消化道。', icon: <Sun size={20} /> },
        { time: '08:00', label: 'Meal', action: '能量同频', en: 'Energy Sync', desc: '注入方程式的完整能量。Cleanse + Nourish + Repair 同步启动。', icon: <Coffee size={20} /> },
        { time: '12:00', label: 'Meal', action: '流动维持', en: 'Flow Maintenance', desc: '防止午后代谢低谷。维持能量水位线，保持清晰的头脑。', icon: <Utensils size={20} /> },
        { time: '18:00', label: 'Meal', action: '温和卸载', en: 'Gentle Unloading', desc: '预备夜间清理。身体启动"内务整理"的自然程序。', icon: <Sunset size={20} /> },
        { time: '20:00', label: 'Snack', action: '安息模式', en: 'Rest Mode', desc: '支持夜间修护。让身体在睡眠中完成最深层的重建工作。', icon: <Moon size={20} /> },
    ];

    return (
        <Section>
            <div className="max-w-5xl mx-auto px-6 md:px-8">
                <motion.div variants={fadeUp} className="text-center mb-16">
                    <span className="text-sm font-semibold text-warm-orange tracking-widest uppercase mb-3 block">ReSet 核心</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-herbal-green mb-4 font-[family-name:var(--font-display)]">
                        5 点校准法
                    </h2>
                    <p className="text-text-sub text-lg max-w-xl mx-auto">
                        跟随日出日落的节律，在 5 个代谢窗口精准补给。
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical line */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-flow-yellow via-warm-orange to-herbal-green" />

                    <div className="space-y-6 md:space-y-0">
                        {points.map((point, index) => (
                            <motion.div
                                key={point.time}
                                variants={fadeUp}
                                className={`relative md:flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} md:py-6`}
                            >
                                {/* Time Badge */}
                                <div className={`md:w-[calc(50%-2rem)] ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                                    <div className={`inline-flex items-center gap-3 px-5 py-4 rounded-2xl bg-white border border-border-soft shadow-sm hover:shadow-md transition-shadow`}>
                                        <div className="w-10 h-10 rounded-xl bg-warm-orange/10 flex items-center justify-center text-warm-orange">
                                            {point.icon}
                                        </div>
                                        <div className="text-left">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl font-bold text-herbal-green tabular-nums">{point.time}</span>
                                                <span className="text-xs font-semibold text-warm-orange uppercase">{point.label}</span>
                                            </div>
                                            <p className="text-sm font-semibold text-text-main">{point.action} <span className="text-text-muted font-normal">({point.en})</span></p>
                                        </div>
                                    </div>
                                </div>

                                {/* Dot */}
                                <div className="hidden md:flex w-4 h-4 rounded-full bg-warm-orange border-4 border-ivory z-10 flex-shrink-0" />

                                {/* Description */}
                                <div className={`md:w-[calc(50%-2rem)] mt-3 md:mt-0 ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                                    <p className="text-sm text-text-sub leading-relaxed">{point.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </Section>
    );
}

/* ═══ SYNC APP SECTION ═══ */
function SyncAppSection() {
    return (
        <Section className="bg-herbal-green text-white">
            <div className="max-w-5xl mx-auto px-6 md:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div variants={fadeUp}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
                            <Smartphone size={14} className="text-warm-orange" />
                            <span className="text-xs font-semibold text-white/80 uppercase tracking-wide">数字副驾驶</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-display)]">
                            ReLife Sync App
                        </h2>
                        <p className="text-white/60 text-lg mb-8 leading-relaxed">
                            再好的配方，如果错过了身体的窗口期，效果都会打折。<br />
                            ReLife Sync 是您的"数字副驾驶"，确保 100% 执行到位。
                        </p>
                        <div className="space-y-4">
                            {[
                                { icon: <Clock size={18} />, title: '自动时刻表', desc: '基于起床时间生成个人化的 5 点校准表' },
                                { icon: <Bell size={18} />, title: '温柔提醒', desc: '像贴身管家一样在代谢窗口推送通知' },
                                { icon: <BarChart3 size={18} />, title: '节律仪表盘', desc: '水分追踪、身体感受、精力值可视化' },
                                { icon: <Activity size={18} />, title: '季度报告', desc: '每次 ReSet 后生成完整的节律结案报告' },
                            ].map((f) => (
                                <div key={f.title} className="flex gap-4 px-5 py-4 rounded-2xl bg-white/5 border border-white/10">
                                    <span className="text-warm-orange mt-0.5">{f.icon}</span>
                                    <div>
                                        <h4 className="text-sm font-bold text-white">{f.title}</h4>
                                        <p className="text-xs text-white/50">{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div variants={fadeUp} className="flex justify-center">
                        <div className="relative w-64 h-[460px] rounded-[3rem] bg-gradient-to-b from-white/10 to-white/5 border border-white/15 p-3">
                            <div className="w-full h-full rounded-[2.4rem] bg-gradient-to-b from-herbal-green-light to-herbal-green flex flex-col items-center justify-center overflow-hidden px-6 text-center">
                                <div className="relative w-14 h-14 mb-4">
                                    <Image src="/photo/ezyrelife-logo-round.png" alt="ReLife Sync" fill className="object-contain brightness-0 invert" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1">ReLife Sync</h3>
                                <p className="text-xs text-white/50 mb-6">您的节律副驾驶</p>
                                <div className="w-full space-y-2">
                                    {['06:00 — 唤醒引擎 ☀️', '08:00 — 能量同频 ⚡', '12:00 — 流动维持 🌊', '18:00 — 温和卸载 🌅', '20:00 — 安息模式 🌙'].map((t) => (
                                        <div key={t} className="px-3 py-2 rounded-lg bg-white/10 text-xs text-white/70 text-left">{t}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </Section>
    );
}

/* ═══ QUALITY & SAFETY ═══ */
function QualitySection() {
    return (
        <Section className="bg-white">
            <div className="max-w-5xl mx-auto px-6 md:px-8">
                <motion.div variants={fadeUp} className="text-center mb-16">
                    <span className="text-sm font-semibold text-warm-orange tracking-widest uppercase mb-3 block">品质承诺</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-herbal-green mb-4 font-[family-name:var(--font-display)]">
                        结构完整性 · 安全底线
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    <motion.div variants={fadeUp} className="p-8 rounded-3xl bg-morning-green/10 border border-morning-green/20">
                        <h3 className="text-xl font-bold text-herbal-green mb-6 flex items-center gap-2">
                            <Shield size={22} className="text-morning-green-dark" /> 品质认证
                        </h3>
                        <div className="space-y-4">
                            {[
                                { label: 'GMP 认证', desc: '良好生产规范，国际制药级标准' },
                                { label: 'ISO 17025', desc: '实验室检测能力国际认证' },
                                { label: 'HACCP', desc: '食品安全危害分析和关键控制点' },
                                { label: 'SGS 检测', desc: '全球领先第三方检测认证' },
                            ].map((cert) => (
                                <div key={cert.label} className="flex gap-3 items-start">
                                    <Check size={18} className="text-morning-green-dark flex-shrink-0 mt-0.5" />
                                    <div>
                                        <span className="text-sm font-semibold text-herbal-green">{cert.label}</span>
                                        <p className="text-xs text-text-muted">{cert.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div variants={fadeUp} className="p-8 rounded-3xl bg-ivory border border-border-soft">
                        <h3 className="text-xl font-bold text-herbal-green mb-6 flex items-center gap-2">
                            <Leaf size={22} className="text-morning-green-dark" /> 清洁标签
                        </h3>
                        <div className="space-y-4">
                            {[
                                { label: '零泻药', desc: '依靠物理吸附，不刺激神经，无依赖性' },
                                { label: '零重金属', desc: '经 SGS 严格检测，远低于安全阈值' },
                                { label: '零违禁添加', desc: '只使用身体「听得懂」的天然成分' },
                                { label: '零防腐剂', desc: '独立小包装确保新鲜度，无需防腐' },
                            ].map((item) => (
                                <div key={item.label} className="flex gap-3 items-start">
                                    <Check size={18} className="text-warm-orange flex-shrink-0 mt-0.5" />
                                    <div>
                                        <span className="text-sm font-semibold text-herbal-green">{item.label}</span>
                                        <p className="text-xs text-text-muted">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </Section>
    );
}

/* ═══ CTA ═══ */
function BottomCTA() {
    return (
        <Section className="gradient-brand">
            <div className="max-w-3xl mx-auto px-6 md:px-8 text-center">
                <motion.div variants={fadeUp}>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-herbal-green mb-6 font-[family-name:var(--font-display)]">
                        准备好了吗？
                    </h2>
                    <p className="text-text-sub text-lg mb-10 max-w-xl mx-auto">
                        给自己 3 天时间重启。不是痛苦的坚持，而是一场温柔的校准。
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/products" className="btn-primary text-base px-10 py-4 flex items-center justify-center gap-2 group">
                            查看产品
                            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </Section>
    );
}

/* ═══ MAIN ═══ */
export default function HowItWorksPage() {
    return (
        <>
            <Navbar />
            <main>
                <PageHero />
                <JourneyTimeline />
                <CalibrationSection />
                <EquationDeepDive />
                <SyncAppSection />
                <QualitySection />
                <BottomCTA />
            </main>
            <Footer />
        </>
    );
}
