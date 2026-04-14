import { ref, computed } from 'vue'

export type ChangeStatus = 'pending' | 'applied' | 'failed'

export type CodeChange = {
  filePath: string
  description: string
  language: string
  code: string
  action: 'auto' | 'replace_file' | 'insert_function' | 'insert_script' | 'insert_template'
  status: ChangeStatus
  errorMessage?: string
  previousCode?: string
}

export type AgentMessage = {
  role: 'user' | 'agent'
  text: string
  timestamp: number
  changes?: CodeChange[]
  streaming?: boolean
}

export type AgentStep = 'analyzing' | 'searching' | 'generating' | 'validating' | null

const AGENT_BASE_URL = ''

function toChanges(suggestions: any[]): CodeChange[] {
  if (!Array.isArray(suggestions)) return []
  return suggestions.map(s => ({
    filePath: s.filename || '',
    description: s.description || '',
    language: s.language || 'js',
    code: s.code || '',
    action: s.action || 'auto',
    status: 'pending' as ChangeStatus,
  }))
}

export function useAgentChat() {
  const messages = ref<AgentMessage[]>([])
  const isLoading = ref(false)
  const currentStep = ref<AgentStep>(null)
  const stepMessage = ref('')

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
    currentStep.value = null

    // 스트리밍 메시지 placeholder
    messages.value.push({
      role: 'agent',
      text: '',
      timestamp: Date.now(),
      streaming: true
    })
    const msgIndex = messages.value.length - 1

    try {
      const body: Record<string, any> = { question: query }
      if (context?.code) body.source_code = context.code
      if (context?.fileName) body.file_name = context.fileName
      if (context?.error) body.error_info = context.error

      // 이전 대화 히스토리 전달 (현재 메시지 제외, 최근 10개)
      const history = messages.value
        .slice(0, -1) // 방금 추가한 user 메시지 제외
        .filter(m => m.text)
        .slice(-10)
        .map(m => ({ role: m.role, content: m.text }))
      if (history.length) body.history = history

      const res = await fetch(`${AGENT_BASE_URL}/api/v1/ask/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error(`${res.status}`)

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error('No reader')

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          
          const data = line.slice(6)
          if (!data.trim()) continue

          try {
            const event = JSON.parse(data)

            if (event.type === 'step') {
              currentStep.value = event.step
              stepMessage.value = event.message || ''
            } else if (event.type === 'token') {
              messages.value[msgIndex].text += event.content
            } else if (event.type === 'result') {
              messages.value[msgIndex].text = event.answer
              messages.value[msgIndex].streaming = false
              if (event.code_suggestions) {
                messages.value[msgIndex].changes = toChanges(event.code_suggestions)
              }
            } else if (event.type === 'done') {
              currentStep.value = null
              stepMessage.value = ''
            } else if (event.type === 'error') {
              messages.value[msgIndex].text = `오류: ${event.message}`
              messages.value[msgIndex].streaming = false
            }
          } catch (e) {
            console.warn('이벤트 파싱 실패:', e)
          }
        }
      }
    } catch (e: any) {
      messages.value[msgIndex].text = `연결 오류: ${e.message}`
      messages.value[msgIndex].streaming = false
    } finally {
      isLoading.value = false
      currentStep.value = null
      stepMessage.value = ''
    }
  }

  function clear() {
    messages.value = []
    currentStep.value = null
    stepMessage.value = ''
  }

  return { 
    messages, 
    isLoading, 
    currentStep, 
    stepMessage, 
    send, 
    clear, 
    changeSummary, 
    allChanges 
  }
}
