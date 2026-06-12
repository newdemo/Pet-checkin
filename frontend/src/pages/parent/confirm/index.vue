<template>
  <view class="page">
    <view class="tip-card">
      <text>孩子打卡后需要家长确认，确认通过后才能获得奖励。</text>
    </view>

    <view v-if="tasks.length === 0" class="empty">
      <text>暂无待确认任务</text>
    </view>

    <view v-for="task in tasks" :key="task.id" class="task-card">
      <view class="task-main">
        <text class="task-icon">{{ task.icon }}</text>
        <view class="task-info">
          <text class="task-name">{{ task.name }}</text>
          <text class="task-reward">奖励：{{ rewardLabel(task.rewardType) }} ×{{ task.rewardAmount }}</text>
        </view>
      </view>
      <view class="task-action">
        <button class="btn-reject" @click="onReview(task.id, false)">驳回</button>
        <button class="btn-confirm" @click="onReview(task.id, true)">确认通过</button>
      </view>
    </view>

    <view class="footer">
      <button class="btn-manage" @click="goTaskManage">管理任务</button>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useTasksStore } from '../../../stores/tasks'
import { ITEM_LABELS } from '../../../constants/pet'

const tasksStore = useTasksStore()

const tasks = computed(() => tasksStore.pendingConfirmations)

function rewardLabel(type) {
  return ITEM_LABELS[type] || type
}

function loadTasks() {
  tasksStore.loadDailyTasks()
}

function onReview(taskId, approved) {
  const label = approved ? '确认通过' : '驳回'
  uni.showModal({
    title: `确认${label}`,
    content: approved
      ? '确认后奖励将发放给孩子'
      : '驳回后孩子可重新打卡',
    success(res) {
      if (!res.confirm) return
      const result = tasksStore.reviewCheckin(taskId, approved)
      if (result.ok) {
        uni.showToast({ title: result.message, icon: 'success' })
      } else {
        uni.showToast({ title: result.message, icon: 'none' })
      }
    }
  })
}

function goTaskManage() {
  uni.navigateTo({ url: '/pages/parent/tasks/index' })
}

onShow(() => {
  loadTasks()
})
</script>

<style scoped lang="scss">
.page {
  padding: 24rpx;
  min-height: 100vh;
  box-sizing: border-box;
}

.tip-card {
  background: #fff5eb;
  border-radius: 16rpx;
  padding: 20rpx 24rpx;
  font-size: 24rpx;
  color: #996633;
  margin-bottom: 24rpx;
  line-height: 1.6;
}

.task-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(255, 140, 66, 0.08);
}

.task-main {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.task-icon {
  font-size: 48rpx;
  margin-right: 20rpx;
}

.task-info {
  display: flex;
  flex-direction: column;
}

.task-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 6rpx;
}

.task-reward {
  font-size: 24rpx;
  color: #999;
}

.task-action {
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
}

.btn-reject,
.btn-confirm {
  height: 72rpx;
  line-height: 72rpx;
  padding: 0 36rpx;
  border-radius: 36rpx;
  font-size: 28rpx;
  border: none;
}

.btn-reject::after,
.btn-confirm::after {
  border: none;
}

.btn-reject {
  background: #f5f5f5;
  color: #999;
}

.btn-confirm {
  background: #ff8c42;
  color: #fff;
}

.empty {
  text-align: center;
  padding: 120rpx 40rpx;
  color: #999;
  font-size: 28rpx;
}

.footer {
  margin-top: 48rpx;
  text-align: center;
}

.btn-manage {
  display: inline-block;
  background: none;
  color: #ff8c42;
  font-size: 26rpx;
  padding: 0;
  border: none;
}

.btn-manage::after {
  border: none;
}
</style>