import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import {
    ShoppingBag, Repeat, Package, Calendar,
    ArrowRight, Activity, Sparkles, TrendingUp
} from 'lucide-react';

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || '用户';

    // Fetch stats from Supabase
    const [ordersRes, subRes, stashRes] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('user_id', user?.id),
        supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('user_id', user?.id).eq('status', 'active'),
        supabase.from('inventory_logs').select('balance_after').eq('user_id', user?.id).order('created_at', { ascending: false }).limit(1)
    ]);

    const orderCount = ordersRes.count || 0;
    const subCount = subRes.count || 0;
    const stashBalance = stashRes.data?.[0]?.balance_after || 0;

    // Quick stat cards data
    const stats = [
        {
            icon: ShoppingBag,
            label: '总订单',
            value: `${orderCount} 笔`,
            sub: orderCount > 0 ? '管理您的订单' : '暂无订单',
            color: 'text-warm-orange',
            bg: 'bg-warm-orange/10',
        },
        {
            icon: Repeat,
            label: '当前订阅',
            value: subCount > 0 ? `${subCount} 份活跃` : '未开通',
            sub: subCount > 0 ? '订阅正常进行中' : '订阅享 10% 折扣',
            color: 'text-morning-green-dark',
            bg: 'bg-morning-green/10',
        },
        {
            icon: Package,
            label: '库存',
            value: `${stashBalance} 盒`,
            sub: stashBalance > 0 ? '充足可用' : '建议补货',
            color: 'text-herbal-green',
            bg: 'bg-herbal-green/10',
        },
        {
            icon: Calendar,
            label: '下次 ReSet',
            value: '待规划',
            sub: '推荐每季度一次',
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-herbal-green font-[family-name:var(--font-display)]">
                        你好，{displayName} 👋
                    </h1>
                    <p className="text-sm text-text-muted mt-1">
                        欢迎来到您的节律控制台。
                    </p>
                </div>
                <Link
                    href="/products"
                    className="btn-primary text-sm px-6 py-2.5 flex items-center gap-2 self-start"
                >
                    <Sparkles size={16} />
                    开始 ReSet
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="p-5 rounded-2xl bg-white border border-border-soft hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                                <stat.icon size={20} />
                            </div>
                            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">{stat.label}</span>
                        </div>
                        <p className="text-xl font-bold text-herbal-green">{stat.value}</p>
                        <p className="text-xs text-text-muted mt-1">{stat.sub}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg font-bold text-herbal-green mb-4">快捷操作</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        {
                            icon: ShoppingBag,
                            title: '浏览产品',
                            desc: '发现 Vitalic D 系列',
                            href: '/products',
                            color: 'text-warm-orange',
                            bg: 'bg-warm-orange/5',
                        },
                        {
                            icon: Activity,
                            title: '了解 3R 流程',
                            desc: '查看详细指南',
                            href: '/how-it-works',
                            color: 'text-morning-green-dark',
                            bg: 'bg-morning-green/5',
                        },
                        {
                            icon: TrendingUp,
                            title: '订阅管理',
                            desc: '管理您的定期订单',
                            href: '/dashboard/subscriptions',
                            color: 'text-herbal-green',
                            bg: 'bg-herbal-green/5',
                        },
                    ].map((action) => (
                        <Link
                            key={action.title}
                            href={action.href}
                            className={`group p-5 rounded-2xl ${action.bg} border border-border-soft hover:border-morning-green/30 transition-all`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <action.icon size={22} className={action.color} />
                                <ArrowRight size={16} className="text-text-muted group-hover:translate-x-1 transition-transform" />
                            </div>
                            <h3 className="text-sm font-bold text-herbal-green">{action.title}</h3>
                            <p className="text-xs text-text-muted mt-1">{action.desc}</p>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Journey CTA */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-herbal-green to-herbal-green-dark text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/4 translate-x-1/4" />
                <div className="relative">
                    <h3 className="text-xl font-bold mb-2">准备好您的下一次 ReSet？</h3>
                    <p className="text-white/50 text-sm mb-5 max-w-md">
                        每季度一次的节律校准，帮助您维持最佳的生物节律。搭配 ReLife Sync App，让每一次 ReSet 都精准到位。
                    </p>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-warm-orange text-white text-sm font-semibold hover:bg-warm-orange-dark transition-colors"
                    >
                        立即购买 <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
