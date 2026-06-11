/** 每级升级所需成长值 */
export const LEVEL_THRESHOLDS = [50, 70, 100, 130]

export const MAX_LEVEL = 5
export const MAX_STAT = 100
export const STAT_GAIN = 20
export const GROWTH_GAIN = 5

export const ITEM_LABELS = {
  food: '食物',
  soap: '肥皂',
  toy: '玩具'
}

export const ACTION_MAP = {
  feed: { item: 'food', stat: 'hunger', label: '喂食' },
  wash: { item: 'soap', stat: 'cleanliness', label: '清洁' },
  play: { item: 'toy', stat: 'mood', label: '陪玩' }
}

export function getLevelThreshold(level) {
  if (level >= MAX_LEVEL) return null
  return LEVEL_THRESHOLDS[level - 1] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
}
