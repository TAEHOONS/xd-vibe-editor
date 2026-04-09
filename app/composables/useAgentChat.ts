import { ref } from 'vue'

export type AgentMessage = {
  role: 'user' | 'agent'
  text: string
  timestamp: number
}

const AGENT_BASE_URL = 'http://34.204.193.135:8000'

export function useAgentChat() {
  const messages = ref<AgentMessage[]>([])
  const isLoading = ref(false)

  async function send(query: string) {
    messages.value.push({ role: 'user', text: query, timestamp: Date.now() })
    isLoading.value = true

    try {
      const res = await fetch(`${AGENT_BASE_URL}/api/v1/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query }),
      })

      if (!res.ok) throw new Error(`${res.status}`)

      const data = await res.json()
      messages.value.push({
        role: 'agent',
        text: data.answer ?? JSON.stringify(data),
        timestamp: Date.now(),
      })
    } catch (e: any) {
      messages.value.push({
        role: 'agent',
        text: `연결 오류: ${e.message}`,
        timestamp: Date.now(),
      })
    } finally {
      isLoading.value = false
    }
  }

  function clear() {
    messages.value = []
  }

  return { messages, isLoading, send, clear }
}
