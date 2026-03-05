'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo, useRef } from 'react';
import { TimelineEvent, Phase, PlanConfig, Intention, StashItem, ScheduledReset, TodayContext, SomaticLogEntry, DailyLog, ReAlignMealEntry, ReStoreMealEntry, ActionTimestamp, Product, PricingTier, Order, OrderItem } from './types';
import {
    RESET_SCHEDULE_TEMPLATE,
    MAINTENANCE_SCHEDULE_TEMPLATE,
    REALIGN_SCHEDULE_TEMPLATE,
    RESTORE_LIQUID_SCHEDULE,
    RESTORE_SOFT_SCHEDULE,
    RESTORE_SOLID_SCHEDULE,
    getWaterGoal
} from './constants';
import { STORAGE_KEYS, loadJSON, saveJSON } from './storage';
import { fullSync, flushSyncQueue } from './cloudSync';
import { createClient } from '@/lib/supabase/client';
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js';

// ---- STUBBED TYPES FROM APP ----
export interface SectionSettings {
    somatic: boolean;
    nutrients: boolean;
    habits: boolean;
}

interface HabitSetting {
    enabled: boolean;
    time: string;
}

interface RhythmSetting {
    time?: string;
    enabled?: boolean;
}

// 🛑 稳定的常量引用，防止 useEffect 死循环
const EMPTY_STRING_ARRAY: string[] = [];
const DEFAULT_DAILY_LOG: DailyLog = {
    waterIntake: 0,
    completedTaskIds: EMPTY_STRING_ARRAY,
    skippedTaskIds: EMPTY_STRING_ARRAY,
    somaticLog: null
};

interface AppContextType {
    // Time & Date State
    simulatedDate: Date | null;
    setSimulatedDate: (d: Date | null) => void;
    selectedDate: Date;
    setSelectedDate: (d: Date) => void;
    isLateNightWindow: boolean; // 00:00 - 04:00

    // Sync State
    waterIntake: number;
    addWater: (amount: number) => void;
    rhythmSchedule: TimelineEvent[];
    habitSchedule: TimelineEvent[];
    nutrientSchedule: TimelineEvent[];
    completedTaskIds: string[];
    skippedTaskIds: string[];
    toggleTask: (id: string, isSkip?: boolean) => void;

    // Global Nutrients
    globalNutrients: TimelineEvent[];
    addGlobalNutrientGroup: (brand: string, name: string, times: string[]) => void;
    removeGlobalNutrientGroup: (groupId: string) => void;
    updateGlobalNutrientGroup: (groupId: string, brand: string, name: string, times: string[]) => void;

    // ReAlign Specific
    reAlignMeals: DailyLog['reAlignMeals'];
    logReAlignMeal: (meal: 'breakfast' | 'lunch' | 'dinner', data: Partial<ReAlignMealEntry>) => void;

    // ReStore Specific
    reStoreMeals: DailyLog['reStoreMeals'];
    logReStoreMeal: (meal: 'breakfast' | 'lunch' | 'dinner', data: Partial<ReStoreMealEntry>) => void;

    // Rhythm State (Somatic)
    somaticLog: SomaticLogEntry | null;
    setSomaticLog: (logOrUpdater: SomaticLogEntry | ((prev: SomaticLogEntry | null) => SomaticLogEntry)) => void;
    somaticSettings: Record<string, boolean>;
    toggleSomaticSetting: (metricId: string) => void;

    // Settings
    wakeUpTime: string;
    setWakeUpTime: (time: string) => void;
    applySmartShift: (oldTime: string, newTime: string) => void;
    habitSettings: Record<string, HabitSetting>;
    updateHabitSetting: (habitId: string, updates: Partial<HabitSetting>) => void;
    sectionSettings: SectionSettings;
    toggleSection: (section: keyof SectionSettings) => void;
    rhythmSettings: Record<string, RhythmSetting>;
    updateRhythmSetting: (id: string, updates: Partial<RhythmSetting>) => void;

    // Context
    todayContext: TodayContext;
    getContextForDate: (date: Date) => TodayContext;
    history: Record<string, DailyLog>;

    // Plan State
    userPlan: PlanConfig;
    scheduledResets: ScheduledReset[];
    updateUserPlan: (config: Partial<PlanConfig>) => void;
    addReset: (date: Date, realign: number, restore: number) => void;
    updateReset: (id: string, date: Date, realign: number, restore: number, shiftFuture?: boolean) => void;
    skipReset: (id: string) => void;
    deleteReset: (id: string) => void;
    exportToCalendar: () => void;

    // Stash State
    stash: StashItem[];
    updateStashQuantity: (id: string, delta: number) => void;

    // Subscription
    subscription: { active: boolean; leadDays: number };
    toggleSubscription: (active: boolean, leadDays?: number) => void;
    redeemExternalOrder: (orderId: string) => Promise<boolean>;

    // Order System (DB-backed)
    products: (Product & { tiers: PricingTier[] })[];
    orders: Order[];
    ordersLoading: boolean;
    loadProducts: () => Promise<void>;
    loadOrders: () => Promise<void>;
    placeOrder: (productId: string, quantity: number, unitPriceCents: number) => Promise<Order | null>;
    refreshStashFromDB: () => Promise<void>;

    // Developer / Debug
    setHistory: (history: Record<string, DailyLog>) => void;
    setScheduledResets: (resets: ScheduledReset[]) => void;

    // UI State
    toastMessage: string | null;
    showToast: (msg: string) => void;
    checklistModalOpen: boolean;
    setChecklistModalOpen: (open: boolean) => void;
    setActiveTab: (tab: 'trace' | 'sync' | 'plan' | 'base') => void;
    activeTab: 'trace' | 'sync' | 'plan' | 'base';
    pendingScrollToTask: string | null;
    clearPendingScroll: () => void;
    setPendingScrollToTask: (id: string | null) => void;

    // Auth State
    authUser: User | null;
    isAuthenticated: boolean;
    authLoading: boolean;
    logoutUser: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

const addMonths = (date: Date, months: number) => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
};

export const getDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const parseMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
};

const formatMinutes = (totalMinutes: number) => {
    const h = Math.floor(totalMinutes / 60) % 24;
    const m = totalMinutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // ─── UI State ───
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [checklistModalOpen, setChecklistModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'trace' | 'sync' | 'plan' | 'base'>('sync');
    const [pendingScrollToTask, setPendingScrollToTask] = useState<string | null>(null);
    const clearPendingScroll = () => setPendingScrollToTask(null);

    const [simulatedDate, setSimulatedDate] = useState<Date | null>(null);
    const getPhysicalNow = () => simulatedDate ? new Date(simulatedDate) : new Date();

    // Auto-update selectedDate when Time Travel is active
    useEffect(() => {
        if (simulatedDate) {
            console.log('[TimeTravel] Syncing selectedDate to:', simulatedDate);
            setSelectedDate(new Date(simulatedDate));
        }
    }, [simulatedDate]);

    const checkLateNight = () => getPhysicalNow().getHours() < 4;
    const [isLateNightWindow, setIsLateNightWindow] = useState(checkLateNight());

    const showToast = (msg: string) => { setToastMessage(msg); setTimeout(() => setToastMessage(null), 3000); };

    // ─── Auth State ───
    const [authUser, setAuthUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const isAuthenticated = authUser !== null;

    const reloadStateFromStorage = (keys: string[]) => {
        if (keys.includes(STORAGE_KEYS.USER_PLAN)) setUserPlan(loadJSON(STORAGE_KEYS.USER_PLAN, { phase: Phase.MAINTENANCE, type: 'recurring', intention: 'GLOW', intervalMonths: 3, occurrences: 4, realignDuration: 2, restoreDuration: 2, nextResetDate: null, isConfigured: false, isRecurring: false }));
        if (keys.includes(STORAGE_KEYS.SCHEDULED_RESETS)) setScheduledResets(loadJSON(STORAGE_KEYS.SCHEDULED_RESETS, []).map((r: any) => ({ ...r, startDate: new Date(r.startDate), endDate: new Date(r.endDate) })));
        if (keys.includes(STORAGE_KEYS.HISTORY)) setHistory(loadJSON(STORAGE_KEYS.HISTORY, {}));
        if (keys.includes(STORAGE_KEYS.STASH)) setStash(loadJSON(STORAGE_KEYS.STASH, []));
        if (keys.includes(STORAGE_KEYS.SUBSCRIPTION)) setSubscription(loadJSON(STORAGE_KEYS.SUBSCRIPTION, { active: false, leadDays: 7 }));
        if (keys.includes(STORAGE_KEYS.GLOBAL_NUTRIENTS)) setGlobalNutrients(loadJSON(STORAGE_KEYS.GLOBAL_NUTRIENTS, []));
        if (keys.includes(STORAGE_KEYS.HABIT_SETTINGS)) setHabitSettings(loadJSON(STORAGE_KEYS.HABIT_SETTINGS, {}));
        if (keys.includes(STORAGE_KEYS.SECTION_SETTINGS)) setSectionSettings(loadJSON(STORAGE_KEYS.SECTION_SETTINGS, { somatic: true, nutrients: true, habits: true }));
        if (keys.includes(STORAGE_KEYS.WAKE_UP_TIME)) setWakeUpTimeInternal(loadJSON(STORAGE_KEYS.WAKE_UP_TIME, '07:00'));
        if (keys.includes(STORAGE_KEYS.RHYTHM_SETTINGS)) setRhythmSettings(loadJSON(STORAGE_KEYS.RHYTHM_SETTINGS, {}));

        if (keys.length > 0) console.log("[CloudSync] State reloaded for:", keys);
    };

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user } }: { data: { user: User | null } }) => {
            setAuthUser(user);
            setAuthLoading(false);
            if (user) {
                console.log('[Auth] User session restored:', user.email);
                fullSync().then((keys) => {
                    if (keys.length > 0) reloadStateFromStorage(keys);
                });
            }
        }).catch(() => setAuthLoading(false));

        const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
            console.log('[Auth] State changed:', event);
            const user = session?.user ?? null;
            setAuthUser(user);
            if (event === 'SIGNED_IN' && user) {
                fullSync().then((keys) => {
                    if (keys.length > 0) {
                        console.log('[Auth] Data changed from cloud:', keys);
                        reloadStateFromStorage(keys);
                    }
                });
            }
        });
        return () => { authSub.unsubscribe(); };
    }, []);

    const logoutUser = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        setAuthUser(null);
        localStorage.clear();
        window.location.reload();
    };

    // ─── Business Logic State (Persisted) ───
    const [userPlan, setUserPlan] = useState<PlanConfig>(() => loadJSON(STORAGE_KEYS.USER_PLAN, {
        phase: Phase.MAINTENANCE,
        type: 'recurring',
        intention: 'GLOW',
        intervalMonths: 3,
        occurrences: 4,
        realignDuration: 2,
        restoreDuration: 2,
        nextResetDate: null,
        isConfigured: false,
        isRecurring: false
    }));
    const [scheduledResets, setScheduledResets] = useState<ScheduledReset[]>(() => loadJSON(STORAGE_KEYS.SCHEDULED_RESETS, []).map((r: any) => ({ ...r, startDate: new Date(r.startDate), endDate: new Date(r.endDate) })));
    const [history, setHistory] = useState<Record<string, DailyLog>>(() => loadJSON(STORAGE_KEYS.HISTORY, {}));
    const [stash, setStash] = useState<StashItem[]>(() => loadJSON(STORAGE_KEYS.STASH, [{ id: 'vitalic-d', name: 'Vitalic D', quantity: 0, status: 'EMPTY' }]));
    const [subscription, setSubscription] = useState(() => loadJSON(STORAGE_KEYS.SUBSCRIPTION, { active: false, leadDays: 7 }));
    const [globalNutrients, setGlobalNutrients] = useState<TimelineEvent[]>(() => loadJSON(STORAGE_KEYS.GLOBAL_NUTRIENTS, []));
    const [habitSettings, setHabitSettings] = useState<Record<string, HabitSetting>>(() => loadJSON(STORAGE_KEYS.HABIT_SETTINGS, {}));
    const [sectionSettings, setSectionSettings] = useState<SectionSettings>(() => loadJSON(STORAGE_KEYS.SECTION_SETTINGS, { somatic: true, nutrients: true, habits: true }));
    const [rhythmSettings, setRhythmSettings] = useState<Record<string, RhythmSetting>>(() => loadJSON(STORAGE_KEYS.RHYTHM_SETTINGS, {}));

    const [wakeUpTime, setWakeUpTimeInternal] = useState<string>(() => loadJSON(STORAGE_KEYS.WAKE_UP_TIME, '07:00'));
    const setWakeUpTime = (time: string) => {
        const mins = parseMinutes(time);
        if (mins > parseMinutes('13:00')) {
            setWakeUpTimeInternal('13:00');
            saveJSON(STORAGE_KEYS.WAKE_UP_TIME, '13:00');
            showToast("Limit: Wake-up cannot exceed 1:00 PM.");
        } else {
            setWakeUpTimeInternal(time);
            saveJSON(STORAGE_KEYS.WAKE_UP_TIME, time);
        }
    };

    const [somaticSettings, setSomaticSettings] = useState<Record<string, boolean>>(() => loadJSON(STORAGE_KEYS.SOMATIC_SETTINGS, { energy: true, digestion: true, sleep: true, lightness: true, mood: true, notes: true }));
    const toggleSomaticSetting = (id: string) => setSomaticSettings(prev => {
        const next = { ...prev, [id]: !prev[id] };
        saveJSON(STORAGE_KEYS.SOMATIC_SETTINGS, next);
        return next;
    });

    const [rhythmSchedule, setRhythmSchedule] = useState<TimelineEvent[]>([]);
    const [habitSchedule, setHabitSchedule] = useState<TimelineEvent[]>([]);
    const [nutrientSchedule, setNutrientSchedule] = useState<TimelineEvent[]>([]);

    // ─── App Lifecycle Listeners ───
    const [foregroundRefreshTick, setForegroundRefreshTick] = useState(0);

    // [Web] Removed Capacitor App Listeners and LocalNotifications deep linking

    // ─── Derived State (Dynamic) ───
    const [selectedDate, setSelectedDate] = useState(new Date());
    const dateKey = useMemo(() => getDateKey(selectedDate), [selectedDate]);

    const dailyLog: DailyLog = useMemo(() => history[dateKey] || DEFAULT_DAILY_LOG, [history, dateKey]);
    const { waterIntake, completedTaskIds, skippedTaskIds, somaticLog, reAlignMeals, reStoreMeals } = dailyLog;

    // ─── Core Application Logic Helpers ───
    const getContextForDate = (date: Date): TodayContext => {
        const target = new Date(date); target.setHours(0, 0, 0, 0);
        const activeReset = scheduledResets.find(r => target >= r.startDate && target <= r.endDate);
        if (activeReset) {
            const start = new Date(activeReset.startDate);
            const dayNum = Math.floor((target.getTime() - start.getTime()) / 86400000) + 1;
            return { date: target, phase: Phase.RESET, cycleDay: dayNum, totalDays: 3, resetId: activeReset.id };
        }
        const prepReset = scheduledResets.find(r => {
            const realignStart = addDays(r.startDate, -r.realignDuration);
            return target >= realignStart && target < r.startDate;
        });
        if (prepReset) {
            const start = new Date(prepReset.startDate);
            const realignStart = addDays(start, -prepReset.realignDuration);
            const dayNum = Math.floor((target.getTime() - realignStart.getTime()) / 86400000) + 1;
            return { date: target, phase: Phase.REALIGN, cycleDay: dayNum, totalDays: prepReset.realignDuration, resetId: prepReset.id };
        }
        const restoreReset = scheduledResets.find(r => target > r.endDate && target <= addDays(r.endDate, r.restoreDuration));
        if (restoreReset) {
            const end = new Date(restoreReset.endDate);
            const dayNum = Math.ceil((target.getTime() - end.getTime()) / 86400000);
            return { date: target, phase: Phase.RESTORE, cycleDay: dayNum, totalDays: restoreReset.restoreDuration, resetId: restoreReset.id };
        }
        return { date: target, phase: Phase.MAINTENANCE, cycleDay: 0, totalDays: 0 };
    };

    const todayContext = useMemo(() => getContextForDate(selectedDate), [selectedDate, scheduledResets]);

    const toggleSection = (section: keyof SectionSettings) => setSectionSettings(prev => {
        const next = { ...prev, [section]: !prev[section] };
        saveJSON(STORAGE_KEYS.SECTION_SETTINGS, next);
        return next;
    });

    const updateRhythmSetting = (id: string, updates: Partial<RhythmSetting>) => {
        setRhythmSettings(prev => ({
            ...prev,
            [id]: { ...prev[id], ...updates }
        }));
    };

    const applySmartShift = (oldTime: string, newTime: string) => {
        const oldMins = parseMinutes(oldTime);
        const newMins = parseMinutes(newTime);
        const delta = newMins - oldMins;
        if (delta !== 0) {
            if (window.confirm(`Shift schedule by ${Math.round(delta)} mins?`)) {
                setHabitSettings(prev => {
                    const next: any = {};
                    Object.keys(prev).forEach(k => { if (prev[k].time) next[k] = { ...prev[k], time: formatMinutes(parseMinutes(prev[k].time) + delta) }; else next[k] = prev[k]; });
                    return next;
                });
                setGlobalNutrients(prev => prev.map(n => ({ ...n, time: formatMinutes(parseMinutes(n.time) + delta) })));
                showToast(`Dynamic Schedule Updated 🔄`);
            }
        }
    };

    // ─── Persistence Side Effects ───
    useEffect(() => { saveJSON(STORAGE_KEYS.USER_PLAN, userPlan); }, [userPlan]);
    useEffect(() => { saveJSON(STORAGE_KEYS.SCHEDULED_RESETS, scheduledResets); }, [scheduledResets]);
    useEffect(() => { saveJSON(STORAGE_KEYS.HISTORY, history); }, [history]);
    useEffect(() => { saveJSON(STORAGE_KEYS.STASH, stash); }, [stash]);
    useEffect(() => { saveJSON(STORAGE_KEYS.SUBSCRIPTION, subscription); }, [subscription]);
    useEffect(() => { saveJSON(STORAGE_KEYS.GLOBAL_NUTRIENTS, globalNutrients); }, [globalNutrients]);
    useEffect(() => { saveJSON(STORAGE_KEYS.HABIT_SETTINGS, habitSettings); }, [habitSettings]);
    useEffect(() => { saveJSON(STORAGE_KEYS.SECTION_SETTINGS, sectionSettings); }, [sectionSettings]);
    useEffect(() => { saveJSON(STORAGE_KEYS.WAKE_UP_TIME, wakeUpTime); }, [wakeUpTime]);
    useEffect(() => { saveJSON(STORAGE_KEYS.RHYTHM_SETTINGS, rhythmSettings); }, [rhythmSettings]);

    // ─── Phase Sync for Admin Visibility ───
    useEffect(() => {
        if (todayContext.phase) {
            saveJSON('currentPhase', {
                phase: todayContext.phase,
                cycleDay: todayContext.cycleDay,
                updatedAt: new Date().toISOString()
            });
        }
    }, [todayContext.phase, todayContext.cycleDay]);

    const addWater = (amount: number) => {
        setHistory(prev => {
            const today = prev[dateKey] || { waterIntake: 0, completedTaskIds: [], skippedTaskIds: [], somaticLog: null };
            const newIntake = Math.max(0, Math.min(today.waterIntake + amount, 5000));
            // Record timestamp for water action
            const newTimestamp: ActionTimestamp = {
                action: 'water',
                value: amount,
                timestamp: new Date().toISOString()
            };
            const existingTimestamps = today.timestamps || [];
            return { ...prev, [dateKey]: { ...today, waterIntake: newIntake, timestamps: [...existingTimestamps, newTimestamp] } };
        });
    };

    const toggleTask = (taskId: string, isSkip: boolean = false, dateOverride?: string, forceState?: 'completed') => {
        const targetKey = dateOverride || dateKey;
        setHistory(prev => {
            const today = prev[targetKey] || { waterIntake: 0, completedTaskIds: [], skippedTaskIds: [], somaticLog: null };

            // [FORCE STATE GUARD]
            // If dragging "Done" on notification but app already has it done -> Do nothing but ensure cleanup
            if (forceState === 'completed' && today.completedTaskIds?.includes(taskId)) {
                return prev;
            }

            let newCompletedIds = [...(today.completedTaskIds || [])];
            let newSkippedIds = [...(today.skippedTaskIds || [])];
            const existingTimestamps = today.timestamps || [];
            const newTimestamps: ActionTimestamp[] = [];
            let waterChange = 0;

            // Determine action type based on taskId prefix
            const getActionType = (id: string): 'habit' | 'nutrient' => {
                if (id.startsWith('nutrient_') || id.startsWith('group_')) return 'nutrient';
                return 'habit';
            };

            if (isSkip) {
                const skipped = newSkippedIds.includes(taskId);
                newSkippedIds = skipped ? newSkippedIds.filter(id => id !== taskId) : [...newSkippedIds, taskId];
                newCompletedIds = newCompletedIds.filter(id => id !== taskId);
                showToast("Task skipped. ⏭️");
            } else {
                const completed = newCompletedIds.includes(taskId);

                // [SMART STOCK LOGIC] - Trigger on First Action
                if (!completed) {
                    console.log(`[StockDebug] Toggling task: ${taskId}, Phase: ${todayContext.phase}, ResetId: ${todayContext.resetId}`);

                    // Check if we are in a Reset and need to deduct stock
                    if (todayContext.phase === Phase.RESET && todayContext.resetId) {
                        const activeReset = scheduledResets.find(r => r.id === todayContext.resetId);

                        console.log(`[StockDebug] Active Reset Stock Deducted: ${activeReset?.isStockDeducted}`);

                        // If stock not yet deducted for this reset
                        if (activeReset && !activeReset.isStockDeducted) {
                            // Find the task to check its type (don't deduct for water checkpoints)

                            // FIX V2: Robust Lookup
                            // 1. Try exact match (e.g. "m1")
                            let task = rhythmSchedule.find(t => t.id === taskId);

                            // 2. If valid itemized task (e.g. "reset_1_0"), find the parent (e.g. "reset_1")
                            // The parent ID is the prefix. We iterate to find which schedule item serves as the prefix.
                            if (!task && taskId.includes('_')) {
                                task = rhythmSchedule.find(t => taskId.startsWith(t.id + '_'));
                            }

                            console.log(`[StockDebug] Found Task for Deduction Check:`, task);

                            // If task exists and is NOT a water checkpoint
                            if (task && task.type !== 'water_checkpoint') {
                                // 1. Deduct Stock
                                updateStashQuantity('vitalic-d', -1);
                                // 2. Mark Reset as Deducted
                                setScheduledResets(prev => prev.map(r => r.id === activeReset.id ? { ...r, isStockDeducted: true } : r));
                                // 3. Feedback
                                showToast("Reset Journey Started! Stock -1 📦");
                            }
                        }
                    }
                }

                newCompletedIds = completed ? newCompletedIds.filter(id => id !== taskId) : [...newCompletedIds, taskId];
                newSkippedIds = newSkippedIds.filter(id => id !== taskId);

                // Record timestamp when completing (not uncompleting)
                if (!completed) {
                    newTimestamps.push({
                        action: getActionType(taskId),
                        taskId,
                        timestamp: new Date().toISOString()
                    });

                    // Check if this task triggers water intake
                    if (taskId === 'm1' || (taskId.startsWith('reset_') && taskId.includes('_'))) {
                        waterChange = 250;
                        newTimestamps.push({
                            action: 'water',
                            value: 250,
                            timestamp: new Date().toISOString()
                        });
                    } else if (taskId.startsWith('water_check_')) {
                        waterChange = 250;
                        newTimestamps.push({
                            action: 'water',
                            value: waterChange,
                            timestamp: new Date().toISOString()
                        });
                    }

                    if (!taskId.includes('_')) showToast("Check-in saved! ✅");
                } else {
                    // Uncompleting a task
                    if (taskId === 'm1' || (taskId.startsWith('reset_') && taskId.includes('_'))) {
                        waterChange = -250;
                        newTimestamps.push({
                            action: 'water',
                            value: -250,
                            timestamp: new Date().toISOString()
                        });
                    } else if (taskId.startsWith('water_check_')) {
                        waterChange = -250;
                        newTimestamps.push({
                            action: 'water',
                            value: waterChange,
                            timestamp: new Date().toISOString()
                        });
                    }
                }
            }

            // Calculate new water intake
            const newIntake = Math.max(0, Math.min(today.waterIntake + waterChange, 5000));

            return {
                ...prev,
                [targetKey]: {
                    ...today,
                    waterIntake: newIntake,
                    completedTaskIds: newCompletedIds,
                    skippedTaskIds: newSkippedIds,
                    timestamps: [...existingTimestamps, ...newTimestamps]
                }
            };
        });
    };

    // Ref to access latest toggleTask in event listeners
    const toggleTaskRef = useRef(toggleTask);
    useEffect(() => {
        toggleTaskRef.current = toggleTask;
    }, [toggleTask]);

    const addGlobalNutrientGroup = (brand: string, name: string, times: string[]) => {
        const groupId = `group_${Date.now()}`;
        const newNutrients: TimelineEvent[] = times.map((t, idx) => ({
            id: `global_${Date.now()}_${idx}`, groupId: groupId, time: t, brand: brand, title: name, description: `Recurring Nutrient Sync${brand ? ` (${brand})` : ''}`, type: 'supplement', completed: false
        }));
        setGlobalNutrients(prev => [...prev, ...newNutrients]);
        showToast(`Added ${times.length} nutrient schedule(s). 💊`);
    };

    const removeGlobalNutrientGroup = (groupId: string) => {
        setGlobalNutrients(prev => prev.filter(n => n.groupId !== groupId));
        showToast("Nutrient group removed.");
    };

    const updateGlobalNutrientGroup = (groupId: string, brand: string, name: string, times: string[]) => {
        setGlobalNutrients(prev => {
            const filtered = prev.filter(n => n.groupId !== groupId);
            const newNutrients: TimelineEvent[] = times.map((t, idx) => ({
                id: `global_${Date.now()}_${idx}`, groupId: groupId, time: t, brand: brand, title: name, description: `Recurring Nutrient Sync${brand ? ` (${brand})` : ''}`, type: 'supplement', completed: false
            }));
            return [...filtered, ...newNutrients];
        });
        showToast("Nutrient group updated. ✅");
    };

    const updateHabitSetting = (habitId: string, updates: Partial<HabitSetting>) => {
        setHabitSettings(prev => ({
            ...prev,
            [habitId]: { ...prev[habitId], ...updates }
        }));
    };

    const setSomaticLog = (logOrUpdater: SomaticLogEntry | ((prev: SomaticLogEntry | null) => SomaticLogEntry)) => {
        setHistory(prev => {
            const today = prev[dateKey] || { waterIntake: 0, completedTaskIds: [], skippedTaskIds: [], somaticLog: null };
            const currentSomaticLog = today.somaticLog;
            const newLog = typeof logOrUpdater === 'function' ? logOrUpdater(currentSomaticLog) : logOrUpdater;

            // Record timestamps for somatic/mood/reflection changes
            const existingTimestamps = today.timestamps || [];
            const newTimestamps: ActionTimestamp[] = [];
            const now = new Date().toISOString();

            // Record somatic values if changed (energy, digestion, sleep, lightness)
            if (newLog.energy !== undefined && newLog.energy !== currentSomaticLog?.energy) {
                newTimestamps.push({ action: 'somatic', value: { type: 'energy', score: newLog.energy }, timestamp: now });
            }
            if (newLog.digestion !== undefined && newLog.digestion !== currentSomaticLog?.digestion) {
                newTimestamps.push({ action: 'somatic', value: { type: 'digestion', score: newLog.digestion }, timestamp: now });
            }
            if (newLog.sleepQuality !== undefined && newLog.sleepQuality !== currentSomaticLog?.sleepQuality) {
                newTimestamps.push({ action: 'somatic', value: { type: 'sleepQuality', score: newLog.sleepQuality }, timestamp: now });
            }
            if (newLog.lightness !== undefined && newLog.lightness !== currentSomaticLog?.lightness) {
                newTimestamps.push({ action: 'somatic', value: { type: 'lightness', score: newLog.lightness }, timestamp: now });
            }

            // Record new mood tags
            const prevMoods = currentSomaticLog?.mood || [];
            const newMoods = newLog.mood || [];
            const addedMoods = newMoods.filter(m => !prevMoods.includes(m));
            addedMoods.forEach(mood => {
                newTimestamps.push({ action: 'mood', value: mood, timestamp: now });
            });

            // Record reflection if notes changed
            if (newLog.notes && newLog.notes !== currentSomaticLog?.notes) {
                newTimestamps.push({ action: 'reflection', value: newLog.notes.slice(0, 50), timestamp: now });
            }

            return {
                ...prev,
                [dateKey]: {
                    ...today,
                    somaticLog: newLog,
                    timestamps: [...existingTimestamps, ...newTimestamps]
                }
            };
        });
    };
    const logReAlignMeal = (meal: 'breakfast' | 'lunch' | 'dinner', data: Partial<ReAlignMealEntry>) => {
        setHistory(prev => {
            const today = prev[dateKey] || { waterIntake: 0, completedTaskIds: [], skippedTaskIds: [], somaticLog: null };
            const currentMeals = today.reAlignMeals || { breakfast: { skipped: false }, lunch: { skipped: false }, dinner: { skipped: false } };
            return { ...prev, [dateKey]: { ...today, reAlignMeals: { ...currentMeals, [meal]: { ...currentMeals[meal], ...data } } } };
        });
        showToast(`${meal.charAt(0).toUpperCase() + meal.slice(1)} updated. 🍽️`);
    };
    const logReStoreMeal = (meal: 'breakfast' | 'lunch' | 'dinner', data: Partial<ReStoreMealEntry>) => {
        setHistory(prev => {
            const today = prev[dateKey] || { waterIntake: 0, completedTaskIds: [], skippedTaskIds: [], somaticLog: null };
            const currentMeals = today.reStoreMeals || { breakfast: { completed: false }, lunch: { completed: false }, dinner: { completed: false } };
            return { ...prev, [dateKey]: { ...today, reStoreMeals: { ...currentMeals, [meal]: { ...currentMeals[meal], ...data } } } };
        });
        if (data.feeling) showToast("Gut feedback recorded. 🌿");
    };

    useEffect(() => {
        const isMaintenance = todayContext.phase === Phase.MAINTENANCE;
        let rhythmTemplate: TimelineEvent[] = [];
        if (!isMaintenance) {
            if (!isMaintenance) {
                const userStartMin = parseMinutes(wakeUpTime);

                // Helper to shift schedule based on an anchor time (when the first event usually happens)
                const getShiftedSchedule = (template: TimelineEvent[], anchorTime: string) => {
                    const defaultStartMin = parseMinutes(anchorTime);
                    const offset = userStartMin - defaultStartMin;

                    return template
                        .filter(event => rhythmSettings[event.id]?.enabled !== false) // 1. Filter Disabled
                        .map(event => {
                            // 2. Determine Time (Custom > Shifted)
                            let finalTime = event.time;
                            if (rhythmSettings[event.id]?.time) {
                                finalTime = rhythmSettings[event.id]!.time!;
                            } else {
                                finalTime = formatMinutes(parseMinutes(event.time) + offset);
                            }
                            return { ...event, time: finalTime };
                        });
                };

                if (todayContext.phase === Phase.RESET) {
                    // ReSet Anchor: 06:00 (Wake-Up Call)
                    rhythmTemplate = getShiftedSchedule(RESET_SCHEDULE_TEMPLATE, '06:00');
                } else if (todayContext.phase === Phase.REALIGN) {
                    // ReAlign Anchor: 07:00 (Warm Wake Up)
                    rhythmTemplate = getShiftedSchedule(REALIGN_SCHEDULE_TEMPLATE, '07:00');
                } else if (todayContext.phase === Phase.RESTORE) {
                    // ReStore Anchor: 08:00 (First Meal - assumes wake up slightly before or at this time for liquid)
                    // Adjusting anchor to 08:00 implies that if I wake up at 6:00, breakfast is at 6:00? 
                    // Maybe ReStore should also anchor at Wake Up? 
                    // If ReStore starts at 08:00, and user wakes at 06:00, maybe they want tasks earlier?
                    // Let's use 08:00 as the anchor for the first event in the list.
                    if (todayContext.cycleDay === 1) rhythmTemplate = getShiftedSchedule(RESTORE_LIQUID_SCHEDULE, '08:00');
                    else if (todayContext.cycleDay === 2) rhythmTemplate = getShiftedSchedule(RESTORE_SOFT_SCHEDULE, '08:00');
                    else rhythmTemplate = getShiftedSchedule(RESTORE_SOLID_SCHEDULE, '08:00'); // Day 3+ handling
                }
            }
        }

        const habitTemplate = (sectionSettings.habits ? MAINTENANCE_SCHEDULE_TEMPLATE : [])
            .filter(h => habitSettings[h.id]?.enabled !== false)
            .map(h => ({
                ...h,
                time: habitSettings[h.id]?.time || h.time
            }));

        const isReset = todayContext.phase === Phase.RESET;
        const nutrientTemplate = (sectionSettings.nutrients && !isReset) ? globalNutrients : [];

        const biologicalSort = (a: TimelineEvent, b: TimelineEvent) => {
            // FIXED PIVOT: 04:00 AM (240 minutes)
            // Any time between 00:00 and 04:00 is considered "Late Night" and sorted to the end of the day.
            // Any time from 04:00 onwards is considered "Morning/Day" and sorted normally.
            const PIVOT = 240;

            const getSortScore = (t: string) => {
                const mins = parseMinutes(t);
                if (t === '10:01') console.log(`[Sort] ${t} < ${PIVOT} ? ${mins < PIVOT}`);
                return mins < PIVOT ? mins + 1440 : mins;
            };

            return getSortScore(a.time) - getSortScore(b.time);
        };

        const mapState = (list: TimelineEvent[]) => list.map(item => {
            const isItemized = todayContext.phase === Phase.RESET && !!item.product;

            let isDone = false;
            let isSkipped = false;

            if (isItemized && item.product) {
                isDone = item.product.items.every((_, idx) => completedTaskIds.includes(`${item.id}_${idx}`));
                isSkipped = item.product.items.every((_, idx) => skippedTaskIds.includes(`${item.id}_${idx}`));
            } else {
                isDone = completedTaskIds.includes(item.id);
                isSkipped = skippedTaskIds.includes(item.id);
            }

            return {
                ...item, completed: isDone, skipped: isSkipped
            };
        }).sort(biologicalSort);

        setRhythmSchedule(mapState(rhythmTemplate));
        setHabitSchedule(mapState(habitTemplate));
        setNutrientSchedule(mapState(nutrientTemplate));

        const now = getPhysicalNow();
        if (now.getHours() < 4) {
            const yesterdayKey = getDateKey(addDays(now, -1));
            if (dateKey === yesterdayKey) {
                const allResolved = rhythmTemplate.length > 0 && rhythmTemplate.every(t => completedTaskIds.includes(t.id) || skippedTaskIds.includes(t.id));
                if (allResolved) {
                    const today = new Date(now);
                    today.setHours(0, 0, 0, 0);
                    setSelectedDate(today);
                    showToast("Ritual resolved. Rest well! 🌙");
                }
            }
        }
    }, [todayContext.phase, todayContext.cycleDay, completedTaskIds, skippedTaskIds, globalNutrients, dateKey, wakeUpTime, habitSettings, sectionSettings, rhythmSettings]);

    const updateUserPlan = (config: Partial<PlanConfig>) => {
        const newConfig = { ...userPlan, ...config, isConfigured: true };
        setUserPlan(newConfig);
        if (newConfig.nextResetDate) {
            const currentNow = getPhysicalNow(); currentNow.setHours(0, 0, 0, 0);
            const resetsToKeep = scheduledResets.filter(r => r.startDate < currentNow || r.type === 'manual');
            const futureResets: ScheduledReset[] = [];
            const rDuration = newConfig.realignDuration || 2;
            const resDuration = newConfig.restoreDuration || 2;
            futureResets.push({
                id: Date.now().toString(), startDate: newConfig.nextResetDate, endDate: addDays(newConfig.nextResetDate, 2),
                intention: newConfig.intention || 'GLOW', type: 'recurring', realignDuration: rDuration, restoreDuration: resDuration, isStockDeducted: false
            });
            if (newConfig.isRecurring) {
                for (let i = 1; i < newConfig.occurrences; i++) {
                    const nextDate = addMonths(newConfig.nextResetDate, newConfig.intervalMonths * i);
                    futureResets.push({
                        id: (Date.now() + i).toString(), startDate: nextDate, endDate: addDays(nextDate, 2),
                        intention: newConfig.intention || 'GLOW', type: 'recurring', realignDuration: rDuration, restoreDuration: resDuration, isStockDeducted: false
                    });
                }
            }
            setScheduledResets([...resetsToKeep, ...futureResets].sort((a, b) => a.startDate.getTime() - b.startDate.getTime()));
        }
        showToast("Rhythm updated. 🌱");
    };

    const addReset = (date: Date, realign: number, restore: number) => {
        const newReset: ScheduledReset = {
            id: Date.now().toString(), startDate: date, endDate: addDays(date, 2), intention: userPlan.intention || 'GLOW', type: 'manual', realignDuration: realign, restoreDuration: restore, isStockDeducted: false
        };
        setScheduledResets(prev => [...prev, newReset].sort((a, b) => a.startDate.getTime() - b.startDate.getTime()));
        showToast("New reset added. 🗓️");
    };

    const updateReset = (id: string, date: Date, realign: number, restore: number, shiftFuture: boolean = false) => {
        setScheduledResets(prev => {
            const index = prev.findIndex(r => r.id === id);
            if (index === -1) return prev;

            const oldReset = prev[index];
            const dateDelta = date.getTime() - oldReset.startDate.getTime();

            // 1. Update the target reset
            const updatedResets = prev.map(r =>
                r.id === id
                    ? { ...r, startDate: date, endDate: addDays(date, 2), realignDuration: realign, restoreDuration: restore }
                    : r
            );

            // 2. If shiftFuture is enabled, update all SUBSEQUENT recurring resets
            if (shiftFuture && oldReset.type === 'recurring') {
                return updatedResets.map((r, i) => {
                    // Only shift resets that come AFTER the current one in the original array
                    // and are of type 'recurring'
                    if (i > index && r.type === 'recurring') {
                        const newStart = new Date(r.startDate.getTime() + dateDelta);
                        return {
                            ...r,
                            startDate: newStart,
                            endDate: addDays(newStart, 2)
                        };
                    }
                    return r;
                }).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
            }

            return updatedResets.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
        });
        showToast(shiftFuture ? "Entire rhythm shifted. 🌊" : "Reset updated. ✏️");
    };

    const skipReset = (id: string) => {
        setScheduledResets(prev => prev.map(r => r.id === id ? { ...r, isSkipped: !r.isSkipped } : r));
        const r = scheduledResets.find(r => r.id === id);
        showToast(r?.isSkipped ? "Reset reactivated." : "Cycle skipped. ⏭️");
    };

    const deleteReset = (id: string) => {
        setScheduledResets(prev => prev.filter(r => r.id !== id));
        showToast("Reset removed. 🗑️");
    };

    const updateStashQuantity = (id: string, delta: number) => setStash(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta), status: (item.quantity + delta) > 0 ? 'OK' : 'EMPTY' } : item));
    const toggleSubscription = (active: boolean, leadDays: number = 7) => { setSubscription({ active, leadDays }); showToast(active ? `Auto-pilot enabled.` : "Subscription paused."); };

    // ─── Order System (Web Interface uses direct Supabase checks elsewhere) ───
    const [products, setProducts] = useState<(Product & { tiers: PricingTier[] })[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(false);

    const loadProducts = async () => { }; // DB calls should be placed in Nextjs server / client libs
    const loadOrders = async () => { };

    const placeOrder = async (productId: string, quantity: number, unitPriceCents: number) => null;
    const refreshStashFromDB = async () => { };
    const redeemExternalOrder = async (orderId: string) => false;

    const exportToCalendar = () => { showToast("Calendar export feature placeholder."); };

    return (
        <AppContext.Provider value={{
            simulatedDate, setSimulatedDate, selectedDate, setSelectedDate, isLateNightWindow,
            waterIntake, addWater, rhythmSchedule, habitSchedule, nutrientSchedule, completedTaskIds, skippedTaskIds, toggleTask,
            globalNutrients, addGlobalNutrientGroup, removeGlobalNutrientGroup, updateGlobalNutrientGroup,
            somaticLog, setSomaticLog, somaticSettings, toggleSomaticSetting, reAlignMeals, logReAlignMeal, reStoreMeals, logReStoreMeal,
            todayContext, getContextForDate, history,
            userPlan, scheduledResets, updateUserPlan, addReset, updateReset, skipReset, deleteReset, exportToCalendar,
            stash, updateStashQuantity, subscription, toggleSubscription, redeemExternalOrder,
            products, orders, ordersLoading, loadProducts, loadOrders, placeOrder, refreshStashFromDB,
            toastMessage, showToast, activeTab, setActiveTab,
            wakeUpTime, setWakeUpTime, applySmartShift, habitSettings, updateHabitSetting,
            sectionSettings, toggleSection,
            rhythmSettings, updateRhythmSetting,
            checklistModalOpen, setChecklistModalOpen,
            pendingScrollToTask, setPendingScrollToTask, clearPendingScroll,
            setHistory, setScheduledResets,
            authUser, isAuthenticated, authLoading, logoutUser
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) throw new Error('useApp must be used within an AppProvider');
    return context;
};
