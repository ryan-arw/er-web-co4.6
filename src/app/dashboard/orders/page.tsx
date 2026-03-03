'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBag, Package, Eye, ChevronDown, ChevronUp,
    Truck, CheckCircle2, Clock, XCircle, Search, Filter,
    ArrowRight, ExternalLink, Info, Zap
} from 'lucide-react';

import { createClient } from '@/lib/supabase/client';

type OrderStatus = 'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    pending: { label: '待付款', color: 'text-amber-600', bg: 'bg-amber-50', icon: <Clock size={14} /> },
    processing: { label: '处理中', color: 'text-blue-600', bg: 'bg-blue-50', icon: <Package size={14} /> },
    shipped: { label: '已发货', color: 'text-purple-600', bg: 'bg-purple-50', icon: <Truck size={14} /> },
    delivered: { label: '已送达', color: 'text-green-600', bg: 'bg-green-50', icon: <CheckCircle2 size={14} /> },
    cancelled: { label: '已取消', color: 'text-red-500', bg: 'bg-red-50', icon: <XCircle size={14} /> },
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [retryingOrderId, setRetryingOrderId] = useState<string | null>(null);
    const [filter, setFilter] = useState<OrderStatus>('all');
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchOrders = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    order_items (
                        *,
                        products (name, image_url)
                    )
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (data) {
                setOrders(data.map(o => ({
                    id: o.order_number,
                    realId: o.id,
                    date: new Date(o.created_at).toLocaleDateString(),
                    status: o.status,
                    paymentProvider: o.payment_provider,
                    shippingAddress: o.shipping_address,
                    items: o.order_items.map((oi: any) => ({
                        name: oi.products?.name || 'Vitalic D',
                        flavor: oi.flavor || 'Original',
                        qty: oi.quantity,
                        price: oi.unit_price_cents / 100,
                        image: oi.products?.image_url || null
                    })),
                    total: o.total_cents / 100,
                    tracking: o.tracking_number
                })));
            }
        }
        setLoading(false);
    };

    const handleRetryPayment = async (order: any) => {
        try {
            setRetryingOrderId(order.realId);
            const response = await fetch(`/api/orders/${order.realId}/pay`, {
                method: 'POST',
            });
            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else if (data.provider === 'paypal') {
                // For PayPal, we could redirect to a checkout page that auto-loads the order
                alert('PayPal 支付重试功能正在完善中，请联系客服。');
            } else {
                alert(data.error || '无法重新发起支付，请重试或联系客服。');
            }
        } catch (err) {
            console.error('Retry error:', err);
            alert('支付重试失败，请稍后。');
        } finally {
            setRetryingOrderId(null);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const filters: { key: OrderStatus; label: string }[] = [
        { key: 'all', label: '全部' },
        { key: 'pending', label: '待付款' },
        { key: 'processing', label: '处理中' },
        { key: 'shipped', label: '已发货' },
        { key: 'delivered', label: '已送达' },
        { key: 'cancelled', label: '已取消' },
    ];

    const filteredOrders = orders.filter((o: any) => {
        if (filter !== 'all' && o.status !== filter) return false;
        if (searchQuery && !o.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-10 w-48 bg-gray-100 rounded-lg animate-pulse" />
                <div className="space-y-4">
                    <div className="h-20 bg-gray-100/50 rounded-2xl animate-pulse" />
                    <div className="h-20 bg-gray-100/50 rounded-2xl animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-herbal-green font-[family-name:var(--font-display)]">我的订单</h1>
                    <p className="text-sm text-text-muted mt-1">查看和管理您的所有订单</p>
                </div>
                <Link href="/products" className="btn-primary text-sm px-5 py-2.5 flex items-center gap-2 self-start">
                    <ShoppingBag size={16} /> 继续购物
                </Link>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                        type="text"
                        placeholder="搜索订单号..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-border-soft text-sm focus:outline-none focus:border-warm-orange focus:ring-2 focus:ring-warm-orange/20 transition-all"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {filters.map((f) => (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${filter === f.key
                                ? 'bg-herbal-green text-white'
                                : 'bg-white border border-border-soft text-text-sub hover:border-herbal-green/30'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="text-center py-16">
                    <ShoppingBag size={48} className="text-text-muted/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-herbal-green mb-2">暂无订单</h3>
                    <p className="text-sm text-text-muted mb-6">开始您的第一次 ReSet 旅程吧！</p>
                    <Link href="/products" className="btn-primary text-sm px-8 py-3 inline-flex items-center gap-2">
                        浏览产品 <ArrowRight size={16} />
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order: any) => {
                        const status = statusConfig[order.status] || {
                            label: order.status || '处理中',
                            color: 'text-gray-600',
                            bg: 'bg-gray-100',
                            icon: <Package size={14} />
                        };
                        const isExpanded = expandedOrder === order.id;

                        return (
                            <motion.div
                                key={order.id}
                                layout
                                className="bg-white rounded-2xl border border-border-soft overflow-hidden hover:shadow-md transition-shadow"
                            >
                                {/* Order Header */}
                                <button
                                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                    className="w-full flex items-center justify-between p-5 text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="hidden sm:flex w-10 h-10 rounded-xl bg-ivory items-center justify-center">
                                            <Package size={20} className="text-herbal-green" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-herbal-green">{order.id}</p>
                                            <p className="text-xs text-text-muted">{order.date}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${status.bg} ${status.color} text-xs font-semibold`}>
                                            {status.icon} {status.label}
                                        </span>
                                        <span className="text-sm font-bold text-herbal-green">${order.total.toFixed(2)}</span>
                                        {isExpanded ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
                                    </div>
                                </button>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="border-t border-border-soft px-5 py-4"
                                    >
                                        <div className="space-y-4">
                                            <div className="space-y-3">
                                                {order.items.map((item: any, i: number) => (
                                                    <div key={i} className="flex items-center justify-between text-sm group/item">
                                                        <div className="flex items-center gap-4">
                                                            <div className="relative w-12 h-12 rounded-xl bg-ivory border border-border-soft overflow-hidden flex-shrink-0 p-1">
                                                                <Image
                                                                    src={item.image || '/photo/01 vitalic-d-main.jpg'}
                                                                    alt={item.name}
                                                                    fill
                                                                    className="object-contain"
                                                                />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-herbal-green">
                                                                    {item.name}
                                                                </p>
                                                                <div className="flex items-center gap-2 mt-0.5">
                                                                    <span className="text-[10px] font-bold text-warm-orange uppercase tracking-wider bg-warm-orange/10 px-1.5 py-0.5 rounded">
                                                                        {item.flavor}
                                                                    </span>
                                                                    <span className="text-[10px] text-text-muted">× {item.qty} 盒</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <span className="font-black text-herbal-green">${(item.price * item.qty).toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Order Metadata Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border-soft">
                                                {/* Shipping Info */}
                                                <div>
                                                    <h4 className="text-[10px] uppercase font-black text-herbal-green/40 tracking-widest mb-3">寄送详情</h4>
                                                    <div className="p-4 rounded-2xl bg-ivory/30 space-y-1.5 border border-border-soft">
                                                        <p className="text-sm font-bold text-herbal-green">{order.shippingAddress?.name}</p>
                                                        <p className="text-xs text-text-muted leading-relaxed">
                                                            {order.shippingAddress?.line1} {order.shippingAddress?.line2}<br />
                                                            {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}<br />
                                                            {order.shippingAddress?.country}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Summary & Payment */}
                                                <div>
                                                    <h4 className="text-[10px] uppercase font-black text-herbal-green/40 tracking-widest mb-3">支付摘要</h4>
                                                    <div className="p-4 rounded-2xl bg-ivory/30 space-y-2 border border-border-soft">
                                                        <div className="flex justify-between text-xs">
                                                            <span className="text-text-muted italic">支付方式</span>
                                                            <span className="font-bold text-herbal-green uppercase">{order.paymentProvider || 'Stripe'}</span>
                                                        </div>
                                                        <div className="flex justify-between text-xs">
                                                            <span className="text-text-muted">订单总计</span>
                                                            <span className="font-black text-herbal-green">${order.total.toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                    {order.status === 'pending' ? (
                                                        <button
                                                            onClick={() => handleRetryPayment(order)}
                                                            disabled={retryingOrderId === order.realId}
                                                            className="mt-3 w-full py-2.5 px-4 rounded-xl bg-warm-orange text-white text-xs font-bold hover:bg-warm-orange-dark shadow-sm shadow-warm-orange/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {retryingOrderId === order.realId ? (
                                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                            ) : (
                                                                <Zap size={14} />
                                                            )}
                                                            立即支付
                                                        </button>
                                                    ) : (
                                                        <button className="mt-3 w-full py-2.5 px-4 rounded-xl border border-border-soft text-xs font-bold text-herbal-green hover:bg-white hover:shadow-sm transition-all flex items-center justify-center gap-2">
                                                            <Info size={14} /> 联系客服/查询进度
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {order.tracking && (
                                                <div className="mt-4 pt-4 border-t border-border-soft flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-sm text-text-sub">
                                                        <Truck size={16} className="text-warm-orange" />
                                                        物流单号：<span className="font-mono text-herbal-green">{order.tracking}</span>
                                                    </div>
                                                    <button className="text-xs text-warm-orange hover:text-warm-orange-dark flex items-center gap-1 transition-colors">
                                                        追踪包裹 <ExternalLink size={12} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
