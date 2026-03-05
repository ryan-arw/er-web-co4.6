import { createClient } from '@/lib/supabase/client';
import type {
    HealthCheckin,
    DailySummary,
    SomaticLog,
    MealLog,
    ResetPlan,
    UserConfig,
    NutrientSchedule,
    UserSettings
} from './health-types';

const supabase = createClient();

/**
 * 记录一次健康动作打卡
 */
export async function logCheckin(checkin: HealthCheckin) {
    const { data, error } = await supabase
        .from('rsl_checkins')
        .insert(checkin);
    if (error) throw error;
    return data;
}

/**
 * 获取特定日期的健康摘要
 */
export async function getDailySummary(userId: string, date: string) {
    const { data, error } = await supabase
        .from('rsl_summaries')
        .select('*')
        .eq('user_id', userId)
        .eq('date', date)
        .single();
    if (error && error.code !== 'PGRST116') throw error; // PGRST116: No rows found
    return data as DailySummary | null;
}

/**
 * 更新每日摘要 (Upsert)
 */
export async function upsertDailySummary(summary: Partial<DailySummary>) {
    const { data, error } = await supabase
        .from('rsl_summaries')
        .upsert(summary, { onConflict: 'user_id,date' });
    if (error) throw error;
    return data;
}

/**
 * 获取特定日期的身体感官日志
 */
export async function getSomaticLog(userId: string, date: string) {
    const { data, error } = await supabase
        .from('rsl_somatic_logs')
        .select('*')
        .eq('user_id', userId)
        .eq('date', date)
        .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data as SomaticLog | null;
}

/**
 * 更新身体日志 (Upsert)
 */
export async function upsertSomaticLog(log: Partial<SomaticLog>) {
    const { data, error } = await supabase
        .from('rsl_somatic_logs')
        .upsert(log, { onConflict: 'user_id,date' });
    if (error) throw error;
    return data;
}

/**
 * 获取饮食日志
 */
export async function getMealLogs(userId: string, date: string) {
    const { data, error } = await supabase
        .from('rsl_meal_logs')
        .select('*')
        .eq('user_id', userId)
        .eq('date', date);
    if (error) throw error;
    return data as MealLog[];
}

/**
 * 更新饮食日志
 */
export async function upsertMealLog(log: Partial<MealLog>) {
    const { data, error } = await supabase
        .from('rsl_meal_logs')
        .upsert(log, { onConflict: 'user_id,date,meal_type' });
    if (error) throw error;
    return data;
}

/**
 * ================================================
 * 计划与设置 API
 * ================================================
 */

/**
 * 获取所有 Reset 计划
 */
export async function getResetPlans(userId: string) {
    const { data, error } = await supabase
        .from('rss_plans')
        .select('*')
        .eq('user_id', userId)
        .order('start_date', { ascending: false });
    if (error) throw error;
    return data as ResetPlan[];
}

/**
 * 更新 Reset 计划
 */
export async function upsertResetPlan(plan: Partial<ResetPlan>) {
    const { data, error } = await supabase
        .from('rss_plans')
        .upsert(plan);
    if (error) throw error;
    return data;
}

/**
 * 获取并创建/更新用户设置
 */
export async function getSettings(userId: string) {
    const { data, error } = await supabase
        .from('rss_settings')
        .select('*')
        .eq('user_id', userId)
        .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data as UserSettings | null;
}

export async function upsertSettings(settings: Partial<UserSettings>) {
    const { data, error } = await supabase
        .from('rss_settings')
        .upsert(settings);
    if (error) throw error;
    return data;
}

/**
 * 获取营养计划
 */
export async function getNutrientSchedules(userId: string) {
    const { data, error } = await supabase
        .from('rss_nutrients')
        .select('*')
        .eq('user_id', userId);
    if (error) throw error;
    return data as NutrientSchedule[];
}

/**
 * 获取历史总结数据（用于图表趋势）
 */
export async function getHealthHistory(userId: string, days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
        .from('rsl_summaries')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: true });

    if (error) throw error;
    return data as DailySummary[];
}

export async function getSomaticLogs(userId: string, days: number = 7): Promise<SomaticLog[]> {
    const { data, error } = await supabase
        .from('rsl_somatic_logs')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(days);

    if (error) {
        console.error('Error fetching somatic logs:', error);
        return [];
    }
    return data || [];
}
