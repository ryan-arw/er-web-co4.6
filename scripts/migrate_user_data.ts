import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// 加载环境变量
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // 使用 Service Role Key 以跳过 RLS

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrate() {
    console.log('🚀 Starting Data Migration: user_data -> Structured Tables');

    // 1. 获取所有用户数据
    const { data: allUserData, error: fetchError } = await supabase
        .from('user_data')
        .select('*');

    if (fetchError) {
        console.error('Failed to fetch user_data:', fetchError);
        return;
    }

    console.log(`Fetched ${allUserData.length} records from user_data`);

    for (const row of allUserData) {
        const { user_id, data_key, data_value } = row;

        try {
            switch (data_key) {
                case 'vitalic_history':
                    await migrateHistory(user_id, data_value);
                    break;
                case 'vitalic_scheduledResets':
                    await migratePlans(user_id, data_value);
                    break;
                case 'vitalic_userPlan':
                    await migrateUserConfig(user_id, data_value);
                    break;
                case 'vitalic_globalNutrients':
                    await migrateNutrients(user_id, data_value);
                    break;
                case 'vitalic_wakeUpTime':
                case 'vitalic_habitSettings':
                case 'vitalic_rhythmSettings':
                case 'vitalic_somaticSettings':
                case 'vitalic_sectionSettings':
                case 'vitalic_notificationSettings':
                    await migrateSetting(user_id, data_key, data_value);
                    break;
                default:
                    // 跳过未知或已由 er-web 处理的 key (如 stash)
                    break;
            }
        } catch (err) {
            console.error(`Error migrating ${data_key} for user ${user_id}:`, err);
        }
    }

    console.log('✅ Migration Finished');
}

/**
 * 迁移历史记录 (History)
 * 包含打卡、饮水、Somatic、饮食等
 */
async function migrateHistory(userId: string, history: any) {
    for (const date in history) {
        const log = history[date];

        // A. 每日摘要 (Summaries)
        await supabase.from('rsl_summaries').upsert({
            user_id: userId,
            date: date,
            water_intake: log.waterIntake || 0,
            completed_task_ids: log.completedTaskIds || [],
            skipped_task_ids: log.skippedTaskIds || [],
            // phase 和 cycle_day 需要从 context 推导，目前先设默认值
        }, { onConflict: 'user_id,date' });

        // B. 每一个打卡动作 (Checkins)
        if (log.timestamps && Array.isArray(log.timestamps)) {
            const checkins = log.timestamps.map((t: any) => ({
                user_id: userId,
                date: date,
                action_type: t.action,
                task_id: t.taskId,
                value: t.value,
                checked_in_at: t.timestamp,
                source: t.source || 'app',
                // scheduled_at 在历史数据中缺失
            }));
            await supabase.from('rsl_checkins').upsert(checkins);
        }

        // C. 身体感知 (Somatic)
        if (log.somaticLog) {
            await supabase.from('rsl_somatic_logs').upsert({
                user_id: userId,
                date: date,
                energy: log.somaticLog.energy,
                digestion: log.somaticLog.digestion,
                sleep_quality: log.somaticLog.sleepQuality,
                lightness: log.somaticLog.lightness,
                mood: log.somaticLog.mood || [],
                notes: log.somaticLog.notes
            }, { onConflict: 'user_id,date' });
        }

        // D. 饮食 (Meals)
        if (log.reAlignMeals) {
            for (const meal in log.reAlignMeals) {
                await supabase.from('rsl_meal_logs').upsert({
                    user_id: userId,
                    date: date,
                    meal_type: meal,
                    phase_type: 'realign',
                    data: log.reAlignMeals[meal]
                }, { onConflict: 'user_id,date,meal_type' });
            }
        }
        if (log.reStoreMeals) {
            for (const meal in log.reStoreMeals) {
                await supabase.from('rsl_meal_logs').upsert({
                    user_id: userId,
                    date: date,
                    meal_type: meal,
                    phase_type: 'restore',
                    data: log.reStoreMeals[meal]
                }, { onConflict: 'user_id,date,meal_type' });
            }
        }
    }
}

/**
 * 迁移计划 (Plans)
 */
async function migratePlans(userId: string, resets: any[]) {
    if (!Array.isArray(resets)) return;
    const plans = resets.map(r => ({
        id: r.id, // 沿用原有 ID 以保持引用
        user_id: userId,
        start_date: r.startDate,
        end_date: r.endDate,
        intention: r.intention,
        type: r.type || 'manual',
        realign_duration: r.realignDuration,
        restore_duration: r.restoreDuration,
        is_stock_deducted: r.isStockDeducted || false,
        is_skipped: r.isSkipped || false
    }));
    await supabase.from('rss_plans').upsert(plans);
}

/**
 * 迁移用户配置 (User Config)
 */
async function migrateUserConfig(userId: string, config: any) {
    await supabase.from('rss_user_configs').upsert({
        user_id: userId,
        current_phase: config.phase,
        next_reset_date: config.nextResetDate,
        interval_months: config.intervalMonths,
        occurrences: config.occurrences,
        is_configured: config.isConfigured,
        is_recurring: config.isRecurring
    });
}

/**
 * 迁移营养计划 (Nutrients)
 */
async function migrateNutrients(userId: string, nutrients: any[]) {
    if (!Array.isArray(nutrients)) return;
    const items = nutrients.map(n => ({
        user_id: userId,
        group_id: n.groupId,
        brand: n.brand,
        name: n.title,
        time: n.time,
        type: n.type || 'supplement'
    }));
    await supabase.from('rss_nutrients').upsert(items);
}

/**
 * 迁移设置 (Settings)
 * 由于设置是零散的，我们需要先获取现有记录再合并
 */
async function migrateSetting(userId: string, key: string, value: any) {
    const fieldMap: any = {
        'vitalic_wakeUpTime': 'wake_up_time',
        'vitalic_habitSettings': 'habit_settings',
        'vitalic_rhythmSettings': 'rhythm_settings',
        'vitalic_somaticSettings': 'somatic_settings',
        'vitalic_sectionSettings': 'section_settings',
        'vitalic_notificationSettings': 'notification_settings'
    };

    const dbField = fieldMap[key];
    if (!dbField) return;

    await supabase.from('rss_settings').upsert({
        user_id: userId,
        [dbField]: value
    });
}

migrate();
