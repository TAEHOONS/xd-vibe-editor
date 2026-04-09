<script setup lang="ts">
import { inject, Ref } from 'vue';

type Action = {
    icon: string,
    value: string,
    title?:string
}

const props = withDefaults(defineProps<{
    title?:string
    logoSrc?:string
    logoAlt?:string
    actions?:Action[]
}>(),{
    title:'Dev Header',
    logoSrc:'/main-logo-img.png',
    logoAlt:'Logo',
    actions:()=>([
        { icon: 'mdi-bell-outline',   value: 'notifications', title: 'Notifications' },
        { icon: 'mdi-dock-window',        value: '새창',        title: 'Search' },
        { icon: 'mdi-account-circle', value: 'profile',       title: 'Profile' },
    ])

})

// Inject isDarkTheme to handle cases where parent theme provider might be wrong
const isDarkTheme = inject('isDarkTheme') as Ref<boolean> | undefined;

const emit = defineEmits<{
  (e: 'click:logo'): void
  (e: 'click:action', value: string): void
  (e: 'click:profile'): void
  (e: 'click:logout'): void
}>()

</script>
<template>
    <div 
        class="header-container d-flex align-center px-3 w-100 h-100" 
        style="font-size: 13px;"
        :style="{ color: isDarkTheme && isDarkTheme.value ? '#cccccc' : '#5f6368' }"
    >
        <!-- Left: Logo, Title, Preview, Chat -->
        <div class="d-flex align-center">
            <span class="font-weight-medium mr-2">{{ title }}</span>
            <slot name="title-append"></slot>
            
            <v-divider vertical class="mx-3" :style="{ borderColor: isDarkTheme && isDarkTheme.value ? '#444' : '#e0e0e0' }"></v-divider>

            <!-- Preview Toggle -->
             <v-btn 
                icon 
                variant="text" 
                density="compact"
                size="small"
                title="Toggle Preview"
                @click="$emit('click:action', 'preview')"
                class="header-action-btn mr-1"
                :class="{ 'is-light': isDarkTheme && !isDarkTheme.value }"
            >
                <!-- actions prop에서 직접 받지 않고 하드코딩된 아이콘 로직 사용 (부모 제어 필요시 props 확인) -->
                 <v-icon size="18">{{ actions?.find(a => a.value === 'preview')?.icon || 'mdi-eye-outline' }}</v-icon>
            </v-btn>

            <!-- Chatbot Toggle -->
             <v-btn 
                icon 
                variant="text" 
                density="compact"
                size="small"
                title="AI Assistant"
                @click="$emit('click:action', 'chat')"
                class="header-action-btn"
                :class="{ 'is-light': isDarkTheme && !isDarkTheme.value }"
            >
                <v-icon size="18">mdi-robot-excited-outline</v-icon>
            </v-btn>

             <!-- Save Button (Optional) -->
             <v-btn
                v-if="actions?.find(a => a.value === 'save')"
                icon 
                variant="text" 
                density="compact"
                size="small"
                title="Save"
                @click="$emit('click:action', 'save')"
                class="header-action-btn ml-1"
                :class="{ 'is-light': isDarkTheme && !isDarkTheme.value }"
            >
                <v-icon size="18">mdi-content-save-outline</v-icon>
            </v-btn>

        </div>

        <v-spacer></v-spacer>

        <!-- Center: Open New Window (Tab Area) -->
        <div class="d-flex align-center justify-center">
             <div 
                class="tab-button d-flex align-center px-3 py-1" 
                :class="{ 'is-light': isDarkTheme && !isDarkTheme.value }"
                @click="$emit('click:action', 'open-window')"
            >
                <v-icon size="16" class="mr-2">mdi-open-in-new</v-icon>
                <span>새 창으로 열기</span>
            </div>
        </div>

        <v-spacer></v-spacer>

        <!-- Right: Exit Only -->
        <div class="d-flex align-center">
            <v-btn icon variant="text" density="compact" size="small" title="Exit" @click="$emit('click:action', 'exit')">
                <v-icon size="18">mdi-exit-to-app</v-icon>
            </v-btn>
        </div>

        <slot name="right"></slot>
    </div>
</template>
<style scoped>
.header-container {
    /* transition: color 0.2s; */
    user-select: none;
}
.header-action-btn {
    opacity: 0.8;
    color: inherit;
}
.header-action-btn:hover {
    opacity: 1;
    background-color: rgba(255, 255, 255, 0.08);
}
.header-action-btn.is-light:hover {
    background-color: rgba(0, 0, 0, 0.05); /* Light mode hover */
}

.tab-button {
    cursor: pointer;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.05); /* Default Dark mode bg */
    color: inherit;
    transition: all 0.2s;
    user-select: none;
    font-size: 13px;
}
/* Light Mode overrides */
.tab-button.is-light {
    background-color: rgba(0, 0, 0, 0.05); 
}

.tab-button:hover {
    background-color: rgba(255, 255, 255, 0.15); /* Dark mode hover */
    color: #ffffff;
}
/* Light Mode Hover Override */
.tab-button.is-light:hover {
    background-color: rgba(0, 0, 0, 0.1); /* Light mode hover */
    color: #202124 !important; /* Force dark text! */
}
</style>
