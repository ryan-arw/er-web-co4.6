'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Heart, Moon, Wind, Smile, Save } from 'lucide-react';
import { useState } from 'react';
import { SomaticLog } from '@/lib/health-types';

interface SomaticDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: SomaticLog | null;
    onSave: (updates: Partial<SomaticLog>) => Promise<void>;
}

const moods = ['平静', '焦虑', '愉悦', '疲惫', '警觉', '感性', '压力', '动力'];

export default function SomaticDetailModal({ isOpen, onClose, initialData, onSave }: SomaticDetailModalProps) {
    const [energy, setEnergy] = useState(initialData?.energy || 3);
    const [digestion, setDigestion] = useState(initialData?.digestion || 3);
    const [sleep, setSleep] = useState(initialData?.sleep_quality || 3);
    const [lightness, setLightness] = useState(initialData?.lightness || 3);
    const [selectedMoods, setSelectedMoods] = useState<string[]>(initialData?.mood || []);
    const [notes, setNotes] = useState(initialData?.notes || '');
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        await onSave({
            energy,
            digestion,
            sleep_quality: sleep,
            lightness,
            mood: selectedMoods,
            notes
        });
        setSaving(false);
        onClose();
    };

    const toggleMood = (mood: string) => {
        setSelectedMoods(prev =>
            prev.includes(mood) ? prev.filter(m => m !== mood) : [...prev, mood]
        );
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative bg-white w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden"
                >
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-herbal-green">身体感官记录</h2>
                            <button onClick={onClose} className="p-2 hover:bg-ivory rounded-full transition-colors">
                                <X size={24} className="text-text-muted" />
                            </button>
                        </div>

                        <div className="space-y-8">
                            {/* Sliders */}
                            {[
                                { label: '能量状态', value: energy, setter: setEnergy, icon: Zap, color: 'text-warm-orange' },
                                { label: '消化感受', value: digestion, setter: setDigestion, icon: Heart, color: 'text-red-500' },
                                { label: '睡眠质量', value: sleep, setter: setSleep, icon: Moon, color: 'text-blue-500' },
                                { label: '身体清盈度', value: lightness, setter: setLightness, icon: Wind, color: 'text-morning-green' },
                            ].map((item, i) => (
                                <div key={i} className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <item.icon size={18} className={item.color} />
                                            <span className="text-sm font-bold text-herbal-green">{item.label}</span>
                                        </div>
                                        <span className="text-lg font-black text-herbal-green">{item.value} / 5</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="5"
                                        step="1"
                                        value={item.value}
                                        onChange={(e) => item.setter(parseInt(e.target.value))}
                                        className="w-full h-2 bg-ivory rounded-lg appearance-none cursor-pointer accent-herbal-green"
                                    />
                                </div>
                            ))}

                            {/* Mood Tag Cloud */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Smile size={18} className="text-yellow-500" />
                                    <span className="text-sm font-bold text-herbal-green">今日心情描述</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {moods.map(mood => (
                                        <button
                                            key={mood}
                                            onClick={() => toggleMood(mood)}
                                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedMoods.includes(mood)
                                                    ? 'bg-herbal-green text-white shadow-md scale-105'
                                                    : 'bg-ivory text-text-muted hover:bg-morning-green/10'
                                                }`}
                                        >
                                            {mood}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="space-y-4">
                                <span className="text-sm font-bold text-herbal-green block">补充备注 (可选)</span>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="今天身体有什么特殊的感觉吗？"
                                    className="w-full bg-ivory/50 border border-border-soft rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-herbal-green/20 min-h-[100px] transition-all"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full mt-8 bg-herbal-green text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-opacity-95 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
                        >
                            {saving ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : <Save size={20} />}
                            {saving ? '保存中...' : '同步至云端'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
