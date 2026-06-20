<template>
  <view class="page">
    <view class="pet-header">
      <view>
        <text class="eyebrow">XIAOLI'S ROOM</text>
        <text class="page-title">小梨的家</text>
      </view>
      <view class="home-badge">
        <text class="home-badge-icon">🏡</text>
        <text>今天也要好好照顾小梨</text>
      </view>
    </view>

    <view class="status-chip-grid">
      <view v-for="chip in statusChips" :key="chip.key" class="status-chip" :class="`status-chip-${chip.key}`">
        <view class="chip-topline">
          <text class="chip-icon">{{ chip.icon }}</text>
          <text class="chip-label">{{ chip.label }}</text>
        </view>
        <view class="chip-value-row">
          <text class="chip-value">{{ chip.value }}</text>
          <text class="chip-caption">{{ chip.caption }}</text>
        </view>
        <view class="chip-track">
          <view class="chip-fill" :style="{ width: chip.percent + '%' }" />
        </view>
      </view>
    </view>

    <view class="pet-stage">
      <view class="room-light" />
      <view class="room-window">
        <view class="window-sky" />
        <view class="window-line window-line-v" />
        <view class="window-line window-line-h" />
      </view>
      <view class="room-shelf">
        <view class="shelf-board" />
        <view class="shelf-book shelf-book-a" />
        <view class="shelf-book shelf-book-b" />
        <view class="shelf-plant" />
      </view>
      <view class="stage-rug" />
      <view class="stage-bed">
        <text>☁️</text>
      </view>
      <view class="stage-star-lamp">
        <text>⭐</text>
      </view>
      <view class="stage-toy-corner">
        <text>🏐</text>
        <text>🧸</text>
      </view>
      <view class="unlock-shelf-ghost">
        <text>🔒</text>
        <text class="unlock-text">待解锁</text>
      </view>

      <view class="emotion-bubble">
        <text>{{ emotionText }}</text>
      </view>

      <view class="pet-visual" :class="`pet-visual-${emotionState}`">
        <view class="pet-aura" />
        <view class="pet-body">
          <text class="pet-emoji">{{ petEmoji }}</text>
          <view class="pet-cheek pet-cheek-left" />
          <view class="pet-cheek pet-cheek-right" />
        </view>
        <view class="pet-shadow" />
      </view>
    </view>

    <view class="section-card furniture-card">
      <view class="section-header">
        <view>
          <text class="section-title">家园布置</text>
          <text class="section-desc">用收集到的家具，布置属于小梨的家吧</text>
        </view>
        <text class="section-pill">静态展示</text>
      </view>
      <view class="furniture-grid">
        <view v-for="item in furnitureItems" :key="item.key" class="furniture-item" :class="{ 'is-locked': item.status === 'locked' }">
          <view class="furniture-icon">{{ item.icon }}</view>
          <view class="furniture-copy">
            <view class="furniture-title-row">
              <text class="furniture-name">{{ item.name }}</text>
              <text v-if="item.level" class="furniture-level">{{ item.level }}</text>
            </view>
            <text class="furniture-desc">{{ item.desc }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="section-card whisper-card">
      <view class="whisper-icon">💬</view>
      <view class="whisper-content">
        <text class="section-title">小梨悄悄话</text>
        <text class="whisper-text">{{ whisperText }}</text>
        <view class="task-mini-row">
          <view class="task-mini-progress">
            <view class="task-mini-fill" :style="{ width: taskProgressPercent + '%' }" />
          </view>
          <text class="task-mini-text">今日任务 {{ taskStats.done }}/{{ taskStats.total }}，完成照顾任务，可以获得更多道具</text>
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

const petStore = usePetStore()
const inventoryStore = useInventoryStore()
const tasksStore = useTasksStore()

const pet = computed(() => petStore.pet)
const inventory = computed(() => inventoryStore.inventory)
const taskStats = computed(() => tasksStore.taskStats)
const growthProgress = computed(() => petStore.growthProgress)

const upgradeVisible = ref(false)
const upgradeLevel = ref(1)

const furnitureItems = [
  {
    key: 'nest',
    name: '小窝',
    level: 'Lv.2',
    icon: '🏠',
    status: 'owned',
    desc: '小梨休息的小角落'
  },
  {
    key: 'lamp',
    name: '星星灯',
    level: 'Lv.1',
    icon: '⭐',
    status: 'owned',
    desc: '夜晚会发光的温柔小灯'
  },
  {
    key: 'toy',
    name: '玩具角',
    level: 'Lv.1',
    icon: '🏐',
    status: 'owned',
    desc: '陪小梨玩耍的地方'
  },
  {
    key: 'locked',
    name: '待解锁',
    level: '',
    icon: '🔒',
    status: 'locked',
    desc: '继续照顾小梨解锁新家具'
  }
]

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
    happy: '今天很开心，小梨想看看新布置',
    hungry: '小梨肚子有点空，先喂点食物吧',
    needClean: '小梨想洗香香，保持干净会更开心',
    bored: '小梨想要新玩具，陪它玩一会儿吧'
  }
  return textMap[emotionState.value]
})

const whisperText = computed(() => {
  const textMap = {
    happy: '小梨把星星灯打开了，想邀请你一起看看今天的家园。',
    hungry: '小梨悄悄摸了摸肚子，如果有食物会更有精神。',
    needClean: '小梨想把小窝整理干净，洗香香之后会更开心。',
    bored: '玩具角安静了一会儿，小梨正在等你一起玩。'
  }
  return textMap[emotionState.value]
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

const statusChips = computed(() => [
  {
    key: 'hunger',
    icon: '🍖',
    label: '饱腹',
    value: `${pet.value.hunger || 0}/100`,
    caption: '小梨能量',
    percent: clampPercent(pet.value.hunger || 0)
  },
  {
    key: 'clean',
    icon: '🫧',
    label: '清洁',
    value: `${pet.value.cleanliness || 0}/100`,
    caption: '香香指数',
    percent: clampPercent(pet.value.cleanliness || 0)
  },
  {
    key: 'mood',
    icon: '😊',
    label: '心情',
    value: `${pet.value.mood || 0}/100`,
    caption: '陪伴感',
    percent: clampPercent(pet.value.mood || 0)
  },
  {
    key: 'growth',
    icon: '🌱',
    label: '成长值',
    value: `${growthProgress.value.current}/${growthProgress.value.total}`,
    caption: `Lv.${pet.value.level || 1}`,
    percent: clampPercent(growthProgress.value.percent || 0)
  }
])

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

const taskProgressPercent = computed(() => {
  if (!taskStats.value.total) return 0
  return Math.min(100, Math.round((taskStats.value.done / taskStats.value.total) * 100))
})

function clampPercent(value) {
  return Math.min(100, Math.max(0, Math.round(value)))
}

function loadData() {
  try {
    initAppData()
    petStore.load()
    inventoryStore.load()
    tasksStore.loadAll()
  } catch (e) {
    console.error('pet page loadData failed', e)
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

onShow(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 32rpx 24rpx 46rpx;
  box-sizing: border-box;
  background:
    radial-gradient(circle at 12% 5%, rgba(255, 216, 153, 0.42) 0, rgba(255, 216, 153, 0) 250rpx),
    radial-gradient(circle at 88% 16%, rgba(78, 205, 196, 0.14) 0, rgba(78, 205, 196, 0) 270rpx),
    linear-gradient(180deg, #fff2df 0%, #fffaf4 42%, #fff5e8 100%);
  color: #2f241d;
}

.pet-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 22rpx;
  margin-bottom: 22rpx;
}

.eyebrow,
.page-title,
.home-badge,
.chip-label,
.chip-value,
.chip-caption,
.section-title,
.section-desc,
.furniture-name,
.furniture-desc,
.whisper-text,
.task-mini-text,
.action-title,
.action-subtitle,
.unlock-text {
  display: block;
}

.eyebrow {
  margin-bottom: 4rpx;
  color: #bd8b62;
  font-size: 22rpx;
  font-weight: 800;
  letter-spacing: 4rpx;
}

.page-title {
  color: #2f241d;
  font-size: 54rpx;
  font-weight: 950;
  line-height: 1.1;
}

.home-badge {
  display: flex;
  align-items: center;
  gap: 8rpx;
  max-width: 276rpx;
  padding: 14rpx 18rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.94);
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.76);
  color: #8b7c70;
  font-size: 22rpx;
  font-weight: 700;
  line-height: 1.25;
  box-shadow: 0 12rpx 30rpx rgba(143, 100, 58, 0.08);
}

.home-badge-icon {
  flex: 0 0 auto;
  font-size: 30rpx;
}

.status-chip-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14rpx;
  margin-bottom: 22rpx;
}

.status-chip {
  min-width: 0;
  padding: 18rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.9);
  border-radius: 30rpx;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 12rpx 28rpx rgba(146, 96, 45, 0.08);
}

.chip-topline,
.chip-value-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
}

.chip-icon {
  font-size: 34rpx;
  line-height: 1;
}

.chip-label {
  flex: 1;
  color: #7b6250;
  font-size: 23rpx;
  font-weight: 800;
}

.chip-value-row {
  margin-top: 10rpx;
}

.chip-value {
  color: #2f241d;
  font-size: 28rpx;
  font-weight: 950;
  line-height: 1;
}

.chip-caption {
  color: #aa9584;
  font-size: 20rpx;
  font-weight: 700;
}

.chip-track {
  height: 12rpx;
  margin-top: 14rpx;
  overflow: hidden;
  border-radius: 999rpx;
  background: rgba(120, 92, 65, 0.12);
}

.chip-fill {
  height: 100%;
  border-radius: 999rpx;
  background: linear-gradient(90deg, #ff8c42 0%, #ffbf3f 100%);
}

.status-chip-clean .chip-fill {
  background: linear-gradient(90deg, #4ecdc4 0%, #8ceadf 100%);
}

.status-chip-mood .chip-fill {
  background: linear-gradient(90deg, #ffd84d 0%, #ffb51f 100%);
}

.status-chip-growth .chip-fill {
  background: linear-gradient(90deg, #ff9d4d 0%, #ffe079 100%);
}

.pet-stage {
  position: relative;
  height: 780rpx;
  margin-bottom: 22rpx;
  overflow: hidden;
  border-radius: 54rpx;
  background:
    linear-gradient(110deg, rgba(255, 255, 255, 0.76) 0%, rgba(255, 241, 219, 0.36) 54%, rgba(255, 220, 166, 0.5) 100%),
    radial-gradient(circle at 50% 88%, #f5d7aa 0, #f5d7aa 170rpx, rgba(245, 215, 170, 0) 172rpx),
    linear-gradient(180deg, #fff2dc 0%, #ffe9cf 64%, #f7d1a8 100%);
  box-shadow: 0 22rpx 50rpx rgba(145, 87, 39, 0.15);
}

.room-light {
  position: absolute;
  top: -170rpx;
  left: -120rpx;
  width: 560rpx;
  height: 560rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.82), rgba(255, 242, 205, 0.2) 58%, rgba(255, 242, 205, 0) 72%);
}

.room-window {
  position: absolute;
  top: 96rpx;
  left: 38rpx;
  width: 170rpx;
  height: 228rpx;
  overflow: hidden;
  border: 10rpx solid rgba(255, 255, 255, 0.94);
  border-radius: 48rpx 48rpx 26rpx 26rpx;
  background: linear-gradient(160deg, #aee8ff 0%, #eaf8ff 48%, #b9ec9b 100%);
  box-shadow: inset 0 0 0 2rpx rgba(255, 255, 255, 0.5), 0 12rpx 28rpx rgba(125, 86, 50, 0.12);
}

.window-sky {
  width: 100%;
  height: 100%;
  background: linear-gradient(118deg, rgba(255, 255, 255, 0.74) 0%, rgba(255, 255, 255, 0) 44%);
}

.window-line {
  position: absolute;
  background: rgba(255, 255, 255, 0.78);
}

.window-line-v {
  top: 0;
  left: 50%;
  width: 6rpx;
  height: 100%;
  transform: translateX(-50%);
}

.window-line-h {
  top: 50%;
  left: 0;
  width: 100%;
  height: 6rpx;
  transform: translateY(-50%);
}

.room-shelf {
  position: absolute;
  top: 112rpx;
  right: 86rpx;
  width: 202rpx;
  height: 112rpx;
}

.shelf-board {
  position: absolute;
  bottom: 20rpx;
  left: 0;
  width: 194rpx;
  height: 16rpx;
  border-radius: 999rpx;
  background: #d7a873;
  box-shadow: 0 8rpx 16rpx rgba(122, 76, 33, 0.15);
}

.shelf-book {
  position: absolute;
  bottom: 36rpx;
  width: 24rpx;
  border-radius: 8rpx 8rpx 4rpx 4rpx;
}

.shelf-book-a {
  left: 18rpx;
  height: 58rpx;
  background: #ff9b70;
}

.shelf-book-b {
  left: 48rpx;
  height: 46rpx;
  background: #81d8d0;
}

.shelf-plant {
  position: absolute;
  right: 38rpx;
  bottom: 36rpx;
  width: 42rpx;
  height: 58rpx;
  border-radius: 22rpx 22rpx 10rpx 10rpx;
  background: linear-gradient(180deg, #85c66e 0%, #5aa74d 54%, #d5a164 55%, #c1864c 100%);
}

.stage-rug {
  position: absolute;
  left: 50%;
  bottom: 58rpx;
  width: 520rpx;
  height: 168rpx;
  border-radius: 50%;
  transform: translateX(-50%);
  background: radial-gradient(circle, rgba(255, 246, 222, 0.9) 0%, rgba(255, 211, 151, 0.8) 52%, rgba(229, 161, 94, 0.16) 72%);
}

.stage-bed {
  position: absolute;
  left: 42rpx;
  bottom: 220rpx;
  width: 184rpx;
  height: 104rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 76rpx 76rpx 34rpx 34rpx;
  background: linear-gradient(180deg, #d6e69b 0%, #c0d87b 100%);
  font-size: 58rpx;
  box-shadow: inset 0 -10rpx 18rpx rgba(113, 143, 75, 0.16), 0 10rpx 22rpx rgba(111, 91, 57, 0.12);
}

.stage-star-lamp {
  position: absolute;
  right: 56rpx;
  bottom: 252rpx;
  width: 138rpx;
  height: 138rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 36rpx;
  background: linear-gradient(145deg, #fff9e6 0%, #ffd27a 100%);
  font-size: 76rpx;
  box-shadow: 0 12rpx 26rpx rgba(246, 171, 57, 0.22), 0 0 44rpx rgba(255, 221, 111, 0.42);
}

.stage-toy-corner {
  position: absolute;
  right: 60rpx;
  bottom: 80rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 14rpx 16rpx;
  border-radius: 28rpx;
  background: rgba(255, 255, 255, 0.34);
  font-size: 50rpx;
  transform: rotate(-5deg);
}

.unlock-shelf-ghost {
  position: absolute;
  right: 38rpx;
  top: 246rpx;
  width: 182rpx;
  height: 132rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 3rpx dashed rgba(150, 125, 98, 0.35);
  border-radius: 40rpx 40rpx 22rpx 22rpx;
  color: rgba(120, 102, 84, 0.58);
  background: rgba(255, 255, 255, 0.22);
  font-size: 34rpx;
}

.unlock-text {
  margin-top: 8rpx;
  font-size: 20rpx;
  font-weight: 800;
}

.emotion-bubble {
  position: absolute;
  z-index: 5;
  top: 268rpx;
  left: 72rpx;
  max-width: 340rpx;
  padding: 24rpx 28rpx;
  border-radius: 34rpx 34rpx 34rpx 10rpx;
  background: rgba(255, 255, 255, 0.9);
  color: #5a4030;
  font-size: 30rpx;
  font-weight: 900;
  line-height: 1.45;
  box-shadow: 0 14rpx 34rpx rgba(115, 77, 42, 0.12);
}

.pet-visual {
  position: absolute;
  z-index: 4;
  left: 50%;
  bottom: 100rpx;
  width: 360rpx;
  height: 424rpx;
  transform: translateX(-50%);
}

.pet-aura {
  position: absolute;
  left: 50%;
  bottom: 20rpx;
  width: 340rpx;
  height: 340rpx;
  border-radius: 50%;
  transform: translateX(-50%);
  background: radial-gradient(circle, rgba(255, 229, 120, 0.44), rgba(255, 209, 102, 0.09) 58%, rgba(255, 209, 102, 0) 72%);
}

.pet-body {
  position: absolute;
  left: 50%;
  bottom: 32rpx;
  width: 292rpx;
  height: 340rpx;
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
  font-size: 152rpx;
  line-height: 1;
  filter: drop-shadow(0 8rpx 10rpx rgba(146, 84, 25, 0.12));
}

.pet-cheek {
  position: absolute;
  top: 190rpx;
  width: 30rpx;
  height: 18rpx;
  border-radius: 50%;
  background: rgba(255, 150, 112, 0.3);
}

.pet-cheek-left {
  left: 58rpx;
}

.pet-cheek-right {
  right: 58rpx;
}

.pet-shadow {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 260rpx;
  height: 44rpx;
  border-radius: 50%;
  transform: translateX(-50%);
  background: rgba(137, 90, 42, 0.13);
  filter: blur(2rpx);
}

.pet-visual-hungry .pet-body {
  background: linear-gradient(150deg, #ffe7a6 0%, #ffd164 52%, #ffb74d 100%);
}

.pet-visual-needClean .pet-aura {
  background: radial-gradient(circle, rgba(78, 205, 196, 0.3), rgba(78, 205, 196, 0.08) 58%, rgba(78, 205, 196, 0) 72%);
}

.pet-visual-bored .pet-aura {
  background: radial-gradient(circle, rgba(255, 179, 71, 0.32), rgba(255, 179, 71, 0.08) 58%, rgba(255, 179, 71, 0) 72%);
}

.section-card {
  margin-bottom: 22rpx;
  padding: 28rpx 24rpx 24rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.9);
  border-radius: 40rpx;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 18rpx 42rpx rgba(145, 87, 39, 0.1);
}

.section-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18rpx;
  margin-bottom: 20rpx;
}

.section-title {
  color: #2f241d;
  font-size: 34rpx;
  font-weight: 950;
  line-height: 1.2;
}

.section-desc {
  margin-top: 8rpx;
  color: #9a8f86;
  font-size: 24rpx;
  line-height: 1.35;
}

.section-pill {
  flex: 0 0 auto;
  padding: 12rpx 18rpx;
  border-radius: 999rpx;
  background: #fff7e9;
  color: #b58148;
  font-size: 21rpx;
  font-weight: 900;
}

.furniture-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
}

.furniture-item {
  min-width: 0;
  padding: 18rpx;
  border-radius: 30rpx;
  background: #fffaf2;
  box-shadow: inset 0 0 0 1rpx rgba(255, 226, 188, 0.58);
}

.furniture-item.is-locked {
  background: rgba(246, 241, 232, 0.72);
  opacity: 0.82;
}

.furniture-icon {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14rpx;
  border-radius: 22rpx;
  background: linear-gradient(145deg, #fff4cf 0%, #ffe4b6 100%);
  font-size: 38rpx;
}

.furniture-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10rpx;
}

.furniture-name {
  color: #2f241d;
  font-size: 28rpx;
  font-weight: 950;
}

.furniture-level {
  flex: 0 0 auto;
  color: #ff8c42;
  font-size: 20rpx;
  font-weight: 900;
}

.furniture-desc {
  margin-top: 8rpx;
  color: #9a8f86;
  font-size: 22rpx;
  line-height: 1.35;
}

.whisper-card {
  display: flex;
  gap: 18rpx;
  background:
    radial-gradient(circle at 8% 12%, rgba(255, 216, 125, 0.32) 0, rgba(255, 216, 125, 0) 170rpx),
    rgba(255, 255, 255, 0.9);
}

.whisper-icon {
  flex: 0 0 auto;
  width: 76rpx;
  height: 76rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24rpx;
  background: linear-gradient(145deg, #fff4cf 0%, #ffe4b6 100%);
  font-size: 40rpx;
}

.whisper-content {
  flex: 1;
  min-width: 0;
}

.whisper-text {
  margin-top: 10rpx;
  color: #6d5544;
  font-size: 26rpx;
  font-weight: 700;
  line-height: 1.45;
}

.task-mini-row {
  margin-top: 18rpx;
}

.task-mini-progress {
  height: 14rpx;
  overflow: hidden;
  border-radius: 999rpx;
  background: #f0e5d8;
}

.task-mini-fill {
  height: 100%;
  border-radius: 999rpx;
  background: linear-gradient(90deg, #ff8c42 0%, #ffbf3f 100%);
}

.task-mini-text {
  margin-top: 10rpx;
  color: #b58148;
  font-size: 22rpx;
  line-height: 1.35;
}

.care-actions {
  display: flex;
  gap: 18rpx;
  padding: 18rpx;
  border-radius: 40rpx;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 16rpx 36rpx rgba(145, 87, 39, 0.1);
}

.care-action-btn {
  flex: 1;
  height: 122rpx;
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
  color: #fff;
}

.action-title {
  font-size: 30rpx;
  font-weight: 950;
  line-height: 1.1;
}

.action-subtitle {
  margin-top: 8rpx;
  font-size: 19rpx;
  opacity: 0.9;
  line-height: 1.1;
}
</style>
