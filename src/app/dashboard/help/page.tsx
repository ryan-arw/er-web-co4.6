'use client';

import { useState } from 'react';
import {
    HelpCircle, Mail, MessageSquare, BookOpen, AlertCircle,
    ArrowRight, Sparkles, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FAQSection from '@/components/FAQSection';
import ContactForm from '@/components/ContactForm';
import FeedbackForm from '@/components/FeedbackForm';

const TABS = [
    { id: 'faq', label: '自助中心 / FAQ', icon: BookOpen },
    { id: 'contact', label: '联系我们 / Contact', icon: Mail },
    { id: 'feedback', label: '反馈中心 / Feedback', icon: MessageSquare },
];

export default function HelpPage() {
    const [activeTab, setActiveTab] = useState('faq');

    return (
        <div className="max-w-4xl space-y-8 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-herbal-green tracking-tight font-[family-name:var(--font-display)]">
                        帮助与支持
                    </h1>
                    <p className="text-sm text-text-muted mt-1 uppercase tracking-widest font-bold">Help & Support Center</p>
                </div>
                <div className="p-3 bg-morning-green/10 border border-morning-green/20 rounded-2xl flex items-center gap-3">
                    <Sparkles size={20} className="text-morning-green-dark" />
                    <p className="text-xs text-herbal-green font-medium leading-tight">
                        找不到答案？<br />
                        通过联系表单或反馈中心告诉我们
                    </p>
                </div>
            </div>

            {/* Quick Actions / Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {TABS.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            data-tab={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`p-6 rounded-3xl text-left transition-all duration-300 relative overflow-hidden group border-2 ${isActive
                                    ? 'border-warm-orange bg-white shadow-xl shadow-warm-orange/5'
                                    : 'border-white bg-white/50 hover:bg-white hover:border-morning-green/20'
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTabGlow"
                                    className="absolute -right-4 -top-4 w-24 h-24 bg-warm-orange/10 blur-3xl"
                                />
                            )}
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors ${isActive ? 'bg-warm-orange text-white' : 'bg-morning-green/10 text-morning-green-dark group-hover:bg-morning-green group-hover:text-white'
                                }`}>
                                <Icon size={24} />
                            </div>
                            <h3 className={`text-lg font-bold transition-colors ${isActive ? 'text-herbal-green' : 'text-herbal-green/60'}`}>
                                {tab.label.split(' / ')[0]}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                                    {tab.label.split(' / ')[1]}
                                </span>
                                <ChevronRight size={12} className={`transition-transform duration-300 ${isActive ? 'translate-x-1 text-warm-orange' : 'opacity-30'}`} />
                            </div>

                            {isActive && (
                                <motion.div
                                    layoutId="activeIndicator"
                                    className="absolute bottom-0 left-6 right-6 h-1 bg-warm-orange rounded-full"
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="mt-8">
                <AnimatePresence mode="wait">
                    {activeTab === 'faq' && (
                        <motion.div
                            key="faq"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-white/40 rounded-3xl p-2 md:p-4"
                        >
                            <FAQSection />
                        </motion.div>
                    )}

                    {activeTab === 'contact' && (
                        <motion.div
                            key="contact"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            <div className="max-w-2xl mx-auto text-center space-y-3">
                                <h2 className="text-2xl font-bold text-herbal-green">联系我们的支持团队</h2>
                                <p className="text-text-sub text-sm">
                                    如果您对订单、产品使用或订阅有任何疑问，请填写下方表单。我们通常在 <strong>24 小时内</strong> 回复您的邮件。
                                </p>
                            </div>
                            <ContactForm />
                        </motion.div>
                    )}

                    {activeTab === 'feedback' && (
                        <motion.div
                            key="feedback"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            <div className="max-w-2xl mx-auto text-center space-y-3">
                                <h2 className="text-2xl font-bold text-herbal-green">反馈中心</h2>
                                <p className="text-text-sub text-sm">
                                    您在产品使用中有任何想法、建议或发现 Bug 吗？您的反馈将直接发送给研发团队，帮助我们不断改善 EzyRelife 体验。
                                </p>
                            </div>
                            <FeedbackForm />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Additional Resources */}
            <div className="pt-8 border-t border-border-soft">
                <h2 className="text-xl font-bold text-herbal-green mb-6 flex items-center gap-2">
                    <BookOpen size={20} className="text-morning-green" />
                    更多自助资源
                </h2>
                <div className="grid sm:grid-cols-3 gap-4">
                    {[
                        { label: '3R 完整指南', href: '/how-it-works', desc: 'ReAlign → ReSet → ReStore' },
                        { label: '产品知识库', href: '/products', desc: '成分与研发故事' },
                        { label: '品牌故事', href: '/about', desc: '了解我们的使命' },
                    ].map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="p-5 rounded-2xl bg-white border border-border-soft hover:border-morning-green/30 transition-all group flex flex-col items-start"
                        >
                            <h3 className="text-sm font-bold text-herbal-green group-hover:text-morning-green-dark transition-colors">{link.label}</h3>
                            <p className="text-[11px] text-text-muted mt-1 leading-tight">{link.desc}</p>
                            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-warm-orange/70 group-hover:text-warm-orange transition-colors">
                                立即查看 <ArrowRight size={12} />
                            </div>
                        </a>
                    ))}
                </div>
            </div>

            {/* Alert for critical issues */}
            <div className="p-6 rounded-3xl bg-ivory border border-border-soft flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                <div className="w-16 h-16 rounded-full bg-white border border-border-soft flex items-center justify-center flex-shrink-0 shadow-sm">
                    <AlertCircle size={32} className="text-warm-orange" />
                </div>
                <div className="flex-1">
                    <h4 className="text-sm font-bold text-herbal-green">紧急问题或安全相关？</h4>
                    <p className="text-xs text-text-muted mt-1">
                        如果您发现直接影响健康的严重问题，或者您的订单配送出现重大偏差，请务必使用 <strong>Contact 表单</strong> 并选择 <strong>"Order Issue"</strong> 类别，我们会最高级别优先处理。
                    </p>
                </div>
                <button
                    onClick={() => setActiveTab('contact')}
                    className="px-6 py-3 bg-herbal-green text-white text-xs font-bold rounded-xl hover:bg-black transition-all whitespace-nowrap"
                >
                    前往联系表单
                </button>
            </div>
        </div>
    );
}
