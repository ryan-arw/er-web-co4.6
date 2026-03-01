'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin, Plus, Edit3, Trash2, Check, X, Star, Home, Building2
} from 'lucide-react';

import { createClient } from '@/lib/supabase/client';
import { useEffect } from 'react';

interface Address {
    id: string;
    label: string;
    name: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    isDefault: boolean;
    type?: 'home' | 'office';
}

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [formLabel, setFormLabel] = useState('');
    const [formName, setFormName] = useState('');
    const [formPhone, setFormPhone] = useState('');
    const [formLine1, setFormLine1] = useState('');
    const [formLine2, setFormLine2] = useState('');
    const [formCity, setFormCity] = useState('');
    const [formState, setFormState] = useState('');
    const [formZip, setFormZip] = useState('');
    const [formCountry, setFormCountry] = useState('Malaysia');

    const fetchAddresses = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase
                .from('addresses')
                .select('*')
                .eq('user_id', user.id)
                .order('is_default', { ascending: false });

            if (data) {
                setAddresses(data.map(a => ({
                    id: a.id,
                    label: a.name || '地址', // The SQL has 'name' which is used for the label in the mock
                    name: a.name || '',
                    phone: a.phone || '',
                    line1: a.line1,
                    line2: a.line2,
                    city: a.city,
                    state: a.state,
                    zip: a.postal_code,
                    country: a.country,
                    isDefault: a.is_default,
                    type: (a.name?.includes('家') || a.name?.includes('Home')) ? 'home' : 'office'
                })));
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const setDefault = async (id: string) => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Reset all to false
        await supabase
            .from('addresses')
            .update({ is_default: false })
            .eq('user_id', user.id);

        // Set target to true
        await supabase
            .from('addresses')
            .update({ is_default: true })
            .eq('id', id);

        fetchAddresses();
    };

    const deleteAddress = async (id: string) => {
        if (!confirm('确定删除该地址吗？')) return;
        const supabase = createClient();
        await supabase.from('addresses').delete().eq('id', id);
        fetchAddresses();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const isFirst = addresses.length === 0;

        await supabase.from('addresses').insert({
            user_id: user.id,
            name: formLabel || formName,
            phone: formPhone,
            line1: formLine1,
            line2: formLine2,
            city: formCity,
            state: formState,
            postal_code: formZip,
            country: formCountry,
            is_default: isFirst
        });

        setShowForm(false);
        // Reset form
        setFormLabel(''); setFormName(''); setFormPhone('');
        setFormLine1(''); setFormLine2(''); setFormCity('');
        setFormState(''); setFormZip('');
        fetchAddresses();
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-10 w-48 bg-gray-100 rounded-lg animate-pulse" />
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="h-48 bg-gray-50 rounded-2xl animate-pulse" />
                    <div className="h-48 bg-gray-50 rounded-2xl animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-herbal-green font-[family-name:var(--font-display)]">地址管理</h1>
                    <p className="text-sm text-text-muted mt-1">管理您的收货地址</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="btn-primary text-sm px-5 py-2.5 flex items-center gap-2 self-start"
                >
                    <Plus size={16} /> 添加地址
                </button>
            </div>

            {/* Address Cards */}
            <div className="grid md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                    <div
                        key={addr.id}
                        className={`relative p-5 rounded-2xl border-2 transition-all ${addr.isDefault
                            ? 'border-warm-orange bg-warm-orange/5'
                            : 'border-border-soft bg-white'
                            }`}
                    >
                        {addr.isDefault && (
                            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-warm-orange text-white text-[10px] font-bold flex items-center gap-1">
                                <Star size={10} /> 默认
                            </span>
                        )}

                        <div className="flex items-start gap-3 mb-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${addr.type === 'home' ? 'bg-morning-green/10 text-morning-green-dark' : 'bg-blue-50 text-blue-600'
                                }`}>
                                {addr.type === 'home' ? <Home size={20} /> : <Building2 size={20} />}
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-herbal-green">{addr.label}</h3>
                                <p className="text-xs text-text-muted">{addr.name}</p>
                            </div>
                        </div>

                        <div className="text-sm text-text-sub leading-relaxed mb-4">
                            <p>{addr.line1}</p>
                            {addr.line2 && <p>{addr.line2}</p>}
                            <p>{addr.city}, {addr.state} {addr.zip}</p>
                            <p>{addr.country}</p>
                            <p className="text-text-muted mt-1">{addr.phone}</p>
                        </div>

                        <div className="flex items-center gap-2 pt-3 border-t border-border-soft">
                            {!addr.isDefault && (
                                <button
                                    onClick={() => setDefault(addr.id)}
                                    className="text-xs text-warm-orange hover:text-warm-orange-dark font-semibold flex items-center gap-1 transition-colors"
                                >
                                    <Check size={14} /> 设为默认
                                </button>
                            )}
                            <button className="text-xs text-text-muted hover:text-herbal-green flex items-center gap-1 transition-colors ml-auto">
                                <Edit3 size={14} /> 编辑
                            </button>
                            <button
                                onClick={() => deleteAddress(addr.id)}
                                className="text-xs text-text-muted hover:text-red-500 flex items-center gap-1 transition-colors"
                            >
                                <Trash2 size={14} /> 删除
                            </button>
                        </div>
                    </div>
                ))}

                {/* Add New Card */}
                <button
                    onClick={() => setShowForm(true)}
                    className="p-8 rounded-2xl border-2 border-dashed border-border-soft hover:border-morning-green/40 transition-colors flex flex-col items-center justify-center text-center gap-3 min-h-[200px]"
                >
                    <div className="w-12 h-12 rounded-full bg-morning-green/10 flex items-center justify-center">
                        <Plus size={24} className="text-morning-green-dark" />
                    </div>
                    <span className="text-sm font-semibold text-herbal-green">添加新地址</span>
                </button>
            </div>

            {/* Add Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowForm(false)}
                            className="fixed inset-0 bg-black/30 z-40"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg bg-white rounded-3xl shadow-2xl z-50 p-6 max-h-[80vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-herbal-green">添加新地址</h2>
                                <button onClick={() => setShowForm(false)} className="p-1 text-text-muted hover:text-herbal-green">
                                    <X size={20} />
                                </button>
                            </div>

                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-medium text-herbal-green mb-1 block uppercase tracking-wider">标签</label>
                                        <input
                                            type="text"
                                            placeholder="如：家、公司"
                                            value={formLabel}
                                            onChange={(e) => setFormLabel(e.target.value)}
                                            className="w-full px-3 py-2.5 rounded-xl bg-ivory border border-border-soft text-sm focus:outline-none focus:border-warm-orange transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-herbal-green mb-1 block uppercase tracking-wider">收件姓名</label>
                                        <input
                                            type="text"
                                            placeholder="收件人姓名"
                                            value={formName}
                                            onChange={(e) => setFormName(e.target.value)}
                                            className="w-full px-3 py-2.5 rounded-xl bg-ivory border border-border-soft text-sm focus:outline-none focus:border-warm-orange transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-herbal-green mb-1 block uppercase tracking-wider">联系电话</label>
                                    <input
                                        type="tel"
                                        placeholder="+60 12-345 6789"
                                        value={formPhone}
                                        onChange={(e) => setFormPhone(e.target.value)}
                                        className="w-full px-3 py-2.5 rounded-xl bg-ivory border border-border-soft text-sm focus:outline-none focus:border-warm-orange transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-herbal-green mb-1 block uppercase tracking-wider">地址行 1</label>
                                    <input
                                        type="text"
                                        placeholder="街道地址"
                                        value={formLine1}
                                        onChange={(e) => setFormLine1(e.target.value)}
                                        className="w-full px-3 py-2.5 rounded-xl bg-ivory border border-border-soft text-sm focus:outline-none focus:border-warm-orange transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-herbal-green mb-1 block uppercase tracking-wider">地址行 2（可选）</label>
                                    <input
                                        type="text"
                                        placeholder="公寓、单元号等"
                                        value={formLine2}
                                        onChange={(e) => setFormLine2(e.target.value)}
                                        className="w-full px-3 py-2.5 rounded-xl bg-ivory border border-border-soft text-sm focus:outline-none focus:border-warm-orange transition-all"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-medium text-herbal-green mb-1 block uppercase tracking-wider">城市</label>
                                        <input
                                            type="text"
                                            placeholder="城市"
                                            value={formCity}
                                            onChange={(e) => setFormCity(e.target.value)}
                                            className="w-full px-3 py-2.5 rounded-xl bg-ivory border border-border-soft text-sm focus:outline-none focus:border-warm-orange transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-herbal-green mb-1 block uppercase tracking-wider">州/省</label>
                                        <input
                                            type="text"
                                            placeholder="州/省"
                                            value={formState}
                                            onChange={(e) => setFormState(e.target.value)}
                                            className="w-full px-3 py-2.5 rounded-xl bg-ivory border border-border-soft text-sm focus:outline-none focus:border-warm-orange transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-medium text-herbal-green mb-1 block uppercase tracking-wider">邮编</label>
                                        <input
                                            type="text"
                                            placeholder="邮编"
                                            value={formZip}
                                            onChange={(e) => setFormZip(e.target.value)}
                                            className="w-full px-3 py-2.5 rounded-xl bg-ivory border border-border-soft text-sm focus:outline-none focus:border-warm-orange transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-herbal-green mb-1 block uppercase tracking-wider">国家/地区</label>
                                        <input
                                            type="text"
                                            value={formCountry}
                                            onChange={(e) => setFormCountry(e.target.value)}
                                            className="w-full px-3 py-2.5 rounded-xl bg-ivory border border-border-soft text-sm focus:outline-none focus:border-warm-orange transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="w-full btn-primary text-sm py-3 mt-2 font-bold tracking-widest">保存地址</button>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
