<template>
  <view class="page">
    <view class="tip-card">
      <text>家长可新增、编辑、开启或关闭每日任务。关闭后孩子今日任务列表不再显示。</text>
    </view>

    <view class="add-bar">
      <button class="btn-add" @click="onAdd">+ 新增任务</button>
    </view>

    <view v-for="tpl in templates" :key="tpl.id" class="tpl-card">
      <view class="tpl-main">
        <text class="tpl-icon">{{ tpl.icon }}</text>
        <view class="tpl-info" @click="onEdit(tpl)">
          <text class="tpl-name">{{ tpl.name }}</text>
          <text class="tpl-reward">奖励：{{ rewardLabel(tpl.rewardType) }} ×{{ tpl.rewardAmount }}</text>
        </view>
      </view>
      <view class="tpl-actions">
        <switch :checked="tpl.enabled" color="#FF8C42" @change="onToggle(tpl.id, $event)" />
        <text class="btn-edit" @click="onEdit(tpl)">✎</text>
      </view>
    </view>

    <view class="reset-box">
      <button class="btn-reset" @click="onReset">重置所有数据（测试用）</button>
    </view>

    <task-form-modal
      :visible="modalVisible"
      :template="editingTemplate"
      @close="onCloseModal"
      @confirm="onSaveTemplate"
      @remove="onRemoveTemplate"
    />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import {
  getTaskTemplates,
  toggleTaskTemplate,
  saveTaskTemplate,
  deleteTaskTemplate,
  resetAllData
} from '../../../services/storage'
import { ITEM_LABELS } from '../../../constants/pet'

const templates = ref([])
const modalVisible = ref(false)
const editingTemplate = ref(null)

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

function onAdd() {
  editingTemplate.value = null
  modalVisible.value = true
}

function onEdit(tpl) {
  editingTemplate.value = { ...tpl }
  modalVisible.value = true
}

function onCloseModal() {
  modalVisible.value = false
  editingTemplate.value = null
}

function onSaveTemplate(formData) {
  const result = saveTaskTemplate(formData)
  if (!result.ok) {
    uni.showToast({ title: result.message, icon: 'none' })
    return
  }
  modalVisible.value = false
  editingTemplate.value = null
  loadTemplates()
  uni.showToast({ title: result.message, icon: 'success' })
}

function onRemoveTemplate() {
  if (!editingTemplate.value?.id) return
  uni.showModal({
    title: '确认删除',
    content: `确定要删除「${editingTemplate.value.name}」吗？`,
    success(res) {
      if (!res.confirm) return
      const result = deleteTaskTemplate(editingTemplate.value.id)
      if (result.ok) {
        modalVisible.value = false
        editingTemplate.value = null
        loadTemplates()
        uni.showToast({ title: '已删除', icon: 'success' })
      } else {
        uni.showToast({ title: result.message, icon: 'none' })
      }
    }
  })
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

.add-bar {
  margin-bottom: 24rpx;
}

.btn-add {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background: #fff;
  color: #ff8c42;
  font-size: 30rpx;
  font-weight: 600;
  border: 2rpx dashed #ff8c42;
  border-radius: 24rpx;
  padding: 0;
}

.btn-add::after {
  border: none;
}

.tpl-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 24rpx 28rpx;
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

.tpl-actions {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.btn-edit {
  font-size: 36rpx;
  color: #999;
  padding: 8rpx;
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