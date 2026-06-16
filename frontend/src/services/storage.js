import { createInitialData } from './initialData'
import { formatDate, getRecentDates } from '../utils/date'
import { usePetItem } from './pet'
import { ITEM_LABELS } from '../constants/pet'

const STORAGE_KEY = 'pet_checkin_data'

let memoryCache = null

function readStorage() {
  if (memoryCache) return memoryCache
  try {
    const raw = uni.getStorageSync(STORAGE_KEY)
    if (!raw) return null
    const data = typeof raw === 'string' ? JSON.parse(raw) : raw
    if (!data || typeof data !== 'object') return null
    return data
  } catch (e) {
    console.warn('read storage failed', e)
    return null
  }
}

function writeStorage(data) {
  memoryCache = data
  try {
    uni.setStorageSync(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.warn('write storage failed', e)
    uni.setStorageSync(STORAGE_KEY, data)
  }
}

/** 合并默认值，修复损坏或不完整的本地数据 */
export function repairAppData(data) {
  const defaults = createInitialData()
  if (!data || typeof data !== 'object') return defaults

  const taskTemplates =
    Array.isArray(data.taskTemplates) && data.taskTemplates.length > 0
      ? data.taskTemplates
      : defaults.taskTemplates

  return {
    ...defaults,
    ...data,
    pet: { ...defaults.pet, ...(data.pet || {}) },
    inventory: { ...defaults.inventory, ...(data.inventory || {}) },
    taskTemplates,
    dailyTasks: Array.isArray(data.dailyTasks) ? data.dailyTasks : [],
    streakStat: { ...defaults.streakStat, ...(data.streakStat || {}) },
    dailySummaries: Array.isArray(data.dailySummaries) ? data.dailySummaries : [],
    history: Array.isArray(data.history) ? data.history : [],
    role: data.role === 'parent' ? 'parent' : 'child'
  }
}

function loadAndPrepareData() {
  const today = formatDate()
  let data = readStorage()
  if (!data) {
    data = createInitialData()
  } else {
    data = repairAppData(data)
  }
  if (data.taskDate !== today) {
    data.taskDate = today
    data.dailyTasks = []
  }
  ensureDailyTasks(data, today)
  writeStorage(data)
  return data
}

export function initAppData() {
  return loadAndPrepareData()
}

export function getAppData() {
  if (!memoryCache) {
    const stored = readStorage()
    if (!stored) return loadAndPrepareData()
    memoryCache = repairAppData(stored)
  }
  const today = formatDate()
  const data = repairAppData(memoryCache)
  if (data.taskDate !== today) {
    data.taskDate = today
    data.dailyTasks = []
  }
  ensureDailyTasks(data, today)
  writeStorage(data)
  return data
}

function ensureDailyTasks(data, today) {
  if (!Array.isArray(data.taskTemplates)) {
    data.taskTemplates = createInitialData().taskTemplates
  }

  const enabledTemplates = data.taskTemplates
    .filter((t) => t && t.enabled)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))

  const existingMap = {}
  ;(data.dailyTasks || []).forEach((task) => {
    if (task && task.taskDate === today) existingMap[task.templateId] = task
  })

  data.dailyTasks = enabledTemplates.map((tpl) => {
    const existing = existingMap[tpl.id]
    if (existing) {
      existing.name = tpl.name
      existing.icon = tpl.icon
      existing.rewardType = tpl.rewardType
      existing.rewardAmount = tpl.rewardAmount
      return existing
    }
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

export function getHomeData() {
  const data = getAppData()
  const todayTasks = data.dailyTasks.filter((t) => t.taskDate === data.taskDate)
  const doneCount = todayTasks.filter((t) => t.status === 'done').length
  const waitingCount = todayTasks.filter((t) => t.status === 'waiting').length
  return {
    pet: data.pet,
    inventory: data.inventory,
    taskStats: {
      total: todayTasks.length,
      done: doneCount,
      pending: todayTasks.length - doneCount
    },
    pendingConfirms: waitingCount
  }
}

export function getDailyTasks() {
  const data = getAppData()
  return [...data.dailyTasks.filter((t) => t.taskDate === data.taskDate)]
}

/**
 * 孩子打卡：仅将任务标记为待确认，不发放奖励。
 * 奖励在家长确认通过后由 reviewCheckin 发放。
 */
export function submitCheckin(taskId) {
  const data = getAppData()
  const task = data.dailyTasks.find((t) => t.id === taskId)
  if (!task) return { ok: false, message: '任务不存在' }
  if (task.status === 'done') return { ok: false, message: '今天已经完成过啦' }
  if (task.status === 'waiting') return { ok: false, message: '正在等待家长确认～' }

  task.status = 'waiting'
  writeStorage(data)

  return { ok: true, message: '打卡成功，等爸爸妈妈确认吧～' }
}

/**
 * 家长审核：确认通过发放奖励并更新记录；驳回则回退为未完成。
 */
export function reviewCheckin(taskId, approved) {
  const data = getAppData()
  const task = data.dailyTasks.find((t) => t.id === taskId)
  if (!task) return { ok: false, message: '任务不存在' }
  if (task.status !== 'waiting') return { ok: false, message: '该任务不在待确认状态' }

  if (!approved) {
    task.status = 'pending'
    writeStorage(data)
    return { ok: true, message: '已驳回，孩子可以重新打卡' }
  }

  task.status = 'done'
  const rewardType = task.rewardType
  data.inventory[rewardType] = (data.inventory[rewardType] || 0) + (task.rewardAmount || 1)

  const today = data.taskDate
  updateStreak(data, today)

  if (!Array.isArray(data.history)) data.history = []
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
    message: `确认通过！获得${ITEM_LABELS[rewardType]} ×${task.rewardAmount}`,
    rewardType,
    rewardAmount: task.rewardAmount
  }
}

/**
 * 获取当日所有待家长确认的任务。
 */
export function getPendingConfirmations() {
  const data = getAppData()
  return data.dailyTasks.filter((t) => t.taskDate === data.taskDate && t.status === 'waiting')
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
  memoryCache = null
  try {
    uni.removeStorageSync(STORAGE_KEY)
  } catch (e) {
    console.warn('remove storage failed', e)
  }
  const data = createInitialData()
  ensureDailyTasks(data, data.taskDate)
  writeStorage(data)
  return data
}

/**
 * 保存任务模板（新增或编辑）。
 * 若有 id 则为编辑，无 id 则为新增。
 */
export function saveTaskTemplate(template) {
  const data = getAppData()

  // 基本校验
  if (!template.name || !template.name.trim()) {
    return { ok: false, message: '请输入任务名称' }
  }
  if (!template.rewardType) {
    return { ok: false, message: '请选择奖励类型' }
  }

  const existing = data.taskTemplates.find((t) => t.id === template.id)
  if (existing) {
    // 编辑：合并字段
    Object.assign(existing, {
      name: template.name.trim(),
      icon: template.icon || '⭐',
      rewardType: template.rewardType,
      rewardAmount: template.rewardAmount || 1
    })
  } else {
    // 新增：生成新 ID
    const newId = `t_${Date.now()}`
    const maxOrder = data.taskTemplates.reduce(
      (max, t) => Math.max(max, t.sortOrder || 0),
      0
    )
    data.taskTemplates.push({
      id: newId,
      name: template.name.trim(),
      icon: template.icon || '⭐',
      rewardType: template.rewardType,
      rewardAmount: template.rewardAmount || 1,
      enabled: true,
      sortOrder: maxOrder + 1
    })
  }

  ensureDailyTasks(data, data.taskDate)
  writeStorage(data)
  return { ok: true, message: existing ? '任务已更新' : '任务已新增' }
}

/**
 * 设置页：修改宠物名称。
 */
export function savePetName(name) {
  if (!name || !name.trim()) {
    return { ok: false, message: '名称不能为空' }
  }
  const data = getAppData()
  data.pet.name = name.trim()
  writeStorage(data)
  return { ok: true, message: '宠物名称已更新' }
}

/**
 * 切换角色。
 */
export function switchRole(role) {
  if (role !== 'child' && role !== 'parent') {
    return { ok: false, message: '无效角色' }
  }
  const data = getAppData()
  data.role = role
  writeStorage(data)
  return { ok: true, message: role === 'parent' ? '已切换为家长模式' : '已切换为孩子模式' }
}

/**
 * 获取当前角色。
 */
export function getRole() {
  const data = getAppData()
  return data.role || 'child'
}

/**
 * 删除任务模板。
 */
export function deleteTaskTemplate(templateId) {
  const data = getAppData()
  const idx = data.taskTemplates.findIndex((t) => t.id === templateId)
  if (idx === -1) return { ok: false, message: '任务不存在' }

  data.taskTemplates.splice(idx, 1)
  ensureDailyTasks(data, data.taskDate)
  writeStorage(data)
  return { ok: true, message: '任务已删除' }
}
