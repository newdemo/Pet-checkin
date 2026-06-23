const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

const COLLECTIONS = ['pet', 'inventory', 'taskTemplates', 'dailyTasks', 'checkinRecords']

function formatDate() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

async function ensureCollection(name) {
  try {
    await db.createCollection(name)
    console.log(`[login] 集合 ${name} 创建成功`)
  } catch (e) {
    if (e.errCode === -502005 || (e.message && e.message.includes('already exist'))) {
      console.log(`[login] 集合 ${name} 已存在，跳过`)
    } else {
      throw e
    }
  }
}

async function ensureAllCollections() {
  for (const name of COLLECTIONS) {
    await ensureCollection(name)
  }
}

function buildDefaultPet(openid) {
  const familyId = `family_${openid}`
  const childId = `child_default_${openid}`
  const now = db.serverDate()
  return {
    openid,
    familyId,
    childId,
    name: '小萌',
    level: 1,
    exp: 0,
    hunger: 80,
    cleanliness: 80,
    mood: 80,
    createdAt: now,
    updatedAt: now
  }
}

function buildDefaultInventory(openid) {
  const familyId = `family_${openid}`
  const childId = `child_default_${openid}`
  const now = db.serverDate()
  return {
    openid,
    familyId,
    childId,
    food: 2,
    soap: 1,
    toy: 0,
    createdAt: now,
    updatedAt: now
  }
}

function buildDefaultTemplates(openid) {
  const familyId = `family_${openid}`
  const childId = `child_default_${openid}`
  const now = db.serverDate()
  return [
    { openid, familyId, childId, name: '刷牙', icon: '🪥', rewardType: 'soap', rewardAmount: 1, enabled: true, sortOrder: 1, createdAt: now, updatedAt: now },
    { openid, familyId, childId, name: '阅读', icon: '📖', rewardType: 'food', rewardAmount: 1, enabled: true, sortOrder: 2, createdAt: now, updatedAt: now },
    { openid, familyId, childId, name: '收拾玩具', icon: '🧸', rewardType: 'toy', rewardAmount: 1, enabled: true, sortOrder: 3, createdAt: now, updatedAt: now },
    { openid, familyId, childId, name: '运动', icon: '🏃', rewardType: 'food', rewardAmount: 1, enabled: true, sortOrder: 4, createdAt: now, updatedAt: now },
    { openid, familyId, childId, name: '练字', icon: '✏️', rewardType: 'food', rewardAmount: 1, enabled: true, sortOrder: 5, createdAt: now, updatedAt: now }
  ]
}

function buildDailyTasks(openid, templates) {
  const familyId = `family_${openid}`
  const childId = `child_default_${openid}`
  const taskDate = formatDate()
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
    createdAt: now,
    updatedAt: now
  }))
}

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()

  if (!OPENID) {
    return { ok: false, message: '无法获取 OPENID' }
  }

  console.log(`[login] OPENID: ${OPENID}`)

  await ensureAllCollections()

  const petRes = await db.collection('pet').where({ openid: OPENID }).get()

  if (petRes.data && petRes.data.length > 0) {
    console.log('[login] 用户已初始化，跳过数据写入')
    return { openid: OPENID, isNewUser: false }
  }

  console.log('[login] 新用户，开始初始化数据')

  const petData = buildDefaultPet(OPENID)
  await db.collection('pet').add({ data: petData })
  console.log('[login] pet 初始化完成')

  const inventoryData = buildDefaultInventory(OPENID)
  await db.collection('inventory').add({ data: inventoryData })
  console.log('[login] inventory 初始化完成')

  const templates = buildDefaultTemplates(OPENID)
  const templateResults = []
  for (const t of templates) {
    const res = await db.collection('taskTemplates').add({ data: t })
    templateResults.push({ _id: res._id, ...t })
  }
  console.log(`[login] taskTemplates 初始化完成，共 ${templateResults.length} 条`)

  const dailyTasks = buildDailyTasks(OPENID, templateResults)
  for (const dt of dailyTasks) {
    await db.collection('dailyTasks').add({ data: dt })
  }
  console.log(`[login] dailyTasks 初始化完成，共 ${dailyTasks.length} 条`)

  console.log('[login] 全部初始化完成')

  return { openid: OPENID, isNewUser: true }
}
