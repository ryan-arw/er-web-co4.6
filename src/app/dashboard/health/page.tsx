'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/lib/vitalic/VitalicContext';
import { Phase } from '@/lib/vitalic/types';
import { getWaterGoal } from '@/lib/vitalic/constants';
import {
    Activity, Droplets, Moon, Sun, Zap, CheckCircle2,
    Circle, Clock, Utensils, MessageSquareText,
    ChevronRight, Info, AlertCircle, Sparkles, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SomaticDetailModal from '@/components/health/SomaticDetailModal';
import MealLogModal from '@/components/health/MealLogModal';
import { SomaticLog, MealLog } from '@/lib/health-types';

export default function HealthTodayPage() {
    const {
        todayContext,
        waterIntake,
        addWater,
        rhythmSchedule,
        completedTaskIds,
        toggleTask,
        somaticLog,
        setSomaticLog,
        reAlignMeals,
        reStoreMeals,
        logReAlignMeal,
        logReStoreMeal,
        authLoading,
        isAuthenticated
    } = useApp();

    const [isSomaticModalOpen, setIsSomaticModalOpen] = useState(false);
    const [activeMeal, setActiveMeal] = useState<{ type: 'breakfast' | 'lunch' | 'dinner', phase: 'realign' | 'restore' } | null>(null);

    // ─── Data Mapping ───
    const phase = todayContext.phase || Phase.MAINTENANCE;
    const cycleDay = todayContext.cycleDay || 0;
    const waterGoal = getWaterGoal(phase);

    const completedCount = rhythmSchedule.filter(t => t.completed).length;
    const totalTasks = rhythmSchedule.length;
    const progress = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

    // Mapping Vitalic SomanicLogEntry to UI SomaticLog
    const uiSomaticData: SomaticLog | null = useMemo(() => {
        if (!somaticLog) return null;
        return {
            user_id: '', // Not used by modal inside onSave
            date: '',
            energy: somaticLog.energy,
            digestion: somaticLog.digestion,
            sleep_quality: somaticLog.sleepQuality,
            lightness: somaticLog.lightness,
            mood: somaticLog.mood,
            notes: somaticLog.notes
        };
    }, [somaticLog]);

    if (authLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-4 border-morning-green/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-herbal-green rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-sm font-bold text-herbal-green animate-pulse">正在同步节律数据...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-white rounded-[40px] border border-border-soft shadow-xl">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4">
                    <AlertCircle size={32} />
                </div>
                <h2 className="text-xl font-black text-herbal-green mb-2">未检测到登录状态</h2>
                <p className="text-sm text-text-muted max-w-xs">请先登录您的 EzyRelife 账户以访问个人健康节律同步系统。</p>
            </div>
        );
    }

    const handleTaskClick = (task: any) => {
        // App Logic: Meals trigger modals
        if (task.id === 'm1' || task.id === 'm2' || task.id === 'm3') {
            const mealType = task.id === 'm1' ? 'breakfast' : task.id === 'm2' ? 'lunch' : 'dinner';
            setActiveMeal({
                type: mealType as any,
                phase: (phase === Phase.RESTORE ? 'restore' : 'realign') as any
            });
            // If not completed, we toggle it (which adds water if needed and marks done)
            if (!task.completed) toggleTask(task.id);
        } else {
            // Normal habits/supplements
            toggleTask(task.id);
        }
    };

    const handleSomaticSave = async (updates: Partial<SomaticLog>) => {
        setSomaticLog(prev => ({
            ...prev,
            energy: updates.energy,
            digestion: updates.digestion,
            sleepQuality: updates.sleep_quality,
            lightness: updates.lightness,
            mood: updates.mood || [],
            notes: updates.notes
        }));
    };

    const handleMealSave = async (data: Partial<MealLog>) => {
        const mealType = data.meal_type as 'breakfast' | 'lunch' | 'dinner';
        const satisfaction = data.data?.satisfaction || 3;
        const portionStr = data.data?.portion || '正常';

        if (phase === Phase.RESTORE) {
            // Map 1-5 to GutFeeling enum
            const feelingMap: Record<number, any> = {
                1: 'pain',
                2: 'bloated',
                3: 'gurgling',
                4: 'soothing',
                5: 'soothing'
            };

            logReStoreMeal(mealType, {
                completed: true,
                foodDescription: data.data?.items?.join(', '),
                feeling: feelingMap[satisfaction] || 'gurgling',
                texture: satisfaction > 3 ? 'normal' : 'light'
            });
        } else {
            // Map Satisfaction to Quality
            const qualityMap: Record<number, any> = {
                1: 'light',
                2: 'light',
                3: 'normal',
                4: 'heavy',
                5: 'heavy'
            };

            // Map Portion text to number
            const portionMap: Record<string, number> = {
                '少食': 50,
                '正常': 100,
                '饱足': 150
            };

            logReAlignMeal(mealType, {
                skipped: false,
                quality: qualityMap[satisfaction] || 'normal',
                portion: portionMap[portionStr] || 100
            });
        }
    };

    // Helper to get current meal data for modal
    const getInitialMealData = () => {
        if (!activeMeal) return null;
        if (phase === Phase.RESTORE) {
            const m = reStoreMeals?.[activeMeal.type];
            if (!m) return null;

            // Map Feeling back to satisfaction score
            const feelingToScore: Record<string, number> = {
                'pain': 1,
                'bloated': 2,
                'gurgling': 3,
                'soothing': 5
            };

            return {
                meal_type: activeMeal.type,
                phase_type: 'restore',
                data: {
                    items: m.foodDescription ? m.foodDescription.split(', ') : [],
                    satisfaction: feelingToScore[m.feeling || ''] || 3,
                    portion: '正常'
                }
            } as MealLog;
        } else {
            const m = reAlignMeals?.[activeMeal.type];
            if (!m) return null;

            const qualityToScore: Record<string, number> = {
                'light': 2,
                'normal': 3,
                'heavy': 4
            };

            const portionToLabel = (p?: number) => {
                if (!p) return '正常';
                if (p <= 50) return '少食';
                if (p >= 150) return '饱足';
                return '正常';
            };

            return {
                meal_type: activeMeal.type,
                phase_type: 'realign',
                data: {
                    items: [], // ReAlignEntry doesn't have items in current types
                    satisfaction: qualityToScore[m.quality || ''] || 3,
                    portion: portionToLabel(m.portion)
                }
            } as MealLog;
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <motion.div
                            initial={{ scale: 0.8, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 ${phase === Phase.RESET ? 'bg-gradient-to-r from-warm-orange to-orange-600 text-white ring-4 ring-orange-500/10' :
                                phase === Phase.REALIGN ? 'bg-gradient-to-r from-morning-green to-herbal-green text-white ring-4 ring-green-500/10' :
                                    phase === Phase.RESTORE ? 'bg-gradient-to-r from-morning-green-dark to-herbal-green text-white ring-4 ring-green-900/10' :
                                        'bg-white text-text-muted border border-border-soft shadow-sm'
                                }`}
                        >
                            <Sparkles size={12} />
                            {phase} {cycleDay > 0 && `· Day ${cycleDay}`}
                        </motion.div>
                    </div>
                    <h1 className="text-4xl font-black text-herbal-green tracking-tight flex items-center gap-3">
                        <Activity className="text-warm-orange" size={32} />
                        健康管理面板
                    </h1>
                    <p className="text-text-muted text-sm mt-2 font-medium">
                        实时同步您的 Vitalic 节律。数据当前与 <span className="text-herbal-green font-bold">App</span> 保持一致。
                    </p>
                </div>

                {/* Progress Wheel Card */}
                <div className="flex items-center gap-6 bg-white p-6 rounded-[32px] border border-border-soft shadow-xl shadow-ivory/50">
                    <div className="text-right">
                        <p className="text-[10px] text-text-muted uppercase font-black tracking-widest mb-1">今日节律完成度</p>
                        <p className="text-4xl font-black text-herbal-green leading-none">
                            {progress}<span className="text-sm ml-0.5 opacity-40">%</span>
                        </p>
                    </div>
                    <div className="relative w-16 h-16 rounded-full flex items-center justify-center bg-ivory/50">
                        <svg className="w-16 h-16 -rotate-90">
                            <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="6" className="text-morning-green/5" />
                            <motion.circle
                                cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="6"
                                strokeDasharray={2 * Math.PI * 28}
                                initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                                animate={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - progress / 100) }}
                                transition={{ duration: 1.5, ease: "circOut" }}
                                strokeLinecap="round"
                                className="text-morning-green"
                            />
                        </svg>
                        <Zap className="absolute text-morning-green/20" size={20} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Interactive Timeline */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[48px] p-8 md:p-12 border border-border-soft shadow-2xl relative overflow-hidden">
                        {/* Background subtle pattern */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-morning-green/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>

                        <div className="flex items-center justify-between mb-12 relative z-10">
                            <h3 className="text-2xl font-black text-herbal-green flex items-center gap-3">
                                <Clock className="text-warm-orange" size={28} />
                                每日节律任务
                            </h3>
                            <button className="flex items-center gap-2 text-xs font-bold text-herbal-green bg-morning-green/10 px-4 py-2 rounded-full hover:bg-morning-green/20 transition-all">
                                <Info size={14} />
                                节律指南
                            </button>
                        </div>

                        <div className="space-y-12 relative z-10 before:absolute before:left-[21px] before:top-4 before:bottom-4 before:w-[3px] before:bg-gradient-to-b before:from-morning-green/20 before:via-morning-green/5 before:to-transparent">
                            {rhythmSchedule.map((task, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 + 0.3 }}
                                    key={task.id}
                                    className="relative pl-16 group"
                                >
                                    {/* Connection Dot */}
                                    <div
                                        className={`absolute left-0 top-1 w-11 h-11 rounded-full bg-white border-2 flex items-center justify-center z-10 transition-all duration-500 shadow-md ${task.completed
                                            ? 'border-morning-green bg-morning-green ring-8 ring-morning-green/10'
                                            : 'border-border-soft group-hover:border-warm-orange/50 group-hover:scale-110'
                                            }`}
                                    >
                                        {task.completed ? <Zap className="text-white fill-white" size={20} /> :
                                            task.title.includes('餐') ? <Utensils className="text-text-muted/30" size={18} /> :
                                                <Circle className="text-text-muted/20" size={18} />}
                                    </div>

                                    {/* Task Card */}
                                    <div
                                        onClick={() => handleTaskClick(task)}
                                        className={`cursor-pointer p-8 rounded-[40px] border transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5 active:scale-[0.98] ${task.completed
                                            ? 'bg-ivory/40 border-morning-green/10 shadow-inner'
                                            : 'bg-white border-border-soft hover:border-warm-orange/30 shadow-sm'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-3 flex-1">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <span className={`text-[11px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest ${task.completed ? 'bg-morning-green/10 text-morning-green-dark' : 'bg-ivory text-text-muted'
                                                        }`}>
                                                        {task.time}
                                                    </span>
                                                    <h4 className={`text-xl font-black transition-colors ${task.completed ? 'text-herbal-green/40 line-through' : 'text- herball-green'
                                                        }`}>
                                                        {task.title}
                                                    </h4>
                                                </div>
                                                <p className="text-sm text-text-muted leading-relaxed max-w-lg font-medium">
                                                    {task.description}
                                                </p>

                                                {/* Specialized Meal View */}
                                                {(task.id === 'm1' || task.id === 'm2' || task.id === 'm3') && task.completed && (
                                                    <div className="mt-4 py-4 px-6 bg-white/80 rounded-3xl border border-morning-green/10 flex items-center justify-between group shadow-sm">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-morning-green/10 rounded-xl">
                                                                <Utensils size={16} className="text-morning-green" />
                                                            </div>
                                                            <span className="text-xs font-bold text-herbal-green">查看内容或修改...</span>
                                                        </div>
                                                        <ChevronRight size={18} className="text-morning-green/40 group-hover:translate-x-1 transition-transform" />
                                                    </div>
                                                )}

                                                {/* Specialized Products */}
                                                {task.product && (
                                                    <div className="mt-4 flex gap-2 flex-wrap">
                                                        {task.product.items.map(item => (
                                                            <span key={item} className="text-[10px] bg-warm-orange/10 text-warm-orange-dark px-4 py-1.5 rounded-full font-black border border-warm-orange/5">
                                                                {item}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className={`transition-all duration-1000 ${task.completed ? 'scale-125 rotate-[360deg]' : 'scale-100 opacity-10'}`}>
                                                <CheckCircle2 className={task.completed ? 'text-morning-green' : 'text-text-muted'} size={32} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Widgets */}
                <div className="space-y-8">
                    {/* Water Tracker - Premium Glass */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-gradient-to-br from-[#1E88E5] to-[#1565C0] rounded-[48px] p-10 text-white shadow-2xl shadow-blue-500/30 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 -mr-12 -mt-12 opacity-10 rotate-12">
                            <Droplets size={240} />
                        </div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="font-black flex items-center gap-3 text-xl tracking-tight">
                                    <Droplets className="text-blue-200" size={28} />
                                    水合同步
                                </h3>
                                <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
                                    <span className="text-xs font-black uppercase tracking-widest text-blue-100">Live</span>
                                </div>
                            </div>

                            <div className="relative h-56 bg-white/10 rounded-[32px] border border-white/20 backdrop-blur-md shadow-inner mb-8 overflow-hidden">
                                {/* Water Animation */}
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${Math.min((waterIntake / waterGoal) * 100, 100)}%` }}
                                    transition={{ type: 'spring', damping: 25, stiffness: 40 }}
                                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/40 to-white/20 backdrop-blur-xl"
                                />

                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <motion.p
                                        key={waterIntake}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="text-6xl font-black drop-shadow-xl"
                                    >
                                        {waterIntake}
                                    </motion.p>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100 mt-2 opacity-60">
                                        ml / {waterGoal}ml Goal
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {[250, 500].map(amt => (
                                    <button
                                        key={amt}
                                        onClick={() => addWater(amt)}
                                        className="bg-white/10 hover:bg-white/30 active:scale-95 py-5 rounded-3xl text-sm font-black text-white backdrop-blur-md transition-all border border-white/20 group flex flex-col items-center gap-1"
                                    >
                                        <Plus size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                                        {amt}ml
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Somatic Log Widget - Re-imagined */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        onClick={() => setIsSomaticModalOpen(true)}
                        className="bg-white rounded-[48px] p-10 border border-border-soft shadow-2xl cursor-pointer group hover:border-warm-orange/20 transition-all"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="font-black text-herbal-green text-xl tracking-tight">感官记录</h3>
                                <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1">Somatic Sync</p>
                            </div>
                            <div className="w-12 h-12 bg-ivory rounded-2xl flex items-center justify-center text-text-muted group-hover:bg-warm-orange group-hover:text-white transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-sm">
                                <MessageSquareText size={20} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { val: somaticLog?.energy || '-', label: '精力', color: 'text-warm-orange', icon: Zap },
                                { val: somaticLog?.digestion || '-', label: '消化', color: 'text-red-500', icon: Activity },
                                { val: somaticLog?.sleepQuality || '-', label: '睡眠', color: 'text-blue-500', icon: Moon },
                                { val: somaticLog?.lightness || '-', label: '体感', color: 'text-morning-green', icon: Sun },
                            ].map((stat, i) => (
                                <div key={i} className="bg-ivory/50 rounded-3xl p-5 border border-border-soft text-center group-hover:bg-white transition-all duration-300">
                                    <div className="flex justify-center mb-2">
                                        <stat.icon className={`${stat.color} opacity-40`} size={16} />
                                    </div>
                                    <p className={`text-3xl font-black ${stat.color}`}>{stat.val}</p>
                                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1 opacity-60">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex flex-wrap gap-2">
                            {somaticLog?.mood?.map(m => (
                                <span key={m} className="px-3 py-1.5 bg-morning-green/10 text-morning-green-dark border border-morning-green/10 rounded-xl text-[10px] font-black shadow-sm">
                                    # {m}
                                </span>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-border-soft text-center">
                            <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.1em] group-hover:text-warm-orange flex items-center justify-center gap-2 transition-colors">
                                点击记录精细感官 ➔
                            </p>
                        </div>
                    </motion.div>

                    {/* Vitalic D Strategy Card */}
                    <div className="p-10 rounded-[48px] bg-ivory/50 border border-border-soft relative overflow-hidden backdrop-blur-sm">
                        <div className="absolute -top-10 -right-10 opacity-5 rotate-45">
                            <Sparkles size={160} />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-warm-orange/10 flex items-center justify-center text-warm-orange shadow-inner">
                                    <Info size={24} />
                                </div>
                                <h5 className="text-lg font-black text-herbal-green">节律策略</h5>
                            </div>
                            <p className="text-sm text-text-muted font-medium leading-relaxed">
                                {phase === Phase.RESET
                                    ? 'Reset 期间肠胃处于高敏感修复期。建议所有饮水均在 45℃ 左右，温润的内环境是触发代谢开关的关键。'
                                    : phase === Phase.REALIGN
                                        ? 'ReAlign 阶段着重于皮质醇与褪黑素的对抗平衡。请确保在 10:00 前完成第一次日光接触。'
                                        : '在日常维护阶段，保持“少量多次”的饮水习惯，有助于维持稳定的基础代谢率。'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals & Overlays */}
            <SomaticDetailModal
                isOpen={isSomaticModalOpen}
                onClose={() => setIsSomaticModalOpen(false)}
                initialData={uiSomaticData}
                onSave={handleSomaticSave}
            />

            {activeMeal && (
                <MealLogModal
                    isOpen={true}
                    onClose={() => setActiveMeal(null)}
                    mealType={activeMeal.type}
                    phaseType={activeMeal.phase}
                    initialData={getInitialMealData()}
                    onSave={handleMealSave}
                />
            )}
        </div>
    );
}
