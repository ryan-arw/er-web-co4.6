'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Calendar, ChevronRight, ChevronLeft, CheckCircle2, Heart, Zap, Waves } from 'lucide-react';
import { useState } from 'react';
import { ResetPlan } from '@/lib/health-types';

interface PlanWizardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (plan: Partial<ResetPlan>) => Promise<void>;
}

const intentions = [
    {
        id: 'GLOW',
        name: 'GLOW (焕颜)',
        description: '侧重于皮肤状态修复、消化排毒与内分泌平衡。',
        icon: Sparkles,
        color: 'text-pink-500',
        bg: 'bg-pink-50',
        realign: 2,
        restore: 2
    },
    {
        id: 'GROW',
        name: 'GROW (赋能)',
        description: '侧重于能量水平提升、肌肉组织修复与免疫增强。',
        icon: Zap,
        color: 'text-warm-orange',
        bg: 'bg-warm-orange/10',
        realign: 3,
        restore: 3
    },
    {
        id: 'FLOW',
        name: 'FLOW (心流)',
        description: '侧重于情绪调节、压力释放与大脑认知清晰。',
        icon: Waves,
        color: 'text-blue-500',
        bg: 'bg-blue-50',
        realign: 2,
        restore: 3
    },
];

export default function PlanWizardModal({ isOpen, onClose, onSave }: PlanWizardModalProps) {
    const [step, setStep] = useState(1);
    const [selectedIntention, setSelectedIntention] = useState(intentions[0]);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + selectedIntention.realign + 3 + selectedIntention.restore - 1);

        await onSave({
            start_date: startDate,
            end_date: endDate.toISOString().split('T')[0],
            intention: selectedIntention.id,
            realign_duration: selectedIntention.realign,
            restore_duration: selectedIntention.restore,
            type: 'manual',
            is_stock_deducted: false,
            is_skipped: false
        });
        setSaving(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden min-h-[500px] flex flex-col">
                    <div className="p-10 flex-1">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className="text-2xl font-black text-herbal-green">开启新的 Reset 计划</h2>
                                <p className="text-xs text-text-muted mt-1 uppercase tracking-widest font-bold">Step {step} of 3</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-ivory rounded-full transition-colors">
                                <X size={24} className="text-text-muted" />
                            </button>
                        </div>

                        {/* Step 1: Intention */}
                        {step === 1 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                <h3 className="text-lg font-black text-herbal-green">本次 Reset 的核心意图是？</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {intentions.map(intl => (
                                        <button
                                            key={intl.id}
                                            onClick={() => setSelectedIntention(intl)}
                                            className={`flex items-start gap-4 p-6 rounded-3xl border-2 transition-all text-left ${selectedIntention.id === intl.id
                                                    ? 'border-herbal-green bg-ivory/50 shadow-md scale-[1.02]'
                                                    : 'border-border-soft hover:border-morning-green/30'
                                                }`}
                                        >
                                            <div className={`w-12 h-12 ${intl.bg} rounded-2xl flex items-center justify-center shrink-0`}>
                                                <intl.icon className={intl.color} size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-herbal-green">{intl.name}</h4>
                                                <p className="text-xs text-text-muted mt-1 leading-relaxed">{intl.description}</p>
                                            </div>
                                            {selectedIntention.id === intl.id && <CheckCircle2 className="text-herbal-green ml-auto" size={20} />}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Date */}
                        {step === 2 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                                <h3 className="text-lg font-black text-herbal-green">计划从哪一天开始？</h3>
                                <div className="p-8 bg-ivory/50 rounded-[32px] border border-border-soft">
                                    <div className="flex flex-col items-center gap-6">
                                        <Calendar size={64} className="text-herbal-green opacity-20" />
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="bg-white border-2 border-border-soft rounded-2xl px-6 py-4 font-black text-lg text-herbal-green focus:border-herbal-green outline-none shadow-sm"
                                        />
                                        <p className="text-xs text-text-muted text-center leading-relaxed">
                                            我们将为您预留 <b>{selectedIntention.realign} 天</b> 的 ReAlign 对齐期，<br />
                                            以确保您的身体处于进入 Reset 的最佳状态。
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Confirmation */}
                        {step === 3 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                                <h3 className="text-lg font-black text-herbal-green">确认计划明细</h3>
                                <div className="space-y-4">
                                    <div className="bg-gradient-to-br from-herbal-green to-herbal-green-dark p-8 rounded-[32px] text-white shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-10">
                                            <selectedIntention.icon size={100} />
                                        </div>
                                        <div className="relative z-10">
                                            <p className="text-xs font-black uppercase tracking-widest opacity-60">Reset 意图</p>
                                            <h4 className="text-2xl font-black mb-6">{selectedIntention.name}</h4>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                                                    <p className="text-[10px] uppercase font-bold text-white/50 tracking-widest">开始日期</p>
                                                    <p className="text-lg font-bold mt-1">{startDate}</p>
                                                </div>
                                                <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                                                    <p className="text-[10px] uppercase font-bold text-white/50 tracking-widest">周期长度</p>
                                                    <p className="text-lg font-bold mt-1">
                                                        {selectedIntention.realign + 3 + selectedIntention.restore} 天
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-2xl flex gap-3">
                                        <Sparkles className="text-blue-500 shrink-0" size={20} />
                                        <p className="text-xs text-blue-900 leading-relaxed">
                                            提交后，您的每日任务流将自动根据此计划进行更新，并同步至您的移动端设备。
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-10 bg-ivory/50 border-t border-border-soft flex items-center justify-between">
                        <button
                            onClick={() => setStep(s => s - 1)}
                            disabled={step === 1}
                            className={`flex items-center gap-2 font-black text-sm transition-all ${step === 1 ? 'opacity-0' : 'text-text-muted hover:text-herbal-green'}`}
                        >
                            <ChevronLeft size={20} /> 上一步
                        </button>

                        {step < 3 ? (
                            <button
                                onClick={() => setStep(s => s + 1)}
                                className="bg-herbal-green text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:shadow-lg transition-all active:scale-[0.98]"
                            >
                                下一步 <ChevronRight size={20} />
                            </button>
                        ) : (
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-warm-orange text-white px-10 py-4 rounded-2xl font-black flex items-center gap-2 hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                {saving ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : <CheckCircle2 size={20} />}
                                {saving ? '创建中...' : '确认并 Commit'}
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
