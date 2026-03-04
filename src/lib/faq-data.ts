export interface FAQItem {
    q: string;
    a: string;
}

export interface FAQCategory {
    category: string;
    items: FAQItem[];
}

export const FAQ_DATA: FAQCategory[] = [
    {
        category: 'Orders & Shipping',
        items: [
            {
                q: '配送需要多长时间？',
                a: '马来西亚境内通常 2-3 个工作日送达。国际配送视目的地而定，通常 5-10 个工作日。所有订阅用户享受优先配送。',
            },
            {
                q: '如何追踪我的订单？',
                a: '订单发货后，系统会通过邮件发送追踪单号。您也可以在 Dashboard -> Orders 中查看实时状态。',
            },
            {
                q: '收到产品后不满意怎么办？',
                a: '我们提供 30 天无忧退换保证。如果您对产品不满意，请提交联系中心表单并选择 "Order Issue"，我们将为您处理。',
            },
        ]
    },
    {
        category: 'Product & Usage',
        items: [
            {
                q: 'Vitalic D 适合哪些人？',
                a: '适合 18 岁以上，希望改善消化健康、提升精力、追求内在通畅的成年人。不建议孕妇、哺乳期女性或正在服用处方药物的人群在未咨询医生前使用。',
            },
            {
                q: 'ReSet 期间可以正常工作吗？',
                a: '可以！大多数用户在 ReSet 期间照常工作。Vitalic D 的配方旨在提供能量支持而非让您虚弱。建议初次使用时选择相对轻松的日程安排。',
            },
            {
                q: '多久做一次 ReSet 比较合适？',
                a: '推荐每季度（90 天）一次完整的 3 天 ReSet。日常可搭配 Vitalic D Snack 维持节律。',
            },
            {
                q: 'Vitalic D 真的有副作用吗？',
                a: 'Vitalic D 选用天然成分。初次进行深层 ReSet 的个人可能会感到轻微的排毒反应（如暂时性的腹胀），这是身体在调整。如有不适，请咨询专业人士。',
            }
        ]
    },
    {
        category: 'Subscription',
        items: [
            {
                q: '订阅可以随时取消吗？',
                a: '当然可以！订阅没有最低购买期限，您可以随时在 Dashboard 暂停或取消。需在下个配送周期前 3 天内操作。',
            },
            {
                q: '我可以更改口味或配送周期吗？',
                a: '可以。您可以在订阅管理面板中随时切换口味或调整配送频率。',
            },
        ]
    },
    {
        category: 'Account & Security',
        items: [
            {
                q: '我忘记了登录密码怎么办？',
                a: '您可以在登录页面点击 "Forgot Password" 链接，通过您的注册邮箱重置密码。',
            },
            {
                q: '如何查看我的消费记录？',
                a: '您可以前往 Dashboard 中的 "Orders" 页面查看所有历史订单。发票通常会附在发货通知邮件中。',
            }
        ]
    }
];
