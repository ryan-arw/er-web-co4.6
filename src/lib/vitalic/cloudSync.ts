import { createClient } from '@/lib/supabase/client';
import { STORAGE_KEYS } from './storage';

// ─── Cloud Sync Engine ───
// Strategy: Local-First with background cloud sync
// - All writes go to localStorage first (instant, offline-safe)
// - Then queue a background sync to Supabase (non-blocking)
// - On app start, pull from cloud and merge with local

let syncQueue: Map<string, any> = new Map();
let syncTimer: ReturnType<typeof setTimeout> | null = null;
const SYNC_DEBOUNCE_MS = 2000; // Batch writes every 2 seconds

/**
 * Queue a key-value pair for cloud sync (debounced)
 * Called from storage.ts after every local save
 */
export function queueCloudSync(key: string, value: any): void {
    syncQueue.set(key, value);

    // Debounce: wait for writes to settle before pushing
    if (syncTimer) clearTimeout(syncTimer);
    syncTimer = setTimeout(() => {
        flushSyncQueue();
    }, SYNC_DEBOUNCE_MS);
}

/**
 * Flush all queued changes to Supabase
 */
export async function flushSyncQueue(): Promise<void> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || syncQueue.size === 0) return;

    const entries = Array.from(syncQueue.entries());
    syncQueue.clear();

    try {
        // Upsert all queued items in parallel
        const promises = entries.map(([key, value]) =>
            supabase
                .from('user_data')
                .upsert(
                    {
                        user_id: user.id,
                        data_key: key,
                        data_value: value,
                        updated_at: new Date().toISOString()
                    },
                    { onConflict: 'user_id,data_key' }
                )
        );

        const results = await Promise.allSettled(promises);
        const failures = results.filter(r => r.status === 'rejected');
        if (failures.length > 0) {
            console.warn(`[CloudSync] ${failures.length}/${entries.length} items failed to sync`);
        } else {
            console.log(`[CloudSync] Synced ${entries.length} items to cloud`);
        }
    } catch (err) {
        console.error('[CloudSync] Flush failed:', err);
        // Re-queue failed items for retry
        entries.forEach(([key, value]) => syncQueue.set(key, value));
    }
}

/**
 * Pull all user data from Supabase and merge with local storage
 * Called on app startup after authentication
 */
export async function pullFromCloud(): Promise<string[]> {
    if (typeof window === 'undefined') return []; // Prevent SSR execution

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    try {
        const { data, error } = await supabase
            .from('user_data')
            .select('data_key, data_value, updated_at')
            .eq('user_id', user.id);

        if (error) throw error;
        if (!data || data.length === 0) {
            console.log('[CloudSync] No cloud data found, keeping local data');
            return [];
        }

        // Merge: cloud data wins if it's newer
        const changedKeys: string[] = [];
        let mergeCount = 0;
        for (const row of data) {
            const localRaw = localStorage.getItem(row.data_key);
            const cloudValueString = JSON.stringify(row.data_value);

            // Only update if local is empty OR cloud data is different
            if (!localRaw || localRaw !== cloudValueString) {
                localStorage.setItem(row.data_key, cloudValueString);
                changedKeys.push(row.data_key);
                mergeCount++;
            }
        }

        if (mergeCount > 0) {
            console.log(`[CloudSync] Updated ${mergeCount} items from cloud:`, changedKeys);
        }
        return changedKeys;
    } catch (err) {
        console.error('[CloudSync] Pull failed:', err);
        return [];
    }
}

/**
 * Push ALL local data to cloud (used on first login to migrate local data)
 */
export async function pushAllToCloud(): Promise<boolean> {
    if (typeof window === 'undefined') return false; // Prevent SSR execution

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    try {
        const allKeys = Object.values(STORAGE_KEYS);
        const upserts: { user_id: string; data_key: string; data_value: any; updated_at: string }[] = [];

        for (const key of allKeys) {
            const raw = localStorage.getItem(key);
            if (raw) {
                try {
                    const parsed = JSON.parse(raw);
                    upserts.push({
                        user_id: user.id,
                        data_key: key,
                        data_value: parsed,
                        updated_at: new Date().toISOString()
                    });
                } catch {
                    // Non-JSON value, store as string
                    upserts.push({
                        user_id: user.id,
                        data_key: key,
                        data_value: raw,
                        updated_at: new Date().toISOString()
                    });
                }
            }
        }

        if (upserts.length === 0) {
            console.log('[CloudSync] No local data to push');
            return true;
        }

        const { error } = await supabase
            .from('user_data')
            .upsert(upserts, { onConflict: 'user_id,data_key' });

        if (error) throw error;

        console.log(`[CloudSync] Pushed ${upserts.length} items to cloud`);
        return true;
    } catch (err) {
        console.error('[CloudSync] Push all failed:', err);
        return false;
    }
}

/**
 * Sync user profile to Supabase profiles table
 */
export async function syncProfile(name: string, rhythmId: string): Promise<void> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
        await supabase
            .from('profiles')
            .upsert({
                id: user.id,
                name,
                rhythm_id: rhythmId,
                updated_at: new Date().toISOString()
            });
    } catch (err) {
        console.error('[CloudSync] Profile sync failed:', err);
    }
}

/**
 * Full sync cycle: pull from cloud, then push local changes
 * Called on app startup when user is authenticated
 */
export async function fullSync(): Promise<string[]> {
    try {
        // Step 1: Check if cloud has data
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data: cloudData } = await supabase
            .from('user_data')
            .select('data_key')
            .eq('user_id', user.id)
            .limit(1);

        if (cloudData && cloudData.length > 0) {
            // Cloud has data → pull first (cloud is source of truth)
            return await pullFromCloud();
        } else {
            // Cloud is empty → push local data up (first-time migration)
            console.log('[CloudSync] First sync detected, migrating local data to cloud...');
            await pushAllToCloud();
            return [];
        }
    } catch (err) {
        console.error('[CloudSync] Full sync failed:', err);
        return [];
    }
}
