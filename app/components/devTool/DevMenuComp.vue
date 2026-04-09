<script setup lang="ts">
type Item ={
  icon:string,
  value:string,
  title?:string
}
const location = ref('end')
const props = withDefaults(defineProps<{
  modelValue?:string
  items?:Item[]
}>(),{
  modelValue:'',
  items:()=>([
    { icon: 'mdi-play-circle-outline', value: 'files', title: 'Files' },
    { icon: 'mdi-content-save-outline', value: 'save', title: '저장' },
  ])
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'click:settings'): void
  (e: 'click:agent'): void
}>()

function select(v:string){
  emit('update:modelValue',v)
}

const settingItems = [
  { label: '새로 만들기', icon: 'mdi-plus' },
  { label: '편집', icon: 'mdi-pencil' },
  { label: '삭제', icon: 'mdi-delete' },
]

function selectAction(item:any){
  console.log('Selected action:', item)
}
const profileMenu = ref(false)
const logoSrc = '/favicon.png'
const logoAlt = 'Logo'

</script>
<template>
        <!-- 상단 아이콘 영역 -->
         <div class="sidebar-inner font-weight-light">
            <div class="sidebar-top">
                  <div class="logo-btn" variant="text" :title="logoAlt">
                      <!-- v-img는 레이지로딩/커버 편함 -->
                      <v-img :src="logoSrc" :alt="logoAlt" class="logo" cover />
                  </div>
                  <v-btn v-for="it in props.items" :key="it.value" icon variant="text"
                        :title="it.title || it.value" color="#B3E5FC"
                        class="menu-btn" @click="select(it.value)">
                    <v-icon size="large">{{ it.icon }}</v-icon>
                  </v-btn>
            </div>

            <!-- 하단 설정 아이콘 버튼 -->
            <div class="sidebar-bottom">
                <v-btn icon variant="text" title="Agent" color="#B3E5FC" class="menu-btn mb-1" @click="emit('click:agent')">
                    <v-icon>mdi-lan-connect</v-icon>
                </v-btn>
                <v-divider class="mb-2" />
                <v-menu
                    v-model="profileMenu"
                    location="end"
                    offset="8"
                    :close-on-content-click="true"
                >
                    <template #activator="{props:menuProps}">
                        <v-btn icon variant="text" title="프로필" v-bind="menuProps" color="#B3E5FC"><v-icon>mdi-account-circle</v-icon></v-btn>
                    </template>
                    <v-list density="compact" min-width="160">
                        <v-list-item>
                            <template #prepend><v-icon size="16">mdi-account</v-icon></template>
                            <v-list-item-title>내 프로필</v-list-item-title>
                        </v-list-item>

                        <v-divider class="my-1" />

                        <v-list-item >
                            <template #prepend><v-icon size="16">mdi-logout</v-icon></template>
                            <v-list-item-title>로그아웃</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
                <v-divider class="mb-2" />
                <v-menu
                    location="end"
                    offset="8"
                    :close-on-content-click="true"
                >
                    <template #activator="{ props }">
                      <v-btn icon variant="text" class="menu-btn" title="설정" color="#B3E5FC">
                        <v-icon>mdi-cog-outline</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                        v-for="(item, i) in settingItems"
                        :key="i"
                        @click="selectAction(item)"
                      >
                        <v-list-item-title>
                          <v-icon start :icon="item.icon"></v-icon>
                          {{ item.label }}
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                </v-menu>
                <!--<v-btn icon variant="text" class="menu-btn" title="설정" @click="emit('click:settings')">
                  <v-icon>mdi-cog-outline</v-icon>
                </v-btn>-->
            </div>

         </div>
        
</template>
<style>
.sidebar-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.sidebar-bottom {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2px 0;
}

.sidebar-inner {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3px 0px 0px 1px;
  box-sizing: border-box;
}


.logo-btn {
  width: 35px;   /* 원하는 너비 */
  height: 35px;   /* 원하는 높이 */
  display: block; /* 정렬 안정화 */
  overflow: hidden;
  margin:8px 0px 0 2px;
}
.logo {
  border-radius: 6px;
}
</style>