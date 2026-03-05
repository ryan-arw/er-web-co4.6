-- 20260304_email_system.sql
-- 邮件双系统架构迁移文件

-- 1. 创建邮件通道设置表
CREATE TABLE IF NOT EXISTS public.email_provider_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email_type TEXT UNIQUE NOT NULL, -- 'order_confirmation', 'order_shipped', 'contact_notification', etc.
    provider TEXT NOT NULL CHECK (provider IN ('resend', 'hostgator_smtp', 'off')),
    display_name TEXT NOT NULL,
    is_enabled BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT now(),
    updated_by UUID REFERENCES auth.users(id)
);

-- 2. 创建邮件审计日志表
CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email_type TEXT NOT NULL,
    provider TEXT NOT NULL,
    to_email TEXT NOT NULL,
    subject TEXT,
    status TEXT NOT NULL CHECK (status IN ('sent', 'failed')),
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. 初始种子数据
INSERT INTO public.email_provider_settings (email_type, provider, display_name)
VALUES 
    ('order_confirmation', 'resend', '订单确认 (Order Confirmation)'),
    ('order_shipped', 'resend', '发货通知 (Order Shipped)'),
    ('contact_notification', 'resend', '联系表单通知 (Contact Notification)'),
    ('password_reset_placeholder', 'off', '密码重置 (Password Reset - App Controlled)'),
    ('low_stock_alert', 'resend', '低库存预警 (Low Stock Alert)')
ON CONFLICT (email_type) DO NOTHING;

-- 4. RLS 策略 (Row Level Security)
ALTER TABLE public.email_provider_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- 仅限管理员读写设置
CREATE POLICY "Admins can manage email settings" ON public.email_provider_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_roles 
            WHERE user_id = auth.uid()
        )
    );

-- 允许所有认证用户读取设置 (以便后端接口调用)
CREATE POLICY "Authenticated users can preview email settings" ON public.email_provider_settings
    FOR SELECT USING (auth.role() = 'authenticated');

-- 仅限管理员查看日志
CREATE POLICY "Admins can view email logs" ON public.email_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admin_roles 
            WHERE user_id = auth.uid()
        )
    );
