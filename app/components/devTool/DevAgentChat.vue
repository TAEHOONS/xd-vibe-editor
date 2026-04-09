<script setup lang="ts">
import { ref, nextTick, inject } from 'vue'

const isDarkTheme = inject('isDarkTheme', ref(true))
const { messages, isLoading, send, clear } = useAgentChat()

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const userInput = ref('')
const chatArea = ref<HTMLElement | null>(null)

const sampleQuestions = [
  '레이어 추가 방법은?',
  '카메라 이동 방법 알려줘',
  '3D 객체 생성은 어떻게 해?',
  '지형 편집 기능 설명해줘',
]

const scrollToBottom = () => {
  nextTick(() => {
    if (chatArea.value) chatArea.value.scrollTop = chatArea.value.scrollHeight
  })
}

const sendSample = async (q: string) => {
  await send(q)
  scrollToBottom()
}

const sendMessage = async () => {
  const text = userInput.value.trim()
  if (!text || isLoading.value) return
  userInput.value = ''
  await send(text)
  scrollToBottom()
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}
</script>

<template>
  <div class="agent-chat d-flex flex-column h-100" :class="{ 'is-dark': isDarkTheme }">
    <!-- Header -->
    <div class="agent-header px-4 d-flex align-center justify-space-between" style="height: 38px; min-height: 38px;">
      <div class="d-flex align-center gap-2">
        <v-icon size="16" color="green">mdi-lan-connect</v-icon>
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
        <div
          class="msg-bubble pa-3 rounded-lg text-body-2"
          :class="msg.role === 'user' ? 'user-msg' : 'agent-msg'"
          style="max-width: 85%;"
        >
          <span style="white-space: pre-wrap;">{{ msg.text }}</span>
          <DevCodeSuggestion
            v-for="(block, bIdx) in (msg.codeBlocks || [])"
            :key="bIdx"
            :block="block"
          />
        </div>
      </div>

      <div v-if="isLoading" class="d-flex justify-start mb-3">
        <v-avatar size="28" color="surface-light" class="mr-2">
          <v-icon size="16" color="green">mdi-robot</v-icon>
        </v-avatar>
        <div class="loading-dots d-flex align-center gap-1 pa-3 rounded-lg agent-msg">
          <span class="dot"></span><span class="dot"></span><span class="dot"></span>
        </div>
      </div>
    </div>

    <v-divider />

    <!-- Input -->
    <div class="agent-input pa-3">
      <v-textarea
        v-model="userInput"
        variant="outlined"
        rows="1"
        auto-grow
        max-rows="4"
        density="compact"
        hide-details
        placeholder="Agent에게 물어보세요..."
        class="agent-textarea"
        bg-color="surface"
        @keydown="handleKeydown"
      >
        <template #append-inner>
          <v-btn
            icon variant="text" size="small" color="green"
            :disabled="!userInput.trim() || isLoading"
            @click="sendMessage"
          >
            <v-icon>mdi-send</v-icon>
          </v-btn>
        </template>
      </v-textarea>
    </div>
  </div>
</template>

<style scoped>
.agent-chat {
  background-color: rgba(var(--v-theme-surface));
  color: rgba(var(--v-theme-on-surface));
}
.agent-header {
  background-color: rgba(var(--v-theme-surface-variant), 0.1);
}
.user-msg {
  background-color: rgb(var(--v-theme-primary));
  color: #fff;
  border-top-right-radius: 0 !important;
}
.agent-msg {
  background-color: rgba(var(--v-theme-surface-variant), 0.15);
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
.agent-messages::-webkit-scrollbar { width: 5px; }
.agent-messages::-webkit-scrollbar-track { background: transparent; }
.agent-messages::-webkit-scrollbar-thumb {
  background-color: rgba(var(--v-theme-on-surface-variant), 0.3);
  border-radius: 3px;
}
</style>
