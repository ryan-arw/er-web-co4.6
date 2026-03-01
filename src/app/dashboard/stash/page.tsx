'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Package, ShoppingBag, ArrowRight, Calendar, AlertCircle } from 'lucide-react';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export default function StashPage() {
    const [stashItems, setStashItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchStash = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            // Get latest balance per product
            const { data } = await supabase
                .from('inventory_logs')
                .select('product_id, balance_after, created_at, products(*)')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (data) {
                // Keep only the latest entry per product_id
                const uniqueLatest = Array.from(
                    data.reduce((map: Map<string, any>, item: any) => {
                        if (!map.has(item.product_id)) {
                            map.set(item.product_id, item);
                        }
                        return map;
                    }, new Map()).values()
                );

                setStashItems(uniqueLatest.map((item: any) => ({
                    id: item.product_id,
                    name: item.products?.name || '未知产品',
                    image: item.products?.image_url || '/photo/01 vitalic-d-main.jpg',
                    qty: item.balance_after,
                    purchaseDate: new Date(item.created_at).toLocaleDateString(),
                    expiryDate: '2027-02-28', // Mocking expiry for now
                })));
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchStash();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-10 w-48 bg-gray-100 rounded-lg animate-pulse" />
                <div className="grid sm:grid-cols-3 gap-4">
                    <div className="h-24 bg-gray-50 rounded-2xl animate-pulse" />
                    <div className="h-24 bg-gray-50 rounded-2xl animate-pulse" />
                    <div className="h-24 bg-gray-50 rounded-2xl animate-pulse" />
                </div>
            </div>
        );
    }

    const totalBoxes = stashItems.reduce((s, i) => s + i.qty, 0);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-herbal-green font-[family-name:var(--font-display)]">我的库存</h1>
                    <p className="text-sm text-text-muted mt-1">追踪您的 Vitalic D 库存和使用情况</p>
                </div>
                <Link href="/products" className="btn-primary text-sm px-5 py-2.5 flex items-center gap-2 self-start">
                    <ShoppingBag size={16} /> 补货
                </Link>
            </div>

            {/* Summary */}
            <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-border-soft">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-herbal-green/10 text-herbal-green flex items-center justify-center">
                            <Package size={20} />
                        </div>
                        <span className="text-xs font-medium text-text-muted uppercase tracking-wider">总库存</span>
                    </div>
                    <p className="text-2xl font-bold text-herbal-green">{totalBoxes} 盒</p>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-border-soft">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-warm-orange/10 text-warm-orange flex items-center justify-center">
                            <Calendar size={20} />
                        </div>
                        <span className="text-xs font-medium text-text-muted uppercase tracking-wider">可完成 ReSet</span>
                    </div>
                    <p className="text-2xl font-bold text-herbal-green">{totalBoxes} 次</p>
                    <p className="text-xs text-text-muted mt-1">推荐每季度 1 次</p>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-border-soft">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-morning-green/10 text-morning-green-dark flex items-center justify-center">
                            <Calendar size={20} />
                        </div>
                        <span className="text-xs font-medium text-text-muted uppercase tracking-wider">预计可用至</span>
                    </div>
                    <p className="text-2xl font-bold text-herbal-green">{totalBoxes > 0 ? `${totalBoxes * 3} 个月` : '—'}</p>
                </div>
            </div>

            {/* Stash Items */}
            <div>
                <h2 className="text-lg font-bold text-herbal-green mb-4">库存明细</h2>
                <div className="space-y-4">
                    {stashItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-5 p-5 rounded-2xl bg-white border border-border-soft">
                            <div className="relative w-16 h-16 rounded-xl bg-ivory overflow-hidden flex-shrink-0">
                                <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-bold text-herbal-green">{item.name}</h3>
                                <div className="flex flex-wrap gap-3 mt-1 text-xs text-text-muted">
                                    <span>购入：{item.purchaseDate}</span>
                                    <span>有效：{item.expiryDate}</span>
                                </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <span className="text-2xl font-bold text-herbal-green">{item.qty}</span>
                                <span className="text-xs text-text-muted block">盒</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Low Stock Alert */}
            {totalBoxes <= 1 && (
                <div className="flex items-start gap-3 p-5 rounded-2xl bg-amber-50 border border-amber-200">
                    <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-sm font-bold text-amber-800">库存偏低</h3>
                        <p className="text-xs text-amber-600 mt-1">
                            建议至少保持 2 盒库存，确保按计划完成季度 ReSet。
                            <Link href="/products" className="text-warm-orange font-semibold ml-1 hover:underline">
                                立即补货 →
                            </Link>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
