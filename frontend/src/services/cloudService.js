const STATUS_MAP = {
  pending: 'pending',
  submitted: 'waiting',
  approved: 'done',
  rejected: 'pending'
}

function mapStatus(cloudStatus) {
  return STATUS_MAP[cloudStatus] || 'pending'
}

function mapPet(cloudPet) {
  if (!cloudPet) return null
  return {
    name: cloudPet.name || '小萌',
    level: cloudPet.level || 1,
    growthValue: cloudPet.exp || 0,
    hunger: cloudPet.hunger || 80,
    cleanliness: cloudPet.cleanliness || 80,
    mood: cloudPet.mood || 80
  }
}

function mapInventory(cloudInv) {
  if (!cloudInv) return { food: 0, soap: 0, toy: 0 }
  return {
    food: cloudInv.food || 0,
    soap: cloudInv.soap || 0,
    toy: cloudInv.toy || 0
  }
}

function mapDailyTask(cloudTask) {
  if (!cloudTask) return null
  return {
    id: cloudTask._id,
    templateId: cloudTask.templateId,
    taskDate: cloudTask.taskDate,
    name: cloudTask.name,
    icon: cloudTask.icon,
    rewardType: cloudTask.rewardType,
    rewardAmount: cloudTask.rewardAmount,
    status: mapStatus(cloudTask.status),
    checkinRecordId: cloudTask.checkinRecordId || null
  }
}

let homeDataCache = null
let homeDataPromise = null

export function clearHomeDataCache() {
  homeDataCache = null
  homeDataPromise = null
}

export async function login() {
  try {
    const res = await wx.cloud.callFunction({ name: 'login' })
    console.log('[cloudService] login 结果:', res.result)
    return res.result
  } catch (e) {
    console.error('[cloudService] login 失败:', e)
    return { ok: false, message: '登录失败，请稍后重试' }
  }
}

export async function getHomeData() {
  if (homeDataCache) {
    console.log('[cloudService] getHomeData 命中缓存')
    return homeDataCache
  }
  if (homeDataPromise) {
    console.log('[cloudService] getHomeData 复用进行中的请求')
    return homeDataPromise
  }

  homeDataPromise = (async () => {
    try {
      const res = await wx.cloud.callFunction({ name: 'getHomeData' })
      console.log('[cloudService] getHomeData 云函数返回:', res.result)

      if (!res.result.ok) {
        homeDataPromise = null
        throw new Error(res.result.message || '获取首页数据失败')
      }

      const d = res.result
      const mapped = {
        pet: mapPet(d.pet),
        inventory: mapInventory(d.inventory),
        dailyTasks: (d.dailyTasks || []).map(mapDailyTask).filter(Boolean),
        taskStats: d.taskStats || { total: 0, done: 0, pending: 0 },
        pendingConfirms: d.pendingConfirms || 0
      }

      homeDataCache = mapped
      homeDataPromise = null
      console.log('[cloudService] getHomeData 映射完成, dailyTasks:', mapped.dailyTasks.length)
      return mapped
    } catch (e) {
      homeDataPromise = null
      console.error('[cloudService] getHomeData 失败:', e)
      throw e
    }
  })()

  return homeDataPromise
}

export async function getDailyTasks() {
  const homeData = await getHomeData()
  return [...homeData.dailyTasks]
}

export async function submitCheckin(dailyTaskId) {
  clearHomeDataCache()
  try {
    const res = await wx.cloud.callFunction({
      name: 'submitCheckin',
      data: { dailyTaskId }
    })
    console.log('[cloudService] submitCheckin 结果:', res.result)
    return res.result
  } catch (e) {
    console.error('[cloudService] submitCheckin 失败:', e)
    return { ok: false, message: '打卡失败，请稍后重试' }
  }
}

export async function reviewCheckin(checkinId, action) {
  clearHomeDataCache()
  try {
    const res = await wx.cloud.callFunction({
      name: 'reviewCheckin',
      data: { checkinId, action }
    })
    console.log('[cloudService] reviewCheckin 结果:', res.result)
    return res.result
  } catch (e) {
    console.error('[cloudService] reviewCheckin 失败:', e)
    return { ok: false, message: '操作失败，请稍后重试' }
  }
}

export async function reviewCheckinByTaskId(taskId, approved) {
  const homeData = await getHomeData()
  const task = homeData.dailyTasks.find(t => t.id === taskId)
  if (!task) return { ok: false, message: '任务不存在' }
  if (!task.checkinRecordId) return { ok: false, message: '打卡记录异常，请刷新后重试' }
  const action = approved ? 'approve' : 'reject'
  return reviewCheckin(task.checkinRecordId, action)
}
