<template>
  <view class="page">
    <view class="section">
      <text class="section-title">宠物信息</text>
      <view class="form-card">
        <view class="form-item">
          <text class="label">宠物名称</text>
          <input
            class="input"
            v-model="petName"
            placeholder="给宠物起个名字吧"
            maxlength="8"
          />
        </view>
        <button class="btn-save" @click="onSave">保存</button>
      </view>
    </view>

    <view class="section">
      <text class="section-title">当前宠物状态</text>
      <view class="info-card">
        <view class="info-row">
          <text class="info-label">名称</text>
          <text class="info-value">{{ pet.name }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">等级</text>
          <text class="info-value">Lv.{{ pet.level }}</text>
        </view>
      </view>
    </view>

    <view class="tip-card">
      <text>设置页面可修改宠物名称等基础信息。更多设置在后续版本中陆续开放。</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { usePetStore } from '../../../stores/pet'

const petStore = usePetStore()
const pet = computed(() => petStore.pet)
const petName = ref('')

function loadData() {
  petStore.load()
  petName.value = pet.value.name || ''
}

function onSave() {
  const name = petName.value.trim()
  if (!name) {
    uni.showToast({ title: '请输入宠物名称', icon: 'none' })
    return
  }
  const result = petStore.saveName(name)
  if (result.ok) {
    uni.showToast({ title: result.message, icon: 'success' })
  } else {
    uni.showToast({ title: result.message, icon: 'none' })
  }
}

onShow(() => {
  loadData()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #FFF8F0;
  padding: 20rpx 30rpx;
}

.section {
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 28rpx;
  color: #999;
  margin-bottom: 16rpx;
  display: block;
}

.form-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
}

.form-item {
  margin-bottom: 30rpx;
}

.label {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  display: block;
  margin-bottom: 12rpx;
}

.input {
  width: 100%;
  height: 80rpx;
  background: #F5F5F5;
  border-radius: 12rpx;
  padding: 0 20rpx;
  font-size: 30rpx;
  color: #333;
}

.btn-save {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  background: #FF8C42;
  color: #fff;
  border-radius: 12rpx;
  font-size: 30rpx;
  text-align: center;
  border: none;
}

.info-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
}

.info-row + .info-row {
  border-top: 1rpx solid #f0f0f0;
}

.info-label {
  font-size: 28rpx;
  color: #666;
}

.info-value {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.tip-card {
  background: #FFF3E6;
  border-radius: 12rpx;
  padding: 20rpx;
  font-size: 24rpx;
  color: #CC6600;
  line-height: 1.6;
}
</style>