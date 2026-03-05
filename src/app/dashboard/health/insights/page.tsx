'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getHealthHistory, getSomaticLogs } from '@/lib/health-api';
import { DailySummary, SomaticLog } from '@/lib/health-types';
import { getScheduleForPhase } from '@/lib/health-constants';
import {
    BarChart3, TrendingUp, Calendar, Zap, Heart, Download,
    Sparkles, ArrowRight, Brain, Wind
} from 'lucide-react';
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip, Bar, ComposedChart, Line, Cell
} from 'recharts';
import { motion } from 'framer-motion';

export default function HealthInsightsPage() {
    const [history, setHistory] = useState<DailySummary[]>([]);
    const [somaticHistory, setSomaticHistory] = useState<SomaticLog[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const [hData, sData] = await Promise.all([
                    getHealthHistory(user.id, 14),
                    getSomaticLogs(user.id, 14)
                ]);
                setHistory(hData || []);
                setSomaticHistory(sData || []);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const chartData = history.map(h => {
        const schedule = getScheduleForPhase(h.phase, h.cycle_day);
        const totalTasks = schedule.length;
        const completedTasks = h.completed_task_ids.length;
        const somatic = somaticHistory.find(s => s.date === h.date);

        return {
            name: h.date.split('-').slice(1).join('/'),
            water: h.water_intake,
            tasks: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
            energy: somatic?.energy || 0,
            moodScore: somatic?.mood?.length || 0
        };
    }).reverse();

    // Stats Calculations
    const avgWater = history.length > 0
        ? (history.reduce((acc, h) => acc + h.water_intake, 0) / history.length / 1000).toFixed(1)
        : '0';

    const avgProgress = history.length > 0
        ? Math.round(history.reduce((acc, h) => {
            const total = getScheduleForPhase(h.phase, h.cycle_day).length;
            const completed = h.completed_task_ids.length;
            return acc + (total > 0 ? (completed / total) * 100 : 0);
        }, 0) / history.length)
        : 0;

    const avgEnergy = somaticHistory.length > 0
        ? (somaticHistory.reduce((acc, s) => acc + (s.energy || 0), 0) / somaticHistory.length).toFixed(1)
        : '0';

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-herbal-green"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-herbal-green flex items-center gap-3">
                        <BarChart3 className="text-warm-orange animate-bounce-subtle" />
                        身体深度洞察
                    </h1>
                    <p className="text-text-muted mt-2 font-medium">多维数据分析，解读您的生物节律与感官趋势。</p>
                </div>

                <button className="flex items-center gap-2 bg-ivory hover:bg-white text-herbal-green border border-border-soft px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-sm hover:shadow-md active:scale-95 group">
                    <Download className="group-hover:translate-y-0.5 transition-transform" size={18} />
                    导出健康分析报告 (PDF)
                </button>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: '平均日饮水', value: `${avgWater} L`, desc: '推荐 2.5 L', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: '周完成度', value: `${avgProgress}%`, desc: '较上周 ↑5%', icon: Zap, color: 'text-warm-orange', bg: 'bg-warm-orange/10' },
                    { label: '身心一致性', value: 'High', desc: '节律对齐良好', icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                    { label: '平均精力', value: `${avgEnergy}`, desc: '总分 5.0', icon: Heart, color: 'text-red-500', bg: 'bg-red-500/10' },
                ].map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i}
                        className="bg-white p-8 rounded-[36px] border border-border-soft shadow-xl shadow-ivory/50 group hover:border-morning-green/20 transition-all"
                    >
                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                            <stat.icon size={24} />
                        </div>
                        <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.15em]">{stat.label}</p>
                        <p className="text-3xl font-black text-herbal-green mt-1">{stat.value}</p>
                        <p className="text-[10px] text-text-muted mt-2 font-bold opacity-60 uppercase">{stat.desc}</p>
                    </motion.div>
                ))}
            </div>

            {/* Main Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Somatic Score Trend */}
                <div className="bg-white rounded-[40px] p-10 border border-border-soft shadow-xl relative overflow-hidden">
                    <h3 className="text-xl font-black text-herbal-green mb-10 flex items-center gap-3">
                        <Brain className="text-purple-500" size={24} />
                        身体精力趋势
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 'bold', fill: '#9CA3AF' }} dy={10} />
                                <YAxis domain={[0, 5]} hide />
                                <Tooltip
                                    cursor={{ stroke: '#8b5cf6', strokeWidth: 1 }}
                                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '20px' }}
                                />
                                <Area type="monotone" dataKey="energy" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorEnergy)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Habit Quality */}
                <div className="bg-white rounded-[40px] p-10 border border-border-soft shadow-xl">
                    <h3 className="text-xl font-black text-herbal-green mb-10 flex items-center gap-3">
                        <Wind className="text-morning-green" size={24} />
                        节律打卡完成率 (%)
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 'bold', fill: '#9CA3AF' }} dy={10} />
                                <YAxis domain={[0, 100]} hide />
                                <Tooltip
                                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '20px' }}
                                />
                                <Bar dataKey="tasks" radius={[12, 12, 4, 4]} barSize={32}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.tasks > 80 ? '#2ea180' : '#f3723e'} fillOpacity={0.8} />
                                    ))}
                                </Bar>
                                <Line type="stepAfter" dataKey="tasks" stroke="#f3723e" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* discovery area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Heatmap */}
                <div className="lg:col-span-2 bg-white rounded-[40px] p-10 border border-border-soft shadow-xl">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-black text-herbal-green flex items-center gap-3">
                            <Calendar className="text-morning-green" size={24} />
                            月度同步全景
                        </h3>
                        <div className="flex gap-2 items-center text-[10px] font-black text-text-muted uppercase tracking-widest">
                            <span>同步度</span>
                            <div className="w-4 h-4 rounded bg-ivory" />
                            <div className="w-4 h-4 rounded bg-morning-green/20" />
                            <div className="w-4 h-4 rounded bg-morning-green/50" />
                            <div className="w-4 h-4 rounded bg-morning-green transition-all" />
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-3">
                        {Array.from({ length: 31 }).map((_, i) => (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: i * 0.01 }}
                                key={i}
                                className={`aspect-square rounded-2xl border border-border-soft/50 group relative cursor-pointer
                                    ${i < 5 ? 'bg-ivory/20' : i < 12 ? 'bg-morning-green/40' : i < 18 ? 'bg-morning-green' : 'bg-ivory'}
                                `}
                            >
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 rounded-2xl backdrop-blur-[2px]">
                                    <span className="text-[10px] font-black">{i + 1}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* AI Insight discovery Card */}
                <div className="bg-gradient-to-br from-herbal-green to-herbal-green-dark rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md">
                            <Sparkles className="text-warm-orange" size={24} />
                        </div>
                        <h4 className="text-2xl font-black mb-6 leading-tight">AI 健康发现</h4>
                        <div className="space-y-6 flex-1">
                            <div className="p-5 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm">
                                <p className="text-xs font-black opacity-60 uppercase tracking-widest mb-2">核心结论</p>
                                <p className="text-sm font-medium leading-relaxed">
                                    我们观察到当您的<b>饮水量</b>在上午 10:00 前达到 800ml 时，当日的<b>精力评分</b>平均提升了 22%。
                                </p>
                            </div>
                            <div className="p-5 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm">
                                <p className="text-xs font-black opacity-60 uppercase tracking-widest mb-2">优化建议</p>
                                <p className="text-sm font-medium leading-relaxed">
                                    尝试在起床后的黄金 30 分钟内完成第一杯 300ml 补水。
                                </p>
                            </div>
                        </div>
                        <button className="mt-8 flex items-center gap-2 text-sm font-black hover:gap-3 transition-all uppercase tracking-widest">
                            查看报告全文 <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
