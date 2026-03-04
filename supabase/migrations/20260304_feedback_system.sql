-- 1. 创建反馈提交表 (Feedback Submissions Table)
CREATE TABLE IF NOT EXISTS public.feedback_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    type TEXT NOT NULL, -- bug_report, feature_request, complaint, other
    description TEXT NOT NULL,
    screenshot_url TEXT,
    reference_number TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'received', -- received, reviewed, archived
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 开启 RLS
ALTER TABLE public.feedback_submissions ENABLE ROW LEVEL SECURITY;

-- 允许登录用户插入自己的反馈 (匿名也可以提交，但这里先限制登录用户以防滥用)
CREATE POLICY "Allow authenticated users to insert feedback" 
ON public.feedback_submissions 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- 允许管理员查看所有反馈 (假设 admin_roles 表管理权限)
CREATE POLICY "Allow admins to view all feedback" 
ON public.feedback_submissions 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid()));

-- 2. 创建 Storage Bucket for Screenshots
-- 插入 bucket 定义
INSERT INTO storage.buckets (id, name, public) 
VALUES ('feedback-screenshots', 'feedback-screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- 允许登录用户上传图片到该 bucket
CREATE POLICY "Allow authenticated users to upload screenshots" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
    bucket_id = 'feedback-screenshots' 
    AND auth.role() = 'authenticated'
);

-- 允许所有人查看截图 (因为 bucket 是 public 的)
CREATE POLICY "Allow anyone to view screenshots" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'feedback-screenshots');
