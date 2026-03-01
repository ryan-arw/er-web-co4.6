import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '服务条款 — EzyRelife',
    description: 'EzyRelife 服务条款。了解使用我们网站和服务的规则与条件。',
};

export default function TermsPage() {
    return (
        <>
            <Navbar />
            <main className="pt-28 pb-20 min-h-screen">
                <article className="max-w-3xl mx-auto px-6 md:px-8">
                    <Link href="/" className="text-xs text-text-muted hover:text-herbal-green flex items-center gap-1 mb-6"><ArrowLeft size={12} /> 返回首页</Link>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-herbal-green mb-4 font-[family-name:var(--font-display)]">服务条款</h1>
                    <p className="text-xs text-text-muted mb-8">最后更新：2026 年 3 月 1 日</p>

                    <div className="space-y-8 text-sm text-text-sub leading-relaxed">
                        <section>
                            <h2 className="text-lg font-bold text-herbal-green mb-3">1. 接受条款</h2>
                            <p>使用 EzyRelife 网站（ezyrelife.com）和服务即表示您同意受这些服务条款的约束。如果您不同意，请停止使用我们的服务。</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-herbal-green mb-3">2. 产品说明</h2>
                            <p>Vitalic D 是一款营养食品，旨在支持健康的生活方式。它不是药品，不用于诊断、治疗、治愈或预防任何疾病。效果因人而异。</p>
                            <p className="mt-2">如果您正在服药、怀孕、哺乳或有特殊健康状况，请在使用前咨询医疗专业人员。</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-herbal-green mb-3">3. 账户责任</h2>
                            <p>您有责任维护账户安全并对账户下的所有活动负责。如发现未经授权的使用，请立即联系我们。</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-herbal-green mb-3">4. 订单和定价</h2>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>所有价格均以美元 (USD) 标示，不含适用税费和运费</li>
                                <li>我们保留修改价格的权利，变更不影响已确认的订单</li>
                                <li>订阅定价在订阅期内保持不变，续订时可能调整</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-herbal-green mb-3">5. 知识产权</h2>
                            <p>EzyRelife、Vitalic D、ReLife Sync、3R Rhythm 等品牌名称、标志和内容均为 EzyRelife 的知识产权。未经书面许可，不得复制或分发。</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-herbal-green mb-3">6. 责任限制</h2>
                            <p>在法律允许的最大范围内，EzyRelife 不对因使用或无法使用我们的产品或服务而产生的任何间接、附带或后果性损害承担责任。</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-herbal-green mb-3">7. 适用法律</h2>
                            <p>这些条款受马来西亚法律管辖，任何争议将在马来西亚管辖法院解决。</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-herbal-green mb-3">8. 联系方式</h2>
                            <p>如有任何问题，请联系 <a href="mailto:legal@ezyrelife.com" className="text-warm-orange hover:underline">legal@ezyrelife.com</a></p>
                        </section>
                    </div>
                </article>
            </main>
            <Footer />
        </>
    );
}
