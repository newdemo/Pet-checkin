import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { switchRole as doSwitchRole, getRole } from '../services/storage'

export const useRoleStore = defineStore('role', () => {
  const role = ref('child')

  function load() {
    role.value = getRole()
  }

  function switchTo(roleValue) {
    const result = doSwitchRole(roleValue)
    if (result.ok) {
      role.value = roleValue
    }
    return result
  }

  const isParent = computed(() => role.value === 'parent')
  const isChild = computed(() => role.value === 'child')

  return { role, load, switchTo, isParent, isChild }
})