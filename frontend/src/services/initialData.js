import { formatDate } from '../utils/date'

/** 创建默认测试数据 */
export function createInitialData() {
  const today = formatDate()
  return {
    taskDate: today,
    pet: {
      name: '小萌',
      level: 1,
      growthValue: 0,
      hunger: 80,
      cleanliness: 80,
      mood: 80
    },
    inventory: {
      food: 0,
      soap: 0,
      toy: 0
    },
    taskTemplates: [
      {
        id: 't1',
        name: '刷牙',
        icon: '🪥',
        rewardType: 'soap',
        rewardAmount: 1,
        enabled: true,
        sortOrder: 1
      },
      {
        id: 't2',
        name: '阅读',
        icon: '📖',
        rewardType: 'food',
        rewardAmount: 1,
        enabled: true,
        sortOrder: 2
      },
      {
        id: 't3',
        name: '收拾玩具',
        icon: '🧸',
        rewardType: 'toy',
        rewardAmount: 1,
        enabled: true,
        sortOrder: 3
      },
      {
        id: 't4',
        name: '运动',
        icon: '🏃',
        rewardType: 'food',
        rewardAmount: 1,
        enabled: true,
        sortOrder: 4
      }
    ],
    dailyTasks: [],
    streakStat: {
      currentStreak: 0,
      longestStreak: 0,
      totalCompleted: 0,
      lastCheckinDate: null
    },
    dailySummaries: [],
    history: [],
    role: 'child'
  }
}
