# CHANGELOG

## [V1.0.20] - 2026-03-03 18:15 till 18:17 (Gemini 3 Flash)

- **变更叙述**：优化了未支付订单的处理流程与用户引导。
  - **状态语义化**：将订单状态“待确认”更名为“待付款”，使其更直观地体现支付状态。
  - **新增支付重试功能**：针对付款不成功或中途退出的订单，用户现在可以在“我的订单”详情页点击新增的“立即支付”按钮，快速重新发起 Stripe 支付流程。
  - **支付链路打通**：实现了通过后端接口为现有订单重新生成支付 Session 的逻辑，确保用户无需重新下单即可完成购买。


## [V1.0.19] - 2026-03-03 18:05 till 18:10 (Gemini 3 Flash)

- **变更叙述**：全面升级了“我的订单”管理系统与数据记录完整性。
  - **订单详情增强**：修复了订单项显示为“未知产品”的 Bug。现在每一项订单都会精准记录对应的口味（原味/苹果）及产品 ID。
  - **信息展示更齐全**：在用户控制面板（Dashboard）的订单详情中，新增了“寄送详情（联系人、地址）”和“支付摘要（支付方式、总额明细）”展示。
  - **UI/UX 优化**：订单项现在包含产品缩略图和口味标签，提升了视觉识别度。
  - **数据一致性修复**：同步更新了 Stripe 和 PayPal 的后端录入逻辑，确保所有新订单的商品详情（口味、子单位数量）完美落库。


## [V1.0.18] - 2026-03-03 17:55 till 18:00 (Gemini 3 Flash)

- **变更叙述**：实现了全自动阶梯定价与购物车智能化整合。
  - **动态阶梯定价**：现在系统会根据购物车中所有口味的“总盒数”自动应用折扣。1盒($145)、2盒($130.5/盒)、3盒+($121/盒)。不仅限于预设套装，手动添加多个单盒也会自动激活双盒/三盒优惠。
  - **购物车归一化**：移除了冗余的“套装(Tier)”概念，购物车改为按“口味”进行归类统计。修复了 Checkout 页面中因口味重复导致的 React Key 冲突（列表渲染错误）。
  - **UI 透明度提升**：在购物车和结算预览中增加了“当前对应单价”的明细展示，用户能清晰感知到买得越多单价越低。
  - **结算稳定性**：修复了支付接口在处理混合口味时的逻辑冲突。


## [V1.0.17] - 2026-03-03 17:40 till 17:55 (Gemini 3 Flash)

- **变更叙述**：重构了产品展示逻辑与库存管理体系。
  - **产品页整合**：将“原味”与“苹果味”整合至统一的 Vitalic D 详情页，支持快捷口味切换，不再区分独立页面。
  - **购物车逻辑修复**：通过底层 `localStorage` 强制清除机制，彻底解决了支付成功后购物车余量未清空的 Bug。
  - **库存 SKU 对齐**：优化了后端订单记录逻辑。现在 1 套（如三盒装）将按照“三倍数量 + 捆绑均价”记录，确保库存系统能精准按“盒”统计，解决了套装 SKU 难以拆解核销的问题。


## [V1.0.16] - 2026-03-03 17:20 till 17:22 (Gemini 3 Flash)

- **变更叙述**：解决了本地开发环境下的 Stripe 支付状态同步问题。
  - **同步验证机制**：针对 Localhost 无法接收 Webhook 的局限，新增了 `verify-session` 主动验证逻辑。
  - **Success 页面增强**：支付后跳转回成功页时自动触发状态对账，确保本地测试也能实时看到订单从“待确认”转为“处理中”。


## [V1.0.15] - 2026-03-03 17:10 till 17:15 (Gemini 3 Flash)

- **变更叙述**：修复了 Stripe API 版本不匹配问题。
  - **核心修复**：从 SDK 初始化中移除了硬编码的 API 版本，改为使用账户默认稳定版本，确保了与各种年限 Stripe 账户的兼容性。
  - **测试准备**：提供了配套的 Stripe 和 PayPal 测试凭据说明。


## [V1.0.14] - 2026-03-03 16:53 till 16:55 (Gemini 3 Flash)

- **变更叙述**：修复了登录状态下的 UI 交互与数据同步问题。
  - **导航栏优化**：导航栏现能正确感知登录状态。已登录用户将看到“控制面板”入口与登出图标，取代原有的“登入”按钮。
  - **Checkout 数据修复**：修复了登录用户在结算页 Email 字段显示为空的 Bug，现在系统能正确预填该字段且在选择地址时保持不变。
  - **代码鲁棒性**：通过函数式状态更新（Functional State Updates）解决了 React 状态更新异步导致的数据覆盖问题。


## [V1.0.13] - 2026-03-03 16:35 till 16:45 (Gemini 3 Flash)

- **变更叙述**：优化了结账逻辑与数据库兼容性。
  - **数据库安全更新**：修正了 `orders` 表的 RLS 与字段约束，解除 `user_id` 非空限制以支持游客结账。
  - **订单全追踪**：强化了 Stripe/PayPal API，实现订单主表与商品明细表（Order Items）的同步写入。
  - **订单号规范化**：由 UUID 升级为品牌化格式（如 ER-YYYYMMDD-XXXX）。
  - **UI 体验微调**：默认启用“游客自动注册”选项，优化转化效率。


## [V1.0.12] - 2026-03-03 15:15 till 15:32 (Gemini 3 Flash)

- **变更叙述**：全面集成 Stripe 和 PayPal 支付网关，支持全球市场（US, UK, AU, SG）。
  - **后端集成**：实现了 Stripe Checkout Session 与 Webhook 验证，以及 PayPal Orders API (Create/Capture) 链路。
  - **结算流程重构**：将 `checkout/page.tsx` 完全英语化，支持游客结账（Guest Checkout）及一键注册功能。
  - **地址管理集成**：已登录用户可直接从保存的地址列表中选择，无需重复输入。
  - **数据库增强**：扩展了 `orders` 表架构，新增支付状态追踪、第三方交易 ID 及游客邮箱字段。
  - **反馈页面**：创建了品牌视觉一致的支付成功 (`/checkout/success`) 与取消 (`/checkout/cancel`) 响应页面。


## [V1.0.11] - 2026-03-03 13:50 till 13:56 (Gemini 3 Pro High)

- **变更叙述**：修复了订单中心页面在遇到异常订单状态时导致页面崩溃的问题。
  - 增强了 `statusConfig` 数据消费的安全性，新增了未知状态的自动兜底机制（Fallback）。
  - 优化了状态标签的渲染逻辑，确保数据库返回变动时前端页面的稳定性。


## [V1.0.10] - 2026-03-02 02:41 till 02:43 (Gemini 3 Flash)

- **变更叙述**：完成 GitHub 远程仓库连接与首次代码推送。
  - 构建了 `er-web-co4.6` 的独立 Git 仓库系统。
  - 连接至远程仓库 `https://github.com/ryan-arw/er-web-co4.6.git`。
  - 自动化版本号递增并完成首次代码同步。

## [V1.0.9] - 2026-03-01 21:10 till 21:14 (Gemini 3 Flash)

- **核心变更叙述**：全站仪表盘数据动态化集成。将静态占位内容彻底替换为来自 Supabase 的实时业务数据，打通了用户中心的全部核心链路。
  - **仪表盘概览 (Overview)**：通过服务端并行数据拉取，实时聚合并展示用户的总订单数、活跃订阅数、当前库存余量及收货地址总计。
  - **我的订单 (Orders)**：完整接入 `orders` 与 `order_items` 表，支持根据订单状态及订单号进行多维筛选与搜索，并实现了订单项的展开详情视图。
  - **订阅管理 (Subscriptions)**：连接 `subscriptions` 及 `products` 表，支持展示活跃方案、自动续约状态及首选配送周期。若无订阅，则自动引导至订阅计划区。
  - **地址管理 (Addresses)**：实现了完整的地址管理中台，支持地址的新增、删除、一键设为默认值，所有操作均实时同步至数据库。
  - **我的库存 (Stash)**：基于 `inventory_logs` 表实时计算并展示各产品的结余库存量，新增了低库存自动预警机制（AlertCircle）。
  - **账户设置 (Settings)**：深度同步 Supabase Auth 的元数据（Metadata）与 `profiles` 业务表，确保姓名、手机、邮箱等资料的实时更新与一致性。
- **技术优化与 UX**：
  - **加载态感知 (Loading UI)**：在所有数据加载过程中新增了极致细腻的骨架屏（Skeleton）与加载波纹 (Ripple Loaders)，消除数据拉取时的视觉卡顿感。
  - **类型安全 (Type Safety)**：修复了由于数据解构导致的 TypeScript 隐式 any 错误，增强了代码的鲁棒性。

## [V1.0.8] - 2026-03-01 21:13 till 21:20 (Gemini 3 Flash)

### 全站功能修复与体验极致优化

- **核心功能修复**：
  - **产品详情页购物车集成**：彻底接入 `CartContext`，实现「加入购物车」与「立即购买」业务逻辑，关联正确的 `tier` 与定价体系。
  - **首页转化链路修复**：将首页产品区的静态按钮改为跳转至对应详情页的 `Link`，确保极速转化。
- **博客系统对齐修复**：同步了博客列表页 (`/blog`) 与详情页 (`/blog/[slug]`) 的文章 Slug，彻底解决了点击部分文章显示「文章未找到」的死链接问题。
- **内容完整性补全**：补齐了缺失的 4 篇博客文章内容（晨间仪式、营养科学、肠道纤维、品牌哲学）。
  - **Footer 链接纠错**：修复了 `/faq` 为锚点链接 `/#faq`，并将 `/contact` 升级为品牌邮件直连。
- **极致用户体验 (UX)**：
  - **全站品牌骨架屏 (Skeleton)**：为 Dashboard、Blog、Products 页面新增 `loading.tsx` 同步加载状态，使用高度定制的骨架屏提升数据获取时的视觉感知。
  - **入柜成功反馈 (Toast)**：新增「已添加到购物车」动态通知组件，包含入场动画与快捷查看入口。
  - **自定义 404 页面**：创建了富有节律感且带交互 Logo 的 404 页面，确保用户迷失时能获得品牌温情指引。
- **页面架构优化**：
  - 将全站 Hero 区的旧有内锚点（#products, #how-it-works）升级为跨页面精准导航链接，提升 SEO 链路权重与导航效率。

## [V1.0.7] - 2026-03-01 19:13 till 19:25 (Claude Opus 4.6)

### Phase 7: 动画优化 + 响应式设计

  - **共享动画组件库**：创建 `components/shared/Animations.tsx` — fadeUp/fadeIn/scaleIn/slideInLeft/slideInRight 变体 + staggerContainer/staggerItem + AnimatedSection（滚动触发）+ AnimatedDiv + PageTransition（页面过渡）+ HoverScale + AnimatedCounter
  - **Logo 动态交互**：创建 `components/shared/AnimatedLogo.tsx` — hover 触发光晕扩散 + 脉冲环循环 + 3 个旋转轨道粒子 + Logo 微晃动效果。已集成到 Navbar
  - **回到顶部按钮**：创建 `components/shared/ScrollToTop.tsx` — 滚动超过 400px 后显示 + 入场/离场动画 + hover 缩放。已集成到根布局
  - **全局 CSS 动画增强**：`globals.css` 新增 link-underline（下划线动画）、card-hover（卡片提升阴影）、gradient-text-animated（渐变文字动画）、focus-ring（无障碍焦点环）、自定义滚动条样式
  - **响应式优化**：移动端 section-gap 间距缩减、所有页面使用 grid/flex 响应式布局

## [V1.0.6] - 2026-03-01 18:56 till 19:10 (Claude Opus 4.6)

### Phase 6: Blog + 法律页 + SEO

  - **Blog 列表页**：创建 `blog/page.tsx` — 6 篇示范文章卡片（封面图+标题+摘要+日期+阅读时间）+ 分类筛选（全部/核心科学/使用指南/科学洞察/生活方式/品牌故事）+ Newsletter CTA
  - **Blog 详情页**：创建 `blog/[slug]/page.tsx` — 动态路由 + 面包屑 + 作者/日期/阅读时间 + 封面图 + Markdown-like 内容渲染 + 分享按钮 + 产品 CTA。含 2 篇完整文章
  - **隐私政策**：创建 `privacy/page.tsx` — 7 个章节（信息收集/使用/共享/安全/Cookie/权利/联系方式）
  - **服务条款**：创建 `terms/page.tsx` — 8 个章节（接受条款/产品说明/账户责任/定价/知识产权/责任限制/适用法律/联系方式）
  - **退款政策**：创建 `refund-policy/page.tsx` — 30 天无忧保证横幅 + 5 个章节（退款资格/流程/换货/不可退款/取消订阅）
  - **配送政策**：创建 `shipping/page.tsx` — 3 张速览卡片 + 5 个章节（配送范围/时间费用表格/订单追踪/订阅配送/包装）
  - **SEO 元数据**：Blog 列表页、所有法律页面均含独立的 `Metadata` 导出（title + description）

## [V1.0.5] - 2026-03-01 18:43 till 18:50 (Claude Opus 4.6)

### Phase 5: 购物车 + 结算 + Stripe

  - **购物车上下文**：创建 `contexts/CartContext.tsx` — Context + localStorage 持久化、添加/删除/更新数量/清空、总数+总价计算、迷你购物车开关状态
  - **迷你购物车面板**：创建 `components/shared/MiniCart.tsx` — 从右侧滑入面板（商品列表+数量调节+删除+小计+结算按钮+空状态）
  - **购物车页面**：创建 `cart/page.tsx` — 完整购物车列表（产品图+数量调节+单价+小计）+ 订单摘要侧边栏（小计/配送免费/合计/结算按钮/SSL 安全标识）+ 空状态引导
  - **结算页面**：创建 `checkout/page.tsx` — 两步结算流程（配送信息表单 → 支付卡片表单）+ 进度指示器 + 配送摘要 + 订单侧边栏 + Stripe 安全支付占位
  - **订单确认页**：创建 `checkout/success/page.tsx` — 成功图标+订单号 + 下一步时间线（处理中→发货→下载App）+ 快捷链接 + 订阅推广
  - **Navbar 更新**：购物车图标（带数量徽章）+ 导航链接改为实际页面路由 + 集成 MiniCart 面板
  - **根布局更新**：`layout.tsx` 包裹 CartProvider 使购物车状态全站可用

## [V1.0.4] - 2026-03-01 18:30 till 18:36 （Claude Opus 4.6)

### Phase 4: Dashboard 功能页面

  - **订单管理**：创建 `dashboard/orders/page.tsx` — 搜索框 + 5 种状态筛选 + 可展开订单卡片（订单号/日期/状态徽章/商品明细/物流追踪）+ 空状态引导
  - **订阅管理**：创建 `dashboard/subscriptions/page.tsx` — 空状态推广（月度 $130.50 省 10% / 季度 $108.90 省 25% 双计划对比）+ 订阅须知
  - **库存展示**：创建 `dashboard/stash/page.tsx` — 3 个汇总统计卡（总库存/可 ReSet 次数/预计可用期）+ 库存明细（产品图/购入日期/有效期）+ 低库存警告
  - **地址管理**：创建 `dashboard/addresses/page.tsx` — 地址卡片（默认标记/家·办公室类别/编辑/删除/设为默认）+ 添加新地址模态框表单
  - **账户设置**：创建 `dashboard/settings/page.tsx` — 个人信息编辑 + 密码修改（含验证反馈）+ 通知偏好 4 项开关 + 语言偏好下拉 + 危险区域（账户删除）
  - **帮助与支持**：创建 `dashboard/help/page.tsx` — 3 种联系方式（邮件/在线聊天/WhatsApp）+ 响应时间提示 + 6 条 FAQ 可折叠 + 更多资源链接

## [V1.0.3] - 2026-03-01 18:05 till 18:15 (Claude Opus 4.6)

### Phase 3: 认证系统 + Dashboard 框架

  - **Supabase SSR 基础设施**：创建 `lib/supabase/client.ts`（浏览器端）、`server.ts`（服务器端）、`middleware.ts`（会话更新 + 路由保护：未登录访问 /dashboard 重定向到 /login，已登录跳过 auth 页面）
  - **中间件入口**：创建 `src/middleware.ts`（Next.js 中间件，排除静态资源）
  - **OAuth 回调**：创建 `auth/callback/route.ts`（code → session 交换 + 重定向）
  - **登入页面**：创建 `(auth)/login/page.tsx`（左侧品牌装饰面板 + 右侧表单：邮箱/密码/密码可见切换/加载状态/错误提示/忘记密码链接）
  - **注册页面**：创建 `(auth)/register/page.tsx`（姓名/邮箱/密码表单 + 验证邮件发送成功状态）
  - **Dashboard Shell**：创建 `components/dashboard/DashboardShell.tsx`（固定侧边栏 7 个导航项 + 移动端抽屉式菜单 + Glassmorphism Header + 通知铃铛 + 用户下拉菜单 + 登出）
  - **Dashboard 布局**：创建 `dashboard/layout.tsx`（Server Component：验证用户会话 + 获取 profile 数据）
  - **Dashboard 概览**：创建 `dashboard/page.tsx`（欢迎消息 + 4 个统计卡片 + 3 个快捷操作 + ReSet 推广 CTA）

## [V1.0.2] - 2026-03-01 17:42 till 17:51 (Claude Opus 4.6)

### Phase 2: 产品页 + How It Works + About

  - **How It Works 页面**：创建 `how-it-works/page.tsx`（6 模块）：3R 焕新节律完整时间线（含行动项和贴士）、5 点校准法可视化时间轴、ReLife 代谢方程式深入解析（四步机制 + 真理）、ReLife Sync App 数字副驾驶、品质与安全承诺（GMP/SGS/HACCP/ISO 认证 + 清洁标签）
  - **About Us 页面**：创建 `about/page.tsx`（6 模块）：品牌宣言 Hero、核心信仰（协作而非对抗）、RIFE 四大价值观卡片、愿景与使命双栏、目标用户画像（4 类人群）、品牌誓言 CTA
  - **产品列表页**：创建 `products/page.tsx`（5 模块）：产品 Hero、开箱内容（Snack/Meal1/Meal2 三栏）、双产品卡片（Original + Apple）、阶梯定价表（$145/$130.50/$121）、订阅计划推广（再省 10%）、信任徽章
  - **产品详情页**：创建 `products/[slug]/page.tsx`（动态路由）：面包屑导航、产品大图、阶梯价选择器（单选按钮）、数量调节器、总价实时计算、加入购物车/立即购买双按钮、包装内容表、核心成分表（8 种）、用户评价卡片、CTA

## [V1.0.1] - 2026-03-01 17:00 till 17:30 (Claude Opus 4.6)

### Phase 1: 项目初始化 + 设计系统 + 首页

  - **项目初始化**：使用 Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 初始化 er-web-co4.6 项目
  - **品牌设计系统**：基于 4 份品牌文档创建完整的 `globals.css` 设计系统，包含品牌色板（活力橙/清晨绿/象牙白/深植绿）、Bio-Rhythmic 动画系统、Glassmorphism、CTA 按钮和渐变系统
  - **导航栏**：创建响应式 Navbar 组件（Glassmorphism 滚动效果 + 移动端汉堡菜单 + Logo 动画）
  - **首页 Landing Page**：创建完整的 9 模块首页（中文版）：
    - Hero Section（品牌标语 + 双 CTA + 产品图 + 信任徽章）
    - 品牌哲学（协作/校准/长期 三张卡片）
    - 3R 焕新节律（ReAlign → ReSet → ReStore 时间线）
    - 核心科技（Cleanse/Nourish/Repair/Glow 方程式）
    - 产品展示（Original + Apple 双栏定价卡 $145/$130.50/$121）
    - ReLife Sync App 介绍（数字副驾驶）
    - 用户评价（3 条真实反馈卡片）
    - FAQ 可展开问答（5 个常见问题）
    - 最终 CTA + 品牌口号
  - **页脚**：创建完整 Footer（Newsletter 订阅 + 分类链接 + 社交媒体 + 品牌宣言）
  - **依赖安装**：framer-motion、@supabase/supabase-js、@supabase/ssr、lucide-react
