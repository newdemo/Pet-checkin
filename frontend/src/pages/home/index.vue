<template>
  <view class="page">
    <view class="home-header">
      <view>
        <text class="eyebrow">小梨在等你</text>
        <text class="page-title">宠物打卡</text>
      </view>
      <view class="parent-entry" @click="goParentConfirm">
        <text class="parent-icon">🛡️</text>
        <text>家长</text>
        <text v-if="pendingConfirms > 0" class="badge">{{ pendingConfirms }}</text>
      </view>
    </view>

    <view class="status-chip-row">
      <view class="status-chip level-chip">
        <text class="chip-icon">⭐</text>
        <view>
          <text class="chip-main">Lv.{{ pet.level }}</text>
          <text class="chip-sub">{{ stageText }}</text>
        </view>
      </view>
      <view class="status-chip">
        <text class="chip-icon">📋</text>
        <view>
          <text class="chip-main">{{ taskStats.done }}/{{ taskStats.total }}</text>
          <text class="chip-sub">今日照顾</text>
        </view>
      </view>
      <view class="status-chip mood-chip">
        <text class="chip-icon">{{ moodChipIcon }}</text>
        <view>
          <text class="chip-main">{{ moodChipText }}</text>
          <text class="chip-sub">小梨状态</text>
        </view>
      </view>
    </view>

    <view class="home-stage" @click="goPetHome">
      <view class="stage-sunlight" />
      <view class="stage-window">
        <view class="window-glow" />
      </view>
      <view class="stage-shelf">
        <view class="shelf-board" />
        <view class="shelf-plant" />
        <view class="shelf-frame">🐥</view>
      </view>
      <view class="unlock-ghost unlock-left">
        <text>🔒</text>
      </view>
      <view class="unlock-ghost unlock-right">
        <text>🔒</text>
      </view>
      <view class="pet-bed">
        <text>☁️</text>
      </view>
      <view class="star-lamp">⭐</view>
      <view class="play-ball">🏐</view>

      <view class="emotion-bubble">
        <text>{{ emotionText }}</text>
      </view>

      <view class="pet-visual" :class="`pet-visual-${emotionState}`">
        <view class="pet-aura" />
        <view class="pet-body">
          <text class="pet-emoji">{{ petEmoji }}</text>
          <view class="pet-shadow" />
        </view>
      </view>
    </view>

    <view class="growth-card">
      <view class="growth-copy">
        <text class="growth-title">{{ pet.name }}正在长大</text>
        <text class="growth-desc">成长值 {{ growthProgress.current }}/{{ growthProgress.total }}</text>
      </view>
      <view class="growth-progress">
        <view class="bar-track">
          <view class="bar-fill growth-fill" :style="{ width: growthProgress.percent + '%' }" />
        </view>
      </view>
    </view>

    <view class="care-actions">
      <button
        v-for="action in careActions"
        :key="action.type"
        class="care-action-btn"
        :class="[`care-action-${action.type}`, { 'is-recommended': recommendedAction === action.type }]"
        @click="onAction(action.type)"
      >
        <text class="action-icon">{{ action.icon }}</text>
        <view class="action-texts">
          <text class="action-title">{{ action.title }}</text>
          <text class="action-subtitle">{{ action.subtitle }}</text>
        </view>
      </button>
    </view>

    <view class="care-tray">
      <view class="tray-header">
        <view>
          <text class="tray-title">今日照顾任务</text>
          <text class="tray-desc">完成照顾，小梨会长大一点</text>
        </view>
        <view class="tray-progress">
          <text class="tray-progress-main">{{ taskStats.done }}/{{ taskStats.total }}</text>
          <text class="tray-progress-sub">已完成</text>
        </view>
      </view>

      <view class="tray-progress-bar">
        <view class="tray-progress-fill" :style="{ width: taskProgressPercent + '%' }" />
      </view>

      <view v-if="previewTasks.length > 0" class="task-preview-list">
        <view v-for="task in previewTasks" :key="task.id" class="task-preview-item">
          <view class="task-preview-icon">{{ task.icon || '🌟' }}</view>
          <view class="task-preview-content">
            <text class="task-preview-name">{{ task.name }}</text>
            <text class="task-preview-reward">{{ formatReward(task) }}</text>
          </view>
          <view class="task-preview-status" :class="`status-${task.status}`">
            <text>{{ taskStatusText(task.status) }}</text>
          </view>
        </view>
      </view>

      <view v-else class="empty-preview">
        <text>今天还没有照顾任务，小梨先陪你玩一会儿</text>
      </view>
    </view>

    <upgrade-modal
      :visible="upgradeVisible"
      :pet-name="pet.name"
      :level="upgradeLevel"
      :emoji="petEmoji"
      @close="upgradeVisible = false"
    />
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { initAppData } from '../../services/storage'
import { usePetStore } from '../../stores/pet'
import { useInventoryStore } from '../../stores/inventory'
import { useTasksStore } from '../../stores/tasks'
import { useRoleStore } from '../../stores/role'

const petStore = usePetStore()
const inventoryStore = useInventoryStore()
const tasksStore = useTasksStore()
const roleStore = useRoleStore()

const pet = computed(() => petStore.pet)
const inventory = computed(() => inventoryStore.inventory)
const taskStats = computed(() => tasksStore.taskStats)
const pendingConfirms = computed(() => tasksStore.pendingConfirmsCount)
const growthProgress = computed(() => petStore.growthProgress)

const upgradeVisible = ref(false)
const upgradeLevel = ref(1)

const petEmoji = computed(() => {
  const emojis = ['🐣', '🐥', '🐤', '🦊', '🌟']
  const level = pet.value.level || 1
  return emojis[Math.min(Math.max(level, 1) - 1, emojis.length - 1)]
})

const emotionState = computed(() => {
  if ((pet.value.cleanliness || 0) <= 35) return 'needClean'
  if ((pet.value.hunger || 0) <= 35) return 'hungry'
  if ((pet.value.mood || 0) <= 35) return 'bored'
  return 'happy'
})

const emotionText = computed(() => {
  const textMap = {
    happy: '小梨想和你一起布置新家',
    hungry: '小梨肚子有点空，可以喂点东西吗？',
    needClean: '小梨想洗香香，保持干净会更开心',
    bored: '小梨想和你玩一会儿'
  }
  return textMap[emotionState.value]
})

const moodChipText = computed(() => {
  const textMap = {
    happy: '心情很好',
    hungry: '有点饿',
    needClean: '想洗澡',
    bored: '想玩耍'
  }
  return textMap[emotionState.value]
})

const moodChipIcon = computed(() => {
  const iconMap = {
    happy: '😊',
    hungry: '🍖',
    needClean: '🫧',
    bored: '🎾'
  }
  return iconMap[emotionState.value]
})

const recommendedAction = computed(() => {
  const actionMap = {
    hungry: 'feed',
    needClean: 'wash',
    bored: 'play',
    happy: ''
  }
  return actionMap[emotionState.value]
})

const stageText = computed(() => {
  const level = pet.value.level || 1
  if (level >= 5) return '闪亮伙伴'
  if (level >= 3) return '幼年期'
  return '小萌新'
})

const careActions = computed(() => [
  {
    type: 'feed',
    icon: '🍖',
    title: '喂食',
    subtitle: `食物 ×${inventory.value.food || 0}`
  },
  {
    type: 'wash',
    icon: '🫧',
    title: '清洁',
    subtitle: `肥皂 ×${inventory.value.soap || 0}`
  },
  {
    type: 'play',
    icon: '🏐',
    title: '陪玩',
    subtitle: `玩具 ×${inventory.value.toy || 0}`
  }
])

const previewTasks = computed(() => tasksStore.dailyTasks.slice(0, 2))

const taskProgressPercent = computed(() => {
  if (!taskStats.value.total) return 0
  return Math.min(100, Math.round((taskStats.value.done / taskStats.value.total) * 100))
})

function formatReward(task) {
  const rewardMap = {
    food: '食物',
    soap: '清洁道具',
    toy: '玩具'
  }
  const rewardName = rewardMap[task.rewardType] || '奖励'
  return `+${task.rewardAmount || 0} ${rewardName}`
}

function taskStatusText(status) {
  const textMap = {
    pending: '去照顾',
    waiting: '等确认',
    done: '已完成'
  }
  return textMap[status] || '去照顾'
}

function loadData() {
  try {
    initAppData()
    petStore.load()
    inventoryStore.load()
    tasksStore.loadAll()
  } catch (e) {
    console.error('home loadData failed', e)
    uni.showToast({ title: '数据加载失败', icon: 'none' })
  }
}

function onAction(type) {
  const itemMap = { feed: 'food', wash: 'soap', play: 'toy' }
  if ((inventory.value[itemMap[type]] || 0) < 1) {
    uni.showToast({ title: '完成任务可获得更多道具', icon: 'none' })
    return
  }
  const result = petStore.performAction(type)
  if (!result.ok) {
    uni.showToast({ title: result.message, icon: 'none' })
    return
  }
  inventoryStore.load()
  const labelMap = { feed: '喂食', wash: '清洁', play: '陪玩' }
  if (result.leveledUp) {
    upgradeLevel.value = pet.value.level
    upgradeVisible.value = true
  } else {
    uni.showToast({ title: `${labelMap[type] || '操作'}成功！`, icon: 'success' })
  }
}

function goPetHome() {
  uni.navigateTo({ url: '/pages/pet/index' })
}

function goParentConfirm() {
  if (roleStore.isChild) {
    uni.showModal({
      title: '进入家长模式',
      content: '家长模式可以管理任务和确认打卡，确定进入吗？',
      success(res) {
        if (res.confirm) {
          roleStore.switchTo('parent')
          uni.navigateTo({ url: '/pages/parent/confirm/index' })
        }
      }
    })
    return
  }
  uni.navigateTo({ url: '/pages/parent/confirm/index' })
}

onShow(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 32rpx 24rpx 44rpx;
  box-sizing: border-box;
  background:
    radial-gradient(circle at 14% 8%, rgba(255, 212, 143, 0.38) 0, rgba(255, 212, 143, 0) 220rpx),
    radial-gradient(circle at 90% 18%, rgba(255, 140, 66, 0.16) 0, rgba(255, 140, 66, 0) 260rpx),
    linear-gradient(180deg, #fff5e8 0%, #fffaf4 48%, #fff6ed 100%);
  color: #2f241d;
}

.home-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 22rpx;
}

.eyebrow {
  display: block;
  margin-bottom: 4rpx;
  color: #bd8b62;
  font-size: 24rpx;
  font-weight: 600;
  letter-spacing: 4rpx;
}

.page-title {
  display: block;
  color: #2f241d;
  font-size: 48rpx;
  font-weight: 900;
  line-height: 1.12;
}

.parent-entry {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8rpx;
  min-height: 56rpx;
  padding: 0 20rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.9);
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 10rpx 28rpx rgba(143, 100, 58, 0.08);
  color: #8b7c70;
  font-size: 24rpx;
}

.parent-icon {
  font-size: 26rpx;
}

.badge {
  position: absolute;
  top: -12rpx;
  right: -8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32rpx;
  height: 32rpx;
  padding: 0 8rpx;
  border-radius: 999rpx;
  background: #ff5a52;
  color: #fff;
  font-size: 20rpx;
  font-weight: 800;
  box-shadow: 0 6rpx 14rpx rgba(255, 90, 82, 0.28);
}

.status-chip-row {
  display: flex;
  gap: 14rpx;
  margin-bottom: 22rpx;
}

.status-chip {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10rpx;
  min-width: 0;
  padding: 18rpx 16rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.92);
  border-radius: 30rpx;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 12rpx 28rpx rgba(146, 96, 45, 0.08);
}

.chip-icon {
  flex: 0 0 auto;
  font-size: 36rpx;
  line-height: 1;
}

.chip-main,
.chip-sub {
  display: block;
  line-height: 1.2;
}

.chip-main {
  color: #2f241d;
  font-size: 28rpx;
  font-weight: 900;
  white-space: nowrap;
}

.chip-sub {
  margin-top: 4rpx;
  color: #9a8f86;
  font-size: 20rpx;
  white-space: nowrap;
}

.level-chip {
  background: linear-gradient(145deg, rgba(255, 247, 219, 0.95), rgba(255, 255, 255, 0.82));
}

.mood-chip {
  background: linear-gradient(145deg, rgba(237, 255, 236, 0.94), rgba(255, 255, 255, 0.82));
}

.home-stage {
  position: relative;
  height: 720rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
  border-radius: 48rpx;
  background:
    linear-gradient(110deg, rgba(255, 255, 255, 0.72) 0%, rgba(255, 240, 215, 0.34) 54%, rgba(255, 220, 166, 0.48) 100%),
    radial-gradient(circle at 50% 88%, #f6d9af 0, #f6d9af 130rpx, rgba(246, 217, 175, 0) 132rpx),
    linear-gradient(180deg, #fff2dc 0%, #ffe8cf 65%, #f7d1a8 100%);
  box-shadow: 0 20rpx 46rpx rgba(145, 87, 39, 0.15);
}

.stage-sunlight {
  position: absolute;
  top: -160rpx;
  left: -120rpx;
  width: 520rpx;
  height: 520rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.78), rgba(255, 243, 206, 0.18) 58%, rgba(255, 243, 206, 0) 72%);
}

.stage-window {
  position: absolute;
  top: 112rpx;
  left: 34rpx;
  width: 152rpx;
  height: 210rpx;
  overflow: hidden;
  border: 10rpx solid rgba(255, 255, 255, 0.92);
  border-radius: 42rpx 42rpx 24rpx 24rpx;
  background: linear-gradient(160deg, #aee8ff 0%, #eaf8ff 48%, #b9ec9b 100%);
  box-shadow: inset 0 0 0 2rpx rgba(255, 255, 255, 0.5), 0 12rpx 28rpx rgba(125, 86, 50, 0.12);
}

.window-glow {
  width: 100%;
  height: 100%;
  background: linear-gradient(118deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 44%);
}

.stage-shelf {
  position: absolute;
  top: 120rpx;
  left: 286rpx;
  width: 180rpx;
  height: 94rpx;
}

.shelf-board {
  position: absolute;
  bottom: 18rpx;
  left: 0;
  width: 170rpx;
  height: 16rpx;
  border-radius: 999rpx;
  background: #d7a873;
  box-shadow: 0 8rpx 16rpx rgba(122, 76, 33, 0.15);
}

.shelf-plant {
  position: absolute;
  bottom: 34rpx;
  left: 18rpx;
  width: 34rpx;
  height: 44rpx;
  border-radius: 18rpx 18rpx 10rpx 10rpx;
  background: linear-gradient(180deg, #85c66e 0%, #5aa74d 54%, #d5a164 55%, #c1864c 100%);
}

.shelf-frame {
  position: absolute;
  right: 22rpx;
  bottom: 34rpx;
  width: 58rpx;
  height: 58rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16rpx;
  background: #fff6de;
  font-size: 28rpx;
  box-shadow: inset 0 0 0 4rpx rgba(229, 177, 94, 0.42);
}

.unlock-ghost {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3rpx dashed rgba(150, 125, 98, 0.34);
  color: rgba(120, 102, 84, 0.54);
  background: rgba(255, 255, 255, 0.22);
}

.unlock-left {
  left: 46rpx;
  bottom: 150rpx;
  width: 150rpx;
  height: 90rpx;
  border-radius: 26rpx;
}

.unlock-right {
  right: 44rpx;
  top: 198rpx;
  width: 186rpx;
  height: 146rpx;
  border-radius: 42rpx 42rpx 20rpx 20rpx;
}

.pet-bed {
  position: absolute;
  left: 42rpx;
  bottom: 210rpx;
  width: 172rpx;
  height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 70rpx 70rpx 34rpx 34rpx;
  background: linear-gradient(180deg, #d6e69b 0%, #c0d87b 100%);
  font-size: 54rpx;
  box-shadow: inset 0 -10rpx 18rpx rgba(113, 143, 75, 0.16), 0 10rpx 22rpx rgba(111, 91, 57, 0.12);
}

.star-lamp {
  position: absolute;
  right: 70rpx;
  bottom: 208rpx;
  width: 126rpx;
  height: 126rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 32rpx;
  background: linear-gradient(145deg, #fff9e6 0%, #ffd27a 100%);
  font-size: 70rpx;
  box-shadow: 0 12rpx 26rpx rgba(246, 171, 57, 0.22), 0 0 40rpx rgba(255, 221, 111, 0.38);
}

.play-ball {
  position: absolute;
  right: 88rpx;
  bottom: 72rpx;
  font-size: 54rpx;
  transform: rotate(-12deg);
}

.emotion-bubble {
  position: absolute;
  z-index: 4;
  top: 236rpx;
  left: 86rpx;
  max-width: 310rpx;
  padding: 24rpx 28rpx;
  border-radius: 34rpx 34rpx 34rpx 10rpx;
  background: rgba(255, 255, 255, 0.88);
  color: #5a4030;
  font-size: 30rpx;
  font-weight: 800;
  line-height: 1.45;
  box-shadow: 0 14rpx 34rpx rgba(115, 77, 42, 0.12);
}

.pet-visual {
  position: absolute;
  z-index: 3;
  left: 50%;
  bottom: 116rpx;
  width: 330rpx;
  height: 390rpx;
  transform: translateX(-50%);
}

.pet-aura {
  position: absolute;
  left: 50%;
  bottom: 2rpx;
  width: 310rpx;
  height: 310rpx;
  border-radius: 50%;
  transform: translateX(-50%);
  background: radial-gradient(circle, rgba(255, 229, 120, 0.42), rgba(255, 209, 102, 0.08) 58%, rgba(255, 209, 102, 0) 72%);
}

.pet-body {
  position: absolute;
  left: 50%;
  bottom: 10rpx;
  width: 270rpx;
  height: 320rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 52% 52% 46% 46%;
  transform: translateX(-50%);
  background: linear-gradient(150deg, #ffe884 0%, #ffd454 44%, #ffc044 100%);
  box-shadow: inset -18rpx -22rpx 32rpx rgba(210, 132, 31, 0.12), inset 16rpx 20rpx 26rpx rgba(255, 255, 255, 0.24), 0 24rpx 40rpx rgba(178, 114, 40, 0.18);
}

.pet-emoji {
  position: relative;
  z-index: 2;
  font-size: 138rpx;
  line-height: 1;
  filter: drop-shadow(0 8rpx 10rpx rgba(146, 84, 25, 0.12));
}

.pet-shadow {
  position: absolute;
  left: 50%;
  bottom: -28rpx;
  width: 236rpx;
  height: 42rpx;
  border-radius: 50%;
  transform: translateX(-50%);
  background: rgba(137, 90, 42, 0.12);
  filter: blur(2rpx);
}

.pet-visual-hungry .pet-body {
  background: linear-gradient(150deg, #ffe7a6 0%, #ffd164 52%, #ffb74d 100%);
}

.pet-visual-needClean .pet-aura {
  background: radial-gradient(circle, rgba(78, 205, 196, 0.28), rgba(78, 205, 196, 0.08) 58%, rgba(78, 205, 196, 0) 72%);
}

.pet-visual-bored .pet-aura {
  background: radial-gradient(circle, rgba(255, 179, 71, 0.3), rgba(255, 179, 71, 0.08) 58%, rgba(255, 179, 71, 0) 72%);
}

.growth-card {
  display: flex;
  align-items: center;
  gap: 22rpx;
  margin-bottom: 22rpx;
  padding: 22rpx 24rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.86);
  border-radius: 34rpx;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 12rpx 28rpx rgba(145, 87, 39, 0.08);
}

.growth-copy {
  flex: 0 0 auto;
}

.growth-title,
.growth-desc {
  display: block;
}

.growth-title {
  color: #2f241d;
  font-size: 28rpx;
  font-weight: 900;
}

.growth-desc {
  margin-top: 6rpx;
  color: #9a8f86;
  font-size: 22rpx;
}

.growth-progress {
  flex: 1;
}

.bar-track {
  height: 18rpx;
  overflow: hidden;
  border-radius: 999rpx;
  background: #f0e5d8;
}

.bar-fill {
  height: 100%;
  border-radius: 999rpx;
}

.growth-fill {
  background: linear-gradient(90deg, #ff8c42 0%, #ffbf3f 100%);
}

.care-actions {
  display: flex;
  gap: 18rpx;
  margin-bottom: 24rpx;
  padding: 18rpx;
  border-radius: 40rpx;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 16rpx 36rpx rgba(145, 87, 39, 0.1);
}

.care-action-btn {
  flex: 1;
  height: 120rpx;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  border: 0;
  border-radius: 34rpx;
  color: #fff;
  line-height: 1;
  box-shadow: 0 12rpx 24rpx rgba(118, 79, 44, 0.12);
}

.care-action-btn::after {
  border: 0;
}

.care-action-feed {
  background: linear-gradient(135deg, #ffb04f 0%, #ff853f 100%);
}

.care-action-wash {
  background: linear-gradient(135deg, #64dfd6 0%, #24bdb6 100%);
}

.care-action-play {
  background: linear-gradient(135deg, #ffd84d 0%, #ffb51f 100%);
}

.care-action-btn.is-recommended {
  transform: translateY(-6rpx);
  box-shadow: 0 18rpx 34rpx rgba(255, 140, 66, 0.24);
}

.action-icon {
  font-size: 42rpx;
  line-height: 1;
}

.action-texts {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.action-title,
.action-subtitle {
  display: block;
  color: #fff;
}

.action-title {
  font-size: 30rpx;
  font-weight: 900;
  line-height: 1.1;
}

.action-subtitle {
  margin-top: 8rpx;
  font-size: 19rpx;
  opacity: 0.88;
  line-height: 1.1;
}

.care-tray {
  padding: 28rpx 24rpx 24rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.9);
  border-radius: 40rpx;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 18rpx 42rpx rgba(145, 87, 39, 0.1);
}

.tray-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  margin-bottom: 18rpx;
}

.tray-title,
.tray-desc,
.tray-progress-main,
.tray-progress-sub {
  display: block;
}

.tray-title {
  color: #2f241d;
  font-size: 34rpx;
  font-weight: 900;
}

.tray-desc {
  margin-top: 8rpx;
  color: #9a8f86;
  font-size: 24rpx;
}

.tray-progress {
  flex: 0 0 auto;
  min-width: 126rpx;
  padding: 16rpx 18rpx;
  border-radius: 999rpx;
  background: #fff7e9;
  text-align: center;
}

.tray-progress-main {
  color: #ff8c42;
  font-size: 32rpx;
  font-weight: 900;
  line-height: 1;
}

.tray-progress-sub {
  margin-top: 6rpx;
  color: #b49268;
  font-size: 20rpx;
}

.tray-progress-bar {
  height: 16rpx;
  margin-bottom: 18rpx;
  overflow: hidden;
  border-radius: 999rpx;
  background: #f0e5d8;
}

.tray-progress-fill {
  height: 100%;
  border-radius: 999rpx;
  background: linear-gradient(90deg, #ff8c42 0%, #ffbf3f 100%);
}

.task-preview-list {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.task-preview-item {
  display: flex;
  align-items: center;
  gap: 18rpx;
  padding: 18rpx;
  border-radius: 28rpx;
  background: #fffaf2;
  box-shadow: inset 0 0 0 1rpx rgba(255, 226, 188, 0.58);
}

.task-preview-icon {
  flex: 0 0 auto;
  width: 74rpx;
  height: 74rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 22rpx;
  background: linear-gradient(145deg, #fff4cf 0%, #ffe4b6 100%);
  font-size: 38rpx;
}

.task-preview-content {
  flex: 1;
  min-width: 0;
}

.task-preview-name,
.task-preview-reward {
  display: block;
}

.task-preview-name {
  overflow: hidden;
  color: #2f241d;
  font-size: 28rpx;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-preview-reward {
  margin-top: 8rpx;
  color: #b58148;
  font-size: 22rpx;
}

.task-preview-status {
  flex: 0 0 auto;
  padding: 12rpx 18rpx;
  border-radius: 999rpx;
  color: #fff;
  font-size: 22rpx;
  font-weight: 800;
  background: #ff8c42;
}

.status-waiting {
  color: #2ba9a3;
  background: #e6fbf8;
}

.status-done {
  color: #7da252;
  background: #eff8e8;
}

.empty-preview {
  padding: 24rpx;
  border-radius: 28rpx;
  background: #fffaf2;
  color: #9a8f86;
  font-size: 26rpx;
  text-align: center;
}
</style>
