// Mock areaStore for REPL sandbox
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAreaStore = defineStore('area', () => {
  const areas = ref([])
  return { areas }
})
