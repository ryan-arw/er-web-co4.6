import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '退款政策 — EzyRelife',
    description: 'EzyRelife 退款与退换货政策。30 天无忧退换保证。',
};

export default function RefundPolicyPage() {
    return (
        <>
            <Navbar />
            <main className="pt-28 pb-20 min-h-screen">
                <article className="max-w-3xl mx-auto px-6 md:px-8">
                    <Link href="/" className="text-xs text-text-muted hover:text-herbal-green flex items-center gap-1 mb-6"><ArrowLeft size={12} /> 返回首页</Link>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-herbal-green mb-4 font-[family-name:var(--font-display)]">退款政策</h1>
                    <p className="text-xs text-text-muted mb-8">最后更新：2026 年 3 月 1 日</p>

                    {/* Guarantee Banner */}
                    <div className="p-6 rounded-2xl bg-morning-green/10 border border-morning-green/20 mb-10 text-center">
                        <p className="text-2xl mb-2">🛡️</p>
                        <h2 className="text-lg font-bold text-herbal-green mb-2">30 天无忧退换保证</h2>
                        <p className="text-sm text-text-sub">如果您对购买不满意，我们将全额退款或换货。</p>
                    </div>

                    <div className="space-y-8 text-sm text-text-sub leading-relaxed">
                        <section>
                            <h2 className="text-lg font-bold text-herbal-green mb-3">1. 退款资格</h2>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>自收到产品之日起 30 天内可申请退款</li>
                                <li>产品必须未使用或使用量不超过总量的 50%</li>
                                <li>订阅订单在当期内可申请退款</li>
                                <li>仅限首次购买的客户享受全额退款（无需退回产品）</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-herbal-green mb-3">2. 退款流程</h2>
                            <ol className="list-decimal pl-5 space-y-2">
                                <li>联系我们的客服团队：<a href="mailto:support@ezyrelife.com" className="text-warm-orange hover:underline">support@ezyrelife.com</a></li>
                                <li>提供订单号和退款原因</li>
                                <li>我们将在 2 个工作日内审核您的申请</li>
                                <li>如需退回产品，我们会提供退货地址和说明</li>
                                <li>退款将在收到退货后 5-7 个工作日内原路退回</li>
                            </ol>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-herbal-green mb-3">3. 换货</h2>
                            <p>如果您收到损坏或错误的产品，我们将免费补发正确的产品。请在收到商品后 7 天内联系我们，并提供相关照片。</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-herbal-green mb-3">4. 不可退款项目</h2>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>已使用超过 50% 的产品</li>
                                <li>收到超过 30 天的订单</li>
                                <li>促销活动中免费赠送的产品</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-herbal-green mb-3">5. 取消订阅</h2>
                            <p>您可以随时在 Dashboard 的「订阅管理」中取消订阅。取消将在下一个计费周期生效。已收取的当期费用不可退还。</p>
                        </section>
                    </div>
                </article>
            </main>
            <Footer />
        </>
    );
}
