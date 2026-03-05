-- ReLife Sync 结构化 Schema 迁移脚本
-- 日期: 2026-03-05
-- 说明: 创建 rsl_ (Logs) 和 rss_ (Settings) 前缀的表

-- ================================================
-- A. 健康数据表 (rsl_ 前缀)
-- ================================================

-- 1. rsl_checkins (原子打卡记录)
CREATE TABLE IF NOT EXISTS public.rsl_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    action_type TEXT NOT NULL, -- 'water', 'habit', 'nutrient', 'somatic', 'mood', 'reflection'
    task_id TEXT, -- 如 'm1', 'reset_1'
    value JSONB, -- 存储具体数值，如 250 (ml), 'Energy High' (mood)
    scheduled_at TIMESTAMPTZ, -- 计划执行时间
    checked_in_at TIMESTAMPTZ NOT NULL DEFAULT now(), -- 真实执行时间
    device_type TEXT, -- 'ios', 'android', 'web'
    source TEXT DEFAULT 'app', -- 'app', 'widget', 'notification', 'web'
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. rsl_summaries (每日聚合摘要)
CREATE TABLE IF NOT EXISTS public.rsl_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    water_intake INTEGER DEFAULT 0,
    completed_task_ids TEXT[] DEFAULT '{}',
    skipped_task_ids TEXT[] DEFAULT '{}',
    phase TEXT DEFAULT 'MAINTENANCE', -- MAINTENANCE, REALIGN, RESET, RESTORE
    cycle_day INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, date)
);

-- 3. rsl_somatic_logs (身体感知日志)
CREATE TABLE IF NOT EXISTS public.rsl_somatic_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    energy INTEGER, -- 1-5
    digestion INTEGER, -- 1-5
    sleep_quality INTEGER, -- 1-5
    lightness INTEGER, -- 1-5
    mood TEXT[] DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, date)
);

-- 4. rsl_meal_logs (饮食记录)
CREATE TABLE IF NOT EXISTS public.rsl_meal_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    meal_type TEXT NOT NULL, -- 'breakfast', 'lunch', 'dinner'
    phase_type TEXT NOT NULL, -- 'realign', 'restore'
    data JSONB DEFAULT '{}', -- 存储不同 Phase 的差异化字段
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, date, meal_type)
);

-- ================================================
-- B. 计划与设置表 (rss_ 前缀)
-- ================================================

-- 5. rss_plans (Reset 排程)
CREATE TABLE IF NOT EXISTS public.rss_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    intention TEXT, -- 'GLOW', 'GROW', 'FLOW'
    type TEXT DEFAULT 'manual', -- 'manual', 'recurring'
    realign_duration INTEGER DEFAULT 2,
    restore_duration INTEGER DEFAULT 2,
    is_stock_deducted BOOLEAN DEFAULT false,
    is_skipped BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. rss_user_configs (用户配置)
CREATE TABLE IF NOT EXISTS public.rss_user_configs (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    current_phase TEXT DEFAULT 'MAINTENANCE',
    next_reset_date DATE,
    interval_months INTEGER DEFAULT 3,
    occurrences INTEGER DEFAULT 4,
    is_configured BOOLEAN DEFAULT false,
    is_recurring BOOLEAN DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. rss_nutrients (营养计划)
CREATE TABLE IF NOT EXISTS public.rss_nutrients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    group_id TEXT,
    brand TEXT,
    name TEXT NOT NULL,
    time TEXT NOT NULL, -- 'HH:mm'
    type TEXT DEFAULT 'supplement',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. rss_settings (用户设置)
CREATE TABLE IF NOT EXISTS public.rss_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    wake_up_time TEXT DEFAULT '07:00',
    habit_settings JSONB DEFAULT '{}',
    rhythm_settings JSONB DEFAULT '{}',
    somatic_settings JSONB DEFAULT '{}',
    section_settings JSONB DEFAULT '{}',
    notification_settings JSONB DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ================================================
-- C. RLS 安全策略 & 触发器
-- ================================================

-- 启用 RLS
ALTER TABLE public.rsl_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsl_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsl_somatic_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsl_meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rss_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rss_user_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rss_nutrients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rss_settings ENABLE ROW LEVEL SECURITY;

-- 创建通用策略函数 (Owner Only)
CREATE POLICY "Users can only access their own data" ON public.rsl_checkins FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only access their own data" ON public.rsl_summaries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only access their own data" ON public.rsl_somatic_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only access their own data" ON public.rsl_meal_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only access their own data" ON public.rss_plans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only access their own data" ON public.rss_user_configs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only access their own data" ON public.rss_nutrients FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only access their own data" ON public.rss_settings FOR ALL USING (auth.uid() = user_id);

-- 自动更新 updated_at 触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_rsl_summaries_updated_at BEFORE UPDATE ON public.rsl_summaries FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_rsl_somatic_logs_updated_at BEFORE UPDATE ON public.rsl_somatic_logs FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_rsl_meal_logs_updated_at BEFORE UPDATE ON public.rsl_meal_logs FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_rss_plans_updated_at BEFORE UPDATE ON public.rss_plans FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_rss_user_configs_updated_at BEFORE UPDATE ON public.rss_user_configs FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_rss_nutrients_updated_at BEFORE UPDATE ON public.rss_nutrients FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_rss_settings_updated_at BEFORE UPDATE ON public.rss_settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
