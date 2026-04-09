// Mock appStore for REPL sandbox
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const activeApps = ref({})

  const isAppActive = (appCode) => {
    return activeApps.value[appCode] || false
  }

  const setAppActive = (val) => {
    // 모든 앱을 활성화/비활성화
    if (typeof val === 'boolean') {
      Object.keys(activeApps.value).forEach(key => {
        activeApps.value[key] = val
      })
      // 기본 앱도 활성화
      activeApps.value['M_APPNAME'] = val
    }
  }

  const contactCS = (title) => {
    console.log('[Mock] 개발자 문의:', title)
  }

  return { activeApps, isAppActive, setAppActive, contactCS }
})
