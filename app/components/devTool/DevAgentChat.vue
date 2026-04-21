<script setup lang="ts">
import { ref, nextTick, inject, computed, watch, type Ref } from 'vue'

const isDarkTheme = inject('isDarkTheme', ref(true))
const agentCodeContext = inject<Ref<any>>('agentCodeContext', ref(null))
const agentErrorContext = inject<Ref<any>>('agentErrorContext', ref(null))
const { messages, isLoading, currentStep, stepMessage, conversationId, send, resume, clear, changeSummary, allChanges } = useAgentChat()

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const userInput = ref('')
const chatArea = ref<HTMLElement | null>(null)
const suggestionRefs = ref<any[]>([])
const allCollapsed = ref(false)

// 코드 컨텍스트 블록
type CodeBlock = { id: number; code: string; fileName: string; startLine: number; lineCount: number }
let blockIdCounter = 0

// 입력 세그먼트: 텍스트와 코드블록이 순서대로 섞임
type Segment = { type: 'text'; value: string } | { type: 'code'; block: CodeBlock }
const segments = ref<Segment[]>([{ type: 'text', value: '' }])

const sampleQuestions = [
  '레이어 추가 방법은?',
  '카메라 이동 방법 알려줘',
  '3D 객체 생성은 어떻게 해?',
  '지형 편집 기능 설명해줘',
]

const hasChanges = computed(() =>
  changeSummary.value.pending + changeSummary.value.applied + changeSummary.value.failed > 0
)

const scrollToBottom = () => {
  nextTick(() => {
    if (chatArea.value) chatArea.value.scrollTop = chatArea.value.scrollHeight
  })
}

const replStore = useState<any>('repl-store')

// 현재 에디터의 전체 코드와 파일명 가져오기
function getEditorContext() {
  const store = replStore.value
  if (!store) return {}
  const fileName = store.activeFile?.filename || ''
  const file = store.files?.[fileName]
  return { code: file?.code || '', fileName }
}

const sendSample = async (q: string) => {
  await send(q, getEditorContext())
  scrollToBottom()
}

const hasInput = computed(() =>
  segments.value.some(s =>
    s.type === 'code' || (s.type === 'text' && s.value.trim())
  )
)

const sendMessage = async () => {
  if (!hasInput.value || isLoading.value) return

  const codeBlocks = segments.value.filter(s => s.type === 'code') as { type: 'code'; block: CodeBlock }[]

  const parts = segments.value.map(s => {
    if (s.type === 'code') {
      const b = s.block
      return `[${b.fileName} : Line ${b.startLine}-${b.startLine + b.lineCount - 1}]\n\`\`\`\n${b.code}\n\`\`\``
    }
    return s.value.trim()
  }).filter(Boolean)

  const fullQuery = parts.join('\n\n')
  segments.value = [{ type: 'text', value: '' }]

  // 선택 코드가 있으면 선택 코드만, 없으면 전체 코드 전송
  const ctx = codeBlocks.length > 0
    ? { code: codeBlocks.map(s => s.block.code).join('\n\n'), fileName: codeBlocks[0].block.fileName }
    : getEditorContext()

  await send(fullQuery, ctx)
  scrollToBottom()
}

const handleResume = async (threadId: string | undefined, approved: boolean) => {
  if (!threadId) return
  await resume(threadId, approved)
  scrollToBottom()
}

const handleKeydown = (e: KeyboardEvent, segIndex: number) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
  // Backspace로 빈 텍스트 세그먼트에서 이전 코드블록 삭제
  if (e.key === 'Backspace') {
    const seg = segments.value[segIndex]
    if (seg.type === 'text' && !seg.value && segIndex > 0) {
      const prev = segments.value[segIndex - 1]
      if (prev.type === 'code') {
        e.preventDefault()
        segments.value.splice(segIndex - 1, 2) // 코드블록 + 빈 텍스트 제거
        if (!segments.value.length) segments.value.push({ type: 'text', value: '' })
        nextTick(() => focusLastTextarea())
      }
    }
  }
}

const removeBlock = (blockId: number) => {
  const idx = segments.value.findIndex(s => s.type === 'code' && s.block.id === blockId)
  if (idx === -1) return
  // 코드블록 제거 후 앞뒤 텍스트 세그먼트 병합
  const before = idx > 0 && segments.value[idx - 1].type === 'text' ? segments.value[idx - 1] as { type: 'text'; value: string } : null
  const after = idx < segments.value.length - 1 && segments.value[idx + 1].type === 'text' ? segments.value[idx + 1] as { type: 'text'; value: string } : null

  if (before && after) {
    before.value = (before.value + '\n' + after.value).trim()
    segments.value.splice(idx, 2) // 코드블록 + 뒤 텍스트 제거
  } else {
    segments.value.splice(idx, 1)
  }
  if (!segments.value.length || segments.value[segments.value.length - 1].type !== 'text') {
    segments.value.push({ type: 'text', value: '' })
  }
}

const focusLastTextarea = () => {
  nextTick(() => {
    const textareas = document.querySelectorAll('.agent-input .seg-textarea textarea') as NodeListOf<HTMLTextAreaElement>
    if (textareas.length) textareas[textareas.length - 1].focus()
  })
}

// Ctrl+L / 플로팅 버튼으로 선택된 코드 수신 → 마지막 위치에 블록 삽입
watch(agentCodeContext, (info) => {
  if (!info || !info.code?.trim()) return

  const lineCount = info.code.trim().split('\n').length
  const block: CodeBlock = {
    id: ++blockIdCounter,
    code: info.code.trim(),
    fileName: info.fileName || '선택된 코드',
    startLine: info.startLine || 1,
    lineCount,
  }

  segments.value.push({ type: 'code', block }, { type: 'text', value: '' })
  agentCodeContext.value = null
  focusLastTextarea()
})

// 프리뷰 에러 수집 (자동 전송 안 함, 목록으로 표시)
const errorList = ref<{ message: string; line?: number; timestamp: number }[]>([])

watch(agentErrorContext, (err) => {
  if (!err) return
  // 중복 방지
  if (!errorList.value.some(e => e.message === err.message)) {
    errorList.value.push({ message: err.message, line: err.line, timestamp: Date.now() })
  }
  agentErrorContext.value = null
})

function askAboutError(err: { message: string; line?: number }) {
  const ctx = getEditorContext()
  const query = `에러: ${err.message}${err.line ? ` (line ${err.line})` : ''}\n이 에러를 수정해주세요.`
  send(query, { ...ctx, error: err.message })
  scrollToBottom()
}

function clearErrors() {
  errorList.value = []
}

function applyAll() {
  allChanges.value
    .filter(c => c.status === 'pending')
    .forEach(c => {
      // trigger each card's apply via direct status manipulation
      const idx = allChanges.value.indexOf(c)
      const refEl = suggestionRefs.value[idx]
      if (refEl?.handleApply) refEl.handleApply()
    })
}

function undoAll() {
  allChanges.value
    .filter(c => c.status === 'applied')
    .forEach(c => {
      const idx = allChanges.value.indexOf(c)
      const refEl = suggestionRefs.value[idx]
      if (refEl?.handleUndo) refEl.handleUndo()
    })
}

function toggleCollapseAll() {
  allCollapsed.value = !allCollapsed.value
}
</script>

<template>
  <div class="agent-chat d-flex flex-column h-100" :class="{ 'is-dark': isDarkTheme }">
    <!-- Header -->
    <div class="agent-header px-3 d-flex align-center justify-space-between">
      <div class="d-flex align-center gap-2">
        <div class="status-dot" />
        <span class="header-title">Vibe Agent</span>
      </div>
      <div class="d-flex align-center gap-1">
        <v-btn icon variant="text" size="x-small" density="compact" title="대화 초기화" @click="clear">
          <v-icon size="14">mdi-broom</v-icon>
        </v-btn>
        <v-btn icon variant="text" size="x-small" density="compact" @click="emit('close')">
          <v-icon size="16">mdi-close</v-icon>
        </v-btn>
      </div>
    </div>

    <!-- Messages -->
    <div class="agent-messages flex-grow-1 overflow-y-auto" ref="chatArea">

      <!-- Error List -->
      <div v-if="errorList.length" class="error-list mx-3 mt-3 rounded-lg">
        <div class="el-header d-flex align-center justify-space-between px-3 py-1">
          <div class="d-flex align-center gap-1">
            <v-icon size="12" color="red-lighten-1">mdi-alert-circle</v-icon>
            <span style="font-size:11px; font-weight:600; color: rgb(var(--v-theme-error))">에러 {{ errorList.length }}건</span>
          </div>
          <v-btn icon variant="text" size="x-small" density="compact" @click="clearErrors">
            <v-icon size="11">mdi-close</v-icon>
          </v-btn>
        </div>
        <div v-for="(err, eIdx) in errorList" :key="eIdx"
          class="el-item d-flex align-center justify-space-between px-3 py-1 cursor-pointer"
          @click="askAboutError(err)"
        >
          <span class="text-truncate" style="font-size:11px; min-width:0;">{{ err.message }}</span>
          <v-icon size="11" color="green" class="flex-shrink-0 ml-1">mdi-send</v-icon>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="messages.length === 0" class="empty-state d-flex flex-column align-center justify-center pa-6">
        <div class="agent-avatar-lg mb-4">
          <v-icon size="28" color="green">mdi-robot-outline</v-icon>
        </div>
        <p class="empty-title mb-1">Vibe Agent</p>
        <p class="empty-sub mb-5">XDWorld 코드를 함께 작성해드립니다</p>
        <div class="d-flex flex-wrap justify-center" style="gap: 6px;">
          <button
            v-for="q in sampleQuestions" :key="q"
            class="sample-chip"
            @click="sendSample(q)"
          >{{ q }}</button>
        </div>
      </div>

      <!-- Messages -->
      <div class="messages-inner px-3 py-3">
        <div
          v-for="(msg, idx) in messages"
          :key="idx"
          class="msg-row mb-4"
          :class="msg.role === 'user' ? 'msg-user' : 'msg-agent'"
        >
          <!-- Agent -->
          <template v-if="msg.role === 'agent'">
            <div class="d-flex align-start gap-2">
              <div class="agent-avatar flex-shrink-0">
                <v-icon size="14" color="green">mdi-robot</v-icon>
              </div>
              <div class="flex-grow-1" style="min-width:0;">
                <div v-if="msg.text" class="agent-bubble">
                  <span style="white-space: pre-wrap; font-size: 13px; line-height: 1.6;">{{ msg.text }}</span>
                </div>
                
                <!-- Human-in-the-Loop 중단 -->
                <div v-if="msg.interrupted" class="mt-2 pa-3" style="background: #2d2d2d; border-radius: 8px; border: 1px solid #4a4a4a;">
                  <div class="d-flex align-center gap-2 mb-2">
                    <v-icon size="16" color="warning">mdi-pause-circle</v-icon>
                    <span style="font-size: 13px; font-weight: 600; color: #ffc107;">코드 생성 전 확인 필요</span>
                  </div>
                  <details class="mb-2">
                    <summary style="cursor: pointer; font-size: 12px; color: #aaa;">검색된 문서 보기</summary>
                    <pre style="font-size: 11px; max-height: 200px; overflow-y: auto; background: #1e1e1e; color: #d4d4d4; padding: 8px; border-radius: 4px; margin-top: 8px; border: 1px solid #3a3a3a;">{{ msg.context }}</pre>
                  </details>
                  <div class="d-flex mt-3">
                    <v-btn size="small" color="success" @click="handleResume(msg.threadId, true)" style="margin-right: 12px;">
                      <v-icon size="14" class="mr-1">mdi-check</v-icon>
                      승인 및 계속
                    </v-btn>
                    <v-btn size="small" color="error" variant="outlined" @click="handleResume(msg.threadId, false)">
                      <v-icon size="14" class="mr-1">mdi-close</v-icon>
                      취소
                    </v-btn>
                  </div>
                </div>

                <DevToolDevCodeSuggestion
                  v-for="(change, cIdx) in (msg.changes || [])"
                  :key="cIdx"
                  :ref="el => { if (el) suggestionRefs[allChanges.indexOf(change)] = el }"
                  :change="change"
                  :collapsed="allCollapsed"
                  class="mt-2"
                />
              </div>
            </div>
          </template>

          <!-- User -->
          <template v-else>
            <div class="d-flex justify-end">
              <div class="user-bubble">
                <span style="white-space: pre-wrap; font-size: 13px; line-height: 1.6;">{{ msg.text }}</span>
              </div>
            </div>
          </template>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="mb-4">
          <div class="d-flex align-start gap-2">
            <div class="agent-avatar flex-shrink-0">
              <v-icon size="14" color="green">mdi-robot</v-icon>
            </div>
            <div class="flex-grow-1">
              <div v-if="currentStep" class="step-indicator">
                <v-progress-circular indeterminate size="12" width="2" color="green" class="mr-2" />
                <span style="font-size:12px;">{{ stepMessage }}</span>
                <div class="step-bar mt-1">
                  <div class="step-bar-fill" :class="`step-${currentStep}`" />
                </div>
              </div>
              <div v-else class="loading-dots d-flex align-center gap-1">
                <span class="dot" /><span class="dot" /><span class="dot" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Change Status Bar -->
    <Transition name="fade">
      <div v-if="hasChanges" class="change-bar px-3 py-1 d-flex align-center gap-2">
        <div class="d-flex align-center gap-3 flex-grow-1">
          <span v-if="changeSummary.pending" class="status-item">
            <v-icon size="11" color="amber">mdi-clock-outline</v-icon>
            <span style="font-size:11px;">{{ changeSummary.pending }}</span>
          </span>
          <span v-if="changeSummary.applied" class="status-item">
            <v-icon size="11" color="green">mdi-check-circle</v-icon>
            <span style="font-size:11px;">{{ changeSummary.applied }}</span>
          </span>
          <span v-if="changeSummary.failed" class="status-item">
            <v-icon size="11" color="red">mdi-alert-circle</v-icon>
            <span style="font-size:11px;">{{ changeSummary.failed }}</span>
          </span>
        </div>
        <v-btn size="x-small" variant="text" density="compact" @click="toggleCollapseAll">
          <v-icon size="13">{{ allCollapsed ? 'mdi-unfold-more-horizontal' : 'mdi-unfold-less-horizontal' }}</v-icon>
        </v-btn>
        <v-btn v-if="changeSummary.pending > 0" size="x-small" color="green" variant="tonal" class="bulk-btn" @click="applyAll">
          <v-icon size="11" start>mdi-check-all</v-icon>전체 적용
        </v-btn>
        <v-btn v-if="changeSummary.applied > 0" size="x-small" color="orange" variant="tonal" class="bulk-btn" @click="undoAll">
          <v-icon size="11" start>mdi-undo-variant</v-icon>되돌리기
        </v-btn>
      </div>
    </Transition>

    <!-- Input -->
    <div class="agent-input px-3 pb-3 pt-2">
      <div class="input-box rounded-xl">
        <template v-for="(seg, sIdx) in segments" :key="sIdx">
          <div v-if="seg.type === 'code'" class="code-chip mx-2 mt-2 rounded-lg d-flex align-center justify-space-between px-2 py-1">
            <div class="d-flex align-center gap-1" style="min-width:0;">
              <v-icon size="11" color="green">mdi-file-code-outline</v-icon>
              <span class="text-truncate" style="font-size:11px; font-weight:600; max-width:120px;">{{ seg.block.fileName }}</span>
              <span style="font-size:10px; opacity:0.5;">L{{ seg.block.startLine }}-{{ seg.block.startLine + seg.block.lineCount - 1 }}</span>
            </div>
            <v-btn icon variant="text" size="x-small" density="compact" @click="removeBlock(seg.block.id)" style="width:16px;height:16px;">
              <v-icon size="11">mdi-close</v-icon>
            </v-btn>
          </div>
          <v-textarea
            v-else
            v-model="seg.value"
            variant="plain"
            rows="1"
            auto-grow
            density="compact"
            hide-details
            :placeholder="sIdx === 0 && segments.length === 1 ? '메시지를 입력하세요...' : ''"
            class="seg-textarea px-3"
            style="min-height: 40px;"
            @keydown="handleKeydown($event, sIdx)"
          />
        </template>
        <div class="d-flex justify-end px-2 pb-1">
          <v-btn
            icon variant="flat" size="small"
            :color="hasInput && !isLoading ? 'green' : 'surface-variant'"
            :disabled="!hasInput || isLoading"
            class="send-btn"
            @click="sendMessage"
          >
            <v-icon size="16">mdi-send</v-icon>
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.agent-chat {
  background: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
}
.agent-header {
  height: 42px;
  min-height: 42px;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.06);
  background: rgba(var(--v-theme-surface-variant), 0.04);
}
.header-title {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.3px;
}
.status-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #4caf50;
  box-shadow: 0 0 0 2px rgba(76,175,80,0.2);
  animation: pulse-dot 2s ease-in-out infinite;
}
@keyframes pulse-dot {
  0%, 100% { box-shadow: 0 0 0 2px rgba(76,175,80,0.2); }
  50% { box-shadow: 0 0 0 4px rgba(76,175,80,0.1); }
}
.agent-messages {
  overflow-y: auto;
}
.agent-messages::-webkit-scrollbar { width: 4px; }
.agent-messages::-webkit-scrollbar-thumb {
  background: rgba(var(--v-theme-on-surface), 0.12);
  border-radius: 2px;
}
.messages-inner { min-height: 100%; }

/* Empty state */
.empty-state { height: 100%; }
.agent-avatar-lg {
  width: 52px; height: 52px;
  border-radius: 16px;
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.2);
  display: flex; align-items: center; justify-content: center;
}
.empty-title { font-size: 14px; font-weight: 700; }
.empty-sub { font-size: 12px; opacity: 0.5; }
.sample-chip {
  font-size: 11px;
  padding: 5px 12px;
  border-radius: 20px;
  border: 1px solid rgba(76, 175, 80, 0.3);
  background: rgba(76, 175, 80, 0.06);
  color: rgb(var(--v-theme-on-surface));
  cursor: pointer;
  transition: all 0.15s;
}
.sample-chip:hover {
  background: rgba(76, 175, 80, 0.14);
  border-color: rgba(76, 175, 80, 0.5);
  transform: translateY(-1px);
}

/* Agent avatar */
.agent-avatar {
  width: 26px; height: 26px;
  border-radius: 8px;
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.2);
  display: flex; align-items: center; justify-content: center;
  margin-top: 2px;
}

/* Bubbles */
.agent-bubble {
  background: rgba(var(--v-theme-surface-variant), 0.1);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.06);
  border-radius: 4px 12px 12px 12px;
  padding: 10px 14px;
  display: inline-block;
  max-width: 100%;
}
.user-bubble {
  background: rgba(76, 175, 80, 0.12);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 12px 4px 12px 12px;
  padding: 10px 14px;
  max-width: 85%;
}
.cursor-blink {
  animation: blink 1s step-end infinite;
  color: #4caf50;
  font-weight: bold;
}
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

/* Loading */
.step-indicator {
  background: rgba(var(--v-theme-surface-variant), 0.1);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.06);
  border-left: 2px solid #4caf50;
  border-radius: 4px 12px 12px 12px;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
}
.step-bar {
  height: 2px;
  background: rgba(var(--v-theme-on-surface), 0.08);
  border-radius: 1px;
  overflow: hidden;
}
.step-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #81c784);
  animation: progress-pulse 1.5s ease-in-out infinite;
  transition: width 0.4s ease;
}
.step-bar-fill.step-analyzing { width: 33%; }
.step-bar-fill.step-searching { width: 66%; }
.step-bar-fill.step-generating { width: 90%; }
@keyframes progress-pulse { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
.loading-dots {
  padding: 10px 14px;
  background: rgba(var(--v-theme-surface-variant), 0.1);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.06);
  border-radius: 4px 12px 12px 12px;
  display: inline-flex;
}
.dot {
  width: 5px; height: 5px;
  background: rgba(var(--v-theme-on-surface), 0.4);
  border-radius: 50%;
  animation: wave 1.3s linear infinite;
}
.dot:nth-child(1) { animation-delay: -1.1s; }
.dot:nth-child(2) { animation-delay: -0.9s; }
.dot:nth-child(3) { animation-delay: -0.7s; }
@keyframes wave { 0%, 60%, 100% { transform: initial; } 30% { transform: translateY(-4px); } }

/* Error list */
.error-list {
  border: 1px solid rgba(244, 67, 54, 0.2);
  background: rgba(244, 67, 54, 0.04);
  overflow: hidden;
}
.el-header { min-height: 26px; border-bottom: 1px solid rgba(244, 67, 54, 0.1); }
.el-item { min-height: 26px; transition: background 0.15s; }
.el-item:hover { background: rgba(244, 67, 54, 0.07); }
.el-item + .el-item { border-top: 1px solid rgba(var(--v-theme-on-surface), 0.04); }

/* Change bar */
.change-bar {
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.06);
  background: rgba(var(--v-theme-surface-variant), 0.04);
  min-height: 36px;
}
.status-item { display: inline-flex; align-items: center; gap: 3px; }
.bulk-btn {
  text-transform: none !important;
  letter-spacing: 0 !important;
  font-size: 11px !important;
  height: 22px !important;
}

/* Input */
.agent-input { border-top: 1px solid rgba(var(--v-theme-on-surface), 0.06); }
.input-box {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  background: rgba(var(--v-theme-surface-variant), 0.04);
  transition: border-color 0.2s;
}
.input-box:focus-within { border-color: rgba(76, 175, 80, 0.5); }
.code-chip {
  border: 1px solid rgba(76, 175, 80, 0.2);
  background: rgba(76, 175, 80, 0.06);
}
.seg-textarea { font-size: 13px; }
.seg-textarea :deep(.v-field) {
  min-height: auto !important;
}
.seg-textarea :deep(.v-field__input) { 
  min-height: 28px !important; 
  max-height: 400px !important;
  padding-top: 6px; 
  padding-bottom: 4px; 
}
.seg-textarea :deep(textarea) {
  overflow-y: auto !important;
}
.send-btn { border-radius: 10px !important; width: 32px !important; height: 32px !important; }

/* Fade */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s, transform 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(4px); }
</style>
