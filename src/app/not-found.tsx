'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';
import AnimatedLogo from '@/components/shared/AnimatedLogo';

export default function NotFound() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-32 pb-20 flex items-center justify-center overflow-hidden relative">
                {/* Background Decorations */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-morning-green/10 rounded-full blur-3xl animate-pulse-gentle" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-warm-orange/5 rounded-full blur-3xl animate-pulse-gentle" style={{ animationDelay: '2s' }} />
                </div>

                <div className="relative z-10 text-center px-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8 flex justify-center"
                    >
                        <div className="w-32 h-32 md:w-40 md:h-40">
                            <AnimatedLogo />
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-6xl md:text-8xl font-extrabold text-herbal-green mb-4 font-[family-name:var(--font-display)]"
                    >
                        404
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h2 className="text-2xl md:text-3xl font-bold text-herbal-green mb-4">
                            节律似乎在这里中断了。
                        </h2>
                        <p className="text-text-muted max-w-md mx-auto mb-10 text-lg">
                            找不到您请求的页面。也许它已经随着陈旧的节奏远去了，让我们为您重置导航。
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/"
                                className="btn-primary px-8 py-3 flex items-center gap-2 group w-full sm:w-auto justify-center"
                            >
                                <Home size={18} />
                                回到首页
                            </Link>
                            <button
                                onClick={() => window.history.back()}
                                className="btn-secondary px-8 py-3 flex items-center gap-2 w-full sm:w-auto justify-center"
                            >
                                <ArrowLeft size={18} />
                                返回上一页
                            </button>
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </>
    );
}
