<template>
  <view v-if="visible" class="overlay" @click.stop>
    <view class="modal">
      <view class="modal-header">
        <text class="modal-title">{{ isEdit ? '编辑任务' : '新增任务' }}</text>
        <view class="btn-close" @click="$emit('close')">✕</view>
      </view>

      <view class="modal-body">
        <view class="form-item">
          <text class="label">任务名称</text>
          <input class="input" v-model="form.name" placeholder="例如：刷牙" maxlength="10" />
        </view>

        <view class="form-item">
          <text class="label">图标</text>
          <input class="input" v-model="form.icon" placeholder="选择一个 emoji" maxlength="2" />
        </view>

        <view class="form-item">
          <text class="label">奖励类型</text>
          <picker mode="selector" :range="rewardOptions" :value="rewardIndex" @change="onRewardChange">
            <view class="picker-value">{{ rewardOptions[rewardIndex] }}</view>
          </picker>
        </view>

        <view class="form-item">
          <text class="label">奖励数量</text>
          <view class="amount-row">
            <view
              v-for="n in 3"
              :key="n"
              :class="['amount-tag', { active: form.rewardAmount === n }]"
              @click="form.rewardAmount = n"
            >
              {{ n }}
            </view>
          </view>
        </view>
      </view>

      <view class="modal-footer">
        <button v-if="isEdit" class="btn-delete" @click="onRemove">删除任务</button>
        <button class="btn-cancel" @click="$emit('close')">取消</button>
        <button class="btn-confirm" @click="onConfirm">确认</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ITEM_LABELS } from '../constants/pet'

const props = defineProps({
  visible: { type: Boolean, default: false },
  template: { type: Object, default: null }
})

const emit = defineEmits(['close', 'confirm', 'remove'])

const isEdit = computed(() => !!props.template?.id)

const rewardOptions = Object.values(ITEM_LABELS)
const rewardTypes = Object.keys(ITEM_LABELS)

const form = ref({
  name: '',
  icon: '⭐',
  rewardType: 'food',
  rewardAmount: 1
})

const rewardIndex = computed(() => {
  const idx = rewardTypes.indexOf(form.value.rewardType)
  return idx >= 0 ? idx : 0
})

function onRewardChange(e) {
  form.value.rewardType = rewardTypes[e.detail.value] || 'food'
}

function resetForm() {
  if (props.template) {
    form.value = {
      name: props.template.name || '',
      icon: props.template.icon || '⭐',
      rewardType: props.template.rewardType || 'food',
      rewardAmount: props.template.rewardAmount || 1
    }
  } else {
    form.value = { name: '', icon: '⭐', rewardType: 'food', rewardAmount: 1 }
  }
}

function onConfirm() {
  if (!form.value.name.trim()) {
    uni.showToast({ title: '请输入任务名称', icon: 'none' })
    return
  }
  if (!form.value.icon.trim()) {
    uni.showToast({ title: '请设置图标', icon: 'none' })
    return
  }
  emit('confirm', {
    ...(props.template?.id ? { id: props.template.id } : {}),
    name: form.value.name.trim(),
    icon: form.value.icon.trim(),
    rewardType: form.value.rewardType,
    rewardAmount: form.value.rewardAmount
  })
}

function onRemove() {
  emit('remove')
}

watch(
  () => props.visible,
  (val) => {
    if (val) resetForm()
  }
)
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
  width: 620rpx;
  background: #fff;
  border-radius: 32rpx;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 32rpx 16rpx;
}

.modal-title {
  font-size: 34rpx;
  font-weight: 700;
  color: #333;
}

.btn-close {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: $text-secondary;
  border-radius: 50%;
  background: #f5f5f5;
}

.modal-body {
  padding: 8rpx 32rpx 24rpx;
}

.form-item {
  margin-bottom: 28rpx;
}

.label {
  display: block;
  font-size: 26rpx;
  color: #666;
  margin-bottom: 12rpx;
}

.input {
  width: 100%;
  height: 80rpx;
  background: #f8f8f8;
  border-radius: 16rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.picker-value {
  height: 80rpx;
  line-height: 80rpx;
  background: #f8f8f8;
  border-radius: 16rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #333;
}

.amount-row {
  display: flex;
  gap: 16rpx;
}

.amount-tag {
  width: 100rpx;
  height: 72rpx;
  line-height: 72rpx;
  text-align: center;
  background: #f8f8f8;
  border-radius: 16rpx;
  font-size: 28rpx;
  color: #666;
  transition: all 0.2s;
}

.amount-tag.active {
  background: $primary;
  color: #fff;
}

.modal-footer {
  display: flex;
  padding: 0 32rpx 32rpx;
  gap: 20rpx;
}

.btn-cancel,
.btn-confirm,
.btn-delete {
  flex: 1;
  height: 84rpx;
  line-height: 84rpx;
  border-radius: 42rpx;
  font-size: 28rpx;
  border: none;
  padding: 0;
}

.btn-cancel::after,
.btn-confirm::after,
.btn-delete::after {
  border: none;
}

.btn-delete {
  background: #fff5f5;
  color: #ff4757;
}

.btn-cancel {
  background: #f5f5f5;
  color: #666;
}

.btn-confirm {
  background: $primary;
  color: #fff;
}
</style>