'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Utensils, Save, Camera, Plus } from 'lucide-react';
import { useState } from 'react';
import { MealLog } from '@/lib/health-types';

interface MealLogModalProps {
    isOpen: boolean;
    onClose: () => void;
    mealType: 'breakfast' | 'lunch' | 'dinner';
    phaseType: 'realign' | 'restore';
    initialData: MealLog | null;
    onSave: (data: Partial<MealLog>) => Promise<void>;
}

export default function MealLogModal({ isOpen, onClose, mealType, phaseType, initialData, onSave }: MealLogModalProps) {
    const [foodItems, setFoodItems] = useState<string[]>(initialData?.data?.items || []);
    const [newItem, setNewItem] = useState('');
    const [portion, setPortion] = useState(initialData?.data?.portion || '正常');
    const [satisfaction, setSatisfaction] = useState(initialData?.data?.satisfaction || 3);
    const [saving, setSaving] = useState(false);

    const mealName = {
        breakfast: '早餐',
        lunch: '午餐',
        dinner: '晚餐'
    }[mealType];

    const addItem = () => {
        if (!newItem.trim()) return;
        setFoodItems([...foodItems, newItem.trim()]);
        setNewItem('');
    };

    const handleSave = async () => {
        setSaving(true);
        await onSave({
            meal_type: mealType,
            phase_type: phaseType,
            data: {
                items: foodItems,
                portion,
                satisfaction
            }
        });
        setSaving(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden">
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-black text-herbal-green">{mealName}记录</h2>
                                <p className="text-xs text-text-muted mt-1 uppercase tracking-widest">{phaseType} Phase 食谱对齐</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-ivory rounded-full">
                                <X size={24} className="text-text-muted" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Food Items */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-herbal-green block">食物清单</label>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {foodItems.map((item, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-morning-green/10 text-morning-green-dark rounded-xl text-sm font-bold flex items-center gap-2">
                                            {item}
                                            <button onClick={() => setFoodItems(foodItems.filter((_, idx) => idx !== i))}><X size={14} /></button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        value={newItem}
                                        onChange={(e) => setNewItem(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addItem()}
                                        placeholder="记录你吃了什么..."
                                        className="flex-1 bg-ivory/50 border border-border-soft rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-herbal-green/20"
                                    />
                                    <button onClick={addItem} className="bg-ivory p-3 rounded-2xl text-herbal-green hover:bg-morning-green/10 transition-colors">
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Portion */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-herbal-green block">进食量</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['少食', '正常', '饱足'].map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setPortion(p)}
                                            className={`py-3 rounded-2xl text-sm font-bold transition-all ${portion === p ? 'bg-herbal-green text-white shadow-md' : 'bg-ivory text-text-muted'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Satisfaction */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-herbal-green">满足感</label>
                                    <span className="text-xs font-bold text-text-muted">{satisfaction} / 5</span>
                                </div>
                                <div className="flex justify-between gap-1">
                                    {[1, 2, 3, 4, 5].map(v => (
                                        <button
                                            key={v}
                                            onClick={() => setSatisfaction(v)}
                                            className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all ${satisfaction >= v ? 'bg-warm-orange text-white' : 'bg-ivory text-text-muted/40'
                                                }`}
                                        >
                                            {v}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full mt-8 bg-herbal-green text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-opacity-95 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
                        >
                            {saving ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : <Save size={20} />}
                            {saving ? '同步中...' : '提交记录'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
