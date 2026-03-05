// 共享健康数据类型定义 (Unified Health Types)

export enum HealthPhase {
    MAINTENANCE = 'MAINTENANCE',
    REALIGN = 'REALIGN',
    RESET = 'RESET',
    RESTORE = 'RESTORE'
}

export type HealthActionType = 'water' | 'habit' | 'nutrient' | 'somatic' | 'mood' | 'reflection';

export interface HealthCheckin {
    id?: string;
    user_id: string;
    date: string; // YYYY-MM-DD
    action_type: HealthActionType;
    task_id?: string;
    value?: any;
    scheduled_at?: string; // ISO String
    checked_in_at?: string; // ISO String
    device_type?: string;
    source?: string;
    created_at?: string;
}

export interface DailySummary {
    user_id: string;
    date: string;
    water_intake: number;
    completed_task_ids: string[];
    skipped_task_ids: string[];
    phase: HealthPhase;
    cycle_day: number;
    updated_at?: string;
}

export interface SomaticLog {
    user_id: string;
    date: string;
    energy?: number;
    digestion?: number;
    sleep_quality?: number;
    lightness?: number;
    mood: string[];
    notes?: string;
    updated_at?: string;
}

export interface MealLog {
    user_id: string;
    date: string;
    meal_type: 'breakfast' | 'lunch' | 'dinner';
    phase_type: 'realign' | 'restore';
    data: any; // JSONB
    updated_at?: string;
}

export interface ResetPlan {
    id?: string;
    user_id: string;
    start_date: string;
    end_date: string;
    intention?: string;
    type?: 'manual' | 'recurring';
    realign_duration: number;
    restore_duration: number;
    is_stock_deducted: boolean;
    is_skipped: boolean;
    updated_at?: string;
}

export interface UserConfig {
    user_id: string;
    current_phase: HealthPhase;
    next_reset_date?: string;
    interval_months: number;
    occurrences: number;
    is_configured: boolean;
    is_recurring: boolean;
    updated_at?: string;
}

export interface NutrientSchedule {
    id?: string;
    user_id: string;
    group_id?: string;
    brand?: string;
    name: string;
    time: string; // HH:mm
    type: string;
}

export interface UserSettings {
    user_id: string;
    wake_up_time: string;
    habit_settings: any;
    rhythm_settings: any;
    somatic_settings: any;
    section_settings: any;
    notification_settings: any;
    updated_at?: string;
}
