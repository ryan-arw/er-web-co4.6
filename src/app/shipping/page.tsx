import Link from 'next/link';
import { ArrowLeft, Truck, Clock, Globe, Package } from 'lucide-react';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '配送政策 — EzyRelife',
    description: 'EzyRelife 配送与物流政策。了解配送时间、范围和运费。',
};

export default function ShippingPage() {
    return (
        <>
            <Navbar />
            <main className="pt-28 pb-20 min-h-screen">
                <article className="max-w-3xl mx-auto px-6 md:px-8">
                    <Link href="/" className="text-xs text-text-muted hover:text-herbal-green flex items-center gap-1 mb-6"><ArrowLeft size={12} /> 返回首页</Link>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-herbal-green mb-4 font-[family-name:var(--font-display)]">配送政策</h1>
                    <p className="text-xs text-text-muted mb-8">最后更新：2026 年 3 月 1 日</p>

                    {/* Quick Info Cards */}
                    <div className="grid sm:grid-cols-3 gap-4 mb-10">
                        <div className="p-5 rounded-2xl bg-white border border-border-soft text-center">
                            <Truck size={24} className="text-warm-orange mx-auto mb-2" />
                            <h3 className="text-sm font-bold text-herbal-green">马来西亚</h3>
                            <p className="text-xs text-text-muted">2-3 个工作日</p>
                        </div>
                        <div className="p-5 rounded-2xl bg-white border border-border-soft text-center">
                            <Globe size={24} className="text-warm-orange mx-auto mb-2" />
                            <h3 className="text-sm font-bold text-herbal-green">国际配送</h3>
                            <p className="text-xs text-text-muted">5-10 个工作日</p>
                        </div>
                        <div className="p-5 rounded-2xl bg-white border border-border-soft text-center">
                            <Package size={24} className="text-warm-orange mx-auto mb-2" />
                            <h3 className="text-sm font-bold text-herbal-green">订阅用户</h3>
                            <p className="text-xs text-text-muted">免费优先配送</p>
                        </div>
                    </div>

                    <div className="space-y-8 text-sm text-text-sub leading-relaxed">
                        <section>
                            <h2 className="text-lg font-bold text-herbal-green mb-3">1. 配送范围</h2>
                            <p>我们目前配送至以下地区：</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li><strong>马来西亚全境</strong>（含东马）</li>
                                <li><strong>新加坡</strong></li>
                                <li><strong>东南亚其他国家</strong>（泰国、印尼、菲律宾、文莱）</li>
                                <li>其他国际地区请联系客服确认</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-herbal-green mb-3">2. 配送时间</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="border-b border-border-soft">
                                            <th className="text-left py-3 pr-4 font-semibold text-herbal-green">地区</th>
                                            <th className="text-left py-3 pr-4 font-semibold text-herbal-green">时间</th>
                                            <th className="text-left py-3 font-semibold text-herbal-green">费用</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-text-sub">
                                        <tr className="border-b border-border-soft/50"><td className="py-3 pr-4">西马</td><td className="py-3 pr-4">2-3 个工作日</td><td className="py-3">$5.00 / 订阅免费</td></tr>
                                        <tr className="border-b border-border-soft/50"><td className="py-3 pr-4">东马（沙巴/砂拉越）</td><td className="py-3 pr-4">3-5 个工作日</td><td className="py-3">$8.00 / 订阅免费</td></tr>
                                        <tr className="border-b border-border-soft/50"><td className="py-3 pr-4">新加坡</td><td className="py-3 pr-4">3-5 个工作日</td><td className="py-3">$10.00</td></tr>
                                        <tr><td className="py-3 pr-4">其他国际</td><td className="py-3 pr-4">5-10 个工作日</td><td className="py-3">按重量计算</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-herbal-green mb-3">3. 订单追踪</h2>
                            <p>订单发货后，您将收到包含物流追踪号码的邮件通知。您也可以在 Dashboard 的「我的订单」中追踪包裹状态。</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-herbal-green mb-3">4. 订阅配送</h2>
                            <p>订阅用户享受以下配送优惠：</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>马来西亚境内免费配送</li>
                                <li>优先处理，确保在计划日期前到达</li>
                                <li>可在下次配送前 3 天修改配送地址</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-herbal-green mb-3">5. 包装</h2>
                            <p>所有产品均采用环保包装，确保产品在运输中完好无损。包裹外部不会显示产品名称，保护您的隐私。</p>
                        </section>
                    </div>
                </article>
            </main>
            <Footer />
        </>
    );
}
