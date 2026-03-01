'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password.length < 6) {
            setError('密码至少需要 6 个字符。');
            setLoading(false);
            return;
        }

        const supabase = createClient();
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: name },
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center gradient-hero p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center p-10 rounded-3xl bg-white border border-border-soft shadow-xl"
                >
                    <div className="w-16 h-16 rounded-full bg-morning-green/15 flex items-center justify-center mx-auto mb-6">
                        <Mail size={28} className="text-morning-green-dark" />
                    </div>
                    <h2 className="text-2xl font-bold text-herbal-green mb-3 font-[family-name:var(--font-display)]">
                        验证邮件已发送 ✨
                    </h2>
                    <p className="text-text-sub mb-6 leading-relaxed">
                        我们已向 <strong className="text-herbal-green">{email}</strong> 发送了验证邮件。<br />
                        请检查您的收件箱（包括垃圾邮件），点击链接完成注册。
                    </p>
                    <Link href="/login" className="btn-primary text-sm px-8 py-3 inline-flex items-center gap-2">
                        返回登入 <ArrowRight size={16} />
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex gradient-hero">
            {/* Left decorative panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-herbal-green relative overflow-hidden items-center justify-center p-16">
                <div className="absolute inset-0">
                    <div className="absolute top-20 right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 left-20 w-96 h-96 bg-morning-green/5 rounded-full blur-3xl" />
                </div>
                <div className="relative text-center max-w-md">
                    <div className="relative w-20 h-20 mx-auto mb-8">
                        <Image src="/photo/ezyrelife-logo-round.png" alt="EzyRelife" fill className="object-contain brightness-0 invert animate-breathe" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4 font-[family-name:var(--font-display)]">
                        加入节律社区
                    </h2>
                    <p className="text-white/50 leading-relaxed">
                        创建账户，开启您的 ReLife 旅程。<br />
                        追踪健康数据、管理订单、获取专属支持。
                    </p>
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
                    <div className="lg:hidden flex items-center gap-3 mb-8">
                        <div className="relative w-10 h-10">
                            <Image src="/photo/ezyrelife-logo-round.png" alt="EzyRelife" fill className="object-contain" />
                        </div>
                        <span className="text-xl font-bold text-herbal-green">EzyRelife</span>
                    </div>

                    <h1 className="text-2xl font-bold text-herbal-green mb-2 font-[family-name:var(--font-display)]">
                        创建账户
                    </h1>
                    <p className="text-sm text-text-muted mb-8">
                        已有账户？{' '}
                        <Link href="/login" className="text-warm-orange font-semibold hover:text-warm-orange-dark transition-colors">
                            立即登入
                        </Link>
                    </p>

                    <form onSubmit={handleRegister} className="space-y-5">
                        {error && (
                            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="text-sm font-medium text-herbal-green mb-1.5 block">姓名</label>
                            <div className="relative">
                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="您的姓名"
                                    required
                                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-ivory border border-border-soft text-text-main text-sm focus:outline-none focus:border-warm-orange focus:ring-2 focus:ring-warm-orange/20 transition-all"
                                />
                            </div>
                        </div>

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
                            <label className="text-sm font-medium text-herbal-green mb-1.5 block">密码</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="至少 6 个字符"
                                    required
                                    minLength={6}
                                    className="w-full pl-11 pr-12 py-3 rounded-xl bg-ivory border border-border-soft text-text-main text-sm focus:outline-none focus:border-warm-orange focus:ring-2 focus:ring-warm-orange/20 transition-all"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-herbal-green transition-colors">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary text-sm py-3.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <>创建账户 <ArrowRight size={16} /></>}
                        </button>
                    </form>

                    <p className="text-xs text-text-muted text-center mt-8">
                        注册即表示您同意我们的{' '}
                        <Link href="/terms" className="text-herbal-green hover:underline">服务条款</Link>
                        {' '}和{' '}
                        <Link href="/privacy" className="text-herbal-green hover:underline">隐私政策</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
