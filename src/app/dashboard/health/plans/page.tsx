'use client';

import { useState, useEffect } from 'react';
import { useHealth } from '@/contexts/HealthContext';
import {
    CalendarRange, Plus, Settings2, Clock, CheckCircle2,
    AlertCircle, Calendar, Sparkles, Package, ShoppingBag
} from 'lucide-react';
import { motion } from 'framer-motion';
import PlanWizardModal from '@/components/health/PlanWizardModal';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function HealthPlansPage() {
    const { plans, settings, loading, addResetPlan } = useHealth();
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [stockCount, setStockCount] = useState<number>(0);
    const supabase = createClient();

    useEffect(() => {
        const fetchStock = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('inventory_logs')
                    .select('balance_after')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(1);
                if (data && data[0]) setStockCount(data[0].balance_after);
            }
        };
        fetchStock();
    }, []);

    const activePlan = plans.find(p => {
        const now = new Date().toISOString().split('T')[0];
        return now >= p.start_date && now <= p.end_date;
    });

    const upcomingPlans = plans.filter(p => {
        const now = new Date().toISOString().split('T')[0];
        return p.start_date > now;
    }).sort((a, b) => a.start_date.localeCompare(b.start_date));

    const inventoryShortage = stockCount < upcomingPlans.length + (activePlan ? 1 : 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-herbal-green"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-herbal-green flex items-center gap-3">
                        <CalendarRange className="text-warm-orange" />
                        计划排程
                    </h1>
                    <p className="text-text-muted mt-2 font-medium">管理您的 ReSet 周期和生物节律配置。</p>
                </div>

                <button
                    onClick={() => setIsWizardOpen(true)}
                    className="bg-herbal-green text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-opacity-90 hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95"
                >
                    <Plus size={20} />
                    新建 Reset 计划
                </button>
            </div>

            {/* Inventory Warning Header if needed */}
            {inventoryShortage && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="bg-amber-50 border border-amber-200 rounded-[32px] p-6 flex items-center justify-between"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
                            <AlertCircle size={24} />
                        </div>
                        <div>
                            <h4 className="font-black text-amber-900">库存对齐预警</h4>
                            <p className="text-xs text-amber-700 mt-1">您目前的库存数量 ({stockCount}) 不足以覆盖已排程的所有计划。建议提前补货以确保周期完整。</p>
                        </div>
                    </div>
                    <Link href="/products" className="bg-amber-600 text-white px-6 py-3 rounded-xl font-black text-xs flex items-center gap-2 hover:bg-amber-700 transition-all">
                        <ShoppingBag size={16} /> 立即补货
                    </Link>
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Plans Card */}
                <div className="lg:col-span-2 space-y-8">
                    {activePlan ? (
                        <div className="bg-gradient-to-br from-herbal-green to-herbal-green-dark rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 -mr-10 -mt-10 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                                <Activity size={200} />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-6">
                                    <span className="bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10">进行中 (Active)</span>
                                </div>
                                <h3 className="text-3xl font-black mb-2">{activePlan.intention === 'GLOW' ? 'GLOW (焕颜)' : activePlan.intention === 'GROW' ? 'GROW (赋能)' : 'FLOW (心流)'} Reset</h3>
                                <p className="text-white/70 text-sm mb-10 flex items-center gap-2 font-medium">
                                    <Calendar size={16} /> {activePlan.start_date} 至 {activePlan.end_date}
                                </p>

                                <div className="grid grid-cols-3 gap-6">
                                    <div className="bg-white/10 p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
                                        <p className="text-[10px] uppercase font-black text-white/40 tracking-widest">ReAlign</p>
                                        <p className="text-2xl font-black mt-1">{activePlan.realign_duration} <span className="text-xs opacity-60 ml-0.5">DAYS</span></p>
                                    </div>
                                    <div className="bg-white/20 p-6 rounded-3xl border border-white/20 backdrop-blur-xl shadow-lg">
                                        <p className="text-[10px] uppercase font-black text-white/50 tracking-widest">Reset</p>
                                        <p className="text-2xl font-black mt-1">3 <span className="text-xs opacity-60 ml-0.5">DAYS</span></p>
                                    </div>
                                    <div className="bg-white/10 p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
                                        <p className="text-[10px] uppercase font-black text-white/40 tracking-widest">ReStore</p>
                                        <p className="text-2xl font-black mt-1">{activePlan.restore_duration} <span className="text-xs opacity-60 ml-0.5">DAYS</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-[40px] p-16 border border-border-soft shadow-xl shadow-ivory/50 text-center">
                            <div className="w-20 h-20 bg-ivory rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                                <CalendarRange size={40} className="text-text-muted/20" />
                            </div>
                            <h3 className="text-xl font-black text-herbal-green mb-3">暂无进行中的 Reset</h3>
                            <p className="text-text-muted text-sm max-w-sm mx-auto mb-10 leading-relaxed">
                                推荐每季度进行一次完整的 3-Day Reset，通过深度对齐与平衡，唤醒身体系统的原生动力。
                            </p>
                            <button
                                onClick={() => setIsWizardOpen(true)}
                                className="text-warm-orange font-black text-sm flex items-center gap-2 mx-auto hover:bg-warm-orange/5 px-6 py-3 rounded-2xl transition-all"
                            >
                                开启我的第一个计划 <Sparkles size={18} />
                            </button>
                        </div>
                    )}

                    {/* Upcoming Plans List */}
                    <div className="bg-white rounded-[40px] p-10 border border-border-soft shadow-xl shadow-ivory/50">
                        <h3 className="text-xl font-black text-herbal-green mb-8 flex items-center gap-3">
                            <Clock className="text-warm-orange" size={24} />
                            后续计划排程
                        </h3>
                        {upcomingPlans.length > 0 ? (
                            <div className="space-y-4">
                                {upcomingPlans.map(plan => (
                                    <div key={plan.id} className="flex items-center justify-between p-6 rounded-3xl border border-border-soft hover:border-morning-green/30 hover:bg-ivory/20 transition-all group">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-ivory rounded-2xl flex flex-col items-center justify-center font-black text-herbal-green shadow-inner">
                                                <span className="text-[10px] font-bold opacity-40 uppercase">{new Date(plan.start_date).toLocaleString('default', { month: 'short' })}</span>
                                                <span className="text-lg">{plan.start_date.split('-')[2]}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-black text-herbal-green group-hover:text-morning-green transition-colors">
                                                    {plan.intention === 'GLOW' ? 'GLOW (焕颜)' : plan.intention === 'GROW' ? 'GROW (赋能)' : 'FLOW (心流)'} Reset
                                                </h4>
                                                <p className="text-xs text-text-muted mt-1 font-medium">{plan.start_date} · {plan.realign_duration + 3 + plan.restore_duration} 天周期</p>
                                            </div>
                                        </div>
                                        <button className="px-6 py-3 text-xs font-black text-text-muted hover:text-warm-orange hover:bg-white rounded-xl transition-all shadow-sm">
                                            编辑计划
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-16 border-2 border-dashed border-border-soft rounded-[32px] text-center bg-ivory/10">
                                <p className="text-text-muted text-sm font-medium">暂时没有排程中的计划</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Configuration Quick Access */}
                <div className="space-y-8">
                    {/* Stock Card */}
                    <div className="bg-white rounded-[40px] p-8 border border-border-soft shadow-xl shadow-ivory/50 group">
                        <div className="flex justify-between items-center mb-8">
                            <h4 className="font-black text-herbal-green flex items-center gap-3">
                                <Package className="text-morning-green" size={20} />
                                我的库存 (Vitalic D)
                            </h4>
                        </div>
                        <div className="bg-ivory/50 rounded-3xl p-6 text-center border border-border-soft group-hover:bg-white transition-colors">
                            <p className={`text-4xl font-black ${inventoryShortage ? 'text-warm-orange' : 'text-herbal-green'}`}>{stockCount}</p>
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-2">可用盒数</p>
                        </div>
                        <Link href="/dashboard/stash" className="mt-6 flex items-center justify-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-widest hover:text-herbal-green transition-colors">
                            查看库存明细 ➔
                        </Link>
                    </div>

                    <div className="bg-white rounded-[40px] p-8 border border-border-soft shadow-xl shadow-ivory/50">
                        <h4 className="font-black text-herbal-green mb-8 flex items-center gap-3">
                            <Settings2 className="text-morning-green" size={20} />
                            节律核心配置
                        </h4>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-5 bg-ivory/50 rounded-3xl border border-border-soft group hover:bg-white transition-colors">
                                <div>
                                    <p className="text-[10px] uppercase font-black text-text-muted tracking-widest">起床时间</p>
                                    <p className="text-xl font-black text-herbal-green mt-1">{settings?.wake_up_time || '07:00'}</p>
                                </div>
                                <button className="p-2.5 hover:bg-ivory rounded-xl transition-colors text-text-muted group-hover:text-herbal-green">
                                    <Settings2 size={18} />
                                </button>
                            </div>

                            <div className="flex justify-between items-center p-5 bg-ivory/50 rounded-3xl border border-border-soft group hover:bg-white transition-colors">
                                <div>
                                    <p className="text-[10px] uppercase font-black text-text-muted tracking-widest">每日饮水目标</p>
                                    <p className="text-xl font-black text-herbal-green mt-1">2500<span className="text-xs ml-0.5">ml</span></p>
                                </div>
                                <button className="p-2.5 hover:bg-ivory rounded-xl transition-colors text-text-muted group-hover:text-herbal-green">
                                    <Settings2 size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="mt-10 p-6 rounded-3xl bg-blue-50 border border-blue-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mr-2 -mt-2 opacity-10">
                                <Sparkles size={60} />
                            </div>
                            <div className="flex gap-4 relative z-10">
                                <AlertCircle className="text-blue-500 shrink-0" size={24} />
                                <div>
                                    <h5 className="text-sm font-black text-blue-900">双端极速同步</h5>
                                    <p className="text-[10px] text-blue-700/70 mt-2 leading-relaxed font-medium">
                                        您的计划与手机端 `er-sync` App 实时对齐。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-ivory/50 rounded-[40px] p-8 border border-morning-green/10 shadow-sm">
                        <h4 className="font-black text-herbal-green mb-6 text-sm flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-morning-green" />
                            Reset 阶段指南
                        </h4>
                        <ul className="space-y-4">
                            {[
                                { t: '什么是节律同步？', d: '对齐内在时间与代谢环境。' },
                                { t: '如何准备 ReAlign？', d: '逐步降低糖分与咖啡因摄入。' },
                                { t: 'Reset 期间饮食建议', d: '遵循“液态-流质-软食”进阶。' }
                            ].map(guide => (
                                <li key={guide.t} className="group cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-morning-green group-hover:scale-150 transition-transform" />
                                        <p className="text-xs font-black text-text-sub group-hover:text-herbal-green">{guide.t}</p>
                                    </div>
                                    <p className="text-[10px] text-text-muted ml-3.5 mt-1 font-medium">{guide.d}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <PlanWizardModal
                isOpen={isWizardOpen}
                onClose={() => setIsWizardOpen(false)}
                onSave={addResetPlan}
            />
        </div>
    );
}

// Missing component from er-sync logic
function Activity({ size, className }: { size: number; className?: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    );
}
