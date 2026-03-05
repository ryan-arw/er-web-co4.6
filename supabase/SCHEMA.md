# EzyRelife 数据库全量技术规约 (Hardcore Schema Spec)

> **版本**: V1.4 (2026-03-05 15:45)
> **状态**: 1:1 还原云端 DDL 逻辑。新增 ReLife Sync 结构化健康管理体系 (rsl_ & rss_)。

---

## 🏗️ 数据库详细定义 (Detailed DDL Breakdown)

### 1. `addresses` (收货地址)
| 字段名 | 类型 | 约束 / 默认值 | 关系 (References) |
| :--- | :--- | :--- | :--- |
| `id` | uuid | **PK**, `gen_random_uuid()` | - |
| `user_id` | uuid | **NOT NULL** | `auth.users(id)` |
| `name` | text | - | - |
| `phone` | text | - | - |
| `line1` | text | **NOT NULL** | - |
| `line2` | text | - | - |
| `city` | text | **NOT NULL** | - |
| `state` | text | - | - |
| `postal_code` | text | - | - |
| `country` | text | **NOT NULL**, `'US'::text` | - |
| `is_default` | boolean | `false` | - |
| `created_at` | timestamptz | `now()` | - |
| `updated_at` | timestamptz | `now()` | - |

### 2. `admin_roles` (管理权限)
| 字段名 | 类型 | 约束 / 默认值 | 关系 (References) |
| :--- | :--- | :--- | :--- |
| `id` | uuid | **PK**, `gen_random_uuid()` | - |
| `user_id` | uuid | **NOT NULL**, **UNIQUE** | `auth.users(id)` |
| `role` | text | **NOT NULL**, `'operator'::text` | - |
| `created_at` | timestamptz | `now()` | - |

### 3. `audit_logs` (审计日志)
| 字段名 | 类型 | 约束 / 默认值 | 关系 (References) |
| :--- | :--- | :--- | :--- |
| `id` | uuid | **PK**, `gen_random_uuid()` | - |
| `admin_id` | uuid | **NOT NULL** | `auth.users(id)` |
| `action` | text | **NOT NULL** | - |
| `target_type` | text | - | - |
| `target_id` | text | - | - |
| `details` | jsonb | - | - |
| `created_at` | timestamptz | `now()` | - |

### 4. `contact_messages` (联系表单)
| 字段名 | 类型 | 约束 / 默认值 | 关系 (References) |
| :--- | :--- | :--- | :--- |
| `id` | uuid | **PK**, `gen_random_uuid()` | - |
| `name` | text | **NOT NULL** | - |
| `email` | text | **NOT NULL** | - |
| `subject` | text | **NOT NULL** | - |
| `message` | text | **NOT NULL** | - |
| `order_number` | text | - | - |
| `reference_number` | text | **UNIQUE** | - |
| `status` | text | `'unread'::text` | - |
| `created_at` | timestamptz | `now()` | - |

### 5. `external_orders` (第三方订单)
| 字段名 | 类型 | 约束 / 默认值 | 关系 (References) |
| :--- | :--- | :--- | :--- |
| `id` | uuid | **PK** | - |
| `user_id` | uuid | - | `auth.users(id)` |
| `platform` | text | **NOT NULL** | - |
| `external_order_id` | text | **NOT NULL** | - |
| `external_order_number`| text | - | - |
| `raw_data` | jsonb | - | - |
| `is_redeemed` | boolean | `false` | - |
| `redeemed_by_user_id` | uuid | - | `auth.users(id)` |
| `linked_order_id` | uuid | - | `public.orders(id)` |

### 6. `inventory_logs` (库存流水)
| 字段名 | 类型 | 约束 / 默认值 | 关系 (References) |
| :--- | :--- | :--- | :--- |
| `id` | uuid | **PK** | - |
| `user_id` | uuid | **NOT NULL** | `auth.users(id)` |
| `product_id` | uuid | - | `public.products(id)` |
| `delta` | integer | **NOT NULL** | - |
| `balance_after` | integer | **NOT NULL** | - |
| `order_id` | uuid | - | `public.orders(id)` |
| `external_order_id` | uuid | - | `public.external_orders(id)` |

### 7. `order_items` (订单项单)
| 字段名 | 类型 | 约束 / 默认值 | 关系 (References) |
| :--- | :--- | :--- | :--- |
| `id` | uuid | **PK** | - |
| `order_id` | uuid | - | `public.orders(id)` |
| `product_id` | uuid | - | `public.products(id)` |
| `flavor` | text | - | 口味 (Apple, Original) |
| `quantity` | integer | **NOT NULL** | - |
| `unit_price_cents` | integer | **NOT NULL** | - |
| `total_cents` | integer | **NOT NULL** | - |

### 8. `orders` (主订单系统)
| 字段名 | 类型 | 约束 / 默认值 | 关系 (References) |
| :--- | :--- | :--- | :--- |
| `id` | uuid | **PK**, `gen_random_uuid()` | - |
| `user_id` | uuid | - | `auth.users(id)` |
| `order_number` | text | **NOT NULL**, **UNIQUE** | - |
| `source` | text | **NOT NULL**, `'app'::text` | - |
| `status` | text | **NOT NULL**, `'pending'::text` | - |
| `currency` | text | `'USD'::text` | - |
| `total_cents` | integer | **NOT NULL** | - |
| `subtotal_cents` | integer | - | - |
| `payment_status` | text | `'pending'::text` | - |
| `payment_provider` | text | - | 'stripe' or 'paypal' |
| `stripe_session_id` | text | - | - |
| `guest_email` | text | - | - |
| `shipping_address` | jsonb | - | - |

### 9. `pricing_tiers` (阶梯定价)
| 字段名 | 类型 | 约束 / 默认值 | 关系 (References) |
| :--- | :--- | :--- | :--- |
| `id` | uuid | **PK** | - |
| `product_id` | uuid | - | `public.products(id)` |
| `min_quantity` | integer | **NOT NULL** | - |
| `price_cents` | integer | **NOT NULL** | - |
| `currency` | text | `'USD'::text` | - |

### 10. `products` (产品信息)
| 字段名 | 类型 | 约束 / 默认值 | 关系 (References) |
| :--- | :--- | :--- | :--- |
| `id` | uuid | **PK** | - |
| `name` | text | **NOT NULL** | - |
| `sku` | text | **UNIQUE** | - |
| `base_price_cents` | integer | **NOT NULL** | - |
| `currency` | text | `'USD'::text` | - |
| `is_active` | boolean | `true` | - |

### 11. `profiles` (用户详情)
| 字段名 | 类型 | 约束 / 默认值 | 关系 (References) |
| :--- | :--- | :--- | :--- |
| `id` | uuid | **PK**, **FK** | `auth.users(id)` |
| `name` | text | `''::text` | 用户姓名 / 昵称 (来自 metadata 或手动输入) |
| `phone` | text | `''::text` | 账户主手机号 (来自 metadata 或手动输入) |
| `rhythm_id` | text | `''::text` | - |
| `avatar_url` | text | `''::text` | - |
| `updated_at` | timestamptz | `now()` | - |


### 12. `subscriptions` (订阅计划)
| 字段名 | 类型 | 约束 / 默认值 | 关系 (References) |
| :--- | :--- | :--- | :--- |
| `id` | uuid | **PK** | - |
| `user_id` | uuid | **NOT NULL** | `auth.users(id)` |
| `product_id` | uuid | - | `public.products(id)` |
| `stripe_subscription_id`| text | **UNIQUE** | - |
| `status` | text | **NOT NULL**, `'active'::text` | - |
| `quantity` | integer | `1` | - |
| `lead_days` | integer | `10` | - |

### 13. `user_data` (底层扩展数据)
| 字段名 | 类型 | 约束 / 默认值 | 关系 (References) |
| :--- | :--- | :--- | :--- |
| `id` | bigint | **PK**, `nextval(...)` | - |
| `user_id` | uuid | **NOT NULL** | `auth.users(id)` |
| `data_key` | text | **NOT NULL** | - |
| `data_value` | jsonb | `'{}'::jsonb` | - |

### 14. `feedback_submissions` (用户反馈)
| 字段名 | 类型 | 约束 / 默认值 | 关系 (References) |
| :--- | :--- | :--- | :--- |
| `id` | uuid | **PK**, `gen_random_uuid()` | - |
| `user_id` | uuid | - | `auth.users(id)` |
| `type` | text | **NOT NULL** | - |
| `description` | text | **NOT NULL** | - |
| `screenshot_urls` | jsonb | - | 存储多个截图 URL (数组) |
| `reference_number` | text | **UNIQUE** | - |
| `status` | text | `'received'::text` | - |
| `metadata` | jsonb | `'{}'::jsonb` | - |
| `created_at` | timestamptz | `now()` | - |

### 15. `email_provider_settings` (邮件发送配置)
| 字段名 | 类型 | 约束 / 默认值 | 关系 (References) |
| :--- | :--- | :--- | :--- |
| `id` | uuid | **PK**, `gen_random_uuid()` | - |
| `email_type` | text | **UNIQUE**, **NOT NULL** | 唯一标识 (如 order_confirmation) |
| `provider` | text | **NOT NULL** | `resend`, `hostgator_smtp`, `off` |
| `display_name` | text | **NOT NULL** | 后台显示名 |
| `is_enabled` | boolean | `true` | 是否全局开启 |
| `updated_at` | timestamptz | `now()` | - |
| `updated_by` | uuid | - | `auth.users(id)` |

### 16. `email_logs` (邮件审计日志)
| 字段名 | 类型 | 约束 / 默认值 | 关系 (References) |
| :--- | :--- | :--- | :--- |
| `id` | uuid | **PK**, `gen_random_uuid()` | - |
| `email_type` | text | **NOT NULL** | 对应邮件类型 |
| `provider` | text | **NOT NULL** | 实际发送通道 |
| `to_email` | text | **NOT NULL** | 收件地址 |
| `subject` | text | - | 邮件标题 |
| `status` | text | **NOT NULL** | `sent`, `failed` |
| `error_message` | text | - | 错误详情 |
| `metadata` | jsonb | `'{}'::jsonb` | 业务关联 ID (如 order_id) |
| `created_at` | timestamptz | `now()` | - |

### 17. `rsl_checkins` (健康打卡记录)
| 字段名 | 类型 | 约束 / 默认值 | 关系 (References) |
| :--- | :--- | :--- | :--- |
| `id` | uuid | **PK**, `gen_random_uuid()` | - |
| `user_id` | uuid | **NOT NULL** | `auth.users(id)` |
| `date` | date | **NOT NULL** | 业务日期 |
| `action_type` | text | **NOT NULL** | water, habit, nutrient, somatic, mood, reflection |
| `task_id` | text | - | 关联任务 ID (如 m1, reset_1) |
| `value` | jsonb | - | 具体数值 (ml, mood tag 等) |
| `scheduled_at` | timestamptz | - | 计划执行时间 |
| `checked_in_at`| timestamptz | `now()` | 真实执行时间 |
| `device_type` | text | - | ios, android, web |
| `source` | text | `'app'::text` | app, widget, notification, web |
| `created_at` | timestamptz | `now()` | - |

### 18. `rsl_summaries` (每日聚合摘要)
| 字段名 | 类型 | 约束 / 默认值 | 关系 (References) |
| :--- | :--- | :--- | :--- |
| `id` | uuid | **PK** | - |
| `user_id` | uuid | **NOT NULL** | `auth.users(id)` |
| `date` | date | **NOT NULL** | **UNIQUE** (with user_id) |
| `water_intake` | integer | `0` | 当日饮水总量 |
| `completed_task_ids`| text[] | `'{}'::text[]` | 已完成任务数组 |
| `skipped_task_ids` | text[]| `'{}'::text[]` | 已跳过任务数组 |
| `phase` | text | `'MAINTENANCE'`| 所属阶段 |
| `cycle_day` | integer | `0` | 阶段进程序号 |
| `updated_at` | timestamptz | `now()` | - |

### 19. `rsl_somatic_logs` (身体感知日志)
| 字段名 | 类型 | 约束 / 默认值 | 关系 (References) |
| :--- | :--- | :--- | :--- |
| `id` | uuid | **PK** | - |
| `user_id` | uuid | **NOT NULL** | `auth.users(id)` |
| `date` | date | **NOT NULL** | **UNIQUE** (with user_id) |
| `energy` | integer | - | 1-5 |
| `digestion` | integer | - | 1-5 |
| `sleep_quality`| integer | - | 1-5 |
| `lightness` | integer | - | 1-5 |
| `mood` | text[] | `'{}'::text[]` | 心情标签数组 |
| `notes` | text | - | 自由随笔 |
| `updated_at` | timestamptz | `now()` | - |

### 20. `rsl_meal_logs` (饮食记录)
| 字段名 | 类型 | 约束 / 默认值 | 关系 (References) |
| :--- | :--- | :--- | :--- |
| `id` | uuid | **PK** | - |
| `user_id` | uuid | **NOT NULL** | `auth.users(id)` |
| `date` | date | **NOT NULL** | **UNIQUE** (with user_id, meal_type) |
| `meal_type` | text | **NOT NULL** | breakfast, lunch, dinner |
| `phase_type` | text | **NOT NULL** | realign, restore |
| `data` | jsonb | `'{}'::jsonb` | 差异化饮食数据 |
| `updated_at` | timestamptz | `now()` | - |

### 21. `rss_plans` (Reset 排程)
| 字段名 | 类型 | 约束 / 默认值 | 关系 (References) |
| :--- | :--- | :--- | :--- |
| `id` | uuid | **PK** | - |
| `user_id` | uuid | **NOT NULL** | `auth.users(id)` |
| `start_date` | date | **NOT NULL** | - |
| `end_date` | date | **NOT NULL** | - |
| `intention` | text | - | GLOW, GROW, FLOW |
| `type` | text | `'manual'` | manual, recurring |
| `realign_duration`| integer | `2` | - |
| `restore_duration`| integer | `2` | - |
| `is_stock_deducted`| boolean | `false` | 是否已预扣库存 |
| `is_skipped` | boolean | `false` | 是否已跳过 |
| `updated_at` | timestamptz | `now()` | - |

### 22. `rss_user_configs` (用户节律配置)
| 字段名 | 类型 | 约束 / 默认值 | 关系 (References) |
| :--- | :--- | :--- | :--- |
| `user_id` | uuid | **PK** | `auth.users(id)` |
| `current_phase` | text | `'MAINTENANCE'` | - |
| `next_reset_date`| date | - | - |
| `interval_months`| integer | `3` | - |
| `occurrences` | integer | `4` | - |
| `is_configured` | boolean | `false` | - |
| `is_recurring` | boolean | `false` | - |
| `updated_at` | timestamptz | `now()` | - |

### 23. `rss_nutrients` (营养补充计划)
| 字段名 | 类型 | 约束 / 默认值 | 关系 (References) |
| :--- | :--- | :--- | :--- |
| `id` | uuid | **PK** | - |
| `user_id` | uuid | **NOT NULL** | `auth.users(id)` |
| `group_id` | text | - | 关联组 ID |
| `brand` | text | - | 品牌名 |
| `name` | text | **NOT NULL** | 产品名 |
| `time` | text | **NOT NULL** | HH:mm |
| `type` | text | `'supplement'` | - |
| `updated_at` | timestamptz | `now()` | - |

### 24. `rss_settings` (个性化设置)
| 字段名 | 类型 | 约束 / 默认值 | 关系 (References) |
| :--- | :--- | :--- | :--- |
| `user_id` | uuid | **PK** | `auth.users(id)` |
| `wake_up_time` | text | `'07:00'` | - |
| `habit_settings` | jsonb | `'{}'::jsonb` | - |
| `rhythm_settings` | jsonb | `'{}'::jsonb` | - |
| `somatic_settings` | jsonb | `'{}'::jsonb` | - |
| `section_settings`| jsonb | `'{}'::jsonb` | - |
| `notification_settings`| jsonb | `'{}'::jsonb` | 仅移动端持久化参考 |
| `updated_at` | timestamptz | `now()` | - |

---

## 📦 存储资源 (Storage Buckets)

### 1. `feedback-screenshots`
- **用途**: 存储用户提交的 Bug 报告或建议截图。
- **限制**: 允许每条反馈上传最多 3 张压缩后的图片。
- **权限**: 开放只读，仅限认证用户上传。
- **关联**: `feedback_submissions(screenshot_urls)`

---

## 🔒 约束与防护逻辑 (Data Integrity)
- **级联保护**: 大多数外键指向 `auth.users`。在删除用户时，由于数据库存在 `Foreign Key Constraint`，默认会阻止删除以保护业务数据（No Action / Restrict），除非显式设置为 `CASCADE`。
- **并发控制**: 关键业务通过 `updated_at` 触发器（如有）或前端 Optimistic UI 结合事务处理。
- **唯一性标识**: 订单系统全线使用 `order_number` 为外部唯一引用，防止接口重复提交订单。
