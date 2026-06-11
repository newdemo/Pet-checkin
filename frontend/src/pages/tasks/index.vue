<template>
  <view class="page">
    <view class="header">
      <text class="date-text">{{ todayLabel }}</text>
      <text class="progress-text">今日进度 {{ doneCount }}/{{ tasks.length }}</text>
    </view>

    <view v-if="tasks.length === 0" class="empty">
      <text>暂无任务，请家长在「任务管理」中添加</text>
    </view>

    <task-card
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      @task-complete="onComplete"
    />
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getDailyTasks, submitCheckin } from '../../services/storage'

const tasks = ref([])

const todayLabel = computed(() => {
  const d = new Date()
  return `${d.getMonth() + 1}月${d.getDate()}日`
})

const doneCount = computed(() => tasks.value.filter((t) => t.status === 'done').length)

function loadTasks() {
  tasks.value = getDailyTasks()
}

function onComplete(taskId) {
  const result = submitCheckin(taskId)
  if (!result.ok) {
    uni.showToast({ title: result.message, icon: 'none' })
    return
  }
  loadTasks()
  uni.showToast({ title: result.message, icon: 'success' })
}

onShow(() => {
  loadTasks()
})
</script>

<style scoped lang="scss">
.page {
  padding: 24rpx;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.date-text {
  font-size: 36rpx;
  font-weight: 700;
  color: #333;
}

.progress-text {
  font-size: 26rpx;
  color: #ff8c42;
}

.empty {
  text-align: center;
  padding: 80rpx 40rpx;
  color: #999;
  font-size: 28rpx;
}
</style>
