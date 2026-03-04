'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, ChevronDown, HelpCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FAQ_DATA } from '@/lib/faq-data';

export default function FAQSection() {
    const [mounted, setMounted] = useState(false);
    const [search, setSearch] = useState('');
    const [expandedIndex, setExpandedIndex] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const filteredFaqs = useMemo(() => {
        if (!search) return FAQ_DATA;
        const query = search.toLowerCase();

        return FAQ_DATA.map(cat => ({
            ...cat,
            items: cat.items.filter(item =>
                item.q.toLowerCase().includes(query) ||
                item.a.toLowerCase().includes(query)
            )
        })).filter(cat => cat.items.length > 0);
    }, [search]);

    if (!mounted) return null;

    return (
        <section className="space-y-8">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-herbal-green font-[family-name:var(--font-display)]">
                    Frequently Asked Questions
                </h2>
                <p className="text-text-sub max-w-2xl mx-auto">
                    Before reaching out, you might find the answer you're looking for here.
                </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-warm-orange transition-colors">
                    <Search size={20} />
                </div>
                <input
                    type="text"
                    placeholder="Search for answers..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-white border border-border-soft rounded-2xl shadow-sm focus:ring-2 focus:ring-morning-green focus:border-transparent outline-none transition-all"
                />
                {search && (
                    <button
                        onClick={() => setSearch('')}
                        className="absolute inset-y-0 right-4 flex items-center text-text-muted hover:text-warm-orange transition-colors"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* FAQ Grid */}
            <div className="max-w-4xl mx-auto space-y-8">
                {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((category, catIndex) => (
                        <div key={catIndex} className="space-y-4">
                            <h3 className="text-lg font-bold text-herbal-green/60 px-2 uppercase tracking-wider text-sm">
                                {category.category}
                            </h3>
                            <div className="space-y-3">
                                {category.items.map((item, itemIndex) => {
                                    const id = `${catIndex}-${itemIndex}`;
                                    const isExpanded = expandedIndex === id;

                                    return (
                                        <div
                                            key={itemIndex}
                                            className={`group rounded-2xl bg-white border transition-all duration-300 ${isExpanded ? 'border-morning-green shadow-lg ring-1 ring-morning-green/20' : 'border-border-soft hover:border-morning-green/50'
                                                }`}
                                        >
                                            <button
                                                onClick={() => setExpandedIndex(isExpanded ? null : id)}
                                                className="w-full flex items-center justify-between p-5 text-left"
                                            >
                                                <span className={`font-semibold transition-colors ${isExpanded ? 'text-herbal-green' : 'text-herbal-green/80 group-hover:text-herbal-green'}`}>
                                                    {item.q}
                                                </span>
                                                <ChevronDown
                                                    size={20}
                                                    className={`text-text-muted transition-transform duration-300 ${isExpanded ? 'rotate-180 text-warm-orange' : ''}`}
                                                />
                                            </button>

                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="px-5 pb-5 pt-1 text-text-sub leading-relaxed text-sm">
                                                            <p>{item.a}</p>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white/50 rounded-3xl border border-dashed border-border-soft">
                        <HelpCircle size={48} className="mx-auto text-text-muted mb-4 opacity-20" />
                        <p className="text-text-muted">No answers found for "{search}".</p>
                        <button
                            onClick={() => {
                                setSearch('');
                                document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="mt-4 text-warm-orange font-semibold hover:underline"
                        >
                            Contact our support team instead
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
