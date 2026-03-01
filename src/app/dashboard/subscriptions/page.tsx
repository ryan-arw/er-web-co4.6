'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Repeat, Check, Calendar, Package, ArrowRight,
    Pause, Play, X, CreditCard, Clock, AlertCircle
} from 'lucide-react';

import { createClient } from '@/lib/supabase/client';
import { useEffect } from 'react';

export default function SubscriptionsPage() {
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSubscriptions = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase
                .from('subscriptions')
                .select('*, products(*)')
                .eq('user_id', user.id);

            if (data) setSubscriptions(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const hasSubscription = subscriptions.length > 0;

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-10 w-48 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-48 bg-gray-50 rounded-3xl animate-pulse" />
            </div>
        );
    }

    if (!hasSubscription) {
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-herbal-green font-[family-name:var(--font-display)]">订阅管理</h1>
                    <p className="text-sm text-text-muted mt-1">管理您的定期配送计划</p>
                </div>

                {/* Empty State — Subscription CTA */}
                <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-morning-green/10 flex items-center justify-center mx-auto mb-6">
                        <Repeat size={28} className="text-morning-green-dark" />
                    </div>
                    <h2 className="text-xl font-bold text-herbal-green mb-3">还没有订阅计划</h2>
                    <p className="text-sm text-text-muted max-w-md mx-auto mb-8">
                        订阅 Vitalic D 享受额外 10% 折扣，自动配送 + ReLife Sync 进阶功能。
                    </p>
                </div>

                {/* Subscription Plans */}
                <div>
                    <h2 className="text-lg font-bold text-herbal-green mb-6">选择订阅计划</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            {
                                name: '月度计划',
                                interval: '每月配送',
                                price: 130.50,
                                originalPrice: 145,
                                savings: '省 10%',
                                features: ['每月自动配送 1 盒', '10% 订阅折扣', 'ReLife Sync 进阶功能', '随时暂停或取消', '优先客户支持'],
                                popular: false,
                            },
                            {
                                name: '季度计划',
                                interval: '每季配送',
                                price: 108.90,
                                originalPrice: 121,
                                savings: '省 25%',
                                features: ['每季度自动配送 3 盒', '25% 综合折扣', 'ReLife Sync 全功能', '免费配送', '季度节律报告', '专属健康顾问'],
                                popular: true,
                            },
                        ].map((plan) => (
                            <div
                                key={plan.name}
                                className={`relative p-6 rounded-3xl border-2 transition-all ${plan.popular ? 'border-warm-orange bg-warm-orange/5' : 'border-border-soft bg-white'
                                    }`}
                            >
                                {plan.popular && (
                                    <span className="absolute -top-3 left-6 px-4 py-1 rounded-full bg-warm-orange text-white text-xs font-bold">
                                        推荐
                                    </span>
                                )}
                                <h3 className="text-lg font-bold text-herbal-green mb-1">{plan.name}</h3>
                                <p className="text-xs text-text-muted mb-4">{plan.interval}</p>

                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-3xl font-extrabold text-herbal-green">${plan.price.toFixed(2)}</span>
                                    <span className="text-sm text-text-muted">/盒</span>
                                </div>
                                <div className="flex items-center gap-2 mb-6">
                                    <span className="text-sm text-text-muted line-through">${plan.originalPrice.toFixed(2)}</span>
                                    <span className="px-2 py-0.5 rounded-full bg-morning-green/15 text-morning-green-dark text-xs font-bold">
                                        {plan.savings}
                                    </span>
                                </div>

                                <ul className="space-y-2.5 mb-8">
                                    {plan.features.map((f) => (
                                        <li key={f} className="flex items-center gap-2 text-sm text-text-sub">
                                            <Check size={16} className="text-morning-green-dark flex-shrink-0" /> {f}
                                        </li>
                                    ))}
                                </ul>

                                <button className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${plan.popular
                                    ? 'bg-warm-orange text-white hover:bg-warm-orange-dark shadow-lg shadow-warm-orange/20'
                                    : 'bg-herbal-green text-white hover:bg-herbal-green-dark'
                                    }`}>
                                    选择此计划
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAQ */}
                <div className="p-6 rounded-2xl bg-ivory border border-border-soft">
                    <h3 className="font-bold text-herbal-green mb-4 flex items-center gap-2">
                        <AlertCircle size={18} /> 订阅须知
                    </h3>
                    <div className="space-y-3 text-sm text-text-sub">
                        <p>• 订阅可随时暂停或取消，不收取任何额外费用。</p>
                        <p>• 配送日期可在下次配送前 3 天调整。</p>
                        <p>• 季度计划为每 90 天配送一次 3 盒，月度计划为每 30 天配送 1 盒。</p>
                        <p>• 所有订阅均享受优先配送和专属客户支持。</p>
                    </div>
                </div>
            </div>
        );
    }

    // Active subscription view (future state)
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-herbal-green font-[family-name:var(--font-display)]">订阅管理</h1>
        </div>
    );
}
