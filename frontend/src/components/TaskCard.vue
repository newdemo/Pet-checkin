<template>
  <view class="task-card">
    <view class="task-main">
      <text class="task-icon">{{ task.icon }}</text>
      <view class="task-info">
        <text class="task-name">{{ task.name }}</text>
        <text class="task-reward">奖励：{{ rewardLabel }} ×{{ task.rewardAmount }}</text>
      </view>
    </view>
    <view class="task-action">
      <button
        v-if="task.status === 'pending'"
        class="btn-checkin"
        @click="$emit('taskComplete', task.id)"
      >
        打卡
      </button>
      <text v-else-if="task.status === 'waiting'" class="waiting-text">⏳ 等待家长确认</text>
      <text v-else class="done-text">✅ 已完成</text>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { ITEM_LABELS } from '../constants/pet'

const props = defineProps({
  task: { type: Object, required: true }
})

defineEmits(['taskComplete'])

const rewardLabel = computed(() => ITEM_LABELS[props.task.rewardType] || props.task.rewardType)
</script>

<style scoped lang="scss">
.task-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 28rpx;
  margin-bottom: 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4rpx 16rpx rgba(255, 140, 66, 0.08);
}

.task-main {
  display: flex;
  align-items: center;
  flex: 1;
}

.task-icon {
  font-size: 56rpx;
  margin-right: 20rpx;
}

.task-info {
  display: flex;
  flex-direction: column;
}

.task-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
}

.task-reward {
  font-size: 24rpx;
  color: #999;
}

.btn-checkin {
  background: #ff8c42;
  color: #fff;
  font-size: 28rpx;
  padding: 0 36rpx;
  height: 72rpx;
  line-height: 72rpx;
  border-radius: 36rpx;
  border: none;
  min-width: 140rpx;
}

.btn-checkin::after {
  border: none;
}

.waiting-text {
  font-size: 26rpx;
  color: #ffb347;
}

.done-text {
  font-size: 26rpx;
  color: #4ecdc4;
}
</style>
