import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getAppData,
  getHomeData,
  getDailyTasks,
  submitCheckin as doSubmitCheckin,
  reviewCheckin as doReviewCheckin,
  getPendingConfirmations,
  getTaskTemplates,
  toggleTaskTemplate as doToggleTaskTemplate,
  saveTaskTemplate as doSaveTaskTemplate,
  deleteTaskTemplate as doDeleteTaskTemplate,
  resetAllData as doResetAllData,
  getRecordData,
  performPetAction
} from '../services/storage'

export const useTasksStore = defineStore('tasks', () => {
  // ---- 任务模板 ----
  const taskTemplates = ref([])

  // ---- 今日任务 ----
  const dailyTasks = ref([])

  // ---- 打卡统计 ----
  const streakStat = ref({
    currentStreak: 0,
    longestStreak: 0,
    totalCompleted: 0,
    lastCheckinDate: null
  })

  // ---- 历史记录 ----
  const history = ref([])
  const weekDays = ref([])

  async function loadAll() {
    const homeData = await getHomeData()
    taskTemplates.value = await getTaskTemplates()
    dailyTasks.value = await getDailyTasks()

    const recordData = await getRecordData()
    streakStat.value = recordData.streakStat
    history.value = recordData.history
    weekDays.value = recordData.weekDays
  }

  async function loadTaskTemplates() {
    taskTemplates.value = await getTaskTemplates()
  }

  async function loadDailyTasks() {
    dailyTasks.value = [...await getDailyTasks()]
  }

  async function loadRecordData() {
    const recordData = await getRecordData()
    streakStat.value = recordData.streakStat
    history.value = recordData.history
    weekDays.value = recordData.weekDays
  }

  // ---- 计算属性 ----
  const pendingConfirmations = computed(() => {
    return dailyTasks.value.filter((t) => t.status === 'waiting')
  })

  const taskStats = computed(() => {
    const total = dailyTasks.value.length
    const done = dailyTasks.value.filter((t) => t.status === 'done').length
    return { total, done, pending: total - done }
  })

  const pendingConfirmsCount = computed(() => {
    return dailyTasks.value.filter((t) => t.status === 'waiting').length
  })

  // ---- 操作 ----
  async function submitCheckin(taskId) {
    const result = await doSubmitCheckin(taskId)
    if (result.ok) {
      await loadDailyTasks()
    }
    return result
  }

  async function reviewCheckin(taskId, approved) {
    const result = await doReviewCheckin(taskId, approved)
    if (result.ok) {
      await loadAll()
    }
    return result
  }

  async function toggleTaskTemplate(templateId, enabled) {
    const result = await doToggleTaskTemplate(templateId, enabled)
    if (result.ok) {
      await loadAll()
    }
    return result
  }

  async function saveTaskTemplate(template) {
    const result = await doSaveTaskTemplate(template)
    if (result.ok) {
      await loadAll()
    }
    return result
  }

  async function deleteTaskTemplate(templateId) {
    const result = await doDeleteTaskTemplate(templateId)
    if (result.ok) {
      await loadAll()
    }
    return result
  }

  async function resetAllData() {
    doResetAllData()
    await loadAll()
    return { ok: true, message: '已重置' }
  }

  return {
    taskTemplates,
    dailyTasks,
    streakStat,
    history,
    weekDays,
    pendingConfirmations,
    taskStats,
    pendingConfirmsCount,
    loadAll,
    loadTaskTemplates,
    loadDailyTasks,
    loadRecordData,
    submitCheckin,
    reviewCheckin,
    toggleTaskTemplate,
    saveTaskTemplate,
    deleteTaskTemplate,
    resetAllData
  }
})