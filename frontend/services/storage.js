import { createInitialData } from '../../mock/initialData'
import { formatDate, getRecentDates } from '../utils/date'
import { usePetItem } from './pet'
import { ITEM_LABELS } from '../constants/pet'

const STORAGE_KEY = 'pet_checkin_data'

let memoryCache = null

function readStorage() {
  if (memoryCache) return memoryCache
  try {
    const raw = uni.getStorageSync(STORAGE_KEY)
    if (raw) {
      memoryCache = typeof raw === 'string' ? JSON.parse(raw) : raw
      return memoryCache
    }
  } catch (e) {
    console.warn('read storage failed', e)
  }
  return null
}

function writeStorage(data) {
  memoryCache = data
  uni.setStorageSync(STORAGE_KEY, data)
}

export function initAppData() {
  const today = formatDate()
  let data = readStorage()
  if (!data) {
    data = createInitialData()
    ensureDailyTasks(data, today)
    writeStorage(data)
    return data
  }
  if (data.taskDate !== today) {
    resetDailyTasks(data, today)
    writeStorage(data)
  } else {
    ensureDailyTasks(data, today)
    writeStorage(data)
  }
  return data
}

export function getAppData() {
  const today = formatDate()
  let data = readStorage()
  if (!data) {
    return initAppData()
  }
  if (data.taskDate !== today) {
    resetDailyTasks(data, today)
    writeStorage(data)
  }
  return data
}

function ensureDailyTasks(data, today) {
  const enabledTemplates = data.taskTemplates
    .filter((t) => t.enabled)
    .sort((a, b) => a.sortOrder - b.sortOrder)

  const existingMap = {}
  ;(data.dailyTasks || []).forEach((task) => {
    if (task.taskDate === today) existingMap[task.templateId] = task
  })

  data.dailyTasks = enabledTemplates.map((tpl) => {
    const existing = existingMap[tpl.id]
    if (existing) return existing
    return {
      id: `d_${tpl.id}_${today}`,
      templateId: tpl.id,
      taskDate: today,
      name: tpl.name,
      icon: tpl.icon,
      rewardType: tpl.rewardType,
      rewardAmount: tpl.rewardAmount,
      status: 'pending'
    }
  })
  data.taskDate = today
}

function resetDailyTasks(data, today) {
  data.taskDate = today
  data.dailyTasks = []
  ensureDailyTasks(data, today)
}

export function getHomeData() {
  const data = getAppData()
  return {
    pet: data.pet,
    inventory: data.inventory
  }
}

export function getDailyTasks() {
  const data = getAppData()
  return data.dailyTasks.filter((t) => t.taskDate === data.taskDate)
}

export function completeTask(taskId) {
  const data = getAppData()
  const task = data.dailyTasks.find((t) => t.id === taskId)
  if (!task) return { ok: false, message: '任务不存在' }
  if (task.status === 'done') return { ok: false, message: '今天已经完成过啦' }

  task.status = 'done'
  const rewardType = task.rewardType
  data.inventory[rewardType] = (data.inventory[rewardType] || 0) + (task.rewardAmount || 1)

  const today = data.taskDate
  updateStreak(data, today)

  data.history.unshift({
    id: `h_${Date.now()}`,
    date: today,
    taskName: task.name,
    rewardType,
    rewardAmount: task.rewardAmount,
    type: 'task_complete'
  })
  data.history = data.history.slice(0, 50)

  updateDailySummary(data, today)
  writeStorage(data)

  return {
    ok: true,
    message: `获得${ITEM_LABELS[rewardType]} ×${task.rewardAmount}`,
    rewardType,
    rewardAmount: task.rewardAmount
  }
}

function updateStreak(data, today) {
  const stat = data.streakStat
  const doneToday = data.dailyTasks.some((t) => t.taskDate === today && t.status === 'done')
  if (!doneToday) return

  if (stat.lastCheckinDate === today) return

  const yesterday = new Date(today.replace(/-/g, '/'))
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = formatDate(yesterday)

  if (stat.lastCheckinDate === yesterdayStr) {
    stat.currentStreak += 1
  } else if (!stat.lastCheckinDate) {
    stat.currentStreak = 1
  } else {
    stat.currentStreak = 1
  }

  stat.lastCheckinDate = today
  stat.totalCompleted += 1
  stat.longestStreak = Math.max(stat.longestStreak, stat.currentStreak)
}

function updateDailySummary(data, today) {
  if (!data.dailySummaries) data.dailySummaries = []
  const total = data.dailyTasks.length
  const completed = data.dailyTasks.filter((t) => t.status === 'done').length
  const existing = data.dailySummaries.find((s) => s.date === today)
  const summary = {
    date: today,
    completedCount: completed,
    totalCount: total,
    hasCheckin: completed > 0
  }
  if (existing) {
    Object.assign(existing, summary)
  } else {
    data.dailySummaries.unshift(summary)
  }
  data.dailySummaries = data.dailySummaries.slice(0, 30)
}

export function performPetAction(actionType) {
  const data = getAppData()
  const result = usePetItem(data.pet, data.inventory, actionType)
  if (!result.ok) return result

  data.pet = result.pet
  data.inventory = result.inventory
  writeStorage(data)
  return result
}

export function getRecordData() {
  const data = getAppData()
  const recentDates = getRecentDates(7)
  const summaryMap = {}
  ;(data.dailySummaries || []).forEach((s) => {
    summaryMap[s.date] = s
  })

  const weekDays = recentDates.map((date) => ({
    date,
    hasCheckin: summaryMap[date]?.hasCheckin || false
  }))

  return {
    pet: data.pet,
    streakStat: data.streakStat,
    weekDays,
    history: (data.history || []).slice(0, 10)
  }
}

export function getTaskTemplates() {
  const data = getAppData()
  return [...data.taskTemplates].sort((a, b) => a.sortOrder - b.sortOrder)
}

export function toggleTaskTemplate(templateId, enabled) {
  const data = getAppData()
  const tpl = data.taskTemplates.find((t) => t.id === templateId)
  if (!tpl) return { ok: false, message: '任务不存在' }
  tpl.enabled = enabled
  ensureDailyTasks(data, data.taskDate)
  writeStorage(data)
  return { ok: true }
}

export function resetAllData() {
  const data = createInitialData()
  ensureDailyTasks(data, data.taskDate)
  writeStorage(data)
  return data
}
