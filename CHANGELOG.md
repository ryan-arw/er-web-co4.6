# CHANGELOG

## [V1.0.10] - 2026-03-02 02:41 till 02:45 (Antigravity Gemini 3 Pro)

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
