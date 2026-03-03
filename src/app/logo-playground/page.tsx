'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import AdvancedSvgLogo from '@/components/shared/AdvancedSvgLogo';

// ============================================================================
// Branding Interaction: Magnetic Button (Enchanced)
// ============================================================================
function MagneticButton({ children, color = "warm-orange", className = "" }: { children: React.ReactNode, color?: string, className?: string }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 150, damping: 15 });
    const springY = useSpring(y, { stiffness: 150, damping: 15 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set((e.clientX - centerX) * 0.4);
        y.set((e.clientY - centerY) * 0.4);
    };

    const handleMouseLeave = () => {
        x.set(0); y.set(0);
    };

    const colorClasses: Record<string, string> = {
        "warm-orange": "bg-warm-orange text-white shadow-[0_0_20px_rgba(243,114,62,0.4)]",
        "emerald": "bg-emerald text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]",
        "zinc": "bg-zinc-800 text-zinc-200 border border-zinc-700"
    };

    return (
        <motion.button
            style={{ x: springX, y: springY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileTap={{ scale: 0.95 }}
            className={`px-8 py-4 rounded-full font-bold text-lg relative group transition-all duration-300 ${colorClasses[color]} ${className}`}
        >
            <span className="relative z-10">{children}</span>
        </motion.button>
    );
}

// ============================================================================
// NEW OBJECT 1: Morphing Orb (Logo-derived fluid shape)
// ============================================================================
function MorphingOrb({ isDarkMode }: { isDarkMode: boolean }) {
    const [pathIndex, setPathIndex] = useState(0);
    // Dynamic shapes inspired by logo curves
    const paths = [
        "M20,50 Q50,20 80,50 T20,50",
        "M25,45 Q55,15 85,45 T25,45",
        "M15,55 Q45,25 75,55 T15,55",
        "M20,40 Q50,70 80,40 T20,40"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setPathIndex((prev) => (prev + 1) % paths.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-full flex items-center justify-center opacity-40 group">
            <svg viewBox="0 0 100 100" className="w-64 h-64 blur-2xl transition-all duration-700">
                <motion.path
                    animate={{ d: paths[pathIndex] }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    fill={isDarkMode ? "#f3723e" : "#10b981"}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <AdvancedSvgLogo variant="pulse" className="w-32 h-32 group-hover:scale-125 transition-transform" isLightMode={!isDarkMode} />
            </div>
        </div>
    );
}

// ============================================================================
// NEW OBJECT 2: ER Particle Rain (Passive background ambience)
// ============================================================================
function ERPatchworkRain({ isDarkMode }: { isDarkMode: boolean }) {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20 z-0">
            {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                    key={i}
                    className={`absolute w-1 h-3 rounded-full ${isDarkMode ? 'bg-warm-orange/30' : 'bg-emerald/30'}`}
                    style={{ left: `${Math.random() * 100}%`, top: `-5%` }}
                    animate={{
                        y: ['0vh', '110vh'],
                        x: [0, Math.random() * 50 - 25],
                        rotate: [0, 360]
                    }}
                    transition={{
                        duration: 8 + Math.random() * 10,
                        repeat: Infinity,
                        delay: Math.random() * 10,
                        ease: "linear"
                    }}
                />
            ))}
        </div>
    );
}

// ============================================================================
// NEW OBJECT 3: Glassmorphic Logo Card (Tilt effect)
// ============================================================================
function TiltLogoCard({ isDarkMode }: { isDarkMode: boolean }) {
    const x = useSpring(useMotionValue(0));
    const y = useSpring(useMotionValue(0));
    const rotateX = useTransform(y, [-0.5, 0.5], [15, -15]);
    const rotateY = useTransform(x, [-0.5, 0.5], [-15, 15]);

    const onMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };
    const onLeave = () => { x.set(0); y.set(0); };

    return (
        <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className={`w-full aspect-square relative rounded-[3rem] p-1 border backdrop-blur-3xl transition-colors duration-500 overflow-hidden ${isDarkMode ? 'bg-white/5 border-white/10 shadow-2xl shadow-black' : 'bg-black/5 border-black/10 shadow-3xl shadow-slate-200'}`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <div className="absolute inset-0 flex flex-col items-center justify-center translate-z-[50px]">
                <AdvancedSvgLogo variant="glitch" className="w-40 h-40 mb-4" isLightMode={!isDarkMode} />
                <span className={`font-bold tracking-widest text-xs uppercase opacity-40 transition-colors ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Holographic Branding</span>
            </div>
        </motion.div>
    );
}

// ============================================================================
// Main Page (Preserving all existing effects)
// ============================================================================
export default function MasterPlaygroundPage() {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [morphProgress, setMorphProgress] = useState(0);
    const [drawReset, setDrawReset] = useState(0);

    const { scrollYProgress } = useScroll();
    const watermarkY = useTransform(scrollYProgress, [0, 1], [0, -400]);
    const watermarkRotate = useTransform(scrollYProgress, [0, 1], [0, 30]);

    // Custom Cursor logic
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const springCursorX = useSpring(cursorX, { damping: 25, stiffness: 400 });
    const springCursorY = useSpring(cursorY, { damping: 25, stiffness: 400 });

    useEffect(() => {
        const move = (e: MouseEvent) => {
            cursorX.set(e.clientX - 10); cursorY.set(e.clientY - 10);
        };
        window.addEventListener('mousemove', move);
        document.body.style.cursor = 'none';
        return () => { window.removeEventListener('mousemove', move); document.body.style.cursor = 'auto'; };
    }, []);

    return (
        <div className={`relative min-h-[400vh] transition-colors duration-1000 overflow-hidden font-sans ${isDarkMode ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-zinc-900'}`}>

            <CustomCursor isDarkMode={isDarkMode} springX={springCursorX} springY={springCursorY} />
            <ERPatchworkRain isDarkMode={isDarkMode} />

            {/* Theme Toggle */}
            <div className="fixed top-8 right-8 z-[1000]">
                <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`px-8 py-4 rounded-2xl font-black text-xs uppercase shadow-2xl transition-all duration-500 border ${isDarkMode ? 'bg-zinc-800/80 border-zinc-700 text-white' : 'bg-white/80 border-slate-200 text-zinc-900'}`}
                >
                    {isDarkMode ? '☀️ Ignite Light' : '🌙 Embrace Dark'}
                </button>
            </div>

            {/* Giant Watermark */}
            <motion.div
                className={`fixed top-1/4 -right-1/4 w-[120vw] h-[120vw] pointer-events-none z-0 mix-blend-screen transition-opacity duration-1000 ${isDarkMode ? 'opacity-[0.03]' : 'opacity-[0.06]'}`}
                style={{ y: watermarkY, rotate: watermarkRotate }}
            >
                <AdvancedSvgLogo variant="static" isLightMode={!isDarkMode} className="w-full h-full" />
            </motion.div>

            {/* Page Scrolling Lifeline */}
            <ScrollLifeline isDarkMode={isDarkMode} />

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-32 space-y-64">

                {/* Intro Header */}
                <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="max-w-4xl">
                    <h1 className="text-7xl md:text-9xl font-black mb-8 tracking-tighter leading-[0.85] uppercase">
                        Omni<br />
                        <span className={`italic transition-colors ${isDarkMode ? 'text-warm-orange' : 'text-emerald'}`}>Experience.</span>
                    </h1>
                    <p className={`text-2xl max-w-2xl leading-relaxed font-light ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>已注入更多可玩性互动对象 (Magnetic, Liquid, Holographic)，构建多维度的品牌生命力。</p>
                </motion.div>

                {/* NEW OBJECTS SECTION */}
                <section className="space-y-16 py-32">
                    <h2 className="text-xs font-black tracking-widest uppercase opacity-30 text-center mb-16 underline underline-offset-8">New Interaction Objects</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {/* Object 1: Fluid Orb */}
                        <div className="flex flex-col items-center">
                            <h3 className="text-xl font-bold mb-8">1. Liquid Morphing Orb</h3>
                            <div className="w-full h-80 rounded-[4rem] bg-zinc-900/10 dark:bg-zinc-100/5 relative overflow-hidden backdrop-blur-xl border border-white/5">
                                <MorphingOrb isDarkMode={isDarkMode} />
                            </div>
                        </div>
                        {/* Object 2: Tilt Card */}
                        <div className="flex flex-col items-center">
                            <h3 className="text-xl font-bold mb-8">2. Holographic Card</h3>
                            <TiltLogoCard isDarkMode={isDarkMode} />
                        </div>
                        {/* Object 3: Animated Pulse Area */}
                        <div className="flex flex-col items-center">
                            <h3 className="text-xl font-bold mb-8">3. Magnetic Core Fields</h3>
                            <div className="w-full aspect-square rounded-[3rem] bg-emerald/5 flex flex-col items-center justify-center gap-8 relative overflow-hidden border border-emerald/20 group">
                                <MagneticButton color="emerald">Magnet 1</MagneticButton>
                                <MagneticButton color="warm-orange">Magnet 2</MagneticButton>
                                <div className="absolute inset-0 bg-emerald/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section I: Core Logo Interaction Cards (Retained and Fixed) */}
                <div className="py-32">
                    <div className="flex justify-between items-end mb-16">
                        <h2 className="text-3xl font-black tracking-tighter italic">I. Micro-Logo Interactions</h2>
                        <button onClick={() => setDrawReset(prev => prev + 1)} className="text-emerald font-bold border-b-2 border-emerald/20 hover:border-emerald pb-1 transition-all">Replay Drawings</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Line Drawing', variant: 'draw', desc: '激光镭雕出场 (已修复强度)' },
                            { title: 'Hyper Parallax', variant: 'parallax', desc: '极致 3D 位移反馈' },
                            { title: 'Shatter Explosion', variant: 'explosion', desc: '物理碰撞碎片化解体' },
                            { title: 'Cyber Glitch', variant: 'glitch', desc: '赛博朋克信号干扰' },
                            { title: 'Inner Pulse', variant: 'pulse', desc: '核心元素呼吸律动' },
                            { title: 'Dynamic Theme', variant: 'theme', desc: '调色盘平滑自适应' }
                        ].map((item, idx) => (
                            <div key={`${idx}-${drawReset}`} className={`p-10 rounded-[2.5rem] border transition-all duration-700 hover:scale-[1.05] ${isDarkMode ? 'bg-zinc-900 border-zinc-800 shadow-2xl overflow-hidden' : 'bg-white border-slate-200 shadow-2xl shadow-slate-200'}`}>
                                <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                                <p className="text-zinc-500 text-xs mb-10 opacity-70 italic">{item.desc}</p>
                                <div className={`aspect-square rounded-3xl flex items-center justify-center overflow-hidden transition-all ${isDarkMode ? 'bg-zinc-950' : 'bg-slate-50 shadow-inner'}`}>
                                    <AdvancedSvgLogo variant={item.variant as any} className="w-40 h-40" isLightMode={!isDarkMode} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section III: Morph Slider Full Width (Retained) */}
                <div className="py-32">
                    <div className={`p-20 rounded-[5rem] text-center border transition-all ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200 shadow-4xl shadow-slate-200'}`}>
                        <h2 className="text-5xl font-black mb-6 italic tracking-tight underline-offset-8">II. Atom-Level State Morph</h2>
                        <p className="text-zinc-500 mb-16 max-w-xl mx-auto text-lg leading-relaxed font-light">体验最丝滑的 SVG 变形。通过调节下方原子滑块，你可以控制 Logo 复杂背景层的透明度与缩放，完美契合不同场景的导航需求。</p>
                        <div className="max-w-xl mx-auto mb-20 px-8">
                            <input type="range" min="0" max="1" step="0.001" value={morphProgress} onChange={(e) => setMorphProgress(parseFloat(e.target.value))} className="w-full accent-emerald h-3 bg-slate-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer" />
                        </div>
                        <div className="inline-flex p-16 bg-zinc-950 rounded-[4rem] shadow-2xl relative">
                            <div className="absolute inset-0 bg-emerald/5 blur-3xl rounded-full" />
                            <AdvancedSvgLogo variant="morph" morphProgress={morphProgress} className="w-72 h-72 relative z-10" isLightMode={!isDarkMode} />
                        </div>
                    </div>
                </div>

                {/* Footer and Final Button */}
                <div className="py-24 border-t border-zinc-800/50 flex flex-col items-center">
                    <MagneticButton color="warm-orange" className="!px-20 !py-8 !text-3xl hover:tracking-widest transition-all">DEPLOΥ THE VISION</MagneticButton>
                    <p className="mt-16 text-zinc-600 font-mono tracking-widest text-[10px] uppercase">© 2026 EzyRelife - Multiverse Visual Foundation</p>
                </div>
            </div>
        </div>
    );
}

// Sub-components helpers
function ScrollLifeline({ isDarkMode }: { isDarkMode: boolean }) {
    const { scrollYProgress } = useScroll();
    const pathLength = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
    return (
        <div className="fixed top-0 left-8 md:left-24 bottom-0 w-8 pointer-events-none z-0">
            <svg viewBox="0 0 10 100" preserveAspectRatio="none" className="w-full h-full opacity-20">
                <path d="M 5 0 C 10 20, 0 40, 5 60 C 10 80, 0 100, 5 100" fill="transparent" stroke={isDarkMode ? "#fff" : "#000"} strokeWidth="0.2" />
                <motion.path d="M 5 0 C 10 20, 0 40, 5 60 C 10 80, 0 100, 5 100" fill="transparent" stroke={isDarkMode ? "#f3723e" : "#10b981"} strokeWidth="1" style={{ pathLength }} />
            </svg>
            <motion.div className={`absolute left-1/2 -ml-2 w-4 h-4 rounded-full shadow-2xl ${isDarkMode ? 'bg-warm-orange' : 'bg-emerald'}`} style={{ top: useTransform(pathLength, [0, 1], ["0%", "100%"]) }} />
        </div>
    );
}

function CustomCursor({ isDarkMode, springX, springY }: { isDarkMode: boolean, springX: any, springY: any }) {
    return (
        <motion.div
            className={`fixed top-0 left-0 w-6 h-6 rounded-full pointer-events-none z-[9999] shadow-2xl ${isDarkMode ? 'bg-warm-orange mix-blend-screen shadow-orange-500/20' : 'bg-emerald mix-blend-multiply shadow-emerald-500/20'}`}
            style={{ x: springX, y: springY }}
        />
    );
}
