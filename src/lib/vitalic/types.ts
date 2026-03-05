
// User Status Types
export enum Phase {
  MAINTENANCE = 'MAINTENANCE',
  REALIGN = 'REALIGN', // Preparation
  RESET = 'RESET',     // The 3-Day Core
  RESTORE = 'RESTORE'  // Recovery
}

// Updated Somatic Log Structure with Optional/Unset support
export interface SomaticLogEntry {
  energy?: number;        // 1 (Foggy/Low) -> 5 (Clear/High)
  digestion?: number;     // 1 (Stuck/Heavy) -> 5 (Light/Flowing)
  sleepQuality?: number;  // 1 (Tired/Restless) -> 5 (Refreshed/Deep)
  lightness?: number;     // 1 (Heavy/Bloated) -> 5 (Light/Airy)
  mood: string[];         // Array of mood tags
  notes?: string;         // Optional text journal
}

// ReAlign Meal Logic
export type MealQuality = 'light' | 'normal' | 'heavy';
export type MealPortion = number; // Percentage (0-200)

export interface ReAlignMealEntry {
  skipped: boolean;
  quality?: MealQuality;
  portion?: MealPortion;
}

export interface ReAlignDailyLog {
  breakfast: ReAlignMealEntry;
  lunch: ReAlignMealEntry;
  dinner: ReAlignMealEntry;
}

// ReStore Meal Logic
export type GutFeeling = 'soothing' | 'gurgling' | 'bloated' | 'pain';
export type ReStoreTexture = 'liquid' | 'light' | 'normal' | 'heavy';

export interface ReStoreMealEntry {
  completed: boolean;
  feeling?: GutFeeling;
  foodDescription?: string;
  texture?: ReStoreTexture;
}

export interface ReStoreDailyLog {
  breakfast: ReStoreMealEntry;
  lunch: ReStoreMealEntry;
  dinner: ReStoreMealEntry;
}

// Action Timestamp Record - records when each action was performed
export type ActionType = 'water' | 'habit' | 'nutrient' | 'mood' | 'reflection' | 'somatic';

export interface ActionTimestamp {
  action: ActionType;
  taskId?: string;        // Related task ID (for habit/nutrient)
  value?: any;            // Specific value (water ml, mood tag, etc)
  timestamp: string;      // ISO 8601 format (e.g., "2026-02-03T21:03:00+08:00")
  source?: 'app' | 'widget' | 'notification'; // Track where the action came from
}

// The complete data shape for a single day
export interface DailyLog {
  waterIntake: number;
  completedTaskIds: string[];
  skippedTaskIds: string[];
  somaticLog: SomaticLogEntry | null;
  reAlignMeals?: ReAlignDailyLog;
  reStoreMeals?: ReStoreDailyLog;
  customTasks?: TimelineEvent[];
  timestamps?: ActionTimestamp[];  // NEW: Detailed action timestamps
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

// Product Definition for Timeline
export interface ProductIntake {
  type: 'snack' | 'meal_set';
  name: string;
  items: string[];
  count: number;
}

export interface TimelineEvent {
  id: string;
  groupId?: string;
  time: string;
  title: string;
  description: string;
  type: 'snack' | 'meal' | 'habit' | 'supplement' | 'water_checkpoint';
  completed: boolean;
  skipped?: boolean;
  product?: ProductIntake;
  hideTime?: boolean;
  brand?: string;
}

export interface UserProfile {
  name: string;
  rhythmId: string;
  nextResetDate: string;
  streakDays: number;
  totalResets: number;
  globalNutrients: TimelineEvent[];
}

// Planning Types
export type Intention = 'GLOW' | 'GROW' | 'FLOW';

export interface PlanConfig {
  nextResetDate: Date | null;
  intention: Intention | null;
  isConfigured: boolean;
  isRecurring: boolean;
  intervalMonths: number;
  occurrences: number;
  realignDuration: number;
  restoreDuration: number;
}

export interface ScheduledReset {
  id: string;
  startDate: Date;
  endDate: Date;
  intention?: Intention;
  type: 'manual' | 'recurring';
  realignDuration: number;
  restoreDuration: number;
  isStockDeducted?: boolean;
  isSkipped?: boolean;
}

export interface StashItem {
  id: string;
  name: string;
  quantity: number;
  status: 'OK' | 'LOW' | 'EMPTY';
}

export interface PhaseDay {
  offset: number;
  date: Date;
  phase: Phase;
  label: string;
  color: string;
}

// Context for the Current Day
export interface TodayContext {
  date: Date;
  phase: Phase;
  cycleDay: number;
  totalDays: number;
  resetId?: string;
}

// ReSet Report Types
export interface VitalicDStats {
  total: number;          // Total expected (24)
  completed: number;      // Actually completed (packets)
  onTime: number;         // Completed within ±30 minutes
  delayed: number;        // Completed 30-60 minutes late
  skipped: number;        // Not completed
  avgDelay: number;       // Average delay in minutes
}

export interface WaterStats {
  dailyIntakes: number[];  // [2800, 2650, 1200] for Day 1-3
  dailyGoal: number;       // 2500ml
  totalIntake: number;     // Sum of all days
  avgPerDose: number;      // Average water per Vitalic D dose
}

export interface BodyTrends {
  energy: number[];        // [3, 2, 4] for Day 1-3
  digestion: number[];
  sleep: number[];
  lightness: number[];
}

export interface HeatmapData {
  hour: number;            // 6-22
  day: number;             // 1-3
  value: number;           // Water amount in ml
}

export interface VitalicDLog {
  plannedTime: string;     // "07:00"
  actualTime: string | null; // ISO timestamp or null if skipped
  delay: number;           // Minutes (positive = late, negative = early)
  status: 'onTime' | 'delayed' | 'skipped';
  waterAmount: number;     // Water consumed around this time
  day: number;             // 1, 2, or 3
  packCount: number;       // Actual Completed Packs
  expectedPacks: number;   // Total Packs planned for this slot
  subTaskDetails?: {       // Detailed stats per pack (for multi-pack slots)
    id: string;
    actualTime: string | null;
    delay: number;
    status: 'onTime' | 'delayed' | 'skipped';
  }[];
}

export interface ReSetReportData {
  resetId: string;
  startDate: Date;
  endDate: Date;
  dailyLogs: DailyLog[];   // 3 days

  // Calculated stats
  vitalicDStats: VitalicDStats;
  vitalicDLogs: VitalicDLog[];  // 15 items
  waterStats: WaterStats;
  bodyTrends: BodyTrends;
  moodTags: string[];      // All mood tags from 3 days

  // Completion metrics
  overallCompletion: number;  // Percentage (0-100)
  perfectDays: number;        // Days with 100% completion
}

// ================================================
// Order System Types
// ================================================

// Enums
export type OrderSource = 'app' | 'subscription' | 'amazon' | 'ebay';
export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentMethod = 'stripe' | 'paypal';
export type CarrierType = 'amazon_mcf' | 'dhl' | 'ups' | 'fedex';
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'past_due';
export type ExternalPlatform = 'amazon' | 'ebay';
export type InventoryReason = 'purchase' | 'reset_deduction' | 'manual' | 'refund' | 'external_redemption' | 'subscription_renewal';

// Product & Pricing
export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  base_price_cents: number;
  currency: string;
  image_url?: string;
  is_active: boolean;
  amazon_sku?: string;
  ebay_item_id?: string;
  created_at: string;
  updated_at: string;
}

export interface PricingTier {
  id: string;
  product_id: string;
  min_quantity: number;
  price_cents: number;
  label?: string;
  currency: string;
}

// Shipping Address
export interface ShippingAddress {
  id: string;
  user_id: string;
  name?: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postal_code?: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// Order
export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  source: OrderSource;
  external_order_id?: string;
  status: OrderStatus;
  subtotal_cents: number;
  discount_cents: number;
  shipping_cents: number;
  total_cents: number;
  currency: string;
  payment_method?: PaymentMethod;
  stripe_payment_intent_id?: string;
  stripe_subscription_id?: string;
  shipping_address?: ShippingAddress;
  tracking_number?: string;
  tracking_url?: string;
  carrier?: CarrierType;
  shipped_at?: string;
  delivered_at?: string;
  cancel_requested_at?: string;
  cancel_reason?: string;
  cancelled_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

// Order Line Item
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price_cents: number;
  total_cents: number;
  created_at: string;
  product?: Product;
}

// Subscription
export interface Subscription {
  id: string;
  user_id: string;
  product_id: string;
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
  status: SubscriptionStatus;
  quantity: number;
  lead_days: number;
  linked_reset_id?: string;
  next_billing_date?: string;
  created_at: string;
  updated_at: string;
  product?: Product;
}

// External Order (Amazon / eBay)
export interface ExternalOrder {
  id: string;
  user_id?: string;
  platform: ExternalPlatform;
  external_order_id: string;
  external_order_number?: string;
  raw_data?: Record<string, unknown>;
  product_sku?: string;
  quantity?: number;
  order_date?: string;
  is_redeemed: boolean;
  redeemed_at?: string;
  redeemed_by_user_id?: string;
  linked_order_id?: string;
  created_at: string;
  updated_at: string;
}

// Inventory Change Log
export interface InventoryLog {
  id: string;
  user_id: string;
  product_id: string;
  delta: number;
  reason: InventoryReason;
  order_id?: string;
  external_order_id?: string;
  reset_id?: string;
  balance_after: number;
  created_at: string;
}

// Cart (client-side, not persisted to DB)
export interface CartItem {
  product: Product;
  quantity: number;
  unit_price_cents: number;
  total_cents: number;
}

export interface Cart {
  items: CartItem[];
  subtotal_cents: number;
  discount_cents: number;
  shipping_cents: number;
  total_cents: number;
  currency: string;
}

// Helper: format cents to display price
export const formatPrice = (cents: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100);
};

// Helper: resolve tiered price for a given quantity
export const resolveTierPrice = (tiers: PricingTier[], quantity: number): number => {
  const sorted = [...tiers].sort((a, b) => b.min_quantity - a.min_quantity);
  const tier = sorted.find(t => quantity >= t.min_quantity);
  return tier ? tier.price_cents : tiers[0]?.price_cents ?? 0;
};

// Subscription discount rate (10%)
export const SUBSCRIPTION_DISCOUNT_RATE = 0.10;
