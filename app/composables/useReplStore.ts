import { ref } from 'vue'
import { useStore } from '@vue/repl'


type ReplInit = {
  welcomeSFC?: string   // 초기 엔트리 코드 (예: MapPreviewSource)
  mainFile?: string
}

export function useReplStore(opts?: ReplInit){
    const storeRef = useState<any>('repl-store',()=>null)
    
    const mainFile = opts?.mainFile ?? 'App.vue'
    const appSourece = opts?.welcomeSFC;
    
    if(import.meta.client && !storeRef.value){
        window.global = window
        storeRef.value=useStore({
            mainFile: ref(mainFile),
            template: ref({ 
                welcomeSFC: appSourece,
                newSFC: '',
            })  
        })
        //xdcloud.kr 플랫폼 환경
        storeRef.value.setImportMap({
            imports: {
                "vue": 'https://unpkg.com/vue@3.5.22/dist/vue.esm-browser.js',
                "vite": "https://esm.sh/vite@5.4.0?bundle",
                "vue-router": "https://unpkg.com/vue-router@4.3.0/dist/vue-router.esm-browser.js",
                "vuetify": "https://cdn.jsdelivr.net/npm/vuetify@3.10.8/dist/vuetify.esm.js",
                "vuetify/components": "https://cdn.jsdelivr.net/npm/vuetify@3.10.8/dist/vuetify.esm.js",
                "vuetify/directives": "https://cdn.jsdelivr.net/npm/vuetify@3.10.8/dist/vuetify.esm.js",
                "vuetify/styles": "https://cdn.jsdelivr.net/npm/vuetify@3.10.8/dist/vuetify.min.css",
                "@mdi/font": "https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css",
                '~/stores/appStore':'./stores/appStore.js',
                '~/stores/areaStore':'/areaStore.js',
                '@xdcloud/common-client':'/xdcloud-common.js',
                'XDEMap':'/xdcloud-common.js',
                'XDWorld':"/XDWorld.XDModule.client.js" ,
                "pinia": "https://unpkg.com/pinia@3.0.3/dist/pinia.esm-browser.js",
                "axios": "https://esm.sh/axios@1.6.7?bundle&target=esnext&polyfill",
                "nuxt/app":"/nuxt-plugin-mock.js",
                "~/stores/upload/csvStore" : '/stores/upload/csvStore.js',
                "~/stores/uploadStore": '/stores/uploadStore.js',
                "~/composables/useConvertCoord":'/composables/useConvertCoord.js',
                "chroma-js":"https://esm.sh/chroma-js@2.4.2",
                "@vue/devtools-api": "https://cdn.jsdelivr.net/npm/@vue/devtools-api@8.0.3/dist/index.js",
                "@vue/devtools-kit": "https://cdn.jsdelivr.net/npm/@vue/devtools-kit@8.0.2/dist/index.js",
                "@vue/devtools-shared": "https://cdn.jsdelivr.net/npm/@vue/devtools-shared@8.0.2/dist/index.js",
                "perfect-debounce":"https://cdn.jsdelivr.net/npm/perfect-debounce@1.0.0/dist/index.mjs",
                "hookable":"https://cdn.jsdelivr.net/npm/hookable@5.5.3/dist/index.mjs",
                "birpc":"https://cdn.jsdelivr.net/npm/birpc@0.2.19/dist/index.mjs",
                "vue/server-renderer": "https://cdn.jsdelivr.net/npm/@vue/server-renderer@3.5.21/dist/server-renderer.esm-browser.js",
            }
        })
    }

    return storeRef
}