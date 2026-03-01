import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '隐私政策 — EzyRelife',
    description: 'EzyRelife 隐私政策。了解我们如何收集、使用和保护您的个人数据。',
};

export default function PrivacyPage() {
    return (
        <>
            <Navbar />
            <main className="pt-28 pb-20 min-h-screen">
                <article className="max-w-3xl mx-auto px-6 md:px-8">
                    <Link href="/" className="text-xs text-text-muted hover:text-herbal-green flex items-center gap-1 mb-6"><ArrowLeft size={12} /> 返回首页</Link>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-herbal-green mb-4 font-[family-name:var(--font-display)]">隐私政策</h1>
                    <p className="text-xs text-text-muted mb-8">最后更新：2026 年 3 月 1 日</p>

                    <div className="space-y-8 text-sm text-text-sub leading-relaxed">
                        <section>
                            <h2 className="text-lg font-bold text-herbal-green mb-3">1. 信息收集</h2>
                            <p>我们在您使用 EzyRelife 服务时可能收集以下信息：</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li><strong>账户信息</strong>：姓名、邮箱、电话号码</li>
                                <li><strong>交易信息</strong>：收货地址、支付记录、订单详情</li>
                                <li><strong>使用数据</strong>：浏览行为、设备信息、IP 地址</li>
                                <li><strong>健康数据</strong>：通过 ReLife Sync App 自愿提交的节律追踪数据</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-herbal-green mb-3">2. 信息使用</h2>
                            <p>我们使用收集的信息用于：</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>处理和配送您的订单</li>
                                <li>提供客户支持和账户管理</li>
                                <li>个性化您的使用体验和产品推荐</li>
                                <li>发送订单更新、产品信息和促销通知（可取消订阅）</li>
                                <li>改进我们的产品和服务</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-herbal-green mb-3">3. 信息共享</h2>
                            <p>我们不会出售您的个人信息。仅在以下情况下共享：</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li><strong>服务提供商</strong>：支付处理（Stripe）、物流配送、云托管（Vercel/Supabase）</li>
                                <li><strong>法律要求</strong>：响应合法的法律请求或保护权利</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-herbal-green mb-3">4. 数据安全</h2>
                            <p>我们采用行业标准的安全措施保护您的数据，包括 SSL/TLS 加密、安全支付处理（PCI 合规）和定期安全审计。</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-herbal-green mb-3">5. Cookie 政策</h2>
                            <p>我们使用必要的 Cookie 来确保网站正常运行，以及分析 Cookie 来改善用户体验。您可以通过浏览器设置管理 Cookie 偏好。</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-herbal-green mb-3">6. 您的权利</h2>
                            <p>您有权访问、更正或删除您的个人数据。如需行使这些权利，请联系 <a href="mailto:privacy@ezyrelife.com" className="text-warm-orange hover:underline">privacy@ezyrelife.com</a>。</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-herbal-green mb-3">7. 联系方式</h2>
                            <p>如有任何隐私相关问题，请联系我们的数据保护团队：<a href="mailto:privacy@ezyrelife.com" className="text-warm-orange hover:underline">privacy@ezyrelife.com</a></p>
                        </section>
                    </div>
                </article>
            </main>
            <Footer />
        </>
    );
}
