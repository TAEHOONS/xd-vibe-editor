<script setup lang="ts">
import { ref, provide } from "vue";

const isPageLoading = ref(true);

function notifyEditorEngineReady() {
  isPageLoading.value = false;
}

provide("notifyEditorEngineReady", notifyEditorEngineReady);
</script>

<template>
  <NuxtLayout name="dev-tool">
    <template #explorerTreeview>
      <DevToolDevTreeViewComp />
    </template>
    <template #MonacoEpel>
      <DevToolDevMonacoRepl />
    </template>
  </NuxtLayout>

  <!-- <ClientOnly>
    <Teleport to="body">
      <div
        v-if="isPageLoading"
        class="editor-page-loading"
        aria-busy="true"
        aria-live="polite"
      >
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
          width="4"
        />
        <p class="editor-page-loading__text">엔진 로딩 중입니다…</p>
      </div>
    </Teleport>
  </ClientOnly> -->


</template>
<style scoped>
.editor-page-loading {
  position: fixed;
  inset: 0;
  z-index: 15000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: rgb(var(--v-theme-surface) / 0.72);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: rgb(var(--v-theme-on-surface));
}

.editor-page-loading__text {
  margin: 0;
  font-size: 0.95rem;
  opacity: 0.85;
}
</style>
