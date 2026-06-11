import {
  MAX_LEVEL,
  MAX_STAT,
  STAT_GAIN,
  GROWTH_GAIN,
  getLevelThreshold
} from '../constants/pet'

export function applyGrowth(pet) {
  let { level, growthValue } = pet
  growthValue += GROWTH_GAIN

  while (level < MAX_LEVEL) {
    const threshold = getLevelThreshold(level)
    if (growthValue < threshold) break
    growthValue -= threshold
    level += 1
  }

  if (level >= MAX_LEVEL) {
    const threshold = getLevelThreshold(MAX_LEVEL - 1)
    growthValue = Math.min(growthValue, threshold || growthValue)
  }

  return { ...pet, level, growthValue }
}

export function usePetItem(pet, inventory, actionType) {
  const actions = {
    feed: { item: 'food', stat: 'hunger' },
    wash: { item: 'soap', stat: 'cleanliness' },
    play: { item: 'toy', stat: 'mood' }
  }
  const action = actions[actionType]
  if (!action) return { ok: false, message: '未知操作' }

  if ((inventory[action.item] || 0) < 1) {
    return { ok: false, message: '道具不足，先完成任务获取吧' }
  }

  const nextInventory = { ...inventory, [action.item]: inventory[action.item] - 1 }
  const nextPet = {
    ...pet,
    [action.stat]: Math.min(MAX_STAT, (pet[action.stat] || 0) + STAT_GAIN)
  }
  const grownPet = applyGrowth({ ...nextPet, growthValue: pet.growthValue })

  return {
    ok: true,
    pet: grownPet,
    inventory: nextInventory,
    leveledUp: grownPet.level > pet.level
  }
}

export function getGrowthProgress(pet) {
  if (pet.level >= MAX_LEVEL) {
    return { current: pet.growthValue, total: getLevelThreshold(MAX_LEVEL - 1) || 1, percent: 100 }
  }
  const total = getLevelThreshold(pet.level) || 1
  const percent = Math.min(100, Math.round((pet.growthValue / total) * 100))
  return { current: pet.growthValue, total, percent }
}
