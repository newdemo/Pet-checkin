const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()

  if (!OPENID) {
    return { ok: false, message: '无法获取 OPENID' }
  }

  const { checkinId, action, rejectReason } = event

  if (!checkinId) {
    return { ok: false, message: '缺少 checkinId' }
  }

  if (!action) {
    return { ok: false, message: '缺少 action' }
  }

  if (action !== 'approve' && action !== 'reject') {
    return { ok: false, message: 'action 仅允许 approve 或 reject' }
  }

  if (action === 'reject' && !rejectReason) {
    return { ok: false, message: '驳回必须填写原因' }
  }

  console.log(`[reviewCheckin] OPENID: ${OPENID}, checkinId: ${checkinId}, action: ${action}`)

  try {
    const result = await db.runTransaction(async transaction => {
      const recordRes = await transaction.collection('checkinRecords')
        .doc(checkinId)
        .get()

      if (!recordRes.data) {
        await transaction.rollback({ ok: false, message: '打卡记录不存在' })
        return
      }

      const record = recordRes.data

      if (record.openid !== OPENID) {
        await transaction.rollback({ ok: false, message: '打卡记录不存在' })
        return
      }

      if (record.status !== 'submitted') {
        await transaction.rollback({ ok: false, message: '该打卡已处理，请刷新页面' })
        return
      }

      const now = db.serverDate()

      if (action === 'approve') {
        if (record.rewardGranted) {
          await transaction.rollback({ ok: false, message: '奖励已发放，请勿重复操作' })
          return
        }

        await transaction.collection('checkinRecords')
          .doc(checkinId)
          .update({
            data: {
              status: 'approved',
              reviewer: OPENID,
              reviewedBy: OPENID,
              reviewedAt: now,
              rewardGranted: true,
              updatedAt: now
            }
          })

        await transaction.collection('dailyTasks')
          .doc(record.dailyTaskId)
          .update({
            data: {
              status: 'approved',
              approvedAt: now,
              updatedAt: now
            }
          })

        const invRes = await transaction.collection('inventory')
          .where({ openid: OPENID })
          .get()

        if (!invRes.data || invRes.data.length === 0) {
          await transaction.rollback({ ok: false, message: '背包数据异常，请联系管理员' })
          return
        }

        const inv = invRes.data[0]
        const rewardField = record.rewardType
        const rewardAmount = record.rewardAmount

        const updateData = {
          updatedAt: now
        }
        updateData[rewardField] = _.inc(rewardAmount)

        await transaction.collection('inventory')
          .doc(inv._id)
          .update({
            data: updateData
          })

        console.log(`[reviewCheckin] 审批通过，发放奖励: ${rewardField} +${rewardAmount}`)

        return {
          ok: true,
          message: '已确认打卡，奖励已发放～',
          data: {
            checkinId,
            dailyTaskId: record.dailyTaskId,
            action: 'approve',
            rewardType: rewardField,
            rewardAmount
          }
        }
      }

      if (action === 'reject') {
        await transaction.collection('checkinRecords')
          .doc(checkinId)
          .update({
            data: {
              status: 'rejected',
              reviewer: OPENID,
              reviewedBy: OPENID,
              reviewedAt: now,
              rejectReason: rejectReason || '',
              updatedAt: now
            }
          })

        await transaction.collection('dailyTasks')
          .doc(record.dailyTaskId)
          .update({
            data: {
              status: 'pending',
              checkinRecordId: null,
              submittedAt: null,
              rejectedAt: now,
              updatedAt: now
            }
          })

        console.log(`[reviewCheckin] 审批驳回，原因: ${rejectReason}`)

        return {
          ok: true,
          message: '已驳回打卡',
          data: {
            checkinId,
            dailyTaskId: record.dailyTaskId,
            action: 'reject',
            rejectReason: rejectReason || ''
          }
        }
      }
    })

    return result
  } catch (e) {
    if (e && typeof e === 'object' && 'ok' in e) {
      return e
    }
    console.error('[reviewCheckin] 执行失败:', e)
    return {
      ok: false,
      message: '操作失败，请稍后重试',
      error: e.message
    }
  }
}
