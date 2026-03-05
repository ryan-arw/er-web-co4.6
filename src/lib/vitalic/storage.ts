import { queueCloudSync } from './cloudSync';

/**
 * Generate a random Rhythm ID (e.g., RID-A1B2-C3D4)
 */
export function generateRhythmId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segment = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `RID-${segment()}-${segment()}`;
}

/**
 * Web-only Storage Adapter
 * Stripped of Capacitor/Native features. Works exclusively with `localStorage`.
 */

// Storage keys for all app data
export const STORAGE_KEYS = {
    WAKE_UP_TIME: 'vitalic_wakeUpTime',
    HABIT_SETTINGS: 'vitalic_habitSettings',
    SOMATIC_SETTINGS: 'vitalic_somaticSettings',
    HISTORY: 'vitalic_history',
    SCHEDULED_RESETS: 'vitalic_scheduledResets',
    USER_PLAN: 'vitalic_userPlan',
    STASH: 'vitalic_stash',
    SUBSCRIPTION: 'vitalic_subscription',
    GLOBAL_NUTRIENTS: 'vitalic_globalNutrients',
    NOTIFICATION_SETTINGS: 'notificationSettings',
    SIMULATED_DATE: 'vitalic_simulatedDate',
    USER_PROFILE: 'vitalic_userProfile',
    SECTION_SETTINGS: 'vitalic_sectionSettings',
    RHYTHM_SETTINGS: 'vitalic_rhythmSettings'
} as const;

/**
 * Get item from storage
 */
export async function getItem(key: string): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
}

/**
 * Set item in storage
 */
export async function setItem(key: string, value: string): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, value);
}

/**
 * Remove item from storage
 */
export async function removeItem(key: string): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
}

/**
 * Clear all storage
 */
export async function clear(): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.clear();
}

/**
 * Synchronous getItem for compatibility with existing code
 */
export function getItemSync(key: string): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
}

/**
 * Synchronous setItem that also updates async storage
 */
export function setItemSync(key: string, value: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, value);
}

/**
 * Load JSON from storage with default value
 */
export function loadJSON<T>(key: string, defaultValue: T): T {
    try {
        const stored = getItemSync(key);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Merge with defaults for objects to handle new properties
            if (typeof defaultValue === 'object' && defaultValue !== null && !Array.isArray(defaultValue)) {
                return { ...defaultValue, ...parsed };
            }
            return parsed;
        }
    } catch (error) {
        console.error(`[Storage] Failed to load ${key}:`, error);
    }
    return defaultValue;
}

/**
 * Save JSON to storage and trigger cloud sync
 */
export function saveJSON<T>(key: string, value: T): void {
    try {
        setItemSync(key, JSON.stringify(value));
        // Trigger cloud sync in background (non-blocking)
        queueCloudSync(key, value);
    } catch (error) {
        console.error(`[Storage] Failed to save ${key}:`, error);
    }
}

/**
 * Clear all ReLife Sync app data
 */
export async function clearAllAppData(): Promise<void> {
    console.log('[Storage] Clearing all app data...');
    if (typeof window !== 'undefined') {
        for (const key of Object.values(STORAGE_KEYS)) {
            localStorage.removeItem(key);
        }
    }
    console.log('[Storage] All app data cleared');
}
