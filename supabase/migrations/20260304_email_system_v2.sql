-- 20260304_email_system_v2.sql
-- 完善邮件类型：添加管理员通知，移除密码重置占位符

-- 1. 移除密码重置占位符（由于它不受代码控制）
DELETE FROM public.email_provider_settings WHERE email_type = 'password_reset_placeholder';

-- 2. 插入新的管理员通知类型
INSERT INTO public.email_provider_settings (email_type, provider, display_name)
VALUES 
    ('admin_order_notification', 'resend', '新订单提醒 (New Order Alert - Admin)'),
    ('feedback_notification', 'resend', '用户反馈提醒 (Feedback Alert - Admin)')
ON CONFLICT (email_type) DO NOTHING;

-- 3. 确保所有类型都有正确的显示名（如果是旧数据可能需要更新）
UPDATE public.email_provider_settings SET display_name = '订单确认 (Order Confirmation - Customer)' WHERE email_type = 'order_confirmation';
UPDATE public.email_provider_settings SET display_name = '发货通知 (Order Shipped - Customer)' WHERE email_type = 'order_shipped';
UPDATE public.email_provider_settings SET display_name = '联系表单提醒 (Contact Notification - Admin)' WHERE email_type = 'contact_notification';
UPDATE public.email_provider_settings SET display_name = '低库存预警 (Low Stock Alert - Admin)' WHERE email_type = 'low_stock_alert';
