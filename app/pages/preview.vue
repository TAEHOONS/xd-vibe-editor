<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useStore, Sandbox } from '@vue/repl';

// REPL Store 초기화
const store = useStore({}, typeof location !== 'undefined' ? location.hash.slice(1) : '');

// BroadcastChannel 초기화
let channel: BroadcastChannel | null = null;
const previewOptions = ref({});

const handleMessage = (event: MessageEvent) => {
    if (event.data && event.data.type === 'sync-code') {
        const newFiles = event.data.files;
        const mainFile = event.data.mainFile;
        // previewOptions 업데이트
        if (event.data.previewOptions) {
            previewOptions.value = event.data.previewOptions;
        }
        store.setFiles(newFiles, mainFile);
    }
};

onMounted(() => {
    channel = new BroadcastChannel('xdcloud-repl-sync');
    channel.addEventListener('message', handleMessage);
    // 초기 로드 시 메인 윈도우에 현재 상태 요청 (선택 사항)
    channel.postMessage({ type: 'request-sync' });
});

onUnmounted(() => {
    if (channel) {
        channel.removeEventListener('message', handleMessage);
        channel.close();
    }
});
</script>

<template>
  <div class="h-100 dark">
     <Sandbox :store="store" :previewOptions="previewOptions" style="height: 100%" />
  </div>
</template>

<style>
html, body, #__nuxt {
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #1e1e1e; /* Dark theme background */
}
</style>
