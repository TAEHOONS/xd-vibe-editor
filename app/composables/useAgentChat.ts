import { ref, computed } from 'vue'

export type ChangeStatus = 'pending' | 'applied' | 'failed'

export type CodeChange = {
  filePath: string
  description: string
  language: string
  code: string
  status: ChangeStatus
  errorMessage?: string
  previousCode?: string
}

export type AgentMessage = {
  role: 'user' | 'agent'
  text: string
  timestamp: number
  changes?: CodeChange[]
}

const AGENT_BASE_URL = 'http://34.204.193.135:8000'

function toChanges(suggestions: any[]): CodeChange[] {
  if (!Array.isArray(suggestions)) return []
  return suggestions.map(s => ({
    filePath: s.filename || '',
    description: '',
    language: s.language || 'js',
    code: s.code || '',
    status: 'pending' as ChangeStatus,
  }))
}

export function useAgentChat() {
  const messages = ref<AgentMessage[]>([])
  const isLoading = ref(false)

  const changeSummary = computed(() => {
    const all = messages.value.flatMap(m => m.changes || [])
    return {
      pending: all.filter(c => c.status === 'pending').length,
      applied: all.filter(c => c.status === 'applied').length,
      failed: all.filter(c => c.status === 'failed').length,
    }
  })

  const allChanges = computed(() => messages.value.flatMap(m => m.changes || []))

  async function send(query: string, context?: { code?: string; fileName?: string; error?: string }) {
    messages.value.push({ role: 'user', text: query, timestamp: Date.now() })
    isLoading.value = true

    try {
      const body: Record<string, any> = { question: query }
      if (context?.code) body.source_code = context.code
      if (context?.fileName) body.file_name = context.fileName
      if (context?.error) body.error_info = context.error

      const res = await fetch(`${AGENT_BASE_URL}/api/v1/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error(`${res.status}`)

      const data = await res.json()
      const answer = data.answer ?? data.response ?? JSON.stringify(data)
      const changes = toChanges(data.code_suggestions)

      messages.value.push({
        role: 'agent',
        text: answer,
        timestamp: Date.now(),
        changes: changes.length ? changes : undefined,
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

  return { messages, isLoading, send, clear, changeSummary, allChanges }
}
