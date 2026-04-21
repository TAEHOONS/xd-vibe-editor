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
  interrupted?: boolean
  threadId?: string
  context?: string
  intent?: string
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
  const conversationId = ref<string | null>(null)

  // localStorage에서 conversation_id 복원
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('agent_conversation_id')
    if (saved) conversationId.value = saved
  }

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
    currentStep.value = 'analyzing'

    messages.value.push({
      role: 'agent',
      text: '',
      timestamp: Date.now(),
    })
    const msgIndex = messages.value.length - 1

    try {
      const body: Record<string, any> = { question: query }
      if (conversationId.value) body.conversation_id = conversationId.value
      if (context?.code) body.source_code = context.code
      if (context?.fileName) body.file_name = context.fileName
      if (context?.error) body.error_info = context.error

      const res = await fetch(`${AGENT_BASE_URL}/api/v1/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error(`${res.status}`)

      const result = await res.json()

      // Human-in-the-Loop 중단 처리
      if (result.interrupted) {
        conversationId.value = result.conversation_id
        if (typeof window !== 'undefined') {
          localStorage.setItem('agent_conversation_id', result.conversation_id)
        }
        
        messages.value[msgIndex].interrupted = true
        messages.value[msgIndex].threadId = result.thread_id
        messages.value[msgIndex].context = result.context
        messages.value[msgIndex].intent = result.intent
        messages.value[msgIndex].text = result.message || '코드 생성 전 검색된 문서를 확인하세요.'
        return
      }

      // 정상 완료
      conversationId.value = result.conversation_id
      if (typeof window !== 'undefined') {
        localStorage.setItem('agent_conversation_id', result.conversation_id)
      }

      messages.value[msgIndex].text = result.answer
      if (result.code_suggestions) {
        messages.value[msgIndex].changes = toChanges(result.code_suggestions)
      }
    } catch (e: any) {
      messages.value[msgIndex].text = `연결 오류: ${e.message}`
    } finally {
      isLoading.value = false
      currentStep.value = null
    }
  }

  async function resume(threadId: string, approved: boolean = true, additionalContext?: string) {
    isLoading.value = true
    currentStep.value = 'generating'

    const msgIndex = messages.value.length
    messages.value.push({
      role: 'agent',
      text: '',
      timestamp: Date.now(),
    })

    try {
      const params = new URLSearchParams({ thread_id: threadId, approved: String(approved) })
      if (additionalContext) params.append('additional_context', additionalContext)

      const res = await fetch(`${AGENT_BASE_URL}/api/v1/ask/resume?${params}`, {
        method: 'POST',
      })

      if (!res.ok) throw new Error(`${res.status}`)

      const result = await res.json()

      messages.value[msgIndex].text = result.answer
      if (result.code_suggestions) {
        messages.value[msgIndex].changes = toChanges(result.code_suggestions)
      }
    } catch (e: any) {
      messages.value[msgIndex].text = `재개 오류: ${e.message}`
    } finally {
      isLoading.value = false
      currentStep.value = null
    }
  }

  function clear() {
    messages.value = []
    currentStep.value = null
    stepMessage.value = ''
    conversationId.value = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('agent_conversation_id')
    }
  }

  return { 
    messages, 
    isLoading, 
    currentStep, 
    stepMessage, 
    conversationId,
    send, 
    resume,
    clear, 
    changeSummary, 
    allChanges 
  }
}
