'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/dashboard';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const supabase = createClient();
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setError(error.message === 'Invalid login credentials'
                ? '邮箱或密码错误，请重试。'
                : error.message);
            setLoading(false);
        } else {
            router.push(redirect);
            router.refresh();
        }
    };

    return (
        <form onSubmit={handleLogin} className="space-y-5">
            {error && (
                <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                    {error}
                </div>
            )}

            <div>
                <label className="text-sm font-medium text-herbal-green mb-1.5 block">邮箱地址</label>
                <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-ivory border border-border-soft text-text-main text-sm focus:outline-none focus:border-warm-orange focus:ring-2 focus:ring-warm-orange/20 transition-all"
                    />
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-herbal-green">密码</label>
                    <Link href="/forgot-password" className="text-xs text-warm-orange hover:text-warm-orange-dark transition-colors">
                        忘记密码？
                    </Link>
                </div>
                <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="输入密码"
                        required
                        className="w-full pl-11 pr-12 py-3 rounded-xl bg-ivory border border-border-soft text-text-main text-sm focus:outline-none focus:border-warm-orange focus:ring-2 focus:ring-warm-orange/20 transition-all"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-herbal-green transition-colors"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary text-sm py-3.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                ) : (
                    <>
                        登入
                        <ArrowRight size={16} />
                    </>
                )}
            </button>
        </form>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex gradient-hero">
            {/* Left decorative panel (desktop only) */}
            <div className="hidden lg:flex lg:w-1/2 bg-herbal-green relative overflow-hidden items-center justify-center p-16">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-warm-orange/5 rounded-full blur-3xl" />
                </div>
                <div className="relative text-center max-w-md">
                    <div className="relative w-20 h-20 mx-auto mb-8">
                        <Image
                            src="/photo/ezyrelife-logo-round.png"
                            alt="EzyRelife"
                            fill
                            className="object-contain brightness-0 invert animate-breathe"
                        />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4 font-[family-name:var(--font-display)]">
                        欢迎回来
                    </h2>
                    <p className="text-white/50 leading-relaxed">
                        登入您的账户，追踪节律旅程、管理订单、<br />
                        查看您的 ReSet 档案。
                    </p>
                    <div className="mt-12 flex justify-center gap-6 text-white/20">
                        <span className="text-sm">ReAlign</span>
                        <span>→</span>
                        <span className="text-sm text-warm-orange/60">ReSet</span>
                        <span>→</span>
                        <span className="text-sm">ReStore</span>
                    </div>
                </div>
            </div>

            {/* Right form panel */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-8">
                        <div className="relative w-10 h-10">
                            <Image src="/photo/ezyrelife-logo-round.png" alt="EzyRelife" fill className="object-contain" />
                        </div>
                        <span className="text-xl font-bold text-herbal-green">EzyRelife</span>
                    </div>

                    <h1 className="text-2xl font-bold text-herbal-green mb-2 font-[family-name:var(--font-display)]">
                        登入账户
                    </h1>
                    <p className="text-sm text-text-muted mb-8">
                        还没有账户？{' '}
                        <Link href="/register" className="text-warm-orange font-semibold hover:text-warm-orange-dark transition-colors">
                            立即注册
                        </Link>
                    </p>

                    <Suspense fallback={<div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-warm-orange" /></div>}>
                        <LoginForm />
                    </Suspense>

                    <p className="text-xs text-text-muted text-center mt-8">
                        登入即表示您同意我们的{' '}
                        <Link href="/terms" className="text-herbal-green hover:underline">服务条款</Link>
                        {' '}和{' '}
                        <Link href="/privacy" className="text-herbal-green hover:underline">隐私政策</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
