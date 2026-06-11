<template>
  <view class="page">
    <view class="parent-entry" @click="goParentConfirm">
      <text>⚙️ 家长管理</text>
      <text v-if="pendingConfirms > 0" class="badge">{{ pendingConfirms }}</text>
    </view>

    <view class="pet-card">
      <view class="pet-avatar">
        <text class="pet-emoji">{{ petEmoji }}</text>
      </view>
      <text class="pet-name">{{ pet.name }}</text>
      <text class="pet-level">Lv.{{ pet.level }}</text>

      <view class="task-badge">
        <text>今日任务 {{ taskStats.done }}/{{ taskStats.total }}</text>
      </view>

      <view class="growth-box">
        <text class="growth-label">成长值 {{ growthProgress.current }}/{{ growthProgress.total }}</text>
        <view class="bar-track">
          <view
            class="bar-fill growth-fill"
            :style="{ width: growthProgress.percent + '%' }"
          />
        </view>
      </view>
    </view>

    <view class="status-card">
      <view class="status-row">
        <text class="status-icon">🍖</text>
        <text class="status-label">饥饿</text>
        <view class="bar-track">
          <view class="bar-fill" :style="{ width: hungerPercent + '%', backgroundColor: '#FF8C42' }" />
        </view>
        <text class="status-value">{{ pet.hunger }}</text>
      </view>
      <view class="status-row">
        <text class="status-icon">🧼</text>
        <text class="status-label">清洁</text>
        <view class="bar-track">
          <view class="bar-fill" :style="{ width: cleanPercent + '%', backgroundColor: '#4ECDC4' }" />
        </view>
        <text class="status-value">{{ pet.cleanliness }}</text>
      </view>
      <view class="status-row">
        <text class="status-icon">🎾</text>
        <text class="status-label">心情</text>
        <view class="bar-track">
          <view class="bar-fill" :style="{ width: moodPercent + '%', backgroundColor: '#FFB347' }" />
        </view>
        <text class="status-value">{{ pet.mood }}</text>
      </view>
    </view>

    <view class="inventory-card">
      <text class="section-title">我的背包</text>
      <view class="inventory-row">
        <text>🍖 食物 ×{{ inventory.food }}</text>
        <text>🧼 肥皂 ×{{ inventory.soap }}</text>
        <text>🎾 玩具 ×{{ inventory.toy }}</text>
      </view>
    </view>

    <view class="action-row">
      <button class="action-btn feed" :disabled="inventory.food < 1" @click="onAction('feed')">
        喂食
      </button>
      <button class="action-btn wash" :disabled="inventory.soap < 1" @click="onAction('wash')">
        清洁
      </button>
      <button class="action-btn play" :disabled="inventory.toy < 1" @click="onAction('play')">
        陪玩
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { getHomeData, performPetAction, initAppData } from '../../services/storage'
import { getGrowthProgress } from '../../services/pet'
import { ACTION_MAP } from '../../constants/pet'

const pet = ref({
  name: '小萌',
  level: 1,
  growthValue: 0,
  hunger: 80,
  cleanliness: 80,
  mood: 80
})
const inventory = ref({ food: 0, soap: 0, toy: 0 })
const taskStats = ref({ total: 0, done: 0, pending: 0 })
const pendingConfirms = ref(0)

const growthProgress = computed(() => getGrowthProgress(pet.value))

const petEmoji = computed(() => {
  const emojis = ['🐣', '🐥', '🐤', '🦊', '🌟']
  const level = pet.value.level || 1
  return emojis[Math.min(Math.max(level, 1) - 1, emojis.length - 1)]
})

const hungerPercent = computed(() => Math.min(100, Math.round((pet.value.hunger || 0) / 100 * 100)))
const cleanPercent = computed(() => Math.min(100, Math.round((pet.value.cleanliness || 0) / 100 * 100)))
const moodPercent = computed(() => Math.min(100, Math.round((pet.value.mood || 0) / 100 * 100)))

function loadData() {
  try {
    initAppData()
    const data = getHomeData()
    if (data.pet) pet.value = { ...pet.value, ...data.pet }
    if (data.inventory) inventory.value = { ...data.inventory }
    if (data.taskStats) taskStats.value = { ...data.taskStats }
    pendingConfirms.value = data.pendingConfirms || 0
  } catch (e) {
    console.error('home loadData failed', e)
    uni.showToast({ title: '数据加载失败', icon: 'none' })
  }
}

function onAction(type) {
  const result = performPetAction(type)
  if (!result.ok) {
    uni.showToast({ title: result.message, icon: 'none' })
    return
  }
  pet.value = { ...result.pet }
  inventory.value = { ...result.inventory }
  const label = ACTION_MAP[type]?.label || '操作'
  if (result.leveledUp) {
    uni.showModal({
      title: '升级啦！',
      content: `${pet.value.name} 升到 Lv.${pet.value.level} 了！`,
      showCancel: false
    })
  } else {
    uni.showToast({ title: `${label}成功！`, icon: 'success' })
  }
}

function goParentConfirm() {
  uni.navigateTo({ url: '/pages/parent/confirm/index' })
}

onLoad(() => {
  loadData()
})

onShow(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.page {
  padding: 24rpx 24rpx 40rpx;
  min-height: 100vh;
  box-sizing: border-box;
}

.parent-entry {
  text-align: right;
  font-size: 26rpx;
  color: #ff8c42;
  margin-bottom: 8rpx;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8rpx;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36rpx;
  height: 36rpx;
  padding: 0 10rpx;
  background: #ff4757;
  color: #fff;
  font-size: 22rpx;
  font-weight: 700;
  border-radius: 18rpx;
}

.pet-card {
  background: linear-gradient(160deg, #fff5eb 0%, #ffffff 100%);
  border-radius: 32rpx;
  padding: 40rpx 32rpx;
  text-align: center;
  margin-bottom: 24rpx;
  box-shadow: 0 8rpx 24rpx rgba(255, 140, 66, 0.12);
}

.pet-avatar {
  width: 200rpx;
  height: 200rpx;
  margin: 0 auto 16rpx;
  background: #ffe8d4;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pet-emoji {
  font-size: 100rpx;
  line-height: 1;
}

.pet-name {
  display: block;
  font-size: 40rpx;
  font-weight: 700;
  color: #333;
}

.pet-level {
  display: block;
  font-size: 28rpx;
  color: #ff8c42;
  margin-top: 8rpx;
}

.task-badge {
  display: inline-block;
  margin-top: 16rpx;
  margin-bottom: 8rpx;
  padding: 8rpx 24rpx;
  background: #fff0e6;
  border-radius: 24rpx;
  font-size: 26rpx;
  color: #ff8c42;
}

.growth-box {
  text-align: left;
  margin-top: 16rpx;
}

.growth-label {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 8rpx;
  display: block;
}

.bar-track {
  height: 20rpx;
  background: #f0e6dc;
  border-radius: 10rpx;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 10rpx;
}

.growth-fill {
  background: linear-gradient(90deg, #ff8c42, #ffb347);
}

.status-card,
.inventory-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 28rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}

.status-row {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.status-row:last-child {
  margin-bottom: 0;
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

.status-row .bar-track {
  flex: 1;
  margin: 0 16rpx;
}

.status-value {
  width: 56rpx;
  text-align: right;
  font-size: 24rpx;
  color: #999;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 16rpx;
  display: block;
}

.inventory-row {
  display: flex;
  justify-content: space-between;
  font-size: 28rpx;
  color: #666;
}

.action-row {
  display: flex;
  justify-content: space-between;
}

.action-btn {
  flex: 1;
  height: 96rpx;
  line-height: 96rpx;
  border-radius: 48rpx;
  font-size: 32rpx;
  color: #fff;
  border: none;
  margin: 0 10rpx;
}

.action-btn::after {
  border: none;
}

.action-btn.feed {
  background: #ff8c42;
}

.action-btn.wash {
  background: #4ecdc4;
}

.action-btn.play {
  background: #ffb347;
}

.action-btn[disabled] {
  opacity: 0.45;
}
</style>
