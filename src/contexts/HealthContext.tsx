'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useReducer } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
    logCheckin,
    getDailySummary,
    upsertDailySummary,
    getSomaticLog,
    upsertSomaticLog,
    getMealLogs,
    upsertMealLog,
    getSettings,
    getResetPlans,
    upsertResetPlan
} from '@/lib/health-api';
import type {
    HealthCheckin,
    DailySummary,
    SomaticLog,
    MealLog,
    UserSettings,
    ResetPlan,
    HealthPhase
} from '@/lib/health-types';

interface HealthState {
    summary: DailySummary | null;
    somatic: SomaticLog | null;
    meals: MealLog[];
    settings: UserSettings | null;
    plans: ResetPlan[];
    loading: boolean;
    error: string | null;
}

type HealthAction =
    | { type: 'SET_INITIAL'; payload: { summary: DailySummary | null, somatic: SomaticLog | null, meals: MealLog[], settings: UserSettings | null, plans: ResetPlan[] } }
    | { type: 'UPDATE_WATER'; payload: number }
    | { type: 'TOGGLE_TASK'; payload: { taskId: string, completed: boolean } }
    | { type: 'SET_SOMATIC'; payload: Partial<SomaticLog> }
    | { type: 'UPDATE_MEAL'; payload: MealLog }
    | { type: 'SET_SETTINGS'; payload: Partial<UserSettings> }
    | { type: 'SET_ERROR'; payload: string }
    | { type: 'SYNC_SUMMARY'; payload: DailySummary }
    | { type: 'SYNC_SOMATIC'; payload: SomaticLog };

const healthReducer = (state: HealthState, action: HealthAction): HealthState => {
    switch (action.type) {
        case 'SET_INITIAL':
            return {
                ...state,
                summary: action.payload.summary,
                somatic: action.payload.somatic,
                meals: action.payload.meals,
                settings: action.payload.settings,
                plans: action.payload.plans,
                loading: false
            };
        case 'UPDATE_WATER':
            if (!state.summary) return state;
            return {
                ...state,
                summary: { ...state.summary, water_intake: state.summary.water_intake + action.payload }
            };
        case 'TOGGLE_TASK':
            if (!state.summary) return state;
            const { taskId, completed } = action.payload;
            const completedIds = completed
                ? [...state.summary.completed_task_ids, taskId]
                : state.summary.completed_task_ids.filter(id => id !== taskId);
            return {
                ...state,
                summary: { ...state.summary, completed_task_ids: completedIds }
            };
        case 'SET_SOMATIC':
            if (!state.somatic) return state;
            return {
                ...state,
                somatic: { ...state.somatic, ...action.payload }
            };
        case 'UPDATE_MEAL':
            const exists = state.meals.find(m => m.meal_type === action.payload.meal_type);
            const newMeals = exists
                ? state.meals.map(m => m.meal_type === action.payload.meal_type ? action.payload : m)
                : [...state.meals, action.payload];
            return {
                ...state,
                meals: newMeals
            };
        case 'SYNC_SUMMARY':
            // 只有当远程数据更新且当前数据落后时才同步
            return { ...state, summary: action.payload };
        case 'SYNC_SOMATIC':
            return { ...state, somatic: action.payload };
        default:
            return state;
    }
};

interface HealthContextType extends HealthState {
    addWater: (amount: number) => Promise<void>;
    toggleTask: (taskId: string, completed: boolean) => Promise<void>;
    updateSomatic: (updates: Partial<SomaticLog>) => Promise<void>;
    updateMealLog: (log: Partial<MealLog>) => Promise<void>;
    addResetPlan: (plan: Partial<ResetPlan>) => Promise<void>;
    refresh: () => Promise<void>;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export function HealthProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(healthReducer, {
        summary: null,
        somatic: null,
        meals: [],
        settings: null,
        plans: [],
        loading: true,
        error: null
    });

    const supabase = createClient();

    // ─── 1. 初始化加载 ───
    const loadData = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            dispatch({ type: 'SET_INITIAL', payload: { summary: null, somatic: null, meals: [], settings: null, plans: [] } });
            return;
        }

        const date = new Date().toISOString().split('T')[0];
        try {
            const [summary, somatic, meals, settings, plans] = await Promise.all([
                getDailySummary(user.id, date),
                getSomaticLog(user.id, date),
                getMealLogs(user.id, date),
                getSettings(user.id),
                getResetPlans(user.id)
            ]);

            dispatch({
                type: 'SET_INITIAL',
                payload: {
                    summary: summary || { user_id: user.id, date, water_intake: 0, completed_task_ids: [], skipped_task_ids: [], phase: 'MAINTENANCE' as any, cycle_day: 0 },
                    somatic: somatic || { user_id: user.id, date, mood: [] },
                    meals: meals || [],
                    settings,
                    plans
                }
            });
        } catch (err: any) {
            dispatch({ type: 'SET_ERROR', payload: err.message });
        }
    }, [supabase.auth]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // ─── 2. 实时订阅 (Real-time Sync) ───
    useEffect(() => {
        const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN') loadData();
        });

        const channel = supabase.channel('health_sync')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rsl_summaries' }, payload => {
                dispatch({ type: 'SYNC_SUMMARY', payload: payload.new as DailySummary });
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rsl_somatic_logs' }, payload => {
                dispatch({ type: 'SYNC_SOMATIC', payload: payload.new as SomaticLog });
            })
            .subscribe();

        return () => {
            authListener.unsubscribe();
            supabase.removeChannel(channel);
        };
    }, [loadData, supabase]);

    // ─── 3. 操作方法 (带乐观更新) ───

    const addWater = async (amount: number) => {
        if (!state.summary) return;
        // 1. Optimistic Update
        dispatch({ type: 'UPDATE_WATER', payload: amount });

        // 2. Persist
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const newTotal = (state.summary.water_intake + amount);
            await upsertDailySummary({ user_id: user.id, date: state.summary.date, water_intake: newTotal });

            await logCheckin({
                user_id: user.id,
                date: state.summary.date,
                action_type: 'water',
                value: amount,
                checked_in_at: new Date().toISOString(),
                source: 'web',
                device_type: 'web'
            });
        } catch (err: any) {
            // 重试加载或通知用户
            loadData();
        }
    };

    const toggleTask = async (taskId: string, completed: boolean) => {
        if (!state.summary) return;
        // 1. Optimistic Update
        dispatch({ type: 'TOGGLE_TASK', payload: { taskId, completed } });

        // 2. Persist
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            let newCompletedIds = completed
                ? [...state.summary.completed_task_ids, taskId]
                : state.summary.completed_task_ids.filter(id => id !== taskId);

            await upsertDailySummary({
                user_id: user.id,
                date: state.summary.date,
                completed_task_ids: newCompletedIds
            });

            if (completed) {
                await logCheckin({
                    user_id: user.id,
                    date: state.summary.date,
                    action_type: 'habit',
                    task_id: taskId,
                    checked_in_at: new Date().toISOString(),
                    source: 'web',
                    device_type: 'web'
                });
            }
        } catch (err: any) {
            loadData();
        }
    };

    const updateSomatic = async (updates: Partial<SomaticLog>) => {
        if (!state.somatic) return;
        dispatch({ type: 'SET_SOMATIC', payload: updates });

        try {
            await upsertSomaticLog({ ...state.somatic, ...updates });
        } catch (err) {
            loadData();
        }
    };

    const updateMealLog = async (log: Partial<MealLog>) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const fullLog = {
                user_id: user.id,
                date: state.summary?.date || new Date().toISOString().split('T')[0],
                ...log
            } as MealLog;

            // Optimistic
            dispatch({ type: 'UPDATE_MEAL', payload: fullLog });

            await upsertMealLog(fullLog);
        } catch (err) {
            loadData();
        }
    };

    const addResetPlan = async (plan: Partial<ResetPlan>) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            await upsertResetPlan({ ...plan, user_id: user.id });
            await loadData();
        } catch (err) {
            console.error('Failed to add plan:', err);
        }
    };

    return (
        <HealthContext.Provider value={{
            ...state,
            addWater,
            toggleTask,
            updateSomatic,
            updateMealLog,
            addResetPlan,
            refresh: loadData
        }}>
            {children}
        </HealthContext.Provider>
    );
}

export function useHealth() {
    const ctx = useContext(HealthContext);
    if (!ctx) throw new Error('useHealth must be used within HealthProvider');
    return ctx;
}
