'use client';

import { useState, useEffect } from 'react';
import { Send, CheckCircle2, Loader2, AlertCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';

const CATEGORIES = [
    { id: 'product_usage', label: 'Product & Usage' },
    { id: 'order_issue', label: 'Order Issue' },
    { id: 'general', label: 'General Inquiry' },
    { id: 'partnership', label: 'Partnership' },
    { id: 'press', label: 'Press & Media' },
];

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        orderNumber: '',
        message: '',
        _hp_website: '', // Honeypot field
    });

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [refNumber, setRefNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [userOrders, setUserOrders] = useState<{ order_number: string }[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    // 初始化 Supabase 客户端并在组件加载时获取用户信息
    useEffect(() => {
        setMounted(true);
        const initForm = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                setIsLoggedIn(true);
                setFormData(prev => ({
                    ...prev,
                    name: user.user_metadata?.name || user.email?.split('@')[0] || '',
                    email: user.email || '',
                }));

                // 获取该用户最近的 5 个订单
                const { data: orders } = await supabase
                    .from('orders')
                    .select('order_number')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(5);

                if (orders) setUserOrders(orders);
            }
        };

        initForm();
    }, []);

    // 校验逻辑
    const validateField = (name: string, value: string) => {
        let error = '';
        if (!value.trim() && name !== 'orderNumber') {
            error = 'This field is required';
        } else if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            error = 'Please enter a valid email address';
        } else if (name === 'message' && value.length < 10) {
            error = 'Message must be at least 10 characters';
        }
        setErrors(prev => ({ ...prev, [name]: error }));
        return error;
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (touched[field]) {
            validateField(field, value);
        }
    };

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        validateField(field, formData[field as keyof typeof formData]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Final validation check
        const newErrors: Record<string, string> = {};
        Object.keys(formData).forEach(key => {
            if (key !== '_hp_website') {
                const err = validateField(key, formData[key as keyof typeof formData]);
                if (err) newErrors[key] = err;
            }
        });

        if (Object.values(newErrors).some(err => err !== '')) {
            setErrors(newErrors);
            setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
            return;
        }

        setStatus('loading');
        setErrorMessage('');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Something went wrong');

            setRefNumber(data.referenceNumber);
            setStatus('success');
            // 重置但在保留登录状态的姓名邮箱
            setFormData(prev => ({
                ...prev,
                subject: '',
                orderNumber: '',
                message: '',
            }));
        } catch (err: any) {
            console.error(err);
            setErrorMessage(err.message);
            setStatus('error');
        }
    };

    if (!mounted) return null;

    if (status === 'success') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border-2 border-morning-green/30 p-8 rounded-3xl text-center shadow-xl shadow-morning-green/5 max-w-xl mx-auto"
            >
                <div className="w-20 h-20 bg-morning-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} className="text-morning-green-dark" />
                </div>
                <h3 className="text-2xl font-bold text-herbal-green mb-2">Message Sent Successfully!</h3>
                <p className="text-text-sub mb-6">
                    Thank you for reaching out. We have received your inquiry and will get back to you within 24 hours.
                </p>
                <div className="bg-ivory py-3 px-4 rounded-xl inline-block border border-border-soft mb-8">
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Reference Number</p>
                    <p className="text-lg font-mono font-bold text-herbal-green tracking-tight">{refNumber}</p>
                </div>
                <div>
                    <button
                        onClick={() => setStatus('idle')}
                        className="text-warm-orange font-semibold hover:underline"
                    >
                        Send another message
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <div id="contact-form" className="bg-white border border-border-soft p-8 md:p-10 rounded-3xl shadow-xl shadow-herbal-green/5 max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-herbal-green ml-1 flex justify-between">
                            Full Name
                            {touched.name && errors.name && <span className="text-red-500 text-[10px] font-bold uppercase">Required</span>}
                        </label>
                        <input
                            type="text"
                            placeholder="Your name"
                            value={formData.name}
                            onChange={e => handleInputChange('name', e.target.value)}
                            onBlur={() => handleBlur('name')}
                            className={`w-full px-5 py-3 rounded-xl border outline-none transition-all placeholder:text-text-muted/50 ${touched.name && errors.name
                                    ? 'border-red-300 focus:ring-2 focus:ring-red-100'
                                    : 'border-border-soft focus:ring-2 focus:ring-morning-green'
                                }`}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-herbal-green ml-1 flex justify-between">
                            Email Address
                            {touched.email && errors.email && <span className="text-red-500 text-[10px] font-bold uppercase">Invalid Format</span>}
                        </label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={e => handleInputChange('email', e.target.value)}
                            onBlur={() => handleBlur('email')}
                            className={`w-full px-5 py-3 rounded-xl border outline-none transition-all placeholder:text-text-muted/50 ${touched.email && errors.email
                                    ? 'border-red-300 focus:ring-2 focus:ring-red-100'
                                    : 'border-border-soft focus:ring-2 focus:ring-morning-green'
                                }`}
                        />
                    </div>
                </div>

                <div className={`grid gap-6 ${formData.subject === 'order_issue' ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-herbal-green ml-1 flex justify-between">
                            Subject
                            {touched.subject && errors.subject && <span className="text-red-500 text-[10px] font-bold uppercase">Required</span>}
                        </label>
                        <select
                            value={formData.subject}
                            onChange={e => {
                                handleInputChange('subject', e.target.value);
                                setFormData(prev => ({ ...prev, orderNumber: '' }));
                            }}
                            onBlur={() => handleBlur('subject')}
                            className={`w-full px-5 py-3 rounded-xl border outline-none transition-all bg-white ${touched.subject && errors.subject
                                    ? 'border-red-300 focus:ring-2 focus:ring-red-100'
                                    : 'border-border-soft focus:ring-2 focus:ring-morning-green'
                                }`}
                        >
                            <option value="" disabled>Select a reason</option>
                            {CATEGORIES.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.label}</option>
                            ))}
                        </select>
                    </div>

                    <AnimatePresence>
                        {formData.subject === 'order_issue' && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="space-y-2"
                            >
                                <label className="text-sm font-semibold text-herbal-green ml-1">Order Number</label>
                                {isLoggedIn && userOrders.length > 0 ? (
                                    <select
                                        value={formData.orderNumber}
                                        onChange={e => setFormData({ ...formData, orderNumber: e.target.value })}
                                        className="w-full px-5 py-3 rounded-xl border border-border-soft focus:ring-2 focus:ring-morning-green focus:border-transparent outline-none transition-all bg-white"
                                    >
                                        <option value="">Select a recent order</option>
                                        {userOrders.map(order => (
                                            <option key={order.order_number} value={order.order_number}>
                                                {order.order_number}
                                            </option>
                                        ))}
                                        <option value="other">Other / Not listed</option>
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        placeholder="e.g. ER-20260303-0001"
                                        value={formData.orderNumber}
                                        onChange={e => setFormData({ ...formData, orderNumber: e.target.value })}
                                        className="w-full px-5 py-3 rounded-xl border border-border-soft focus:ring-2 focus:ring-morning-green focus:border-transparent outline-none transition-all placeholder:text-text-muted/50"
                                    />
                                )}
                                {formData.orderNumber === 'other' && (
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Enter order number manually"
                                        onChange={e => setFormData({ ...formData, orderNumber: e.target.value })}
                                        className="w-full px-5 py-2 mt-2 rounded-lg border border-border-soft text-sm outline-none focus:ring-1 focus:ring-morning-green"
                                    />
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-herbal-green ml-1 flex justify-between">
                        Message
                        {touched.message && errors.message && <span className="text-red-500 text-[10px] font-bold uppercase">{errors.message}</span>}
                    </label>
                    <textarea
                        rows={5}
                        placeholder="How can we help you?"
                        value={formData.message}
                        onChange={e => handleInputChange('message', e.target.value)}
                        onBlur={() => handleBlur('message')}
                        className={`w-full px-5 py-3 rounded-xl border outline-none transition-all placeholder:text-text-muted/50 resize-none ${touched.message && errors.message
                                ? 'border-red-300 focus:ring-2 focus:ring-red-100'
                                : 'border-border-soft focus:ring-2 focus:ring-morning-green'
                            }`}
                    />
                </div>

                <AnimatePresence>
                    {status === 'error' && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="flex items-center gap-2 p-4 rounded-xl bg-red-50 text-red-600 border border-red-100 text-sm"
                        >
                            <AlertCircle size={18} />
                            <p>{errorMessage}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    disabled={status === 'loading'}
                    type="submit"
                    className="w-full py-4 rounded-xl bg-warm-orange text-white font-bold text-lg shadow-lg shadow-warm-orange/20 hover:bg-warm-orange-dark hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                    {status === 'loading' ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            Sending...
                        </>
                    ) : (
                        <>
                            <Send size={20} />
                            Send Message
                        </>
                    )}
                </button>

                <p className="text-center text-xs text-text-muted">
                    By submitting, you agree to our <a href="/privacy" className="underline hover:text-herbal-green">Privacy Policy</a>.
                </p>
            </form>
        </div>
    );
}
