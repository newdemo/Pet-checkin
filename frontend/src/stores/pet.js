import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getGrowthProgress } from '../services/pet'
import { MAX_LEVEL } from '../constants/pet'
import { getAppData, performPetAction, savePetName } from '../services/storage'

export const usePetStore = defineStore('pet', () => {
  const pet = ref({
    name: '小萌',
    level: 1,
    growthValue: 0,
    hunger: 80,
    cleanliness: 80,
    mood: 80
  })

  async function load() {
    const data = await getAppData()
    pet.value = { ...data.pet }
  }

  async function performAction(actionType) {
    const result = await performPetAction(actionType)
    if (result.ok) {
      pet.value = { ...result.pet }
    }
    return result
  }

  async function saveName(name) {
    const result = await savePetName(name)
    if (result.ok) {
      pet.value.name = name.trim()
    }
    return result
  }

  const growthProgress = computed(() => {
    return getGrowthProgress(pet.value)
  })

  const isMaxLevel = computed(() => pet.value.level >= MAX_LEVEL)

  return { pet, load, performAction, saveName, growthProgress, isMaxLevel }
})