<script setup>
import { ref, watch, provide } from "vue";

const drawer = ref(true);
const { items, selectedAppData, selectedAppVrsnData, downloadZipFiles } =
  useTreeStore();
const route = useRoute();
const router = useRouter();

const replStore = useState("repl-store", () => null);

const isReady = ref(false);
const isModified = ref(false);
const isSaveCooldown = ref(true); // 초기 로드 중에도 변경 감지 비활성화

const IMG_RE = /\.(png|jpe?g|gif|svg|ico|webp|bmp)$/i;

const isFormValid = ref(false);

const setModified = (status) => {
  // 저장 직후에는 true 설정을 무시 (REPL watcher의 오탐 방지)
  if (isSaveCooldown.value && status === true) return;
  isModified.value = status;
};
provide("setModified", setModified);

const isChatOpen = ref(false);
const isAgentOpen = ref(false);
const isPreviewOpen = ref(true);
provide("isPreviewOpen", isPreviewOpen);

// Agent에 코드 컨텍스트 전달용
const agentCodeContext = ref(null);
provide("agentCodeContext", agentCodeContext);
provide("isAgentOpen", isAgentOpen);

// iframe 에러를 Agent에 전달
const agentErrorContext = ref(null);
provide("agentErrorContext", agentErrorContext);

const generateUUID = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const saveDialog = ref(false);
const appNmInput = ref("");

// Confirm dialog
const confirmDialog = ref(false);
const confirmMessage = ref("");
const confirmCallback = ref(null);

// Alert dialog
const alertDialog = ref(false);
const alertMessage = ref("");

const handleAlertClose = () => {
  alertDialog.value = false;
  // 성공 메시지인 경우 라우터 이동
  if (alertMessage.value.includes("성공")) {
    router.push("/application/all");
  }
};

const appNameRules = [
  (v) => !!v || "앱명을 입력해주세요.", // 빈 값 체크
  (v) => (v && v.length <= 30) || "앱명은 30자 이내로 입력해주세요.",
];

async function loadAppData(id, type) {
  let data = {};

  if (id) {
    try {
      const response = await fetch(`/api/apps/${id}/versions/type/${type}`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        data = await response.json();
      }
    } catch (e) {
      console.warn("서버 API 호출 실패, 기본 데이터로 진행합니다:", e);
    }
  }

  if (data.treeData) {
    data.pendingData = JSON.parse(data.treeData);
  }

  // treeData가 없거나 빈 배열인지 확인
  if (!data?.treeData || data?.treeData.length === 0) {
    let loadedTreeData = data.treeData;

    if (!loadedTreeData) {
      data.pendingData = {};
    }

    const appFolderId = generateUUID();
    const extFolderId = generateUUID();

    // 기본 데이터 구조 생성
    data.pendingData = [
      {
        id: appFolderId,
        title: "APP",
        type: "folder",
        sortOrder: 0,
        content: "",
        path: "APP",
        disabled: false,
        children: [
          {
            id: generateUUID(),
            title: "untitled.vue",
            type: "file",
            extension: "vue",
            file: "vue",
            sortOrder: 0,
            path: "APP/untitled.vue",
            disabled: true,
          },
        ],
      },

      {
        id: extFolderId,
        title: "ext",
        type: "folder",
        sortOrder: 1,
        content: "",
        path: "ext",
        disabled: false,
        children: [],
      },
    ];
  }

  return data;
}

const toggleSidebar = () => {
  drawer.value = !drawer.value;
};

const saveCode = async () => {
  saveDialog.value = false;

  const flatData = [];

  const prepareTreeData = (nodes, parentPath = "") => {
    // parentPath 기본값 추가
    return nodes.map((node) => {
      let displayTitle = node.title;

      // 1. 현재 노드의 전체 경로 계산
      // 부모 경로가 있으면 "부모경로/현재제목", 없으면 "현재제목"
      let fullPath = parentPath
        ? `${parentPath}/${displayTitle}`
        : displayTitle;

      // .vue 파일에 대한 특수 처리 (기존 로직 유지)
      if (node.extension === "vue") {
        const newFileName = "index.vue";
        displayTitle = newFileName;
        fullPath = newFileName; // .vue 파일은 보통 루트에 위치하므로 고정하거나 구조에 맞춰 조정
      }

      let content = node.content || "";

      // 에디터 스토어에서 최신 코드 확인 로직 (기존과 동일)
      if (node.file && replStore.value?.files) {
        const originalPath = node.path || node.title;
        const fileInStore =
          replStore.value.files[originalPath] ||
          replStore.value.files[`src/${originalPath}`] ||
          replStore.value.files[node.title] ||
          replStore.value.files[`src/${node.title}`];
        if (fileInStore && fileInStore.code !== undefined) {
          content = fileInStore.code;
        }
      }

      let fileSize = node.size || 0;
      if (node.file && content !== undefined && !IMG_RE.test(displayTitle)) {
        fileSize = new Blob([content]).size;
      }

      return {
        ...node,
        id: node.id || generateUUID(),
        title: displayTitle,
        content: content,
        path: fullPath, // 이제 "ext/folder/image.png" 형태가 됩니다.
        size: fileSize,
        isLocal: false,
        // 2. 자식들을 처리할 때 현재 노드의 경로(fullPath)를 부모 경로로 전달
        children:
          node.children && node.children.length > 0
            ? prepareTreeData(node.children, fullPath)
            : [],
      };
    });
  };

  // 호출 부분 수정
  const finalTreeData = prepareTreeData(items.value);

  // 파일 업로드 목록 추출
  const filesToUpload = [];
  const collectFiles = (nodes) => {
    nodes.forEach((n) => {
      if (n.type === "file") filesToUpload.push(n);
      if (n.children) collectFiles(n.children);
    });
  };
  collectFiles(finalTreeData);

  try {
    const formData = new FormData();
    const appId = selectedAppData.value.appId;

    // 파일 처리 로직 (서버 데이터 Fetch 포함)
    for (const node of filesToUpload) {
      const isImage = IMG_RE.test(node.title);
      let fileBlob = null;

      try {
        if (!isImage) {
          let finalContent = node.content;
          if (!finalContent && !node.isLocal) {
            const res = await fetch(
              `/api/apps/file/${appId}/${selectedAppData.value.type}/${node.path}`,
              {
                credentials: "include",
              },
            );
            if (res.ok) finalContent = await res.text();
          }

          fileBlob = new Blob([finalContent || ""], { type: "text/plain" });
        } else if (isImage && node.blobUrl) {
          const res = await fetch(node.blobUrl);
          fileBlob = await res.blob();
        } else if (isImage && !node.isLocal) {
          // 클릭 안 한 서버 이미지의 경우 서버에서 다시 긁어옴
          const res = await fetch(
            `/api/apps/file/${appId}/${selectedAppData.value.type}/${node.path}`,
            {
              credentials: "include",
            },
          );
          if (res.ok) fileBlob = await res.blob();
        }

        if (fileBlob) {
          // 1. 메인 앱 파일(.vue)인 경우
          if (node.extension === "vue") {
            formData.append("appVueFile", fileBlob, "index.vue");
          }
          // 2. 그 외 모든 파일 (이미지, 일반 폴더 내 파일 등)
          else {
            // node.path가 'folder/image.png' 형태로 되어 있어야 서버에서도 폴더 구조를 유지합니다.

            const uploadPath = node.path || node.title;
            formData.append("extFiles", fileBlob, uploadPath);
            console.log(`[Upload Stack] ${uploadPath} 추가됨`);
          }
        }
      } catch (fileErr) {
        console.warn(`파일 처리 실패 (${node.title}):`, fileErr);
      }
    }

    // JSON 데이터에서 content 제외 처리
    const treeDataJson = JSON.stringify(finalTreeData, (key, value) => {
      if (key === "content" || key === "blobUrl") return undefined;
      return value;
    });

    const appVrsnObject = {
      id: selectedAppVrsnData.value.appNo || null,
      appVrsnNo: selectedAppVrsnData.value.appVrsnNo || null,
      sttsCd: 0,
      type: "develop",
      treeData: treeDataJson,
      modStts: isModified.value, // 앱 소스 코드 변경 여부
    };

    const payload = {
      appNo: selectedAppVrsnData.value.appNo || null,
      appNm: appNmInput.value,
      pendingData: appVrsnObject,
    };

    formData.append(
      "appData",
      new Blob([JSON.stringify(payload)], { type: "application/json" }),
    );

    const response = await fetch("/api/apps/insertAppData", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) throw new Error(`저장 실패: ${response.status}`);

    isModified.value = false;
    // 저장 직후 REPL watcher의 오탐 방지를 위한 쿨다운
    isSaveCooldown.value = true;
    setTimeout(() => {
      isSaveCooldown.value = false;
    }, 1500);
    alertMessage.value = "성공적으로 저장되었습니다.";
    alertDialog.value = true;
    //router.push("/application/all");
  } catch (error) {
    console.error("저장 중 오류 발생:", error);
    alertMessage.value = "저장에 실패했습니다.";
    alertDialog.value = true;
  }
};

const loadProject = (serverData) => {
  items.value = [];
  if (!serverData || !Array.isArray(serverData)) return;

  const processNodesRecursive = (nodes) => {
    return nodes.map((node) => {
      // 숫자 타입 보정
      let fileSize = 0;
      if (node.size !== undefined && node.size !== null) {
        fileSize = Number(node.size);
      }

      // 트리뷰 컴포넌트에서 사용하는 아이콘/확장자 속성 보정
      const newNode = {
        ...node,
        file: node.type === "file" ? node.extension : undefined,
        size: fileSize,
      };

      // 에디터(Repl)에 파일 내용 복구
      if (node.type === "file" && replStore.value) {
        const content = node.content || "";
        const storagePath = node.path || node.title;

        // 에디터에 파일 추가 및 코드 주입
        replStore.value.addFile(storagePath, content);
        if (replStore.value.files[storagePath]) {
          replStore.value.files[storagePath].code = content;
        }
      }

      // 자식이 있으면 재귀 호출
      if (node.children && node.children.length > 0) {
        newNode.children = processNodesRecursive(node.children);
      } else {
        newNode.children = [];
      }

      return newNode;
    });
  };

  // 재귀적으로 데이터 가공 및 에디터 등록 실행
  const finalizedTree = processNodesRecursive(serverData);

  const sortRecursive = (nodes) => {
    nodes.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        sortRecursive(node.children);
      }
    });
  };
  sortRecursive(finalizedTree);

  // 최종 결과 반영
  items.value = finalizedTree;
};

const isAppNmFixed = computed(() => selectedAppData.value?.isApproved === true);

const openSaveDialog = () => {
  let appData = selectedAppData.value;

  appNmInput.value = appData.appNm || "이름없는 앱";
  saveDialog.value = true;
};

const handleBack = async () => {
  router.push("/application/all");
};

// 새로고침, 탭 닫기, 외부 링크 이동할 때 처리
const handleBeforeUnload = (event) => {
  if (isModified.value) {
    event.preventDefault();
    event.returnValue = "";
  }
};

const handleKeydown = (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
    e.preventDefault();
    e.stopPropagation(); // 이벤트 전파 중단
    openSaveDialog();
  }
};

onMounted(async () => {
  window.addEventListener("beforeunload", handleBeforeUnload);
  window.addEventListener("keydown", handleKeydown, true); // true: 캡처링 단계에서 이벤트 감지

  try {
    selectedAppVrsnData.value = null;
    const loadData = await loadAppData(
      selectedAppData.value.id,
      selectedAppData.value.type,
    );
    if (loadData) {
      selectedAppVrsnData.value = loadData;
      await nextTick(); // DOM 업데이트 대기
      isReady.value = true;
    }
  } catch (err) {
    console.error("데이터 로딩 실패, 기본 데이터로 진행:", err);
    // 실패해도 기본 데이터로 진행
    const fallback = await loadAppData(null, null);
    selectedAppVrsnData.value = fallback;
    await nextTick();
    isReady.value = true;
  }

  // 초기 로드 완료 후 변경 감지 활성화 (watcher 오탐 방지)
  setTimeout(() => {
    isSaveCooldown.value = false;
  }, 3000);
});

onUnmounted(() => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
  window.removeEventListener("keydown", handleKeydown, true);
});

// 메뉴 클릭, 뒤로가기 버튼, 내부 페이지 이동할 때 처리
let routeLeaveNext = null;
onBeforeRouteLeave((to, from, next) => {
  if (isModified.value) {
    routeLeaveNext = next;
    confirmMessage.value =
      "저장하지 않은 변경사항이 있습니다. 정말 나가시겠습니까?";
    confirmCallback.value = (confirmed) => {
      if (confirmed && routeLeaveNext) {
        routeLeaveNext();
      } else if (routeLeaveNext) {
        routeLeaveNext(false);
      }
      routeLeaveNext = null;
    };
    confirmDialog.value = true;
  } else {
    next();
  }
});

provide("loadProjectFunction", loadProject);

const profileMenu = ref(false);
const settingMenu = ref(false);

function getResizeEvent(e) {
  const paneIndx = e.index;

  if (paneIndx == 0 && typeof Module == "object") {
    if (typeof Module.Resize == "function") {
      const engineContainer = document.getElementById("egisEngine");
      //e.panes[2].width = engineContainer.clientWidth || e.panes[2].width;
      Module.Resize(engineContainer.clientWidth, engineContainer.clientHeight);
      Module.XDRenderData();
    }
  }
}

// Module.Resize 사용을 위한 추가 스크립트 (필요 시) - 제거하거나 통합
const handleHeaderAction = (val) => {
  if (val === "chat") isChatOpen.value = !isChatOpen.value;
  if (val === "agent") { isAgentOpen.value = !isAgentOpen.value; isChatOpen.value = false; }
  if (val === "preview") isPreviewOpen.value = !isPreviewOpen.value;
  if (val === "open-window") {
    isPreviewOpen.value = false;
    const width = 1200;
    const height = 800;
    if (typeof window !== "undefined" && window.screen) {
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;
      window.open(
        "/preview#" + (location.hash.slice(1) || ""),
        "xdcloud-preview",
        `width=${width},height=${height},left=${left},top=${top}`,
      );
    } else {
      window.open(
        "/preview#" + (location.hash.slice(1) || ""),
        "xdcloud-preview",
      );
    }
  }
  if (val === "exit") handleBack();
};

const explorerWidth = ref(256);
const chatWidth = ref(400);
const isResizing = ref(false);

const startResize = (direction, e) => {
  e.preventDefault();
  isResizing.value = true;
  const startX = e.clientX;
  const startWidth =
    direction === "left" ? explorerWidth.value : chatWidth.value;

  const onMouseMove = (moveEvent) => {
    const diff = moveEvent.clientX - startX;
    if (direction === "left") {
      explorerWidth.value = Math.max(200, Math.min(600, startWidth + diff));
    } else {
      // right (AI Chat) - resizing from left edge
      chatWidth.value = Math.max(300, Math.min(800, startWidth - diff));
    }
  };

  const onMouseUp = () => {
    isResizing.value = false;
    document.documentElement.style.cursor = ""; // Reset cursor
    document.body.style.userSelect = "";
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);

    // Trigger resize event for map engine if needed
    window.dispatchEvent(new Event("resize"));
  };

  document.documentElement.style.cursor = "col-resize";
  document.body.style.userSelect = "none"; // Prevent text selection
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
};

// Theme Management
const themeCookie = useCookie("theme", {
  domain: ".xdcloud.kr",
  path: "/",
  maxAge: 60 * 60 * 24 * 365, // 1 year
});
const currentTheme = ref(themeCookie.value || "dark");
const isDarkTheme = ref(currentTheme.value === "dark");

const toggleTheme = (val) => {
  currentTheme.value = val ? "dark" : "light";
  themeCookie.value = currentTheme.value;
  isDarkTheme.value = val;
};

// Watch for external cookie changes
watch(themeCookie, (newVal) => {
  if (newVal) {
    currentTheme.value = newVal;
    isDarkTheme.value = newVal === "dark";
  }
});

provide("currentTheme", currentTheme);
provide("isDarkTheme", isDarkTheme);
</script>

<template>
  <v-theme-provider :theme="currentTheme">
    <v-layout :class="{ 'is-resizing': isResizing }">
      <v-navigation-drawer app permanent rail>
        <!-- ... activity bar content ... -->
        <v-list density="compact" class="px-1">
          <v-btn icon variant="plain" :ripple="false" @click="toggleSidebar">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </v-list>
        <v-divider></v-divider>
        <v-list
          density="compact"
          nav
          class="d-flex flex-column align-center gap-2"
        >
          <!-- Save Button -->
          <v-tooltip location="right" text="저장">
            <template v-slot:activator="{ props }">
              <v-btn
                icon
                variant="plain"
                :ripple="false"
                v-bind="props"
                class="tutorial-target-save"
                @click="openSaveDialog"
              >
                <v-icon>mdi-content-save</v-icon>
              </v-btn>
            </template>
          </v-tooltip>

          <!-- Download Button -->
          <v-tooltip location="right" text="다운로드">
            <template v-slot:activator="{ props }">
              <v-btn
                icon
                variant="plain"
                :ripple="false"
                v-bind="props"
                class="tutorial-target-download"
                @click="downloadZipFiles"
              >
                <v-icon>mdi-download</v-icon>
              </v-btn>
            </template>
          </v-tooltip>

          <!-- API Document Button -->
          <v-tooltip location="right" text="API 문서">
            <template v-slot:activator="{ props }">
              <v-btn
                icon
                variant="plain"
                :ripple="false"
                v-bind="props"
                class="tutorial-target-api"
                href="https://egiscorp.gitbook.io/xdworld-webgl-manual"
                target="_blank"
              >
                <v-icon>mdi-book-open-page-variant</v-icon>
              </v-btn>
            </template>
          </v-tooltip>

          <!-- Sandbox Button -->
          <v-tooltip location="right" text="샌드박스">
            <template v-slot:activator="{ props }">
              <v-btn
                icon
                variant="plain"
                :ripple="false"
                v-bind="props"
                class="tutorial-target-sandbox"
                href="https://sandbox.egiscloud.com"
                target="_blank"
              >
                <v-icon>mdi-cube-outline</v-icon>
              </v-btn>
            </template>
          </v-tooltip>

          <!-- Toggle Preview -->
          <v-tooltip location="right" text="미리보기">
            <template v-slot:activator="{ props }">
              <v-btn
                icon
                variant="plain"
                :ripple="false"
                v-bind="props"
                class="tutorial-target-preview"
                @click="isPreviewOpen = !isPreviewOpen"
              >
                <v-icon>{{
                  isPreviewOpen ? "mdi-earth" : "mdi-earth-off"
                }}</v-icon>
              </v-btn>
            </template>
          </v-tooltip>

          <!-- Toggle Chat -->
          <v-tooltip location="right" text="AI 어시스턴트">
            <template v-slot:activator="{ props }">
              <v-btn
                icon
                variant="plain"
                :ripple="false"
                v-bind="props"
                class="tutorial-target-chat"
                @click="isChatOpen = !isChatOpen"
              >
                <v-icon>mdi-robot-excited-outline</v-icon>
              </v-btn>
            </template>
          </v-tooltip>

          <!-- Toggle Agent -->
          <v-tooltip location="right" text="Agent">
            <template v-slot:activator="{ props }">
              <v-btn
                icon
                variant="plain"
                :ripple="false"
                v-bind="props"
                @click="handleHeaderAction('agent')"
              >
                <v-icon>mdi-robot-outline</v-icon>
              </v-btn>
            </template>
          </v-tooltip>

          <!-- Settings Menu -->
          <v-menu location="right" :close-on-content-click="false">
            <template v-slot:activator="{ props }">
              <v-tooltip location="right" text="설정">
                <template v-slot:activator="{ props: tooltipProps }">
                  <v-btn
                    icon
                    variant="plain"
                    :ripple="false"
                    v-bind="{ ...props, ...tooltipProps }"
                    class="tutorial-target-settings"
                  >
                    <v-icon>mdi-cog-outline</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
            </template>

            <v-card min-width="200" class="pa-2">
              <v-card-title class="text-subtitle-2 font-weight-bold mb-2"
                >설정</v-card-title
              >
              <v-divider class="mb-2"></v-divider>

              <v-list-item class="px-2">
                <template v-slot:prepend>
                  <v-icon size="small" class="mr-2">{{
                    currentTheme === "dark"
                      ? "mdi-weather-night"
                      : "mdi-weather-sunny"
                  }}</v-icon>
                </template>
                <v-list-item-title class="text-caption"
                  >다크모드</v-list-item-title
                >
                <template v-slot:append>
                  <v-switch
                    v-model="isDarkTheme"
                    color="primary"
                    hide-details
                    density="compact"
                    inset
                    @update:model-value="toggleTheme"
                  ></v-switch>
                </template>
              </v-list-item>
            </v-card>
          </v-menu>
        </v-list>
        <template v-slot:append>
          <v-list density="compact" nav>
            <v-list-item
              prepend-icon="mdi-arrow-left"
              @click="handleBack"
              title="목록으로 돌아가기"
              variant="plain"
              :ripple="false"
            ></v-list-item>
          </v-list>
        </template>
      </v-navigation-drawer>

      <div v-if="isReady" style="width: 100%; height: 100%">
        <v-navigation-drawer
          app
          :permanent="true"
          v-model="drawer"
          :scrim="false"
          :width="explorerWidth"
          class="explorer-drawer"
        >
          <slot name="explorerTreeview"></slot>
          <div
            class="resize-handle right"
            @mousedown="startResize('left', $event)"
          ></div>
        </v-navigation-drawer>
        <v-main class="d-flex h-100">
          <!-- ... main content ... -->
          <div
            class="flex-1-1-auto pa-0 w-100 d-flex flex-column"
            style="min-width: 0"
          >
            <!-- Header REMOVED -->
            <!-- <div class="w-100 bg-grey-darken-4" style="height: 48px; flex-shrink: 0;"> ... </div> -->

            <div class="w-100 d-flex" style="height: 100%">
              <div v-if="isReady" class="h-100" style="width: 100%">
                <slot name="MonacoEpel"></slot>
              </div>
            </div>
          </div>
        </v-main>

        <!-- AI Chat Drawer -->
        <v-navigation-drawer
          v-model="isChatOpen"
          location="right"
          :width="chatWidth"
          app
          class="chat-drawer"
          :scrim="false"
        >
          <div
            class="resize-handle left"
            @mousedown="startResize('right', $event)"
          ></div>
          <DevToolDevAiChatComp
            :is-open="isChatOpen"
            @close="isChatOpen = false"
          />
        </v-navigation-drawer>

        <!-- Agent Drawer -->
        <v-navigation-drawer
          v-model="isAgentOpen"
          location="right"
          :width="chatWidth"
          app
          class="chat-drawer"
          :scrim="false"
        >
          <div
            class="resize-handle left"
            @mousedown="startResize('right', $event)"
          ></div>
          <DevToolDevAgentChat
            :is-open="isAgentOpen"
            @close="isAgentOpen = false"
          />
        </v-navigation-drawer>
      </div>
    </v-layout>
    <v-dialog v-model="saveDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6 pa-4"> 저장 </v-card-title>

        <v-form v-model="isFormValid" @submit.prevent="saveCode">
          <v-card-text>
            <p class="text-body-2 text-medium-emphasis mb-4">
              앱명을 입력해주세요.<br />
            </p>
            <v-text-field
              v-model="appNmInput"
              variant="outlined"
              density="compact"
              autofocus
              hide-details="auto"
              :rules="appNameRules"
              :readonly="isAppNmFixed"
              :disabled="isAppNmFixed"
            ></v-text-field>
          </v-card-text>
          <v-card-actions class="justify-end pa-4 pt-0">
            <v-btn variant="text" @click="saveDialog = false">취소</v-btn>

            <v-btn
              color="primary"
              variant="flat"
              type="submit"
              :disabled="!isFormValid"
            >
              저장
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Confirm Dialog -->
    <v-dialog v-model="confirmDialog" max-width="380" persistent>
      <v-card class="dialog-card">
        <v-card-text class="pa-6">
          <div class="d-flex align-start mb-4">
            <v-icon color="warning" size="24" class="me-3 mt-1">
              mdi-alert-circle-outline
            </v-icon>
            <div class="flex-grow-1">
              <p
                class="text-body-1 mb-0"
                style="
                  line-height: 1.6;
                  color: rgba(var(--v-theme-on-surface), 0.87);
                "
              >
                {{ confirmMessage }}
              </p>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 justify-end">
          <v-btn
            variant="text"
            class="me-2"
            @click="
              confirmCallback && confirmCallback(false);
              confirmDialog = false;
            "
          >
            취소
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="
              confirmCallback && confirmCallback(true);
              confirmDialog = false;
            "
          >
            확인
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Alert Dialog -->
    <v-dialog v-model="alertDialog" max-width="380" persistent>
      <v-card class="dialog-card">
        <v-card-text class="pa-6">
          <div class="d-flex align-start mb-4">
            <v-icon
              :color="alertMessage.includes('실패') ? 'error' : 'success'"
              size="24"
              class="me-3 mt-1"
            >
              {{
                alertMessage.includes("실패")
                  ? "mdi-alert-circle-outline"
                  : "mdi-check-circle-outline"
              }}
            </v-icon>
            <div class="flex-grow-1">
              <p
                class="text-body-1 mb-0"
                style="
                  line-height: 1.6;
                  color: rgba(var(--v-theme-on-surface), 0.87);
                "
              >
                {{ alertMessage }}
              </p>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 justify-end">
          <v-btn
            :color="alertMessage.includes('실패') ? 'error' : 'success'"
            variant="flat"
            @click="handleAlertClose"
          >
            확인
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-theme-provider>
</template>
<style scoped>
/* Design System Tokens */
.v-layout {
  --editor-bg: #0f172a;
  --panel-bg: #1e293b;
  --panel-header: #334155;
  --border-color: #1e293b;
  --accent-green: #22c55e;
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --icon-inactive: #94a3b8;
  --font-ui: "IBM Plex Sans", "Inter", sans-serif;
  --font-code: "JetBrains Mono", monospace;
  font-family: var(--font-ui);
  height: 100vh;
}

/* Force v-main to fill available height */
:deep(.v-main) {
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
}

:deep(.v-main__wrap) {
  height: 100%;
}

/* Prevent global scrollbar */
:global(html),
:global(body) {
  overflow: hidden !important;
}

.explorer-drawer,
.chat-drawer {
  position: relative;
  transition: none !important; /* Disable transition during resize for smooth following */
}

/* Ensure resizing doesn't trigger transitions on width changes */
:deep(.v-navigation-drawer__content) {
  transition: none !important;
}

.resize-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 4px;
  cursor: col-resize;
  z-index: 1000;
  transition: background-color 0.2s;
}

.resize-handle:hover,
.resize-handle:active {
  background-color: rgba(59, 130, 246, 0.5);
}

.resize-handle.right {
  right: 0;
}

.resize-handle.left {
  left: 0;
}

/* Prevent iframe interference and text selection during resize */
.is-resizing :deep(iframe),
.is-resizing :deep(.split-pane) {
  pointer-events: none;
}

.is-resizing {
  cursor: col-resize;
}

/* Clean Dialog Styles */
:deep(.dialog-card) {
  border-radius: 12px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
}

:deep(.dialog-card .v-card-text) {
  padding-bottom: 0;
}

:deep(.dialog-card .v-card-actions) {
  padding-top: 0;
}

:deep(.dialog-card .v-btn) {
  text-transform: none;
  font-weight: 500;
  border-radius: 8px;
  min-width: 80px;
  height: 36px;
}
</style>
