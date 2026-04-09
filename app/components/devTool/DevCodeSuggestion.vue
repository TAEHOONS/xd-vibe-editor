<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'
import type { CodeBlock } from '~/composables/useAgentChat'

const props = defineProps<{ block: CodeBlock }>()
const isDarkTheme = inject('isDarkTheme', ref(true))
const replStore = useState<any>('repl-store')

const { init, highlight, isReady } = useHighlighter()
const highlightedHtml = ref('')
const showPreview = ref(false)

onMounted(async () => {
  await init()
  const lang = props.block.language === 'vue' ? 'html' : props.block.language
  highlightedHtml.value = highlight(props.block.code, lang, isDarkTheme.value ? 'dark-plus' : 'light-plus') || ''
})

function applyCode() {
  const store = replStore.value
  if (!store) return

  const filename = props.block.filename || store.state.activeFile?.filename
  if (!filename) return

  // 현재 코드 백업
  const file = store.state.files[filename]
  if (file) {
    props.block.previousCode = file.code
    file.code = props.block.code
  } else {
    store.addFile(filename)
    store.state.files[filename].code = props.block.code
  }
  props.block.status = 'applied'
}

function rejectCode() {
  props.block.status = 'rejected'
}

function undoCode() {
  const store = replStore.value
  if (!store || !props.block.previousCode) return
  const filename = props.block.filename || store.state.activeFile?.filename
  if (filename && store.state.files[filename]) {
    store.state.files[filename].code = props.block.previousCode
  }
  props.block.status = 'pending'
}
</script>

<template>
  <div class="code-suggestion mt-2 rounded-lg" :class="{ 'is-dark': isDarkTheme }">
    <!-- Header -->
    <div class="cs-header d-flex align-center justify-space-between px-3 py-1">
      <div class="d-flex align-center gap-2">
        <v-icon size="14" color="amber">mdi-file-code-outline</v-icon>
        <span class="text-caption font-weight-medium">{{ block.filename || '현재 파일' }}</span>
        <v-chip size="x-small" variant="outlined" class="ml-1">{{ block.language }}</v-chip>
      </div>
      <v-btn
        icon variant="text" size="x-small" density="compact"
        @click="showPreview = !showPreview"
      >
        <v-icon size="14">{{ showPreview ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </div>

    <!-- Code Preview -->
    <div v-show="showPreview" class="cs-code overflow-x-auto" style="max-height: 300px;">
      <div v-if="highlightedHtml" v-html="highlightedHtml" class="code-render pa-3 text-caption" />
      <pre v-else class="pa-3 text-caption" style="margin:0;"><code>{{ block.code }}</code></pre>
    </div>

    <!-- Actions -->
    <div class="cs-actions d-flex align-center gap-2 px-3 py-2">
      <template v-if="block.status === 'pending'">
        <v-btn size="x-small" color="green" variant="tonal" @click="showPreview = true" v-if="!showPreview">
          <v-icon size="12" start>mdi-eye</v-icon>미리보기
        </v-btn>
        <v-btn size="x-small" color="green" variant="flat" @click="applyCode">
          <v-icon size="12" start>mdi-check</v-icon>적용
        </v-btn>
        <v-btn size="x-small" color="grey" variant="text" @click="rejectCode">거절</v-btn>
      </template>
      <template v-else-if="block.status === 'applied'">
        <v-icon size="14" color="green">mdi-check-circle</v-icon>
        <span class="text-caption text-green">적용됨</span>
        <v-btn size="x-small" variant="text" color="orange" @click="undoCode" v-if="block.previousCode">
          <v-icon size="12" start>mdi-undo</v-icon>되돌리기
        </v-btn>
      </template>
      <template v-else>
        <v-icon size="14" color="grey">mdi-close-circle</v-icon>
        <span class="text-caption text-medium-emphasis">거절됨</span>
      </template>
    </div>
  </div>
</template>

<style scoped>
.code-suggestion {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  overflow: hidden;
}
.cs-header {
  background: rgba(var(--v-theme-surface-variant), 0.15);
  min-height: 32px;
}
.cs-code {
  background: rgba(0, 0, 0, 0.2);
  overflow-y: auto;
}
.code-suggestion.is-dark .cs-code {
  background: rgba(0, 0, 0, 0.3);
}
.cs-code :deep(pre) {
  margin: 0;
  background: transparent !important;
}
.cs-actions {
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}
</style>
