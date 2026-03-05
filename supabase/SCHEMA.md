# EzyRelife 数据库全量技术规约 (Hardcore Schema Spec)

> **版本**: V1.3 (2026-03-04 23:15)
> **状态**: 1:1 还原云端 DDL 逻辑。新增 Email Dual Gateway 模块。

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
