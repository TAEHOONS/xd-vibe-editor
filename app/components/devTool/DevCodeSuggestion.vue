<script setup lang="ts">
import { ref, onMounted, inject, watch } from 'vue'
import type { CodeChange } from '~/composables/useAgentChat'

const props = defineProps<{ change: CodeChange; collapsed?: boolean }>()
const isDarkTheme = inject('isDarkTheme', ref(true))
const replStore = useState<any>('repl-store')

const { init, highlight } = useHighlighter()
const highlightedHtml = ref('')
const showPreview = ref(!props.collapsed)
const copied = ref(false)

watch(() => props.collapsed, (val) => {
  showPreview.value = !val
})

function handleCopy() {
  navigator.clipboard.writeText(props.change.code)
  copied.value = true
  setTimeout(() => { copied.value = false }, 1500)
}

onMounted(async () => {
  await init()
  const lang = props.change.language === 'vue' ? 'html' : props.change.language
  highlightedHtml.value = highlight(props.change.code, lang, isDarkTheme.value ? 'dark-plus' : 'light-plus') || ''
})

function handleApply() {
  try {
    const store = replStore.value
    if (!store) throw new Error('에디터가 초기화되지 않았습니다')

    let filePath = props.change.filePath
    if (!filePath || !store.files[filePath]) {
      filePath = store.activeFile?.filename
    }
    if (!filePath) throw new Error('대상 파일을 찾을 수 없습니다')

    const file = store.files[filePath]
    if (!file) throw new Error('파일을 찾을 수 없습니다')

    props.change.previousCode = file.code

    const initRegex = /(function\s+initialize\s*\(\s*\)\s*\{)([\s\S]*?)(\})/
    const match = file.code.match(initRegex)
    if (match) {
      const existing = match[2].trimEnd()
      const indent = '  '
      const indentedCode = props.change.code.split('\n').map(l => indent + l).join('\n')
      file.code = file.code.replace(initRegex, `$1${existing}\n${indentedCode}\n$3`)
    } else {
      file.code = file.code.trimEnd() + '\n\n' + props.change.code + '\n'
    }

    props.change.status = 'applied'
    props.change.errorMessage = undefined
  } catch (e: any) {
    props.change.status = 'failed'
    props.change.errorMessage = e.message
    console.warn('[CodeSuggestion] Apply 실패:', e.message)
  }
}

function handleUndo() {
  const store = replStore.value
  if (!store || !props.change.previousCode) return

  let filePath = props.change.filePath
  if (!filePath || !store.files[filePath]) {
    filePath = store.activeFile?.filename
  }
  if (filePath && store.files[filePath]) {
    store.files[filePath].code = props.change.previousCode
  }
  props.change.status = 'pending'
  props.change.errorMessage = undefined
}

function handleRetry() {
  props.change.status = 'pending'
  props.change.errorMessage = undefined
  handleApply()
}

defineExpose({ handleApply, handleUndo })
</script>

<template>
  <div class="code-suggestion mt-2 rounded-lg" :class="[`status-${change.status}`, { 'is-dark': isDarkTheme }]">
    <!-- Header -->
    <div class="cs-header d-flex align-center justify-space-between px-3" @click="showPreview = !showPreview" style="cursor: pointer;">
      <div class="d-flex align-center gap-2" style="min-width: 0;">
        <v-icon size="14" :color="change.status === 'applied' ? 'green' : change.status === 'failed' ? 'red' : 'amber'">
          {{ change.status === 'applied' ? 'mdi-check-circle' : change.status === 'failed' ? 'mdi-alert-circle' : 'mdi-file-code-outline' }}
        </v-icon>
        <span class="text-caption font-weight-medium text-truncate">{{ change.filePath || '현재 파일' }}</span>
        <v-chip size="x-small" variant="outlined" class="lang-chip flex-shrink-0">{{ change.language }}</v-chip>
      </div>
      <div class="d-flex align-center gap-1 flex-shrink-0">
        <v-chip v-if="change.status === 'applied'" size="x-small" color="green" variant="tonal" class="status-chip">
          <v-icon size="10" start>mdi-check</v-icon>적용됨
        </v-chip>
        <v-chip v-else-if="change.status === 'failed'" size="x-small" color="red" variant="tonal" class="status-chip">
          <v-icon size="10" start>mdi-close</v-icon>실패
        </v-chip>
        <v-icon size="14" class="toggle-icon" :class="{ rotated: showPreview }">mdi-chevron-down</v-icon>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="change.status === 'failed' && change.errorMessage" class="error-bar d-flex align-center gap-2 px-3 py-1">
      <v-icon size="12" color="red">mdi-information-outline</v-icon>
      <span class="text-caption text-red">{{ change.errorMessage }}</span>
    </div>

    <!-- Code Preview -->
    <Transition name="slide">
      <div v-show="showPreview" class="cs-code overflow-x-auto" style="max-height: 300px;">
        <div v-if="highlightedHtml" v-html="highlightedHtml" class="code-render pa-3 text-caption" />
        <pre v-else class="pa-3 text-caption" style="margin:0;"><code>{{ change.code }}</code></pre>
      </div>
    </Transition>

    <!-- Actions -->
    <div class="cs-actions d-flex align-center gap-1 px-3 py-1">
      <v-btn size="x-small" variant="text" class="action-btn" @click.stop="handleCopy">
        <v-icon size="12" start>{{ copied ? 'mdi-check' : 'mdi-content-copy' }}</v-icon>
        <span class="btn-label">{{ copied ? '복사됨' : '복사' }}</span>
      </v-btn>

      <v-spacer />

      <template v-if="change.status === 'pending'">
        <v-btn size="x-small" color="green" variant="flat" class="action-btn apply-btn" @click.stop="handleApply">
          <v-icon size="12" start>mdi-play</v-icon>
          <span class="btn-label">Apply</span>
        </v-btn>
      </template>

      <template v-else-if="change.status === 'applied'">
        <v-btn v-if="change.previousCode" size="x-small" variant="tonal" color="orange" class="action-btn" @click.stop="handleUndo">
          <v-icon size="12" start>mdi-undo</v-icon>
          <span class="btn-label">되돌리기</span>
        </v-btn>
      </template>

      <template v-else-if="change.status === 'failed'">
        <v-btn size="x-small" variant="tonal" color="red" class="action-btn" @click.stop="handleRetry">
          <v-icon size="12" start>mdi-refresh</v-icon>
          <span class="btn-label">재시도</span>
        </v-btn>
      </template>
    </div>
  </div>
</template>

<style scoped>
.code-suggestion {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  overflow: hidden;
  transition: border-color 0.25s, box-shadow 0.25s;
}
.code-suggestion:hover {
  border-color: rgba(var(--v-theme-on-surface), 0.2);
}
.code-suggestion.status-applied {
  border-color: rgba(76, 175, 80, 0.35);
  box-shadow: 0 0 0 1px rgba(76, 175, 80, 0.08);
}
.code-suggestion.status-failed {
  border-color: rgba(244, 67, 54, 0.35);
  box-shadow: 0 0 0 1px rgba(244, 67, 54, 0.08);
}
.cs-header {
  background: rgba(var(--v-theme-surface-variant), 0.08);
  min-height: 34px;
  transition: background 0.15s;
}
.cs-header:hover {
  background: rgba(var(--v-theme-surface-variant), 0.18);
}
.toggle-icon {
  transition: transform 0.2s;
  opacity: 0.5;
}
.toggle-icon.rotated {
  transform: rotate(180deg);
}
.lang-chip {
  font-size: 10px !important;
  height: 16px !important;
  opacity: 0.7;
}
.status-chip {
  font-size: 10px !important;
  height: 18px !important;
}
.error-bar {
  background: rgba(244, 67, 54, 0.08);
  border-top: 1px solid rgba(244, 67, 54, 0.15);
}
.cs-code {
  background: rgba(0, 0, 0, 0.15);
  overflow-y: auto;
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.05);
}
.code-suggestion.is-dark .cs-code {
  background: rgba(0, 0, 0, 0.25);
}
.cs-code :deep(pre) {
  margin: 0;
  background: transparent !important;
}
.cs-code::-webkit-scrollbar { width: 4px; height: 4px; }
.cs-code::-webkit-scrollbar-thumb {
  background: rgba(var(--v-theme-on-surface), 0.15);
  border-radius: 2px;
}
.cs-actions {
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.05);
  min-height: 32px;
}
.action-btn {
  text-transform: none !important;
  letter-spacing: 0 !important;
  font-weight: 500;
  min-width: auto !important;
  padding: 0 8px !important;
  height: 24px !important;
}
.action-btn .btn-label {
  font-size: 11px;
}
.apply-btn {
  box-shadow: 0 1px 3px rgba(76, 175, 80, 0.3);
}
/* slide transition */
.slide-enter-active, .slide-leave-active {
  transition: max-height 0.2s ease, opacity 0.2s ease;
  overflow: hidden;
}
.slide-enter-from, .slide-leave-to {
  max-height: 0;
  opacity: 0;
}
.slide-enter-to, .slide-leave-from {
  max-height: 300px;
  opacity: 1;
}
</style>
