
import { Phase, TimelineEvent, Badge } from './types';

// Brand Colors
export const COLORS = {
  sync: '#f3723e', // Vitality Orange
  trace: '#b7da80', // Morning Green
  plan: '#F6E8B1', // Flow Yellow
  base: '#787878', // Neutral Gray for base
  ivory: '#F9FCEB',
  textMain: '#1F2937',
  textSub: '#6B7280'
};

export const CUP_SIZE_ML = 250;

// Dynamic Water Goals based on Phase
export const getWaterGoal = (phase: Phase): number => {
  switch (phase) {
    case Phase.RESET: return 3500;
    case Phase.REALIGN: return 2500;
    case Phase.RESTORE: return 2500;
    default: return 2000;
  }
};

// --- Vitalic D Product Schedule ---
export const RESET_SCHEDULE_TEMPLATE: TimelineEvent[] = [
  {
    id: 'reset_1',
    time: '06:00',
    title: 'Wake-Up Call',
    description: 'Awaken metabolism + Warm Water',
    type: 'snack',
    completed: false,
    product: { type: 'snack', name: 'Vitalic Snack', items: ['1x Snack Sachet'], count: 1 }
  },
  {
    id: 'reset_2',
    time: '08:00',
    title: 'Energy Sync',
    description: 'Fiber Matrix + Enzymes Ignition',
    type: 'meal',
    completed: false,
    product: { type: 'meal_set', name: 'Meal 1 + Meal 2', items: ['Meal 1 (Cleanse)', 'Meal 2 (Nourish)'], count: 2 }
  },
  {
    id: 'reset_3',
    time: '12:00',
    title: 'Flow Maintenance',
    description: 'Sustain energy, prevent slump',
    type: 'meal',
    completed: false,
    product: { type: 'meal_set', name: 'Meal 1 + Meal 2', items: ['Meal 1 (Cleanse)', 'Meal 2 (Nourish)'], count: 2 }
  },
  {
    id: 'reset_4',
    time: '18:00',
    title: 'Gentle Unloading',
    description: 'Prepare for nightly repair',
    type: 'meal',
    completed: false,
    product: { type: 'meal_set', name: 'Meal 1 + Meal 2', items: ['Meal 1 (Cleanse)', 'Meal 2 (Nourish)'], count: 2 }
  },
  {
    id: 'reset_5',
    time: '20:00',
    title: 'Rest Mode',
    description: 'Soothe hunger, signal deep rest',
    type: 'snack',
    completed: false,
    product: { type: 'snack', name: 'Vitalic Snack', items: ['1x Snack Sachet'], count: 1 }
  },
];

// --- ReAlign Schedule ---
export const REALIGN_SCHEDULE_TEMPLATE: TimelineEvent[] = [
  { id: 'align_1', time: '07:00', title: 'Warm Wake Up', description: 'Warm water or veggie soup. No cold drinks.', type: 'habit', completed: false },
  { id: 'align_bk', time: '08:30', title: 'Nourishing Start', description: 'Warm oatmeal, congee, or steamed egg.', type: 'meal', completed: false },
  { id: 'align_2', time: '10:00', title: 'Caffeine Check', description: 'Skipped coffee today? (Reduce noise)', type: 'habit', completed: false },
  { id: 'align_3', time: '13:00', title: 'Clean Lunch', description: 'Steamed/Boiled. No fried foods.', type: 'meal', completed: false },
  { id: 'align_4', time: '19:00', title: 'Light Dinner', description: 'Half portion size. Reduce load.', type: 'meal', completed: false },
];

// --- ReStore Schedule Day 1 ---
export const RESTORE_LIQUID_SCHEDULE: TimelineEvent[] = [
  { id: 'rs_l_1', time: '08:00', title: 'Enzyme Boost', description: 'Warm water with lemon or ACV', type: 'meal', completed: false },
  { id: 'rs_l_2', time: '10:00', title: 'Liquid Nourish', description: 'Bone broth or Miso soup', type: 'meal', completed: false },
  { id: 'rs_l_3', time: '13:00', title: 'Probiotic Punch', description: 'Fermented juice or Kefir', type: 'meal', completed: false },
  { id: 'rs_l_4', time: '19:00', title: 'Calming Sip', description: 'Herbal tea or Golden Milk', type: 'meal', completed: false },
];

// --- ReStore Schedule Day 2 ---
export const RESTORE_SOFT_SCHEDULE: TimelineEvent[] = [
  { id: 'rs_s_1', time: '08:00', title: 'Gentle Awakening', description: 'Steamed cooked fruit/veggies', type: 'meal', completed: false },
  { id: 'rs_s_2', time: '13:00', title: 'Soft Landing', description: 'Congee, Oatmeal or Scrambled Eggs', type: 'meal', completed: false },
  { id: 'rs_s_3', time: '19:00', title: 'Root Grounding', description: 'Root vegetable soup (blended)', type: 'meal', completed: false },
];

// --- ReStore Schedule Day 3+ ---
export const RESTORE_SOLID_SCHEDULE: TimelineEvent[] = [
  { id: 'rs_sol_1', time: '08:00', title: 'Nourishing Start', description: 'Normal breakfast with protein', type: 'meal', completed: false },
  { id: 'rs_sol_2', time: '13:00', title: 'Balanced Fuel', description: 'Complex carbs and lean protein', type: 'meal', completed: false },
  { id: 'rs_sol_3', time: '19:00', title: 'Fiber Feast', description: 'High fiber dinner', type: 'meal', completed: false },
];

// --- Maintenance Schedule (Time Hiding Logic) ---
// --- Maintenance Schedule (Time Hiding Logic) ---
export const MAINTENANCE_SCHEDULE_TEMPLATE: TimelineEvent[] = [
  { id: 'm4', time: '06:00', title: 'Overnight Fast Complete', description: '12h Rest & Repair finished.', type: 'habit', completed: false },
  { id: 'm1', time: '06:05', title: 'Morning Hydration', description: '250ml Warm Water + Lemon', type: 'habit', completed: false },
  { id: 'm5', time: '06:10', title: 'Gut Awakening Massage', description: 'Clockwise circles to stimulate flow.', type: 'habit', completed: false },
  { id: 'm6', time: '06:15', title: 'Morning Activation', description: '5-10 min Squats, Stretches or Walk.', type: 'habit', completed: false },
];

// Mock Badges
export const BADGES: Badge[] = [
  { id: '1', name: 'Reset Initiate', description: 'Completed first 3-day Reset', icon: 'award', unlocked: true },
  { id: '2', name: 'Rhythm Keeper', description: '2 Consecutive Seasons', icon: 'shield', unlocked: false },
  { id: '3', name: 'Flow Master', description: '30 Days Water Streak', icon: 'droplet', unlocked: true },
];

// Mock Data
export const CHART_DATA = [
  { day: 'Mon', flow: 4, energy: 5 },
  { day: 'Tue', flow: 6, energy: 6 },
  { day: 'Wed', flow: 5, energy: 7 },
  { day: 'Thu', flow: 8, energy: 8 },
  { day: 'Fri', flow: 9, energy: 8 },
  { day: 'Sat', flow: 8, energy: 9 },
  { day: 'Sun', flow: 9, energy: 9 },
];
