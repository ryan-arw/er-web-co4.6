-- 1. 为 profiles 表增加 phone 字段
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone text DEFAULT '';

-- 2. 创建或更新处理新用户的函数 (支持 OAuth 兼容性)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, phone, avatar_url, updated_at)
  VALUES (
    new.id,
    -- 优先级：full_name (常规注册) -> name (Google/Apple) -> email 前缀 (兜底)
    COALESCE(
      new.raw_user_meta_data->>'full_name', 
      new.raw_user_meta_data->>'name', 
      split_part(new.email, '@', 1)
    ),
    -- 获取手机号
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    -- 获取头像 (Google/Apple)
    COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = now();
  RETURN new;
END;
$$;

-- 3. 创建触发器 (如果不存在)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

-- 4. 补救措施：为现有用户生成 profile (以防万一有遗漏)
INSERT INTO public.profiles (id, name, phone, updated_at)
SELECT 
    id, 
    COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', split_part(email, '@', 1)),
    COALESCE(raw_user_meta_data->>'phone', ''),
    now()
FROM auth.users
ON CONFLICT (id) DO NOTHING;
