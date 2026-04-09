import { ref } from 'vue'

export type CodeBlock = {
  filename: string
  language: string
  code: string
  action: 'create' | 'replace'
  status: 'pending' | 'applied' | 'rejected'
  previousCode?: string
}

export type AgentMessage = {
  role: 'user' | 'agent'
  text: string
  timestamp: number
  codeBlocks?: CodeBlock[]
}

const AGENT_BASE_URL = 'http://34.204.193.135:8000'

/** ```lang:filename 형태의 코드블록을 파싱 */
function parseCodeBlocks(text: string): CodeBlock[] {
  const regex = /```(\w+)?(?::([^\n]+))?\n([\s\S]*?)```/g
  const blocks: CodeBlock[] = []
  let m: RegExpExecArray | null
  while ((m = regex.exec(text)) !== null) {
    blocks.push({
      filename: m[2]?.trim() || '',
      language: m[1] || 'vue',
      code: m[3].trimEnd(),
      action: 'replace',
      status: 'pending',
    })
  }
  return blocks
}

/** 코드블록을 제거한 텍스트 반환 */
function stripCodeBlocks(text: string): string {
  return text.replace(/```(\w+)?(?::([^\n]+))?\n[\s\S]*?```/g, '').trim()
}

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
      const raw = data.answer ?? data.response ?? JSON.stringify(data)
      const codeBlocks = parseCodeBlocks(raw)

      messages.value.push({
        role: 'agent',
        text: codeBlocks.length ? stripCodeBlocks(raw) || '코드 제안:' : raw,
        timestamp: Date.now(),
        codeBlocks: codeBlocks.length ? codeBlocks : undefined,
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
