<template>
  <v-app :class="{ 'theme--dark': isDarkMode }">
    <v-navigation-drawer
      v-model="drawer"
      location="right"
      :width="width"
      class="base-drawer"
      elevation="4"
    >
      <v-toolbar flat dense class="base-toolbar">
        <v-toolbar-title class="font-weight-medium">
          {{ title }}
        </v-toolbar-title>
        <v-spacer />
        <v-tooltip location="bottom" :open-on-hover="true" :open-on-click="false">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon="mdi-message-question"
              size="small"
              variant="text"
              class="mr-2"
              @click.stop="contactDev"
            />
          </template>
          <span>앱 개발자에게 문의하기</span>
        </v-tooltip>
        <v-btn icon @click="closeApp">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-container class="pa-4 base-container">
        
      </v-container>
    </v-navigation-drawer>
  </v-app>
</template>

<script setup lang="ts">
import { useTheme } from "vuetify";
import { useAppStore } from '~/stores/appStore'
import { ref, computed, onMounted, watch } from "vue";

const props = defineProps({
  appCode: { type: String, default: "M_APPNAME" },
  title: { type: String, default: "앱 이름" },
  width: { type: [Number, String], default: 370 },
});
const emit = defineEmits(["drawer-change"]);

const theme = useTheme();

const appStore = useAppStore();

const drawer = ref(true);
const isDarkMode = computed(() => theme.global.current.value.dark);

const moduleIndex = ref(-1);

const isActive = computed(() => appStore.isAppActive(props.appCode));

watch(
  isActive,
  (active) => {
    if (active) {
      initialize();
    } 
  },
  { immediate: true }
);

function initialize() {

}

function closeApp() {
  drawer.value = false;
  if (moduleIndex.value !== -1) {
  }
}

function contactDev() {
      // TODO: 개발자 문의 로직
      appStore.contactCS(props.title);
    }


</script>

<style scoped>
.base-drawer {
  background-color: rgb(var(--v-theme-surface)) !important;
  border-left: 1px solid rgba(255, 255, 255, 0.12);
}

.base-toolbar {
  background-color: rgb(var(--v-theme-surface)) !important;
  color: rgb(var(--v-theme-on-surface));
}

.base-container {
  background-color: transparent;
  color: rgb(var(--v-theme-on-surface));
}
</style>
