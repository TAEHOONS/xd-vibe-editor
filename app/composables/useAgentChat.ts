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

const AGENT_BASE_URL = 'http://localhost:8000'

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
    const streamingMsg: AgentMessage = {
      role: 'agent',
      text: '',
      timestamp: Date.now(),
      streaming: true
    }
    messages.value.push(streamingMsg)

    try {
      const body: Record<string, any> = { question: query }
      if (context?.code) body.source_code = context.code
      if (context?.fileName) body.file_name = context.fileName
      if (context?.error) body.error_info = context.error

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
            console.log('[Agent Event]', event) // 디버깅

            if (event.type === 'step') {
              currentStep.value = event.step
              stepMessage.value = event.message || ''
              console.log('→ Step:', event.step, event.message)
            } else if (event.type === 'token') {
              streamingMsg.text += event.content
            } else if (event.type === 'result') {
              streamingMsg.text = event.answer
              streamingMsg.streaming = false
              if (event.code_suggestions) {
                streamingMsg.changes = toChanges(event.code_suggestions)
              }
            } else if (event.type === 'done') {
              currentStep.value = null
              stepMessage.value = ''
            } else if (event.type === 'error') {
              streamingMsg.text = `오류: ${event.message}`
              streamingMsg.streaming = false
            }
          } catch (e) {
            console.warn('이벤트 파싱 실패:', e)
          }
        }
      }
    } catch (e: any) {
      streamingMsg.text = `연결 오류: ${e.message}`
      streamingMsg.streaming = false
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
