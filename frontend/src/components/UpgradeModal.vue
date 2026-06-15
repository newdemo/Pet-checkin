<template>
  <view v-if="visible" class="overlay" @click.stop>
    <view class="modal">
      <view class="confetti-row">
        <text class="confetti">🎉</text>
        <text class="confetti">🌟</text>
        <text class="confetti">🎊</text>
      </view>
      <text class="title">升级啦！</text>
      <text class="emoji">{{ emoji }}</text>
      <text class="message">{{ petName }} 升到 Lv.{{ level }} 了！</text>
      <button class="btn" @click="$emit('close')">太棒了</button>
    </view>
  </view>
</template>

<script setup>
defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  petName: {
    type: String,
    default: '小萌'
  },
  level: {
    type: Number,
    default: 1
  },
  emoji: {
    type: String,
    default: '🌟'
  }
})

defineEmits(['close'])
</script>

<style scoped lang="scss">
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal {
  width: 560rpx;
  background: #fff;
  border-radius: 32rpx;
  padding: 48rpx 40rpx 40rpx;
  text-align: center;
  box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.15);
}

.confetti-row {
  display: flex;
  justify-content: center;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.confetti {
  font-size: 48rpx;
}

.title {
  display: block;
  font-size: 40rpx;
  font-weight: 700;
  color: $primary;
  margin-bottom: 16rpx;
}

.emoji {
  display: block;
  font-size: 96rpx;
  margin-bottom: 16rpx;
}

.message {
  display: block;
  font-size: 30rpx;
  color: #666;
  margin-bottom: 36rpx;
}

.btn {
  width: 320rpx;
  height: 80rpx;
  line-height: 80rpx;
  background: linear-gradient(135deg, $primary, #FFB347);
  color: #fff;
  border-radius: 40rpx;
  font-size: 30rpx;
  font-weight: 600;
  border: none;
}

.btn::after {
  border: none;
}
</style>