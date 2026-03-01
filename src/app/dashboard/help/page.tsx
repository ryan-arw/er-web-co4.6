'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
    HelpCircle, MessageCircle, Mail, FileText, ChevronDown,
    ExternalLink, Phone, Clock
} from 'lucide-react';

const faqs = [
    {
        q: 'Vitalic D 适合哪些人？',
        a: '适合 18 岁以上，希望改善消化健康、提升精力、追求内在通畅的成年人。不建议孕妇、哺乳期女性或正在服用处方药物的人群在未咨询医生前使用。',
    },
    {
        q: 'ReSet 期间可以正常工作吗？',
        a: '可以！大多数用户在 ReSet 期间照常工作。Vitalic D 的配方旨在提供能量支持而非让您虚弱。不过我们建议第一次 ReSet 选择相对轻松的日程安排。',
    },
    {
        q: '多久做一次 ReSet 比较合适？',
        a: '推荐每季度（90 天）一次完整的 3 天 ReSet。日常可搭配 Vitalic D Snack 维持节律。每个人的身体节奏不同，您可以根据自身感受适当调整。',
    },
    {
        q: '订阅可以随时取消吗？',
        a: '当然可以！订阅没有最低购买期限，您可以随时暂停或取消。更改将在下个配送周期前 3 天内生效。',
    },
    {
        q: '收到产品后不满意怎么办？',
        a: '我们提供 30 天无忧退换保证。如果您对产品不满意，请联系客服团队，我们将为您安排退款或换货。',
    },
    {
        q: '配送需要多长时间？',
        a: '马来西亚境内通常 2-3 个工作日送达。国际配送视目的地而定，通常 5-10 个工作日。所有订阅用户享受优先配送。',
    },
];

export default function HelpPage() {
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    return (
        <div className="max-w-3xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-herbal-green font-[family-name:var(--font-display)]">帮助与支持</h1>
                <p className="text-sm text-text-muted mt-1">找到答案或联系我们的团队</p>
            </div>

            {/* Contact Cards */}
            <div className="grid sm:grid-cols-3 gap-4">
                <a
                    href="mailto:support@ezyrelife.com"
                    className="p-5 rounded-2xl bg-white border border-border-soft hover:border-morning-green/30 hover:shadow-md transition-all text-center"
                >
                    <Mail size={24} className="text-warm-orange mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-herbal-green mb-1">邮件支持</h3>
                    <p className="text-xs text-text-muted">support@ezyrelife.com</p>
                </a>
                <a
                    href="#"
                    className="p-5 rounded-2xl bg-white border border-border-soft hover:border-morning-green/30 hover:shadow-md transition-all text-center"
                >
                    <MessageCircle size={24} className="text-warm-orange mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-herbal-green mb-1">在线聊天</h3>
                    <p className="text-xs text-text-muted">工作日 9:00 - 18:00</p>
                </a>
                <a
                    href="https://wa.me/60123456789"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-5 rounded-2xl bg-white border border-border-soft hover:border-morning-green/30 hover:shadow-md transition-all text-center"
                >
                    <Phone size={24} className="text-warm-orange mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-herbal-green mb-1">WhatsApp</h3>
                    <p className="text-xs text-text-muted">+60 12-345 6789</p>
                </a>
            </div>

            {/* Response Time */}
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-morning-green/10 border border-morning-green/20">
                <Clock size={18} className="text-morning-green-dark flex-shrink-0" />
                <p className="text-sm text-herbal-green">
                    通常在 <strong>24 小时内</strong> 回复您的邮件。紧急事项请使用 WhatsApp 联系。
                </p>
            </div>

            {/* FAQ */}
            <div>
                <h2 className="text-lg font-bold text-herbal-green mb-4">常见问题</h2>
                <div className="space-y-3">
                    {faqs.map((faq, index) => (
                        <div key={index} className="rounded-2xl bg-white border border-border-soft overflow-hidden">
                            <button
                                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                className="w-full flex items-center justify-between p-4 text-left"
                            >
                                <span className="text-sm font-semibold text-herbal-green pr-4">{faq.q}</span>
                                <ChevronDown
                                    size={16}
                                    className={`text-text-muted flex-shrink-0 transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`}
                                />
                            </button>
                            {expandedFaq === index && (
                                <div className="px-4 pb-4 border-t border-border-soft pt-3">
                                    <p className="text-sm text-text-sub leading-relaxed">{faq.a}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Resources */}
            <div>
                <h2 className="text-lg font-bold text-herbal-green mb-4">更多资源</h2>
                <div className="space-y-2">
                    {[
                        { label: '3R 完整指南', href: '/how-it-works', desc: '了解 ReAlign → ReSet → ReStore 流程' },
                        { label: '产品信息', href: '/products', desc: '查看 Vitalic D 产品详情和成分' },
                        { label: '关于我们', href: '/about', desc: '了解 EzyRelife 的品牌故事和价值观' },
                    ].map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="flex items-center justify-between p-4 rounded-xl bg-white border border-border-soft hover:border-morning-green/30 transition-all group"
                        >
                            <div>
                                <h3 className="text-sm font-semibold text-herbal-green">{link.label}</h3>
                                <p className="text-xs text-text-muted">{link.desc}</p>
                            </div>
                            <ExternalLink size={16} className="text-text-muted group-hover:text-warm-orange transition-colors" />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
