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
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getRecordData } from '../../services/storage'
import { getWeekdayLabel } from '../../utils/date'

const pet = ref({ level: 1 })
const streakStat = ref({ currentStreak: 0, totalCompleted: 0 })
const weekDays = ref([])
const history = ref([])

function weekday(date) {
  return getWeekdayLabel(date)
}

function formatDay(dateStr) {
  const [, m, d] = dateStr.split('-')
  return `${Number(m)}/${Number(d)}`
}

function loadData() {
  const data = getRecordData()
  pet.value = data.pet
  streakStat.value = data.streakStat
  weekDays.value = data.weekDays
  history.value = data.history
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
  color: #ff8c42;
}

.stat-label {
  display: block;
  font-size: 22rpx;
  color: #999;
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
  color: #999;
  margin-bottom: 8rpx;
}

.week-dot {
  font-size: 32rpx;
  color: #ddd;
}

.week-dot.active {
  color: #4ecdc4;
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
