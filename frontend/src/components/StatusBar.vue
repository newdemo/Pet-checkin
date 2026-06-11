<template>
  <view class="status-row">
    <text class="status-icon">{{ icon }}</text>
    <text class="status-label">{{ label }}</text>
    <view class="bar-track">
      <view class="bar-fill" :style="{ width: percent + '%', backgroundColor: color }" />
    </view>
    <text class="status-value">{{ value }}</text>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  icon: { type: String, default: '' },
  label: { type: String, default: '' },
  value: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  color: { type: String, default: '#FF8C42' }
})

const percent = computed(() => Math.min(100, Math.round((props.value / props.max) * 100)))
</script>

<style scoped lang="scss">
.status-row {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.status-icon {
  width: 48rpx;
  font-size: 32rpx;
  text-align: center;
}

.status-label {
  width: 80rpx;
  font-size: 26rpx;
  color: #666;
}

.bar-track {
  flex: 1;
  height: 20rpx;
  background: #f0e6dc;
  border-radius: 10rpx;
  overflow: hidden;
  margin: 0 16rpx;
}

.bar-fill {
  height: 100%;
  border-radius: 10rpx;
  transition: width 0.2s;
}

.status-value {
  width: 56rpx;
  text-align: right;
  font-size: 24rpx;
  color: #999;
}
</style>
