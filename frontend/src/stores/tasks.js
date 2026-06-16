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

  function loadAll() {
    const homeData = getHomeData()
    taskTemplates.value = getTaskTemplates()
    dailyTasks.value = getDailyTasks()

    const recordData = getRecordData()
    streakStat.value = recordData.streakStat
    history.value = recordData.history
    weekDays.value = recordData.weekDays
  }

  function loadTaskTemplates() {
    taskTemplates.value = getTaskTemplates()
  }

  function loadDailyTasks() {
    dailyTasks.value = [...getDailyTasks()]
  }

  function loadRecordData() {
    const recordData = getRecordData()
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
  function submitCheckin(taskId) {
    const result = doSubmitCheckin(taskId)
    if (result.ok) {
      loadDailyTasks()
    }
    return result
  }

  function reviewCheckin(taskId, approved) {
    const result = doReviewCheckin(taskId, approved)
    if (result.ok) {
      loadAll()
    }
    return result
  }

  function toggleTaskTemplate(templateId, enabled) {
    const result = doToggleTaskTemplate(templateId, enabled)
    if (result.ok) {
      loadAll()
    }
    return result
  }

  function saveTaskTemplate(template) {
    const result = doSaveTaskTemplate(template)
    if (result.ok) {
      loadAll()
    }
    return result
  }

  function deleteTaskTemplate(templateId) {
    const result = doDeleteTaskTemplate(templateId)
    if (result.ok) {
      loadAll()
    }
    return result
  }

  function resetAllData() {
    doResetAllData()
    loadAll()
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