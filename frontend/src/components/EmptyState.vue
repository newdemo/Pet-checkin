<template>
  <view class="empty-state">
    <text class="empty-icon">{{ icon }}</text>
    <text class="empty-text">{{ text }}</text>
    <text v-if="subText" class="empty-sub">{{ subText }}</text>
  </view>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    default: '📭'
  },
  text: {
    type: String,
    default: '暂无数据'
  },
  subText: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 40rpx;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 24rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.empty-sub {
  font-size: 24rpx;
  color: #bbb;
  margin-top: 12rpx;
}
</style>