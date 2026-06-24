import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ITEM_LABELS } from '../constants/pet'
import { getAppData } from '../services/storage'

export const useInventoryStore = defineStore('inventory', () => {
  const inventory = ref({
    food: 0,
    soap: 0,
    toy: 0
  })

  async function load() {
    const data = await getAppData()
    inventory.value = { ...data.inventory }
  }

  const items = computed(() => {
    return Object.entries(inventory.value).map(([key, count]) => ({
      type: key,
      label: ITEM_LABELS[key] || key,
      count
    }))
  })

  const totalCount = computed(() => {
    return Object.values(inventory.value).reduce((sum, v) => sum + v, 0)
  })

  return { inventory, load, items, totalCount }
})