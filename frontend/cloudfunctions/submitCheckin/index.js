const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()

  if (!OPENID) {
    return { ok: false, message: '无法获取 OPENID' }
  }

  const { dailyTaskId } = event

  if (!dailyTaskId) {
    return { ok: false, message: '缺少 dailyTaskId' }
  }

  console.log(`[submitCheckin] OPENID: ${OPENID}, dailyTaskId: ${dailyTaskId}`)

  const familyId = `family_${OPENID}`
  const childId = `child_default_${OPENID}`

  try {
    const result = await db.runTransaction(async transaction => {
      const taskRes = await transaction.collection('dailyTasks')
        .doc(dailyTaskId)
        .get()

      if (!taskRes.data) {
        await transaction.rollback({ ok: false, message: '任务不存在' })
        return
      }

      const task = taskRes.data

      if (task.openid !== OPENID) {
        await transaction.rollback({ ok: false, message: '任务不存在' })
        return
      }

      if (task.status === 'submitted') {
        await transaction.rollback({ ok: false, message: '正在等待家长确认～' })
        return
      }
      if (task.status === 'approved') {
        await transaction.rollback({ ok: false, message: '今天已经完成过啦' })
        return
      }
      if (task.status !== 'pending') {
        await transaction.rollback({ ok: false, message: '当前状态不可打卡' })
        return
      }

      const now = db.serverDate()
      const recordData = {
        openid: OPENID,
        familyId,
        childId,
        dailyTaskId: task._id,
        taskDate: task.taskDate,
        taskName: task.name,
        status: 'submitted',
        reviewer: null,
        rewardType: task.rewardType,
        rewardAmount: task.rewardAmount,
        rewardGranted: false,
        createdAt: now,
        reviewedAt: null,
        updatedAt: now
      }

      const recordRes = await transaction.collection('checkinRecords').add({ data: recordData })
      console.log(`[submitCheckin] checkinRecord 创建成功: ${recordRes._id}`)

      await transaction.collection('dailyTasks')
        .doc(task._id)
        .update({
          data: {
            status: 'submitted',
            checkinRecordId: recordRes._id,
            submittedAt: now,
            updatedAt: now
          }
        })

      console.log(`[submitCheckin] dailyTask ${task._id} 状态更新为 submitted`)

      return {
        ok: true,
        message: '打卡成功，等爸爸妈妈确认吧～',
        checkinRecordId: recordRes._id,
        dailyTaskId: task._id
      }
    })

    return result
  } catch (e) {
    if (e && typeof e === 'object' && 'ok' in e) {
      return e
    }
    console.error('[submitCheckin] 执行失败:', e)
    return {
      ok: false,
      message: '打卡失败，请稍后重试',
      error: e.message
    }
  }
}
