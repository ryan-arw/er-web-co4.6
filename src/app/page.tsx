'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Droplets, Zap, Shield, Sparkles,
  ArrowRight, Check, Star, ChevronDown,
  Timer, Leaf, Heart, Activity,
  Smartphone, Clock, BarChart3, Bell
} from 'lucide-react';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';

/* ─── Animation Variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

function Section({ children, className = '', id = '' }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={stagger}
      className={`section-gap ${className}`}
    >
      {children}
    </motion.section>
  );
}

/* ═══════════════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════════════ */
function HeroSection() {
  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden gradient-hero">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating circles - Bio-Rhythmic visual metaphors */}
        <div className="absolute top-20 right-[15%] w-72 h-72 bg-morning-green/10 rounded-full blur-3xl animate-breathe" />
        <div className="absolute bottom-20 left-[10%] w-96 h-96 bg-warm-orange/5 rounded-full blur-3xl animate-breathe" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-[5%] w-48 h-48 bg-flow-yellow/15 rounded-full blur-2xl animate-float" />

        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle, #044b33 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-8 pt-28 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-morning-green/15 border border-morning-green/30 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-warm-orange animate-pulse-gentle" />
              <span className="text-xs font-semibold text-herbal-green tracking-wide uppercase">
                生物节律校准系统
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6 font-[family-name:var(--font-display)]">
              <span className="text-herbal-green">别再与身体对抗，</span>
              <br />
              <span className="gradient-text-brand">开始一场协作。</span>
            </h1>

            <p className="text-lg md:text-xl text-text-sub leading-relaxed mb-10 max-w-lg">
              Vitalic D 3 天生物节律重整系统，不排毒，只
              <span className="text-warm-orange font-semibold">校准</span>。
              让失序的代谢时钟，回到精准的生命节律上。
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/products" className="btn-primary text-base px-8 py-4 flex items-center justify-center gap-2 group">
                开始我的重启
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/how-it-works" className="btn-secondary text-base px-8 py-4 flex items-center justify-center gap-2">
                了解运作原理
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-6 text-sm text-text-muted">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-morning-green-dark" />
                <span>零泻药·零防腐剂</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} className="text-morning-green-dark" />
                <span>GMP / SGS 认证</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Product Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex justify-center"
          >
            {/* Glow ring behind product */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[80%] h-[80%] rounded-full bg-gradient-to-br from-morning-green/20 via-transparent to-warm-orange/10 animate-spin-slow" />
            </div>
            <div className="relative w-full max-w-lg aspect-square">
              <Image
                src="/photo/01 vitalic-d-main.jpg"
                alt="Vitalic D 3-Day Reset System"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-text-muted">向下探索</span>
          <ChevronDown size={20} className="text-warm-orange animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   BRAND PHILOSOPHY
   ═══════════════════════════════════════════════════ */
function PhilosophySection() {
  const philosophies = [
    {
      icon: <Heart className="text-warm-orange" size={28} />,
      title: '协作而非对抗',
      en: 'Collaboration over Control',
      description: '我们不控制身体，我们与身体协作。通过物理吸附与营养支持，赋能身体完成自我修复。',
    },
    {
      icon: <Activity className="text-morning-green-dark" size={28} />,
      title: '校准而非排毒',
      en: 'Calibration not Detox',
      description: '"排毒"暗示身体是脏的，"校准"确认身体是精密的。我们的目标是让你感到通畅流动与掌控感。',
    },
    {
      icon: <Timer className="text-herbal-green" size={28} />,
      title: '长期而非速效',
      en: 'Cultivation not Quick-fix',
      description: '我们不承诺违背生理规律的速效奇迹。ReLife 是一场长期的节律养成，像呼吸一样自然。',
    },
  ];

  return (
    <Section id="philosophy" className="bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <motion.div variants={fadeUp} className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-warm-orange tracking-widest uppercase mb-3 block">
            我们的哲学
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-herbal-green mb-4 font-[family-name:var(--font-display)]">
            重新定义「健康」
          </h2>
          <p className="text-text-sub text-lg">
            在一个崇尚 "更快、更狠" 的时代，我们选择了温柔的力量。
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {philosophies.map((item, index) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              className="group relative p-8 rounded-3xl bg-ivory border border-border-soft hover:border-morning-green/40 transition-all duration-500 hover:shadow-lg hover:shadow-morning-green/10"
            >
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-500">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-herbal-green mb-1">{item.title}</h3>
              <p className="text-xs text-warm-orange font-medium mb-4 tracking-wide">{item.en}</p>
              <p className="text-text-sub leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════
   HOW IT WORKS — 3R Journey
   ═══════════════════════════════════════════════════ */
function HowItWorksSection() {
  const steps = [
    {
      step: '01',
      phase: 'ReAlign',
      title: '调频 · 减噪',
      duration: '准备期 2-3 天',
      description: '给身体腾出空间。通过清淡饮食减少干扰噪音，让消化系统安静下来，准备接收校准信号。',
      color: 'bg-flow-yellow/30',
      borderColor: 'border-flow-yellow',
      textColor: 'text-herbal-green',
      icon: <Leaf size={24} />,
    },
    {
      step: '02',
      phase: 'ReSet',
      title: '重启 · 校准',
      duration: '核心 72 小时',
      description: '启动 5 点校准法。跟随日出日落的节律，定时给予身体液态滋养。这是与身体深度对话的黄金时间。',
      color: 'bg-warm-orange/10',
      borderColor: 'border-warm-orange',
      textColor: 'text-warm-orange',
      icon: <Zap size={24} />,
    },
    {
      step: '03',
      phase: 'ReStore',
      title: '归位 · 新生',
      duration: '回归期 2-4 天',
      description: '带着全新的觉察回归日常。您会发现对食物的选择变了，那份轻盈感变成了新的常态。',
      color: 'bg-morning-green/15',
      borderColor: 'border-morning-green',
      textColor: 'text-morning-green-dark',
      icon: <Sparkles size={24} />,
    },
  ];

  return (
    <Section id="how-it-works">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <motion.div variants={fadeUp} className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-warm-orange tracking-widest uppercase mb-3 block">
            您的旅程
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-herbal-green mb-4 font-[family-name:var(--font-display)]">
            3R 焕新节律
          </h2>
          <p className="text-text-sub text-lg">
            不是疗程，而是一段与身体同频的三部曲乐章。
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-10">
          {steps.map((step, index) => (
            <motion.div
              key={step.phase}
              variants={fadeUp}
              className={`relative p-8 rounded-3xl border-2 ${step.borderColor} ${step.color} overflow-hidden group`}
            >
              {/* Step number */}
              <span className="absolute top-6 right-6 text-6xl font-extrabold opacity-10 text-herbal-green">
                {step.step}
              </span>

              <div className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center ${step.textColor} mb-5`}>
                {step.icon}
              </div>

              <div className="mb-4">
                <span className={`text-sm font-bold ${step.textColor} tracking-wide`}>
                  {step.phase}
                </span>
                <h3 className="text-2xl font-bold text-herbal-green mt-1">{step.title}</h3>
                <span className="text-xs text-text-muted mt-1 block">{step.duration}</span>
              </div>
              <p className="text-text-sub leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Connection line (desktop only) */}
        <div className="hidden md:flex justify-center mt-10">
          <Link href="/how-it-works" className="flex items-center gap-2 text-sm font-semibold text-warm-orange hover:text-warm-orange-dark transition-colors group">
            深入了解完整流程
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════
   SCIENCE — ReLife Metabolic Equation
   ═══════════════════════════════════════════════════ */
function ScienceSection() {
  const equations = [
    {
      icon: <Droplets size={24} />,
      name: 'Cleanse',
      cn: '净彻',
      tagline: '消除阻滞，制造流动',
      description: '专利油棕纤维的立体网状结构，像温和的海绵，深入肠道褶皱吸附陈旧废物。制造流动，不制造腹痛。',
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    {
      icon: <Zap size={24} />,
      name: 'Nourish',
      cn: '滋养',
      tagline: '能量同频，清理不掉电',
      description: '综合植物酵素与功能性果蔬粉，为身体注入高能燃料，填补能量空窗。精力充沛，不饿不虚。',
      color: 'text-warm-orange',
      bg: 'bg-warm-orange/5',
    },
    {
      icon: <Shield size={24} />,
      name: 'Repair',
      cn: '修护',
      tagline: '不止是通，更要护',
      description: '优质豌豆蛋白为肠道屏障提供修复砖块。结构完整性，是我们的安全底线。',
      color: 'text-morning-green-dark',
      bg: 'bg-morning-green/10',
    },
    {
      icon: <Sparkles size={24} />,
      name: 'Glow',
      cn: '焕采',
      tagline: '内在通透，外在发光',
      description: '当内在阻滞消除，迷走神经信号变得清晰。通畅最终折射为眼神的清澈与肌肤的光泽。',
      color: 'text-amber-500',
      bg: 'bg-amber-50',
    },
  ];

  return (
    <Section id="science" className="bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <motion.div variants={fadeUp} className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-warm-orange tracking-widest uppercase mb-3 block">
            核心科技
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-herbal-green mb-4 font-[family-name:var(--font-display)]">
            ReLife 代谢方程式
          </h2>
          <p className="text-text-sub text-lg">
            每一包产品背后的精密运算。不堆砌成分，我们构建系统。
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {equations.map((eq, index) => (
            <motion.div
              key={eq.name}
              variants={fadeUp}
              className={`p-6 rounded-2xl ${eq.bg} border border-transparent hover:border-border-soft transition-all duration-500 group`}
            >
              <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center ${eq.color} shadow-sm mb-5 group-hover:scale-110 transition-transform`}>
                {eq.icon}
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <h3 className="text-lg font-bold text-herbal-green">{eq.name}</h3>
                <span className="text-sm text-text-muted">({eq.cn})</span>
              </div>
              <p className={`text-xs font-semibold ${eq.color} mb-3`}>{eq.tagline}</p>
              <p className="text-sm text-text-sub leading-relaxed">{eq.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════
   PRODUCT SECTION
   ═══════════════════════════════════════════════════ */
function ProductSection() {
  return (
    <Section id="products">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <motion.div variants={fadeUp} className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-warm-orange tracking-widest uppercase mb-3 block">
            产品
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-herbal-green mb-4 font-[family-name:var(--font-display)]">
            选择您的重启之旅
          </h2>
          <p className="text-text-sub text-lg">
            一盒 24 包（Snack 6 包 + Meal 1 x 9 包 + Meal 2 x 9 包），完整 3 天旅程。
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Product Card: Original */}
          <motion.div
            variants={fadeUp}
            className="relative group rounded-3xl bg-white border border-border-soft overflow-hidden hover:shadow-xl hover:shadow-morning-green/10 transition-all duration-500"
          >
            <div className="relative aspect-square bg-gradient-to-b from-ivory to-morning-green/5 p-8 flex items-center justify-center">
              <Image
                src="/photo/01 vitalic-d-main.jpg"
                alt="Vitalic D Original"
                fill
                className="object-contain p-8 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-warm-orange text-white text-xs font-bold">
                热销
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-xl font-bold text-herbal-green mb-1">Vitalic D · Original</h3>
              <p className="text-sm text-text-muted mb-4">3 天生物节律重整系统 · 原味</p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between py-2 border-b border-border-soft">
                  <span className="text-sm text-text-sub">单盒购买</span>
                  <span className="text-lg font-bold text-herbal-green">$145.00</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border-soft">
                  <span className="text-sm text-text-sub">2 盒优惠</span>
                  <span className="text-lg font-bold text-warm-orange">$130.50 <span className="text-xs text-text-muted font-normal">/盒</span></span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-text-sub flex items-center gap-1">
                    3 盒超值
                    <span className="px-2 py-0.5 rounded-full bg-morning-green/20 text-xs font-semibold text-herbal-green">超值</span>
                  </span>
                  <span className="text-lg font-bold text-warm-orange">$121.00 <span className="text-xs text-text-muted font-normal">/盒</span></span>
                </div>
              </div>

              <Link
                href="/products/original"
                className="w-full btn-primary text-sm py-3 flex items-center justify-center gap-2"
              >
                立即选购
                <ArrowRight size={16} />
              </Link>
              <p className="text-xs text-text-muted text-center mt-3">
                🔁 订阅再省 10% · 含 ReLife Sync App 导航
              </p>
            </div>
          </motion.div>

          {/* Product Card: Apple */}
          <motion.div
            variants={fadeUp}
            className="relative group rounded-3xl bg-white border border-border-soft overflow-hidden hover:shadow-xl hover:shadow-morning-green/10 transition-all duration-500"
          >
            <div className="relative aspect-square bg-gradient-to-b from-ivory to-morning-green/5 p-8 flex items-center justify-center">
              <Image
                src="/photo/1 main.jpg"
                alt="Vitalic D Apple Flavor"
                fill
                className="object-contain p-8 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-morning-green text-white text-xs font-bold">
                新口味
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-xl font-bold text-herbal-green mb-1">Vitalic D · Apple</h3>
              <p className="text-sm text-text-muted mb-4">3 天生物节律重整系统 · 苹果味</p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between py-2 border-b border-border-soft">
                  <span className="text-sm text-text-sub">单盒购买</span>
                  <span className="text-lg font-bold text-herbal-green">$145.00</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border-soft">
                  <span className="text-sm text-text-sub">2 盒优惠</span>
                  <span className="text-lg font-bold text-warm-orange">$130.50 <span className="text-xs text-text-muted font-normal">/盒</span></span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-text-sub flex items-center gap-1">
                    3 盒超值
                    <span className="px-2 py-0.5 rounded-full bg-morning-green/20 text-xs font-semibold text-herbal-green">超值</span>
                  </span>
                  <span className="text-lg font-bold text-warm-orange">$121.00 <span className="text-xs text-text-muted font-normal">/盒</span></span>
                </div>
              </div>

              <Link
                href="/products/apple"
                className="w-full btn-primary text-sm py-3 flex items-center justify-center gap-2"
              >
                立即选购
                <ArrowRight size={16} />
              </Link>
              <p className="text-xs text-text-muted text-center mt-3">
                🔁 订阅再省 10% · 含 ReLife Sync App 导航
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════
   APP SECTION — ReLife Sync
   ═══════════════════════════════════════════════════ */
function AppSection() {
  const features = [
    {
      icon: <Clock size={20} />,
      title: '精准卡点',
      description: '基于起床时间自动生成「5点校准时刻表」，温柔提醒每个代谢节点。',
    },
    {
      icon: <BarChart3 size={20} />,
      title: '可视化反馈',
      description: '将身体感受转化为「节律仪表盘」，直观追踪流动感与精力值。',
    },
    {
      icon: <Bell size={20} />,
      title: '智能提醒',
      description: '根据您的生活节奏自动调整提醒时间，像贴身管家一样温柔陪伴。',
    },
    {
      icon: <Activity size={20} />,
      title: '365 天同频',
      description: '不仅 3 天校准，更提供日常习惯同频管理与季度节律结案报告。',
    },
  ];

  return (
    <Section className="bg-herbal-green text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <motion.div variants={fadeUp}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8">
              <Smartphone size={14} className="text-warm-orange" />
              <span className="text-xs font-semibold text-white/80 tracking-wide uppercase">
                数字副驾驶
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-display)]">
              ReLife Sync App
            </h2>
            <p className="text-white/60 text-lg mb-10 leading-relaxed">
              不仅仅是产品，更是全天候的节律导航。
              <br />它负责记忆，您只负责感受。
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature) => (
                <motion.div key={feature.title} variants={fadeUp} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-warm-orange flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">{feature.title}</h4>
                    <p className="text-xs text-white/50 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: App Visual */}
          <motion.div
            variants={fadeUp}
            className="relative flex justify-center"
          >
            <div className="relative w-72 h-[520px] rounded-[3rem] bg-gradient-to-b from-white/10 to-white/5 border border-white/15 p-3 shadow-2xl">
              <div className="w-full h-full rounded-[2.4rem] bg-gradient-to-b from-herbal-green-light to-herbal-green flex items-center justify-center overflow-hidden">
                <div className="text-center px-6">
                  <div className="relative w-16 h-16 mx-auto mb-6">
                    <Image
                      src="/photo/ezyrelife-logo-round.png"
                      alt="ReLife Sync"
                      fill
                      className="object-contain brightness-0 invert"
                    />
                  </div>
                  <h3 className="text-white text-xl font-bold mb-2">ReLife Sync</h3>
                  <p className="text-white/50 text-sm mb-8">您的节律副驾驶</p>

                  {/* Mini Feature List */}
                  <div className="space-y-3 text-left">
                    {['5 点校准时刻表', '水分追踪仪表盘', '身体感受记录', '季度节律报告'].map((item) => (
                      <div key={item} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10">
                        <Check size={14} className="text-warm-orange" />
                        <span className="text-xs text-white/80">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════
   TESTIMONIALS
   ═══════════════════════════════════════════════════ */
function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah L.',
      role: '节律追寻者',
      avatar: '🌿',
      content: '第一次不是「被掏空」的感觉，而是真正的轻盈。早上的清晰度和精力提升让我很惊喜——这才是真正的"重启"。',
      rating: 5,
    },
    {
      name: 'James K.',
      role: '超负荷者',
      avatar: '🔄',
      content: '作为经常应酬的人，每季度一次 ReSet 已经成为我的仪式。App 的定时提醒太舒服了，完全不需要操心。',
      rating: 5,
    },
    {
      name: 'Mei T.',
      role: '阻滞者',
      avatar: '✨',
      content: '困扰了多年的排便不规律，3 天后就感受到了「流动」。不是暴力的，而是温柔的、自然的。身体在变好。',
      rating: 5,
    },
  ];

  return (
    <Section id="testimonials">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <motion.div variants={fadeUp} className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-warm-orange tracking-widest uppercase mb-3 block">
            真实反馈
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-herbal-green mb-4 font-[family-name:var(--font-display)]">
            他们找回了节律
          </h2>
          <p className="text-text-sub text-lg">
            来自真实用户的重启旅程分享
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              variants={fadeUp}
              className="p-8 rounded-3xl bg-white border border-border-soft hover:shadow-lg transition-all duration-500"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={16} className="fill-warm-orange text-warm-orange" />
                ))}
              </div>
              <p className="text-text-main leading-relaxed mb-6 italic">
                &ldquo;{t.content}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-morning-green/20 flex items-center justify-center text-lg">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-herbal-green">{t.name}</p>
                  <p className="text-xs text-text-muted">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════
   FAQ SECTION
   ═══════════════════════════════════════════════════ */
function FAQSection() {
  const faqs = [
    {
      q: '这三天需要请假在家吗？会一直腹泻吗？',
      a: '不需要。Vitalic D 创造的是「流动 (Flow)」，不是「强迫 (Force)」。我们基于物理吸附原理，配合身体自然的蠕动节律。绝大多数用户感受到的是水到渠成的顺畅释放，而非突发性腹痛。这是一次有尊严、可掌控的清理。',
    },
    {
      q: '这三天会饿得头晕吗？',
      a: '通常不会。因为这不单纯是"减法"，而是精密的"加法"。ReLife 代谢方程式内置了 Nourish（滋养）构成，每隔几小时的能量补给会维持您的血糖与代谢水平。如果确实难以忍受，可以适量喝一些清澈的蔬菜汤。',
    },
    {
      q: '我可以长期每天喝吗？',
      a: 'Vitalic D 设计为"大节律 (Macro-Rhythm)"校准工具，类似汽车的"大保养"。我们建议您每季度进行一次完整的 3 天 Reset。对于日常的"小节律 (Micro-Rhythm)"维护，请期待我们未来的 Daily 系列产品。',
    },
    {
      q: '为什么喝了之后没有马上排便？',
      a: '每个人的生物钟都在不同的时区。没有剧烈腹泻反而证明了 Vitalic D 的温和性——它在与您的身体协作。请检查您的水合情况：纤维吸附阻滞需要大量水分作为载体。试着多喝两杯温水，给身体时间找回流动的节奏。',
    },
    {
      q: '怀孕/哺乳期/有特定疾病可以喝吗？',
      a: '请务必先咨询您的医生。作为节律架构师，我们专注于健康人群的生活方式校准。虽然成分都是天然食品级，但特殊阶段的身体需求是独特的。医生最了解您的身体状况。',
    },
  ];

  return (
    <Section id="faq" className="bg-white">
      <div className="max-w-3xl mx-auto px-6 md:px-8">
        <motion.div variants={fadeUp} className="text-center mb-16">
          <span className="text-sm font-semibold text-warm-orange tracking-widest uppercase mb-3 block">
            常见问题
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-herbal-green mb-4 font-[family-name:var(--font-display)]">
            您可能想知道的
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.details
              key={index}
              variants={fadeUp}
              className="group rounded-2xl bg-ivory border border-border-soft overflow-hidden open:shadow-md transition-all"
            >
              <summary className="flex items-center justify-between p-6 cursor-pointer text-herbal-green font-semibold hover:text-warm-orange transition-colors">
                <span className="pr-4">{faq.q}</span>
                <ChevronDown size={20} className="flex-shrink-0 transition-transform group-open:rotate-180 text-warm-orange" />
              </summary>
              <div className="px-6 pb-6 text-text-sub leading-relaxed text-sm">
                {faq.a}
              </div>
            </motion.details>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════
   FINAL CTA
   ═══════════════════════════════════════════════════ */
function FinalCTA() {
  return (
    <Section className="gradient-brand">
      <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
        <motion.div variants={fadeUp}>
          <div className="relative w-16 h-16 mx-auto mb-8">
            <Image
              src="/photo/ezyrelife-logo-round.png"
              alt="EzyRelife"
              fill
              className="object-contain animate-breathe"
            />
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-herbal-green mb-6 font-[family-name:var(--font-display)]">
            不要等待身体崩溃，
            <br />
            <span className="gradient-text-brand">现在就与它同频。</span>
          </h2>
          <p className="text-text-sub text-lg mb-10 max-w-xl mx-auto">
            Reset from Within. ReLife for Real.
            <br />
            从内在重启节律，活出真实生命力。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="btn-primary text-base px-10 py-4 flex items-center justify-center gap-2 group">
              开始我的重启
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/about" className="btn-secondary text-base px-10 py-4">
              了解更多
            </Link>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════ */
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <PhilosophySection />
        <HowItWorksSection />
        <ScienceSection />
        <ProductSection />
        <AppSection />
        <TestimonialsSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
