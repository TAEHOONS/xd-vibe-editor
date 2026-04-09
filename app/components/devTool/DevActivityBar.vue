<script setup lang="ts">
import { ref } from 'vue';

const activeItem = ref('explorer');
const settingsMenu = ref(false);

const emit = defineEmits<{
  (e: 'change', value: string): void
}>();

const items = [
    { id: 'explorer', icon: 'mdi-file-multiple-outline', title: 'Explorer' },
    { id: 'agent', icon: 'mdi-robot-outline', title: 'Agent' },
];

const selectItem = (id: string) => {
    activeItem.value = id;
    emit('change', id);
};
</script>

<template>
    <div class="activity-bar d-flex flex-column align-center py-2">
        <!-- Company Logo -->
        <div class="mb-4 d-flex align-center justify-center" style="width: 100%; height: 40px;">
             <img src="/egis-logo.png" alt="Logo" style="width: 28px; height: 28px; object-fit: contain;" />
        </div>

        <div 
            v-for="item in items" 
            :key="item.id"
            class="activity-item d-flex align-center justify-center mb-2"
            :class="{ active: activeItem === item.id }"
            :title="item.title"
            @click="selectItem(item.id)"
        >
            <v-icon :color="activeItem === item.id ? '#F8FAFC' : '#94A3B8'" size="24">{{ item.icon }}</v-icon>
        </div>

        <v-spacer></v-spacer>

        <div class="activity-item d-flex align-center justify-center mb-2" title="Accounts">
             <v-icon color="#94A3B8" size="24">mdi-account-circle-outline</v-icon>
        </div>
        
        <!-- Settings Menu -->
        <v-menu v-model="settingsMenu" location="end" offset="4" :close-on-content-click="true">
            <template #activator="{ props }">
                <div 
                    class="activity-item d-flex align-center justify-center mb-2" 
                    title="Manage"
                    v-bind="props"
                >
                    <v-icon color="#94A3B8" size="24">mdi-cog-outline</v-icon>
                </div>
            </template>
            <v-list density="compact" bg-color="#1E293B" style="color: #CBD5E1; border: 1px solid #334155;">
                <v-list-item value="settings" prepend-icon="mdi-cog">
                    <v-list-item-title>Settings</v-list-item-title>
                </v-list-item>
                <v-list-item value="shortcuts" prepend-icon="mdi-keyboard">
                    <v-list-item-title>Keyboard Shortcuts</v-list-item-title>
                </v-list-item>
                <v-divider style="border-color: #334155;"></v-divider>
                <v-list-item value="about" prepend-icon="mdi-information-outline">
                    <v-list-item-title>About</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>

<style scoped>
.activity-bar {
    width: 48px;
    height: 100%;
    background-color: var(--panel-bg, #1E293B);
    border-right: 1px solid var(--border-color, #1E293B);
    flex-shrink: 0;
    user-select: none;
}

.activity-item {
    width: 48px;
    height: 48px;
    cursor: pointer;
    position: relative;
    opacity: 0.8;
    transition: opacity 0.2s;
}

.activity-item:hover {
    opacity: 1;
}

.activity-item.active {
    opacity: 1;
    border-left: 2px solid var(--accent-green, #22C55E);
}
</style>
