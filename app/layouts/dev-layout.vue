<script setup>
 import { ref, watch } from 'vue'
 import { Splitpanes, Pane } from 'splitpanes'
 import 'splitpanes/dist/splitpanes.css'
 const drawer = ref(true)

 const toggleSidebar=()=>{
    drawer.value = !drawer.value
 }

 const profileMenu = ref(false)
 const settingMenu = ref(false)

 function getResizeEvent(e){
  //console.log(e)
  const paneIndx = e.index;

  if(paneIndx==0 && typeof Module == 'object') {
      if (typeof Module.Resize == 'function') {
          const engineContainer = document.getElementById('egisEngine');
          //e.panes[2].width = engineContainer.clientWidth || e.panes[2].width;
          Module.Resize(engineContainer.clientWidth, engineContainer.clientHeight);
          Module.XDRenderData();
      }
  }
}

</script>
<template>
<v-theme-provider theme="dark">
  <v-layout>
      <v-navigation-drawer app permanent rail>
        <v-list density="compact" class="px-1">
            <v-btn icon @click="toggleSidebar">
                <v-icon>mdi-menu</v-icon>
            </v-btn>
        </v-list>
        <v-divider></v-divider>
        <v-list density="compact" nav>
          <v-list-item
            prepend-icon="mdi-bug-play"
            value="dashboard"
            size="large"
          >
          </v-list-item>
          <v-list-item prepend-icon="mdi-content-save" value="messages"></v-list-item>
        </v-list>
        <template v-slot:append >
            <v-list density="compact" nav>
                 <v-menu
                    v-model="profileMenu"
                    location="end"
                    offset="2"
                    :close-on-content-click="true"
                    
                >
                    <template #activator="{props:menuProps}">
                        <v-btn block variant="text" title="프로필" v-bind="menuProps"><v-icon size="x-large">mdi-account-circle</v-icon></v-btn>
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
            </v-list>
            <v-list density="compact" nav>
                 <v-menu
                    v-model="settingMenu"
                    location="end"
                    offset="2"
                    :close-on-content-click="true"
                    
                >
                    <template #activator="{props:menuProps}">
                        <v-btn block variant="text" title="프로필" v-bind="menuProps"><v-icon size="x-large">mdi-cog-outline</v-icon></v-btn>
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
            </v-list>
        </template>
      </v-navigation-drawer>

      <v-navigation-drawer app :permanent="true" v-model="drawer" :scrim="false">
        <slot name="explorerTreeview"></slot>
      </v-navigation-drawer>
      <v-main class="d-flex h-100">
        <div class="flex-1-1-auto pa-0 w-100">
            <Splitpanes :dbl-click-splitter="false" @resized="getResizeEvent">
              <Pane min-size="0">
                <div class="w-100 h-100">
                    <slot name="devSource"></slot>
                </div>
              </Pane>
              <!-- 오른쪽 이미지 창 -->
              <Pane min-size="0">
                <div ref="rightPaneEl" class="w-100 h-100">
                  <slot name="mapView">
                  </slot>
                </div>
              </Pane>
            </Splitpanes>
        </div>
      </v-main>
    </v-layout>
  </v-theme-provider>
</template>
<style>
.splitpanes {background-color: #7e7e7e;}

.splitpanes__splitter {background-color: #ccc;position: relative;}
.splitpanes__splitter:before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  transition: opacity 0.8s;
  background-color: #1c9fc76c;
  border-radius: 6px;
  opacity: 0;
  z-index: 1;
}
.splitpanes__splitter:hover:before {opacity: 1;}
.splitpanes--vertical > .splitpanes__splitter:before {left: -4px;right: -4px;height: 100%;}
.splitpanes--horizontal > .splitpanes__splitter:before {top: -4px;bottom: -4px;width: 100%;}
</style>
