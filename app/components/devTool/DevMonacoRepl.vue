<script setup lang="ts">
import { onMounted, onUnmounted, nextTick, defineAsyncComponent, ref, watch, inject, type Ref } from "vue";

const notifyEditorEngineReady = inject<(() => void) | undefined>(
  "notifyEditorEngineReady",
  undefined,
);

const agentCodeContext = inject<Ref<any>>("agentCodeContext", ref(null));
const agentErrorContext = inject<Ref<any>>("agentErrorContext", ref(null));
const isAgentOpen = inject<Ref<boolean>>("isAgentOpen", ref(false));
// import DevStatusBar from './DevStatusBar.vue';

const { items, removeTitle, blobMap, registerBlobUrl,selectedAppData, selectedAppVrsnData } = useTreeStore();

const Monaco = defineAsyncComponent(() =>
  import("@vue/repl/monaco-editor").then((m) => m.default)
);
const Repl = defineAsyncComponent(() =>
  import("@vue/repl").then((m) => m.Repl)
);


const isReady = ref(false);
const replStore = useState<any>("repl-store");

const setModified = inject('setModified') as (status: boolean) => void;

const previewOptions = ref({
  show: true,
  layout: "horizontal",
  headHTML: `
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vuetify@3.10.8/dist/vuetify.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css">
    <style>
      body { margin: 0; font-family: Roboto, sans-serif; }
      ::-webkit-scrollbar { display: none; }
      html { scrollbar-width: none; -ms-overflow-style: none; }
    </style>
  `,
  bodyHTML: `
  <div class="sidebar-wrapper">
  <div class="sidebar-container">
    <div class="top-menus">
      <i id="btn-open-drawer" class="mdi mdi-apps sidebar-icon" title="My Apps"></i>
      <i class="mdi mdi-layers sidebar-icon" title="Layers"></i>
      <i class="mdi mdi-upload sidebar-icon" title="Upload"></i>
      <i class="mdi mdi-magnify sidebar-icon" title="Search"></i>
      <i class="mdi mdi-chat-outline sidebar-icon" title="AI Assistant"></i>
    </div>
    <div class="bottom-list">
      <i class="mdi mdi-map sidebar-icon" title="Maps"></i>
      <i class="mdi mdi-cart sidebar-icon" title="Store"></i>
      <i class="mdi mdi-help-circle-outline sidebar-icon" title="Help"></i>
      <i class="mdi mdi-cog-outline sidebar-icon" title="Settings"></i>
    </div>
  </div>
</div>

<div id="egisEngine"></div>

<div class="navbar-wrapper">
  <div class="profile-menu">
    <input type="checkbox" id="menu-toggle" hidden />
    <label for="menu-toggle" class="avatar-circle">
      <span>U</span>
    </label>

    <div class="dropdown-menu">
      <div class="menu-item"><i class="mdi mdi-view-dashboard"></i> 대시보드</div>
      <div class="menu-item"><i class="mdi mdi-home"></i> 메인</div>
      <div class="menu-item"><i class="mdi mdi-help-circle"></i> 고객센터</div>
      <div class="menu-item logout"><i class="mdi mdi-logout"></i> 로그아웃</div>
    </div>
  </div>
</div>


<style>
  #egisEngine { position: absolute; top: 0; width: 100%; height: 100%; z-index: 1; background: #101010; }
  .sidebar-wrapper { position: fixed; top: 0; left: 0; width: 60px; height: 100%; z-index: 1000; display: flex; flex-direction: column; justify-content: space-between; background: rgba(30, 30, 30, 0.9); backdrop-filter: blur(10px); padding: 10px 0; }
  .sidebar-container { display: flex; flex-direction: column; height: 100%; justify-content: space-between; align-items: center; width: 100%; }
  .top-menus, .bottom-list { display: flex; flex-direction: column; gap: 15px; align-items: center; }
  .sidebar-icon { font-size: 24px; color: white; cursor: pointer; transition: transform 0.2s, color 0.2s; }
  .sidebar-icon:hover { transform: scale(1.2); color: #1976d2; }
  .navbar-wrapper { position: fixed; top: 15px; right: 25px; z-index: 1001; }
  .profile-menu { position: relative; display: inline-block; }
  .avatar-circle { width: 42px; height: 42px; border-radius: 50%; background-color: #1976d2; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25); }
  .avatar-circle:hover { transform: scale(1.05); }
  .dropdown-menu { position: absolute; top: 52px; right: 0; background: rgba(30, 30, 30, 0.95); border-radius: 8px; padding: 10px 0; width: 160px; display: none; flex-direction: column; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px); }
  #menu-toggle:checked + .avatar-circle + .dropdown-menu { display: flex; }
  .menu-item { display: flex; align-items: center; gap: 8px; color: #eee; font-size: 14px; padding: 8px 16px; cursor: pointer; transition: background 0.2s, color 0.2s; }
  .menu-item:hover { background: rgba(255, 255, 255, 0.1); color: #1976d2; }
  .menu-item i { font-size: 18px; }
  .logout { color: #f44336; }
</style>
  `,
  customCode: {
    importCode: `
      import { createVuetify } from 'vuetify'
      import { inject, onMounted, defineProps } from 'vue'
      import { createPinia, setActivePinia } from 'pinia'
      import { useAppStore } from '~/stores/appStore'
      if (window.__XDWORLD_INITIALIZED__) {
        window.__XDWORLD_INITIALIZED__ = false;
        window.location.reload();
      }
    `,
    useCode: '', 
  },
});

function updateMockFetch() {
  let blobMapJson = "{}";
  const appId = selectedAppData.value?.appId || '';
  const appType = selectedAppData.value?.type || '';
  try { 
    if (blobMap && blobMap.value) {
       blobMapJson = JSON.stringify(blobMap.value);
    }
  } catch (e) {}

  const useCodeScript = `
     try { 
      window.__BLOB_MAP__ = ${blobMapJson}; 
    } catch(e) { 
      window.__BLOB_MAP__ = {}; 
    }

    if (!window.__REAL_FETCH__) {
        window.__REAL_FETCH__ = window.fetch;
    }
      console.log('[MockMap Updated Keys]:', Object.keys(window.__BLOB_MAP__));

      const pinia = createPinia();
      app.use(pinia);
      setActivePinia(pinia);

      window.__INTERNAL_APP_STORE__ = useAppStore();
      
      // 불러온 vue파일 화면 열기 이벤트때문에 추가
      app.mixin({
        mounted() {
          if (this.$options && this.$options.name === 'VNavigationDrawer') {
             
             this._openDrawerHandler = () => {
                
                // $props가 없으면 this.modelValue로 접근 시도
                const currentValue = this.modelValue || (this.$props && this.$props.modelValue);
                
                if (currentValue === true) {
                    return;
                }
                this.$emit('update:modelValue', true);
             };

             window.addEventListener('open-drawer', this._openDrawerHandler);
          }
        },
        
        unmounted() {
            if (this._openDrawerHandler) {
                window.removeEventListener('open-drawer', this._openDrawerHandler);
            }
        }
      });

      
      window.fetch = async (input, init) => {
      const appId = "${appId}";
      const appType = "${appType}";
      const originalFetch = window.__REAL_FETCH__;

      try {
        let url = typeof input === 'string' ? input : (input && input.url ? input.url : String(input));
        
        // 이미 변환된 서버 주소라면 더 이상 가공하지 않고 원본 fetch 실행
        // 중복 방지: /api/apps/file/{appId}/{appType} 가 포함되어 있는지 확인
        const alreadyTransformed = url.includes(\`/api/apps/file/\${appId}/\${appType}\`);
        if (alreadyTransformed) {
            return originalFetch(input, init);
        }

        // [경로 정규화]
        let cleanPath = url.split('?')[0].split('#')[0];
        if (cleanPath.includes('/apps/file/')) {
            cleanPath = cleanPath.split('/apps/file/')[1];
        }
        while (cleanPath.startsWith('/')) {
            cleanPath = cleanPath.substring(1);
        }

        // 트리뷰 파일 우선 체크
        const map = window.__BLOB_MAP__ || {};
        let blobUrl = map[cleanPath];

        if (blobUrl) {
          const response = await originalFetch(blobUrl, init);
          
          // JSON 파일인 경우 SyntaxError 방지를 위해 Header 강제 설정
          if (cleanPath.endsWith('.json')) {
              const blob = await response.blob();
              return new Response(blob, {
                  headers: { 'Content-Type': 'application/json' }
              });
          }
          return response;
        }
        
        // 트리뷰에 없고, 특정 경로를 포함한 경우 서버 API로 전환
        if (url.includes('/apps/file/')) {
          const relativePath = url.split('?')[0].split('/apps/file/')[1];
          const serverUrl = \`/api/apps/file/\${appId}/\${appType}/\${relativePath}\`;
          
          return originalFetch(serverUrl, {
            ...init,
            credentials: 'include'
          });
        }

      } catch (e) {
        console.warn("[MockFetch] Error:", e);
      }

      return originalFetch(input, init);
    };

      const vuetify = createVuetify({ 
        theme: { defaultTheme: 'dark' },
        defaults: {
            VNavigationDrawer: {
                disableResizeWatcher: true, // 리사이즈 시 자동 닫힘 방지
                mobileBreakpoint: 0         // 항상 데스크탑 모드로 유지
            }
        }
      })
      app.use(vuetify)

      // XDWorld 엔진 직접 로드 (import 없이)
      if (!window._XDWorldEM_loaded) {
        if (!document.querySelector('script[src*="XDWorldEM.js"]')) {
          const s = document.createElement('script');
          s.src = 'https://cdn.xdworld.kr/latest/XDWorldEM.js';
          s.onload = () => { window._XDWorldEM_loaded = true; };
          document.head.appendChild(s);
        } else {
          window._XDWorldEM_loaded = true;
        }
      }
      if (window.Module) {
        app.provide('xdworld', window.Module);
        app.config.globalProperties.$xdworld = window.Module;
      }

      setTimeout(() => {

        const appBtn = document.getElementById('btn-open-drawer');
        if (appBtn) {
            appBtn.onclick = function() {
                window.dispatchEvent(new CustomEvent('open-drawer'));
            };
        }
        // 엔진 초기화
        const initEngine = () => {
            if (window.Module && typeof window.Module.initialize === 'function') {
                app.config.globalProperties.$xdworld = window.Module;

                window.Module.initialize({
                    container: document.getElementById('egisEngine'),
                    terrain: {
                        dem: {
                            url: "https://3dmap.egiscloud.com",
                            name: "dem",
                            encoding: false,
                            servername: "XDServer"
                        },
                        image: {
                            url: "https://basemap.egiscloud.com",
                            name: "EGIS_hMap_World",
                            servername: "XDServer"
                        },
                    },
                    worker: {
                        use: false,
                        path: './worker/XDWorldWorker.js',
                        count: 5,
                    },
                    defaultKey: 'dJe!e!iaEpHmEpCrD5QpEQf2#FBrdzDmd(BQDQEQDJdaE(iB',
                });

                const createLayer = () => {
                   const layerList = window.Module.getTileLayerList();
                   if (layerList) {
                      layerList.createXDServerLayer({
                          url : "https://3dmap.egiscloud.com",
                          servername : "XDServer",
                          name : "bldg_3ds_korea_lv15_xnd",
                          type : 29,
                          minLevel : 0,
                          maxLevel : 15
                      });
                      window.Module.setVisibleRange("bldg_3ds_korea_lv15_xnd", 3.0, 5000.0);
                      console.log('[XDWorld] Building layer loaded');
                      
                      window.__XDWORLD_INITIALIZED__ = true;
                      window.parent.postMessage({ type: 'ENGINE_INIT_COMPLETE' }, '*');
                      
                      const observer = new ResizeObserver(entries => {
                          for (let entry of entries) {
                              window.Module.Resize(entry.contentRect.width, entry.contentRect.height);
                              window.Module.XDRenderData();
                          }
                      });
                      observer.observe(document.body);
                   } else {
                      setTimeout(createLayer, 100); 
                   }
                };
                
                createLayer();
                window.useNuxtApp = () => ({ $xdworld: window.Module });
            } else {
                // Module 미로드 또는 initialize 미준비 — 재시도
                setTimeout(initEngine, 500);
            }
        };
        initEngine();
          
      }, 1000);
  `;

  previewOptions.value.customCode.useCode = useCodeScript;
}

const isPreviewOpen = inject('isPreviewOpen') as Ref<boolean>;
const currentTheme = inject('currentTheme', ref('dark')) as Ref<'dark' | 'light'>;

watch(isPreviewOpen, (newVal) => {
    if (previewOptions.value) {
        previewOptions.value.show = newVal;
    }
}, { immediate: true });

watch(blobMap, () => {
    // if (typeof document !== 'undefined') {
    //     const iframe = document.querySelector('.vue-repl iframe') as HTMLIFrameElement;
    //     if (iframe && iframe.contentWindow) {
    //         try {
    //             // Cross-origin 접근 시도 시 에러 처리
    //             if ((iframe.contentWindow as any).__BLOB_MAP__) {
    //                 console.log('[DevMonacoRepl] Updating __BLOB_MAP__ directly without reload');
    //                 (iframe.contentWindow as any).__BLOB_MAP__ = blobMap.value;
    //                 return;
    //             }
    //         } catch (e) {
    //             // Cross-origin 에러 또는 다른 보안 에러 발생 시 fallback으로 진행
    //             console.warn('[DevMonacoRepl] Failed to update iframe blob map:', e);
    //         }
    //     }
    // }
    
    updateMockFetch(); 
}, { deep: true, immediate: true });


watch(() => replStore.value?.files, (newFiles) => {
  if (!newFiles) return;

  // 모든 파일을 즉시 blobMap에 등록 (debounce 없이)
  Object.entries(newFiles).forEach(([filename, fileObj]) => {
    const code = (fileObj as any).code;
    if (typeof code === 'string' && code.trim() !== "") {
      // registerBlobUrl은 useTreeStore에서 가져온 함수여야 함
      registerBlobUrl(filename, code);
    }
  });

  // 변경 상태 표시 및 캐시 업데이트
  if (isReady.value && setModified) {
    setModified(true);
  }
  
  // Iframe에 즉시 동기화 시도
  const iframe = document.querySelector('.vue-repl iframe') as HTMLIFrameElement;
  if (iframe?.contentWindow) {
    try {
      (iframe.contentWindow as any).__BLOB_MAP__ = JSON.parse(JSON.stringify(blobMap.value));
    } catch (e) {}
  }
}, { deep: true, immediate: true });

const findNodeRecursive = (nodes: any[], predicate: string | ((node: any) => boolean)): any => {
  for (const node of nodes) {
    // 판별 로직
    const isMatch = typeof predicate === 'function' 
      ? predicate(node) 
      : (node.title === predicate || node.id === predicate);

    if (isMatch) return node;

    // 자식 노드 재귀 탐색
    if (node.children && node.children.length > 0) {
      const found = findNodeRecursive(node.children, predicate);
      if (found) return found;
    }
  }
  return null;
};

// Iframe 내부에서 보낸 메시지 수신 리스너
const handleMessage = (e: MessageEvent) => {
  const iframe = document.querySelector('.vue-repl iframe') as HTMLIFrameElement;
  if (!iframe || !iframe.contentWindow) return;

  // 프리뷰 에러 감지 시 iframe 리로드
  if (e.data?.type === 'error' || (typeof e.data === 'string' && e.data.includes?.("Cannot read properties of undefined (reading 'default')"))) {
    console.warn('[DevMonacoRepl] 프리뷰 에러 감지, iframe 리로드');
    try { iframe.contentWindow.location.reload(); } catch {}
    return;
  }

  let internalStore;
  try {
    internalStore = (iframe.contentWindow as any).__INTERNAL_APP_STORE__;
  } catch (error) {
    // Cross-origin 에러 또는 다른 보안 에러 발생 시 무시
    // console.warn('[DevMonacoRepl] Cannot access iframe contentWindow:', error);
    return;
  }

  if (!internalStore) return;

  if (e.data.type === 'ENGINE_INIT_COMPLETE') {
    console.log("[Parent] Engine Init Detected.");
    
    if (typeof internalStore.setAppActive === 'function') {
      internalStore.setAppActive(true);
    }

    notifyEditorEngineReady?.();
  }
};

onMounted(async () => {
  await nextTick();
  replStore.value = null;
  isReady.value = false;

  // 메시지 리스너 등록
  window.addEventListener('message', handleMessage);

  // 프리뷰 iframe 에러 감지 → Agent에 전달
  let reloadTimeout: ReturnType<typeof setTimeout> | null = null;
  let lastErrorSent = '';
  window.addEventListener('error', (evt) => {
    const msg = evt.message || '';
    // repl 내부 에러는 리로드
    if (msg.includes("reading 'default'")) {
      if (reloadTimeout) return;
      reloadTimeout = setTimeout(() => {
        const iframe = document.querySelector('.vue-repl iframe') as HTMLIFrameElement;
        if (iframe?.contentWindow) {
          try { iframe.contentWindow.location.reload(); } catch {}
        }
        reloadTimeout = null;
      }, 500);
      return;
    }
    // 그 외 런타임 에러 → Agent에 전달 (중복 방지)
    if (msg && msg !== lastErrorSent) {
      lastErrorSent = msg;
      agentErrorContext.value = { message: msg, source: evt.filename, line: evt.lineno };
      setTimeout(() => { lastErrorSent = ''; }, 3000);
    }
  }, true);

  // 모나코 에디터 선택 정보 가져오기
  const getMonacoSelectionInfo = () => {
    try {
      const editors = (window as any).monaco?.editor?.getEditors?.();
      const editor = editors?.[0];
      if (editor) {
        const sel = editor.getSelection();
        if (sel) {
          const text = editor.getModel().getValueInRange(sel);
          if (text?.trim()) {
            const fileName = replStore.value?.activeFile?.filename || '선택된 코드';
            return { code: text, fileName, startLine: sel.startLineNumber, endLine: sel.endLineNumber };
          }
        }
      }
    } catch {}

    // fallback: window.getSelection
    const fallbackText = window.getSelection()?.toString();
    if (fallbackText?.trim()) {
      const fileName = replStore.value?.activeFile?.filename || '선택된 코드';
      return { code: fallbackText, fileName, startLine: 1, endLine: 1 };
    }
    return null;
  };

  // Ctrl+L: 선택한 코드를 Agent에 전달
  const handleCtrlL = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
      e.preventDefault();
      const info = getMonacoSelectionInfo();
      if (info) {
        agentCodeContext.value = info;
        isAgentOpen.value = true;
      }
    }
  };
  (window as any).__ctrlLHandler = handleCtrlL;
  window.addEventListener('keydown', handleCtrlL, true);

  // 코드 선택 시 "Agent에게 질문" 플로팅 버튼
  let floatingBtn: HTMLElement | null = null;

  const removeFloatingBtn = () => {
    if (floatingBtn) {
      floatingBtn.remove();
      floatingBtn = null;
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.monaco-editor')) return;

    removeFloatingBtn();

    setTimeout(() => {
      const info = getMonacoSelectionInfo();
      if (!info) return;

      floatingBtn = document.createElement('div');
      floatingBtn.innerHTML = `
        <span style="display:inline-flex;align-items:center;gap:4px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1.07A7 7 0 0 1 14 23h-4a7 7 0 0 1-6.93-4H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2m-4 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4m8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/></svg>
          Agent에게 질문
        </span>`;
      Object.assign(floatingBtn.style, {
        position: 'fixed',
        left: e.clientX + 'px',
        top: (e.clientY - 36) + 'px',
        zIndex: '9999',
        background: '#4caf50',
        color: '#fff',
        padding: '4px 10px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '500',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        transition: 'opacity 0.15s, transform 0.15s',
        opacity: '0',
        transform: 'translateY(4px)',
        userSelect: 'none',
        whiteSpace: 'nowrap',
      });
      document.body.appendChild(floatingBtn);

      requestAnimationFrame(() => {
        if (floatingBtn) {
          floatingBtn.style.opacity = '1';
          floatingBtn.style.transform = 'translateY(0)';
        }
      });

      floatingBtn.addEventListener('click', () => {
        agentCodeContext.value = info;
        isAgentOpen.value = true;
        removeFloatingBtn();
      });
    }, 50);
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (floatingBtn && !floatingBtn.contains(e.target as Node)) {
      removeFloatingBtn();
    }
  };

  document.addEventListener('mouseup', handleMouseUp);
  document.addEventListener('mousedown', handleMouseDown);
  (window as any).__floatingBtnCleanup = () => {
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('mousedown', handleMouseDown);
    removeFloatingBtn();
  };

  let treeData = (selectedAppVrsnData as any).value?.pendingData;

  // treeData가 배열이 아니면 기본값 사용
  if (!Array.isArray(treeData)) {
    treeData = [
      {
        id: 'app-folder',
        title: 'APP',
        type: 'folder',
        sortOrder: 0,
        path: 'APP',
        children: [
          {
            id: 'main-vue',
            title: 'untitled.vue',
            type: 'file',
            extension: 'vue',
            file: 'vue',
            sortOrder: 0,
            path: 'APP/untitled.vue',
          },
        ],
      },
      {
        id: 'ext-folder',
        title: 'ext',
        type: 'folder',
        sortOrder: 1,
        path: 'ext',
        children: [],
      },
    ];
  }

  const fileData = findNodeRecursive(treeData, (n: any) => n.extension === 'vue');
  if (!fileData) {
    console.error('[DevMonacoRepl] Vue 파일을 찾을 수 없습니다.');
    return;
  }
  let fileNm = fileData.title;
  let app_source = "";

  if (fileNm === 'untitled.vue') {
      // untitled.vue일 경우 서버에 파일이 없으므로 기본 템플릿(M_APPNAME_H.vue)을 가져옴
      try {
          const res = await fetch("M_APPNAME_H.vue");
          if (res.ok) {
              app_source = await res.text();
          } else {
              // fallback if fetch fails
              app_source = `<template><v-app>FAILED TO LOAD DEFAULT TEMPLATE</v-app></template>`; 
          }
      } catch (e) {
          app_source = `<template><v-app>FAILED TO LOAD DEFAULT TEMPLATE</v-app></template>`; 
      }
  } else {
    let appId = selectedAppData.value?.appId;


    let response_source = await fetch("/api/apps/file/"+appId+"/"+selectedAppData.value.type+"/"+fileNm,{
      credentials: "include" 
    });

      if (response_source.status === 404) {
          // 대체 파일(M_APPNAME_H.vue) 요청
          response_source = await fetch("M_APPNAME_H.vue");
      }
      app_source = await response_source.text();
  }

  const sourceSize = new Blob([app_source]).size;

  if (items.value && items.value.length > 0) {
    const uiNode = findNodeRecursive(items.value, fileNm);
    if (uiNode) {
      uiNode.size = sourceSize;
    } else {
      console.warn(`[UI Warning] Cannot find node in items: ${fileNm}`);
    }
  }

  fileData.size = sourceSize;  

  if (import.meta.client) {
    const storeRef = useReplStore({
      welcomeSFC: app_source,
      mainFile: fileData.path || fileNm,
    });

    storeRef.value.deleteFile = async (filename: string) => {
      const targetFile = storeRef.value.files[filename];
      if (!targetFile) return;

      // if (confirm("수정된 파일을 저장하시겠습니까?")) {
      //   console.log("여기서 서버 저장 로직");
      //   // await saveCode(); 
      // }

      const currentActive = typeof storeRef.value.activeFilename === 'object' 
        ? storeRef.value.activeFilename.value 
        : storeRef.value.activeFilename;

      if (currentActive === filename) {
        const mainPath = storeRef.value.mainFile;
        if (typeof storeRef.value.activeFilename === 'object') {
          storeRef.value.activeFilename.value = mainPath;
        } else {
          storeRef.value.activeFilename = mainPath;
        }
      }

      storeRef.value.files[filename] = {
        ...targetFile,
        hidden: true
      };

      if (targetFile.code === undefined) {
        removeTitle(filename);
      }

      await nextTick();
    };

    replStore.value = storeRef.value;

    isReady.value = true;
    
    // Status Bar listener attach
    // setTimeout(() => attachEditorListeners(0), 1000); 

    // BroadcastChannel 설정 (프리뷰 동기화)
    const channel = new BroadcastChannel('xdcloud-repl-sync');

    // 코드 변경 감지 및 전송
    watch(() => replStore.value?.files, (newFiles) => {
        if (newFiles && replStore.value?.getFiles) {
            channel.postMessage({
                type: 'sync-code',
                files: replStore.value.getFiles(),
                mainFile: replStore.value.mainFile,
                previewOptions: JSON.parse(JSON.stringify(previewOptions.value))
            });
        }
    }, { deep: true });

    // 새 창에서 요청 시 현재 상태 전송
    channel.onmessage = (event) => {
        if (event.data && event.data.type === 'request-sync') {
             if (replStore.value?.files && replStore.value?.getFiles) {
                channel.postMessage({
                    type: 'sync-code',
                    files: replStore.value.getFiles(),
                    mainFile: replStore.value.mainFile,
                    previewOptions: JSON.parse(JSON.stringify(previewOptions.value))
                });
            }
        }
    };
  }
});

onUnmounted(() => {
  window.removeEventListener('message', handleMessage);
  window.removeEventListener('keydown', (window as any).__ctrlLHandler, true);
  (window as any).__floatingBtnCleanup?.();
});

const openNewWindow = () => {
    const width = 1200;
    const height = 800;
    let popup = null;
    
    if (typeof window !== 'undefined' && window.screen) {
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;
        popup = window.open('/preview#' + (location.hash.slice(1) || ''), 'xdcloud-preview', `width=${width},height=${height},left=${left},top=${top}`);
    } else {
         popup = window.open('/preview#' + (location.hash.slice(1) || ''), 'xdcloud-preview');
    }

    if (popup) {
        // 프리뷰 닫기
        if (isPreviewOpen) {
            isPreviewOpen.value = false;
        }

        // 팝업이 닫혔는지 감지하는 타이머
        const timer = setInterval(() => {
            if (popup.closed) {
                clearInterval(timer);
                // 팝업이 닫히면 프리뷰 다시 열기
                if (isPreviewOpen) {
                    isPreviewOpen.value = true;
                }
            }
        }, 500);
    }
};
</script>


<template>
  <ClientOnly>
    <v-theme-provider :theme="currentTheme">
      <div class="repl-wrapper" :class="{ 'dark': currentTheme === 'dark', 'hide-preview': !isPreviewOpen }">
        <div class="repl-container vue-repl">
            <Repl
            ref="replRef"
            v-if="isReady"
            :editor="Monaco"
            :theme="currentTheme"
            :showCompileOutput="false"
            :showSsrOutput="true"
            :showTsConfig="false"
            :showImportMap="false"
            :store="replStore"
            :previewOptions="previewOptions"
            />
            
            <!-- Open New Window Button (Absolute Positioned) -->
            <div 
            v-if="isPreviewOpen"
            class="new-window-btn-overlay" 
            @click="openNewWindow" 
            title="Open in New Window"
            >
                <v-icon size="18" color="#ccc">mdi-dock-window</v-icon>
            </div>
        </div>

      </div>
    </v-theme-provider>
  </ClientOnly>
</template>

<style scoped>
.repl-wrapper {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.repl-container {
  flex: 1;
  position: relative;
  min-height: 0;
}

:deep(.vue-repl),
:deep(.vue-repl .split-pane) {
  height: 100% !important;
}

:deep(.vue-repl .add),
:deep(.vue-repl .file-action.add),
:deep(.vue-repl .file-tab-add),
:deep(.vue-repl .toggler) { /* Auto Save 및 Show Error 토글 숨김 */
  display: none !important;
  /* display: none !important; */
}

.new-window-btn-overlay {
    position: absolute;
    top: 8px; /* Slightly adjusted for alignment */
    right: 16px; /* Moved closer to edge since it's just an icon */
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: transparent;
    border: none;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s;
}
.new-window-btn-overlay:hover {
    background: rgba(255, 255, 255, 0.1);
}
.h-100:not(.dark) .new-window-btn-overlay:hover {
    background: rgba(0, 0, 0, 0.2);
}
.new-window-btn-overlay:hover .v-icon {
    color: white !important; /* Keep icon white in dark mode */
}
.h-100:not(.dark) .new-window-btn-overlay:hover .v-icon {
    color: #333 !important; /* Make icon dark in light mode */
}

/* 프리뷰 숨김 처리 */
/* .hide-preview :deep(.vue-repl) { } */

.hide-preview :deep(.split-pane) {
    display: block !important;
}

/* 왼쪽 에디터 영역 100% */
.hide-preview :deep(.split-pane > .left) {
    width: 100% !important;
    height: 100% !important;
}

/* 오른쪽 프리뷰 영역 및 드래거 숨김 */
.hide-preview :deep(.split-pane > .right),
.hide-preview :deep(.split-pane > .dragger) {
    display: none !important;
}

/* Teleport로 들어가는 상태바 공간 확보를 위해 에디터 높이 조정 */
/* :deep(.split-pane > .left > .editor-container) 같은 클래스가 있다면 조정 필요 */
/* 보통 Monaco Editor는 absolute로 채워지므로, 하단 padding을 줌 */
:deep(.split-pane > .left) {
    /* padding-bottom: 24px !important;  상태바 높이만큼 확보 */
    position: relative !important;
}

:deep(.editor-floating) {
    background-color: transparent !important;
}
</style>