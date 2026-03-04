-- 1. 修改 screenshot_url 字段为 screenshot_urls (JSONB 类型以存数组)
-- 先重命名以防数据丢失（虽然目前还没数据）
ALTER TABLE public.feedback_submissions RENAME COLUMN screenshot_url TO screenshot_url_old;
ALTER TABLE public.feedback_submissions ADD COLUMN screenshot_urls JSONB DEFAULT '[]'::jsonb;

-- 可选：如果已经有数据，可以迁移一下（目前不需要）
-- UPDATE public.feedback_submissions SET screenshot_urls = jsonb_build_array(screenshot_url_old) WHERE screenshot_url_old IS NOT NULL;

-- 2. 删除旧字段
ALTER TABLE public.feedback_submissions DROP COLUMN screenshot_url_old;
