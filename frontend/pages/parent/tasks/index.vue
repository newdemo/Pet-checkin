<template>
  <view class="page">
    <view class="tip-card">
      <text>家长可开启或关闭每日任务，关闭后孩子今日任务列表不再显示。</text>
    </view>

    <view v-for="tpl in templates" :key="tpl.id" class="tpl-card">
      <view class="tpl-main">
        <text class="tpl-icon">{{ tpl.icon }}</text>
        <view class="tpl-info">
          <text class="tpl-name">{{ tpl.name }}</text>
          <text class="tpl-reward">奖励：{{ rewardLabel(tpl.rewardType) }} ×{{ tpl.rewardAmount }}</text>
        </view>
      </view>
      <switch :checked="tpl.enabled" color="#FF8C42" @change="onToggle(tpl.id, $event)" />
    </view>

    <view class="reset-box">
      <button class="btn-reset" @click="onReset">重置所有数据（测试用）</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getTaskTemplates, toggleTaskTemplate, resetAllData } from '../../../services/storage'
import { ITEM_LABELS } from '../../../constants/pet'

const templates = ref([])

function rewardLabel(type) {
  return ITEM_LABELS[type] || type
}

function loadTemplates() {
  templates.value = getTaskTemplates()
}

function onToggle(templateId, e) {
  const enabled = e.detail.value
  toggleTaskTemplate(templateId, enabled)
  loadTemplates()
  uni.showToast({ title: enabled ? '已开启' : '已关闭', icon: 'none' })
}

function onReset() {
  uni.showModal({
    title: '确认重置',
    content: '将清空本地数据并恢复初始状态',
    success(res) {
      if (res.confirm) {
        resetAllData()
        loadTemplates()
        uni.showToast({ title: '已重置', icon: 'success' })
      }
    }
  })
}

onShow(() => {
  loadTemplates()
})
</script>

<style scoped lang="scss">
.page {
  padding: 24rpx;
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

.tpl-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}

.tpl-main {
  display: flex;
  align-items: center;
  flex: 1;
}

.tpl-icon {
  font-size: 48rpx;
  margin-right: 20rpx;
}

.tpl-info {
  display: flex;
  flex-direction: column;
}

.tpl-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
}

.tpl-reward {
  font-size: 24rpx;
  color: #999;
  margin-top: 6rpx;
}

.reset-box {
  margin-top: 48rpx;
}

.btn-reset {
  background: #f5f5f5;
  color: #999;
  font-size: 26rpx;
  border-radius: 40rpx;
  border: none;
}

.btn-reset::after {
  border: none;
}
</style>
