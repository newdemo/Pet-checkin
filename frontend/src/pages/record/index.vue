<template>
  <view class="page">
    <view class="stats-row">
      <view class="stat-card">
        <text class="stat-num">{{ streakStat.currentStreak }}</text>
        <text class="stat-label">连续打卡天</text>
      </view>
      <view class="stat-card">
        <text class="stat-num">Lv.{{ pet.level }}</text>
        <text class="stat-label">宠物等级</text>
      </view>
      <view class="stat-card">
        <text class="stat-num">{{ streakStat.totalCompleted }}</text>
        <text class="stat-label">累计完成</text>
      </view>
    </view>

    <view class="section-card">
      <text class="section-title">近 7 日</text>
      <view class="week-row">
        <view v-for="day in weekDays" :key="day.date" class="week-item">
          <text class="week-label">{{ weekday(day.date) }}</text>
          <text class="week-dot" :class="{ active: day.hasCheckin }">
            {{ day.hasCheckin ? '✓' : '·' }}
          </text>
        </view>
      </view>
    </view>

    <view class="section-card">
      <text class="section-title">最近完成</text>
      <view v-if="history.length === 0" class="empty">还没有记录，快去完成任务吧</view>
      <view v-for="item in history" :key="item.id" class="history-item">
        <text class="history-date">{{ formatDay(item.date) }}</text>
        <text class="history-name">{{ item.taskName }}</text>
        <text class="history-done">✅</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useTasksStore } from '../../stores/tasks'
import { usePetStore } from '../../stores/pet'
import { getWeekdayLabel } from '../../utils/date'

const tasksStore = useTasksStore()
const petStore = usePetStore()

const pet = computed(() => petStore.pet)
const streakStat = computed(() => tasksStore.streakStat)
const weekDays = computed(() => tasksStore.weekDays)
const history = computed(() => tasksStore.history)

function weekday(date) {
  return getWeekdayLabel(date)
}

function formatDay(dateStr) {
  const [, m, d] = dateStr.split('-')
  return `${Number(m)}/${Number(d)}`
}

function loadData() {
  petStore.load()
  tasksStore.loadRecordData()
}

onShow(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.page {
  padding: 24rpx;
}

.stats-row {
  display: flex;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.stat-card {
  flex: 1;
  background: #fff;
  border-radius: 24rpx;
  padding: 28rpx 16rpx;
  text-align: center;
  box-shadow: 0 4rpx 16rpx rgba(255, 140, 66, 0.08);
}

.stat-num {
  display: block;
  font-size: 40rpx;
  font-weight: 700;
  color: $primary;
}

.stat-label {
  display: block;
  font-size: 22rpx;
  color: $text-secondary;
  margin-top: 8rpx;
}

.section-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 28rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.week-row {
  display: flex;
  justify-content: space-between;
}

.week-item {
  text-align: center;
}

.week-label {
  display: block;
  font-size: 22rpx;
  color: $text-secondary;
  margin-bottom: 8rpx;
}

.week-dot {
  font-size: 32rpx;
  color: #ddd;
}

.week-dot.active {
  color: $success;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.history-date {
  width: 100rpx;
  font-size: 24rpx;
  color: #999;
}

.history-name {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.history-done {
  font-size: 28rpx;
}

.empty {
  text-align: center;
  color: #999;
  font-size: 26rpx;
  padding: 24rpx 0;
}
</style>
