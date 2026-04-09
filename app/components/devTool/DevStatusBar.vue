<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  line: { type: Number, default: 1 },
  col: { type: Number, default: 1 },
  language: { type: String, default: 'vue' },
  encoding: { type: String, default: 'UTF-8' },
  indent: { type: String, default: 'Spaces: 2' },
});

const formattedLanguage = computed(() => {
  if (!props.language) return 'Vue';
  return props.language.toUpperCase(); // e.g., 'vue' -> 'VUE'
});
</script>

<template>
  <div class="status-bar d-flex align-center px-4 bg-blue-grey-darken-4 text-caption">
    <!-- Left side (optional, maybe git branch in future) -->
    <v-spacer></v-spacer>
    
    <!-- Right side info -->
    <div class="d-flex align-center gap-4 text-grey-lighten-1">
      <div class="status-item d-flex align-center cursor-pointer hover-bright">
        <span class="mdi mdi-xml mr-1"></span>
        <span>Ln {{ line }}, Col {{ col }}</span>
      </div>

      <div class="status-item d-flex align-center cursor-pointer hover-bright ml-4">
        <span>{{ indent }}</span>
      </div>

      <div class="status-item d-flex align-center cursor-pointer hover-bright ml-4">
        <span>{{ encoding }}</span>
      </div>

      <div class="status-item d-flex align-center cursor-pointer hover-bright ml-4">
        <span class="mdi mdi-code-tags mr-1"></span>
        <span>{{ formattedLanguage }}</span>
      </div>
      
       <div class="status-item d-flex align-center cursor-pointer hover-bright ml-4">
        <span class="mdi mdi-bell-outline"></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.status-bar {
  height: 24px;
  width: 100%;
  border-top: 1px solid #444;
  user-select: none;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace; /* IDE-like font */
  font-size: 11px;
}

.hover-bright:hover {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.status-item {
  padding: 0 6px;
  height: 20px;
}
</style>
