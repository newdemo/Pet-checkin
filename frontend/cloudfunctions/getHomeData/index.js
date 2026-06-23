const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

function formatDate() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function buildDailyTasks(openid, familyId, childId, taskDate, templates) {
  const now = db.serverDate()
  return templates.map(t => ({
    openid,
    familyId,
    childId,
    taskDate,
    templateId: t._id,
    name: t.name,
    icon: t.icon,
    rewardType: t.rewardType,
    rewardAmount: t.rewardAmount,
    status: 'pending',
    checkinRecordId: null,
    submittedAt: null,
    approvedAt: null,
    rejectedAt: null,
    createdAt: now,
    updatedAt: now
  }))
}

async function ensureDailyTasks(openid, familyId, childId, taskDate) {
  const existingRes = await db.collection('dailyTasks')
    .where({ openid, taskDate })
    .get()
  if (existingRes.data && existingRes.data.length > 0) {
    console.log(`[getHomeData] dailyTasks 已存在 ${existingRes.data.length} 条，跳过生成`)
    return existingRes.data
  }

  console.log('[getHomeData] dailyTasks 为空，开始懒生成')

  const tplRes = await db.collection('taskTemplates')
    .where({ openid, familyId, childId, enabled: true })
    .orderBy('sortOrder', 'asc')
    .get()
  const templates = tplRes.data || []
  console.log(`[getHomeData] 查询到 ${templates.length} 个启用模板`)

  if (templates.length === 0) {
    console.log('[getHomeData] 无启用模板，跳过 dailyTasks 生成')
    return []
  }

  const dailyTasks = buildDailyTasks(openid, familyId, childId, taskDate, templates)
  for (const dt of dailyTasks) {
    await db.collection('dailyTasks').add({ data: dt })
  }
  console.log(`[getHomeData] dailyTasks 懒生成完成，共 ${dailyTasks.length} 条`)

  const regeneratedRes = await db.collection('dailyTasks')
    .where({ openid, taskDate })
    .get()
  return regeneratedRes.data || []
}

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()

  if (!OPENID) {
    return { ok: false, message: '无法获取 OPENID' }
  }

  console.log(`[getHomeData] OPENID: ${OPENID}`)

  const familyId = `family_${OPENID}`
  const childId = `child_default_${OPENID}`
  const taskDate = formatDate()

  const petRes = await db.collection('pet').where({ openid: OPENID }).get()
  if (!petRes.data || petRes.data.length === 0) {
    console.log('[getHomeData] 用户未初始化')
    return { ok: false, message: '用户未初始化，请先调用 login' }
  }
  const pet = petRes.data[0]
  console.log('[getHomeData] pet 查询完成')

  const invRes = await db.collection('inventory').where({ openid: OPENID }).get()
  const inventory = invRes.data && invRes.data.length > 0 ? invRes.data[0] : null
  console.log('[getHomeData] inventory 查询完成')

  const dailyTasks = await ensureDailyTasks(OPENID, familyId, childId, taskDate)

  const crRes = await db.collection('checkinRecords')
    .where({ openid: OPENID, taskDate, status: 'submitted' })
    .get()
  const pendingCheckins = crRes.data || []
  console.log(`[getHomeData] checkinRecords 查询完成，待确认 ${pendingCheckins.length} 条`)

  const total = dailyTasks.length
  const approvedCount = dailyTasks.filter(t => t.status === 'approved').length
  const pendingCount = total - approvedCount

  return {
    ok: true,
    pet,
    inventory,
    dailyTasks,
    taskStats: {
      total,
      done: approvedCount,
      pending: pendingCount
    },
    pendingConfirms: pendingCheckins.length
  }
}
