<script setup lang="ts">
import { ref, nextTick, inject, computed, watch, type Ref } from 'vue'

const isDarkTheme = inject('isDarkTheme', ref(true))
const agentCodeContext = inject<Ref<any>>('agentCodeContext', ref(null))
const agentErrorContext = inject<Ref<any>>('agentErrorContext', ref(null))
const { messages, isLoading, currentStep, stepMessage, send, clear, changeSummary, allChanges } = useAgentChat()

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

  // 세그먼트를 하나의 쿼리로 조합
  const parts = segments.value.map(s => {
    if (s.type === 'code') {
      const b = s.block
      return `[${b.fileName} : Line ${b.startLine}-${b.startLine + b.lineCount - 1}]\n\`\`\`\n${b.code}\n\`\`\``
    }
    return s.value.trim()
  }).filter(Boolean)

  const fullQuery = parts.join('\n\n')
  segments.value = [{ type: 'text', value: '' }]
  await send(fullQuery, getEditorContext())
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
    <div class="agent-header px-4 d-flex align-center justify-space-between" style="height: 38px; min-height: 38px;">
      <div class="d-flex align-center gap-2">
        <div class="status-dot" />
        <span class="text-caption font-weight-bold" style="font-size: 13px;">Agent</span>
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

    <v-divider />

    <!-- Messages -->
    <div class="agent-messages flex-grow-1 overflow-y-auto pa-4" ref="chatArea">
      <!-- Error List -->
      <div v-if="errorList.length" class="error-list mb-3 rounded-lg">
        <div class="el-header d-flex align-center justify-space-between px-3 py-1">
          <div class="d-flex align-center gap-1">
            <v-icon size="14" color="red">mdi-alert-circle</v-icon>
            <span class="text-caption font-weight-medium">에러 {{ errorList.length }}건</span>
          </div>
          <v-btn icon variant="text" size="x-small" density="compact" @click="clearErrors">
            <v-icon size="12">mdi-close</v-icon>
          </v-btn>
        </div>
        <div v-for="(err, eIdx) in errorList" :key="eIdx"
          class="el-item d-flex align-center justify-space-between px-3 py-1 cursor-pointer"
          @click="askAboutError(err)"
        >
          <span class="text-caption text-truncate" style="min-width:0;">{{ err.message }}</span>
          <v-icon size="12" color="green" class="flex-shrink-0 ml-1">mdi-send</v-icon>
        </div>
      </div>

      <div v-if="messages.length === 0" class="empty-state text-center pa-8">
        <v-icon size="48" color="disabled" class="mb-3">mdi-robot-outline</v-icon>
        <p class="text-body-2 text-medium-emphasis mb-4">Agent에게 질문하세요.</p>
        <div class="d-flex flex-wrap justify-center" style="gap: 10px; margin-top: 12px;">
          <v-chip
            v-for="q in sampleQuestions" :key="q"
            size="small" variant="tonal" color="green"
            class="cursor-pointer sample-chip px-4"
            style="margin: 4px 0;"
            @click="sendSample(q)"
          >{{ q }}</v-chip>
        </div>
      </div>

      <div
        v-for="(msg, idx) in messages"
        :key="idx"
        class="msg-row d-flex mb-3"
        :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
      >
        <v-avatar v-if="msg.role === 'agent'" size="28" color="surface-light" class="mr-2 align-self-start">
          <v-icon size="16" color="green">mdi-robot</v-icon>
        </v-avatar>
        <div style="max-width: 90%;">
          <div
            class="msg-bubble pa-3 rounded-lg text-body-2"
            :class="msg.role === 'user' ? 'user-msg' : 'agent-msg'"
          >
            <span style="white-space: pre-wrap;">{{ msg.text }}</span>
          </div>
          <DevToolDevCodeSuggestion
            v-for="(change, cIdx) in (msg.changes || [])"
            :key="cIdx"
            :ref="el => { if (el) suggestionRefs[allChanges.indexOf(change)] = el }"
            :change="change"
            :collapsed="allCollapsed"
          />
        </div>
      </div>

      <div v-if="isLoading" class="d-flex flex-column mb-3">
        <!-- 진행 단계 표시 -->
        <div v-if="currentStep" class="step-progress mb-2">
          <div class="d-flex align-center gap-2 pa-3 rounded-lg">
            <v-avatar size="28" color="green" class="flex-shrink-0">
              <v-icon size="16" color="white">mdi-robot</v-icon>
            </v-avatar>
            <div class="flex-grow-1">
              <div class="d-flex align-center gap-2 mb-1">
                <v-progress-circular indeterminate size="14" width="2" color="green" />
                <span class="text-caption font-weight-bold text-green">{{ stepMessage }}</span>
              </div>
              <div class="step-bar">
                <div class="step-bar-fill" :class="`step-${currentStep}`"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 기본 로딩 (단계 정보 없을 때) -->
        <div v-else class="d-flex justify-start">
          <v-avatar size="28" color="surface-light" class="mr-2">
            <v-icon size="16" color="green">mdi-robot</v-icon>
          </v-avatar>
          <div class="loading-dots d-flex align-center gap-1 pa-3 rounded-lg agent-msg">
            <span class="dot"></span><span class="dot"></span><span class="dot"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Change Status Bar -->
    <Transition name="fade">
      <div v-if="hasChanges" class="change-bar">
        <div class="d-flex align-center gap-2 px-3 py-1">
          <!-- Status counts -->
          <div class="d-flex align-center gap-3 flex-grow-1">
            <span v-if="changeSummary.pending" class="status-item text-amber-lighten-1">
              <v-icon size="12">mdi-clock-outline</v-icon>
              <span class="text-caption">{{ changeSummary.pending }}</span>
            </span>
            <span v-if="changeSummary.applied" class="status-item text-green">
              <v-icon size="12">mdi-check-circle</v-icon>
              <span class="text-caption">{{ changeSummary.applied }}</span>
            </span>
            <span v-if="changeSummary.failed" class="status-item text-red">
              <v-icon size="12">mdi-alert-circle</v-icon>
              <span class="text-caption">{{ changeSummary.failed }}</span>
            </span>
          </div>

          <!-- Bulk actions -->
          <v-btn size="x-small" variant="text" density="compact" @click="toggleCollapseAll" :title="allCollapsed ? '모두 펼치기' : '모두 접기'">
            <v-icon size="14">{{ allCollapsed ? 'mdi-unfold-more-horizontal' : 'mdi-unfold-less-horizontal' }}</v-icon>
          </v-btn>
          <v-btn v-if="changeSummary.pending > 0" size="x-small" color="green" variant="tonal" class="bulk-btn" @click="applyAll">
            <v-icon size="12" start>mdi-check-all</v-icon>전체 적용
          </v-btn>
          <v-btn v-if="changeSummary.applied > 0" size="x-small" color="orange" variant="tonal" class="bulk-btn" @click="undoAll">
            <v-icon size="12" start>mdi-undo-variant</v-icon>전체 되돌리기
          </v-btn>
        </div>
      </div>
    </Transition>

    <!-- Input -->
    <div class="agent-input pa-3">
      <div class="input-wrapper rounded-lg">
        <template v-for="(seg, sIdx) in segments" :key="sIdx">
          <!-- Code Block Chip -->
          <div v-if="seg.type === 'code'" class="attached-code mx-2 mt-2 rounded">
            <div class="ac-header d-flex align-center justify-space-between px-2 py-1">
              <div class="d-flex align-center gap-1" style="min-width:0;">
                <v-icon size="12" color="green">mdi-file-code-outline</v-icon>
                <span class="ac-filename text-truncate">{{ seg.block.fileName }}</span>
                <span class="ac-lines">L{{ seg.block.startLine }}-{{ seg.block.startLine + seg.block.lineCount - 1 }}</span>
              </div>
              <v-btn icon variant="text" size="x-small" density="compact" @click="removeBlock(seg.block.id)" style="width:18px;height:18px;">
                <v-icon size="12">mdi-close</v-icon>
              </v-btn>
            </div>
          </div>
          <!-- Text Input -->
          <v-textarea
            v-else
            v-model="seg.value"
            variant="plain"
            rows="1"
            auto-grow
            max-rows="4"
            density="compact"
            hide-details
            :placeholder="sIdx === 0 && segments.length === 1 ? 'Agent에게 물어보세요...' : sIdx === segments.length - 1 ? '이어서 질문하세요...' : ''"
            class="seg-textarea agent-textarea px-3"
            @keydown="handleKeydown($event, sIdx)"
          />
        </template>

        <!-- Send Button -->
        <div class="d-flex justify-end px-2 pb-1">
          <v-btn
            icon variant="text" size="small" color="green"
            :disabled="!hasInput || isLoading"
            @click="sendMessage"
          >
            <v-icon>mdi-send</v-icon>
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.agent-chat {
  background-color: rgba(var(--v-theme-surface));
  color: rgba(var(--v-theme-on-surface));
}
.agent-header {
  background-color: rgba(var(--v-theme-surface-variant), 0.08);
}
.status-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #4caf50;
  box-shadow: 0 0 6px rgba(76, 175, 80, 0.5);
}
.user-msg {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgba(var(--v-theme-primary), 0.85));
  color: #fff;
  border-top-right-radius: 0 !important;
}
.agent-msg {
  background-color: rgba(var(--v-theme-surface-variant), 0.12);
  color: rgba(var(--v-theme-on-surface));
  border-top-left-radius: 0 !important;
}
.agent-textarea { font-size: 13px; }
.sample-chip {
  transition: transform 0.15s, box-shadow 0.15s;
}
.sample-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.25);
}
.dot {
  width: 6px; height: 6px;
  background-color: #888; border-radius: 50%;
  animation: wave 1.3s linear infinite;
}
.agent-chat.is-dark .dot { background-color: #aaa; }
.dot:nth-child(1) { animation-delay: -1.1s; }
.dot:nth-child(2) { animation-delay: -0.9s; }
.dot:nth-child(3) { animation-delay: -0.7s; }
@keyframes wave {
  0%, 60%, 100% { transform: initial; }
  30% { transform: translateY(-4px); }
}
.step-progress {
  width: 100%;
  background-color: rgba(var(--v-theme-surface-variant), 0.08);
  border-radius: 8px;
  border-left: 3px solid #4caf50;
}
.step-bar {
  height: 3px;
  background-color: rgba(var(--v-theme-surface-variant), 0.2);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 4px;
}
.step-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #66bb6a);
  transition: width 0.3s ease;
  animation: progress-pulse 1.5s ease-in-out infinite;
}
.step-bar-fill.step-analyzing { width: 33%; }
.step-bar-fill.step-searching { width: 66%; }
.step-bar-fill.step-generating { width: 90%; }
@keyframes progress-pulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}
.agent-messages::-webkit-scrollbar { width: 5px; }
.agent-messages::-webkit-scrollbar-track { background: transparent; }
.agent-messages::-webkit-scrollbar-thumb {
  background-color: rgba(var(--v-theme-on-surface-variant), 0.2);
  border-radius: 3px;
}
/* Change status bar */
/* Error list */
.error-list {
  border: 1px solid rgba(244, 67, 54, 0.25);
  background: rgba(244, 67, 54, 0.05);
  overflow: hidden;
}
.el-header {
  min-height: 28px;
  border-bottom: 1px solid rgba(244, 67, 54, 0.1);
}
.el-item {
  transition: background 0.15s;
  min-height: 28px;
}
.el-item:hover {
  background: rgba(244, 67, 54, 0.08);
}
.el-item + .el-item {
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.04);
}
/* Change status bar */
.change-bar {
  background: rgba(var(--v-theme-surface-variant), 0.08);
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.06);
}
.status-item {
  display: inline-flex;
  align-items: center;
  gap: 3px;
}
.bulk-btn {
  text-transform: none !important;
  letter-spacing: 0 !important;
  font-weight: 500;
  font-size: 11px !important;
  height: 24px !important;
}
/* Fade transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
/* Attached code block */
.input-wrapper {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.15);
  background: rgba(var(--v-theme-surface), 1);
  transition: border-color 0.2s;
}
.input-wrapper:focus-within {
  border-color: #4caf50;
}
.attached-code {
  border: 1px solid rgba(76, 175, 80, 0.25);
  background: rgba(76, 175, 80, 0.06);
  overflow: hidden;
}
.ac-header {
  min-height: 24px;
}
.ac-filename {
  font-size: 11px;
  font-weight: 600;
  max-width: 120px;
}
.ac-lines {
  font-size: 10px;
  opacity: 0.5;
}
.ac-preview {
  max-height: 60px;
  overflow-y: auto;
}
.ac-preview pre {
  margin: 0;
  white-space: pre-wrap;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 10px;
  line-height: 1.4;
  opacity: 0.6;
}
.ac-preview::-webkit-scrollbar { width: 3px; }
.ac-preview::-webkit-scrollbar-thumb {
  background: rgba(var(--v-theme-on-surface), 0.15);
  border-radius: 2px;
}
.seg-textarea { font-size: 13px; }
.seg-textarea :deep(.v-field__input) { min-height: 28px !important; padding-top: 4px; padding-bottom: 4px; }
</style>
