import { HealthPhase } from './health-types';

export interface TimelineEvent {
    id: string;
    time: string;
    title: string;
    description: string;
    type: 'meal' | 'snack' | 'habit' | 'water';
    product?: {
        name: string;
        items: string[];
        count: number;
    };
}

export const RESET_SCHEDULE_TEMPLATE: TimelineEvent[] = [
    {
        id: 'reset_1',
        time: '06:00',
        title: '唤醒补充 (Wake-Up)',
        description: '唤醒代谢 + 温水',
        type: 'snack',
        product: { name: 'Vitalic Snack', items: ['1x Snack Sachet'], count: 1 }
    },
    {
        id: 'reset_2',
        time: '08:00',
        title: '能量同步 (Energy Sync)',
        description: '纤维矩阵 + 酶催化点火',
        type: 'meal',
        product: { name: 'Meal 1 + Meal 2', items: ['Meal 1 (Cleanse)', 'Meal 2 (Nourish)'], count: 2 }
    },
    {
        id: 'reset_3',
        time: '12:00',
        title: '流动维持 (Flow Maintenance)',
        description: '维持能量，防止下滑',
        type: 'meal',
        product: { name: 'Meal 1 + Meal 2', items: ['Meal 1 (Cleanse)', 'Meal 2 (Nourish)'], count: 2 }
    },
    {
        id: 'reset_4',
        time: '18:00',
        title: '温和卸载 (Gentle Unloading)',
        description: '准备夜间修复',
        type: 'meal',
        product: { name: 'Meal 1 + Meal 2', items: ['Meal 1 (Cleanse)', 'Meal 2 (Nourish)'], count: 2 }
    },
    {
        id: 'reset_5',
        time: '20:00',
        title: '休息模式 (Rest Mode)',
        description: '缓解饥饿，发出深度休息信号',
        type: 'snack',
        product: { name: 'Vitalic Snack', items: ['1x Snack Sachet'], count: 1 }
    },
];

export const REALIGN_SCHEDULE_TEMPLATE: TimelineEvent[] = [
    { id: 'align_1', time: '07:00', title: '温暖唤醒', description: '温水或蔬菜汤。无冷饮。', type: 'habit' },
    { id: 'align_bk', time: '08:30', title: '营养开始', description: '温热燕麦粥、瘦肉粥或蒸蛋。', type: 'meal' },
    { id: 'align_2', time: '10:00', title: '咖啡因检查', description: '今天少喝咖啡了吗？(降低噪音)', type: 'habit' },
    { id: 'align_3', time: '13:00', title: '洁净午餐', description: '蒸/煮。无油炸。', type: 'meal' },
    { id: 'align_4', time: '19:00', title: '轻盈晚餐', description: '份量减半。降低负荷。', type: 'meal' },
];

export const RESTORE_LIQUID_SCHEDULE: TimelineEvent[] = [
    { id: 'rs_l_1', time: '08:00', title: '酶力增强', description: '温水加柠檬或苹果醋', type: 'meal' },
    { id: 'rs_l_2', time: '10:00', title: '液态滋养', description: '骨头汤或味增汤', type: 'meal' },
    { id: 'rs_l_3', time: '13:00', title: '益生菌动力', description: '发酵果汁或开菲尔', type: 'meal' },
    { id: 'rs_l_4', time: '19:00', title: '平静吸吮', description: '花草茶或黄金奶', type: 'meal' },
];

export const MAINTENANCE_SCHEDULE_TEMPLATE: TimelineEvent[] = [
    { id: 'm1', time: '06:05', title: '晨间补水', description: '250ml 温水 + 柠檬', type: 'habit' },
    { id: 'm5', time: '06:10', title: '肠道唤醒按摩', description: '顺时针揉腹，刺激蠕动。', type: 'habit' },
    { id: 'm6', time: '06:15', title: '晨间激活', description: '5-10 分钟深蹲、拉伸或散步。', type: 'habit' },
];

export const getWaterGoal = (phase: HealthPhase): number => {
    switch (phase) {
        case 'RESET': return 3500;
        case 'REALIGN': return 2500;
        case 'RESTORE': return 2500;
        default: return 2000;
    }
};

export const getScheduleForPhase = (phase: HealthPhase, cycleDay: number = 1): TimelineEvent[] => {
    switch (phase) {
        case 'RESET': return RESET_SCHEDULE_TEMPLATE;
        case 'REALIGN': return REALIGN_SCHEDULE_TEMPLATE;
        case 'RESTORE':
            if (cycleDay === 1) return RESTORE_LIQUID_SCHEDULE;
            return REALIGN_SCHEDULE_TEMPLATE; // Default to ReAlign if 
        case 'MAINTENANCE':
        default:
            return MAINTENANCE_SCHEDULE_TEMPLATE;
    }
};
