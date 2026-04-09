<script setup lang="ts">
import { shallowRef, ref, onMounted, inject } from "vue";

const {
  items,
  setInitialItems,
  removeTitle,
  registerBlobUrl,
  selectedAppData,
  selectedAppVrsnData,
} = useTreeStore();
const loadProjectFunction = inject("loadProjectFunction") as (
  data: any[],
) => void;
const setModified = inject("setModified") as (status: boolean) => void;

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

onMounted(async () => {
  await nextTick();

  if (loadProjectFunction) {
    // Cast selectedAppData to any to avoid TS error
    let treeData = (selectedAppVrsnData as any).value?.pendingData;

    if (treeData && Array.isArray(treeData)) {
      // 데이터 가공: file 속성이 없는 노드들에 아이콘 타입 부여
      treeData = initializeTreeData(treeData);
      loadProjectFunction(treeData);
    } else {
      loadProjectFunction(treeData);
    }

    const initialOpenIds: string[] = [];
    const findInitialFolders = (nodes: any[]) => {
      nodes.forEach((node) => {
        if (node.title === "APP" || node.title === "ext") {
          initialOpenIds.push(node.id); // title이 아닌 id를 넣어야 함
        }
        if (node.children && node.children.length > 0) {
          findInitialFolders(node.children);
        }
      });
    };
    findInitialFolders(treeData);

    // open ref 업데이트 (shallowRef이므로 전체 교체)
    open.value = initialOpenIds;
  } else {
    console.warn("loadProject 함수를 찾을 수 없습니다.");
  }
});

const getFileTypeByTitle = (title: string) => {
  if (!title) return undefined;
  const ext = title.toLowerCase().split(".").pop() || "";

  // 이미지 확장자인지 체크
  if (IMG_RE.test(title)) {
    return "img"; // 이미지면 img (템플릿에서 mdi-image-outline 사용)
  }

  // 그 외 일반 파일 (txt, json, csv 등)
  return ext;
};

// 트리 데이터를 재귀적으로 돌며 file 속성이 없는 경우 채워주는 함수
const initializeTreeData = (nodes: any[]) => {
  return nodes.map((node) => {
    const newNode = { ...node };

    // 자식 노드가 없고(파일이고), file 속성이 없는 경우 확장자 기반으로 설정
    if ((!newNode.children || newNode.children.length === 0) && !newNode.file) {
      newNode.file = getFileTypeByTitle(newNode.title);
    }

    // 자식이 있다면 재귀 호출
    if (newNode.children && newNode.children.length > 0) {
      newNode.children = initializeTreeData(newNode.children);
    }

    return newNode;
  });
};

const resourceDropdown = ref(false);
const addDialog = ref(false);
const imgDialog = ref(false);
const newFileName = ref("");
const newFileType = ref("txt");
const targetNode = ref<any>(null);
const nameField = ref<HTMLInputElement | null>(null);
const replStore = useState<any>("repl-store", () => null);
const IMG_RE = /\.(png|jpe?g|gif|webp|svg|bmp|ico)$/i;

const previewImgSrc = ref("");
const dImageFileName = ref("");

const addFolderDialog = ref(false);
const newFolderName = ref("");
const folderForm = ref<any>(null); // 폴더 폼 참조
const folderFormValid = ref(false);

const form = ref<any>(null);
const formValid = ref(false);

const fileInput = ref<HTMLInputElement | null>(null);

const dragOverNode = ref<any>(null);

const snackbar = ref({ show: false, message: "", color: "info" });
const showSnackbar = (message: string, color = "info") => {
  snackbar.value = { show: true, message, color };
};

const open = shallowRef(["APP", "resources"]);
const files = shallowRef<Record<string, { icon: string; color: string }>>({
  html: { icon: "mdi-language-html5", color: "#E65100" },
  js: { icon: "mdi-nodejs", color: "#FDD835" },
  json: { icon: "mdi-code-json", color: "#42A5F5" },
  md: { icon: "mdi-language-markdown", color: "#29B6F6" },
  png: { icon: "mdi-file-image", color: "#B0BEC5" },
  jpg: { icon: "mdi-file-image", color: "#B0BEC5" },
  jpeg: { icon: "mdi-file-image", color: "#B0BEC5" },
  gif: { icon: "mdi-file-image", color: "#B0BEC5" },
  webp: { icon: "mdi-file-image", color: "#B0BEC5" },
  svg: { icon: "mdi-file-image", color: "#AB47BC" },
  bmp: { icon: "mdi-file-image", color: "#B0BEC5" },
  ico: { icon: "mdi-file-image", color: "#B0BEC5" },
  txt: { icon: "mdi-file-document-outline", color: "#9E9E9E" },
  xls: { icon: "mdi-file-excel", color: "#4CAF50" },
  vue: { icon: "mdi-vuejs", color: "#42B883" },
  img: { icon: "mdi-image-outline", color: "#B0BEC5" },
  csv: { icon: "mdi-file-delimited", color: "#66BB6A" },
});

const fileRules = [
  (v: string) => !!v || "파일명을 입력해주세요.",
  (v: string) =>
    /^[a-zA-Z0-9_\-]+\.(json|txt|csv|js)$/i.test(v) ||
    "파일명은 영문, 숫자, '-', '_'만 가능하며 확장자는 .json, .txt, .csv, .js 여야 합니다.",
];

const folderRules = [
  (v: string) => !!v || "폴더명을 입력해주세요.",
  (v: string) =>
    /^[a-zA-Z0-9_\-]+$/i.test(v) ||
    "폴더명은 영문, 숫자, '-', '_'만 가능합니다.",
];

const contextMenu = ref({
  show: false,
  x: 0,
  y: 0,
  item: null as any,
});

function showContextMenu(e: MouseEvent, item: any) {
  // 기본 브라우저 메뉴 막기
  e.preventDefault();

  // 삭제 불가능한 항목이면 메뉴 띄우지 않음 (APP, ext 등)
  if (item.disabled || item.title === "APP" || item.title === "ext") {
    return;
  }

  contextMenu.value = {
    show: true,
    x: e.clientX,
    y: e.clientY,
    item: item,
  };
}

function executeDelete() {
  if (contextMenu.value.item) {
    handleDelete(contextMenu.value.item);
  }
  contextMenu.value.show = false;
}

function findNodeByTitle(nodes: any[], title: string): any {
  for (const node of nodes) {
    if (node.title === title) {
      return node;
    }
    if (node.children && node.children.length > 0) {
      const found = findNodeByTitle(node.children, title);
      if (found) return found;
    }
  }
  return null;
}

const findNodeRecursive = (nodes: any[], targetValue: string): any => {
  for (const node of nodes) {
    // 고유 ID로 먼저 매칭 시도
    if (node.id === targetValue) {
      return node;
    }
    // ID가 일치하지 않더라도 title이 일치하는지 확인
    if (node.title === targetValue) {
      return node;
    }
    // 자식 노드가 있다면 재귀 탐색
    if (node.children && node.children.length > 0) {
      const found = findNodeRecursive(node.children, targetValue);
      if (found) return found;
    }
  }
  return null;
};

// 트리 노드 클릭 시 실행되는 핸들러
const onNodeClick = async (e: any) => {
  let targetKey: any = "";

  // 클릭된 타겟 id 추출
  if (typeof e === "string") {
    targetKey = e;
  } else if (e && typeof e === "object") {
    targetKey = e.id || e.title || "";
  }

  // 재귀 함수 호출을 통해 정확한 노드 객체(Item) 획득
  const item = findNodeRecursive(items.value, targetKey);

  if (!item) {
    console.error(`[Explorer] 노드를 찾을 수 없습니다: ${targetKey}`);
    return;
  }

  // 폴더인 경우 로직 중단
  if (!item.file) return;

  // 경로 설정
  const filename = item.path || item.title;
  const ext = filename.toLowerCase().split(".").pop();
  const isImage = IMG_RE.test(filename || "");

  // --- 이미지 처리 ---
  if (isImage) {
    if (item.isLocal && item.blobUrl) {
      // 방금 업로드한 로컬 이미지인 경우
      previewImgSrc.value = item.blobUrl;
    } else {
      // 서버에 저장된 이미지인 경우
      const appId = selectedAppData.value?.appId;
      if (!appId) {
        console.warn("appId 정보가 없어 이미지 주소를 생성할 수 없습니다.");
        return;
      }
      previewImgSrc.value = `/api/apps/file/${appId}/${selectedAppData.value.type}/${filename}`;
    }

    dImageFileName.value = filename;
    imgDialog.value = true;
  }

  // --- 일반 코드 파일 처리 ---
  else if (ext !== "vue") {
    const s = replStore.value;
    if (!s) return;

    // 에디터 스토어에 등록되어 있는지 확인
    if (!s.files[filename]) {
      // 로컬 파일인데 스토어에 없으면 스킵
      if (item.isLocal) return;

      try {
        const appId = selectedAppData.value?.appId;

        const fetchUrl = `/api/apps/file/${appId}/${selectedAppVrsnData.value.type}/${filename}`;

        const response = await fetch(fetchUrl, {
          credentials: "include",
        });

        if (!response.ok) throw new Error(`파일 로드 실패: ${response.status}`);

        const sourceText = await response.text();

        // 에디터에 '전체 경로'를 키로 하여 등록
        s.addFile(filename, sourceText);
        if (s.files[filename]) {
          s.files[filename].code = sourceText;
        }
        item.size = new Blob([sourceText]).size;
      } catch (err) {
        console.error(`[Fetch Error] ${filename}:`, err);
        return;
      }
    }

    // 파일 탭 활성화
    if (s.files[filename]) {
      s.files[filename].hidden = false;
      s.activeFilename = filename;
    }
  }

  // --- 메인 Vue 파일 처리 ---
  else if (ext === "vue") {
    const s = replStore.value;
    if (!s) return;

    const vuePath = "src/" + filename;
    if (s.files[vuePath]) {
      s.files[vuePath].hidden = false;
      s.activeFilename = vuePath;
    }
  }
};

function triggerImageUpload(node: any) {
  targetNode.value = node;
  fileInput.value?.click();
}

const ALLOWED_FILE_RE = /\.(json|txt|csv|png|jpe?g|gif|webp|svg|bmp|ico|js)$/i;

function getNodePath(
  nodes: any[],
  target: any,
  currentPath: string = "",
): string | null {
  for (const node of nodes) {
    const myPath = currentPath ? `${currentPath}/${node.title}` : node.title;
    if (node === target) return myPath;
    if (node.children) {
      const foundPath = getNodePath(node.children, target, myPath);
      if (foundPath) return foundPath;
    }
  }
  return null;
}

async function processFileAndAdd(file: File, targetNode: any) {
  const ALLOWED_FILE_RE =
    /\.(js|json|txt|csv|png|jpe?g|gif|webp|svg|bmp|ico)$/i;

  if (!ALLOWED_FILE_RE.test(file.name)) {
    showSnackbar(
      `허용되지 않는 파일 형식입니다. (${file.name})
허용: .js, .json, .txt, .csv, .png, .jpg, .gif, .webp, .svg, .bmp, .ico`,
      "warning",
    );
    return;
  }

  targetNode.children = targetNode.children || [];

  // 파일명 중복 처리
  const filename = file.name;
  let base = filename;
  let name = base;
  let i = 1;

  const nameParts = filename.split(".");
  const extensionStr = nameParts.length > 1 ? `.${nameParts.pop()}` : "";
  const nameBody = nameParts.join(".");

  const exists = (n: string) =>
    targetNode.children.some((c: any) => c.title === n);

  while (exists(name)) {
    name = `${nameBody}_${i++}${extensionStr}`;
  }

  const ext = name.split(".").pop()?.toLowerCase() || "txt";
  const isImage = IMG_RE.test(name);

  const iconType = isImage ? "img" : ext;

  let parentPath = "";
  if (targetNode.path) {
    parentPath = targetNode.path;
  } else {
    const calculatedPath = getNodePath(items.value, targetNode);
    parentPath = calculatedPath || "";
  }

  if (targetNode.isRoot || targetNode.title === "APP") {
    parentPath = "";
  }

  const fullPath = parentPath ? `${parentPath}/${name}` : name;

  // 트리 아이템 생성
  const newItem: any = {
    id: generateUUID(),
    title: name,
    file: iconType,
    type: "file",
    isLocal: true,
    path: fullPath,
    size: file.size,
    extension: ext,
    children: [],
  };

  const s = replStore.value;

  if (isImage) {
    newItem.blobUrl = URL.createObjectURL(file);
  } else {
    const text = await file.text();
    s.addFile(fullPath, text);

    // 내용 강제 주입 및 렌더링 대기
    if (s.files[fullPath]) s.files[fullPath].code = text;
    await nextTick();
  }

  registerBlobUrl(fullPath, file);

  targetNode.children.push(newItem);

  setModified(true);
}

function formatBytes(bytes: number, decimals = 1) {
  if (!bytes || bytes === 0) return "0 B";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

async function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;
  if (!targetNode.value) return;

  // 분리한 함수 사용
  for (const file of input.files) {
    await processFileAndAdd(file, targetNode.value);
  }

  input.value = "";
}

function onDragOver(e: DragEvent, item: any) {
  if (item.file || item.title === "APP") {
    e.dataTransfer!.dropEffect = "none"; // 금지 아이콘 표시
    return;
  }
  // 폴더인 경우에만 드롭 허용
  if (!item.file) {
    e.preventDefault();
    dragOverNode.value = item; // 하이라이트 활성화
  }
}

function onDragLeave(e: DragEvent, item: any) {
  // 드래그가 떠나면 하이라이트 해제
  if (dragOverNode.value === item) {
    dragOverNode.value = null;
  }
}

async function onDrop(e: DragEvent, item: any) {
  e.preventDefault();
  dragOverNode.value = null;

  // 폴더가 아니거나 'APP' 폴더인 경우 중단
  if (item.file || item.title === "APP") return;

  const files = e.dataTransfer?.files;
  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file) await processFileAndAdd(file, item);
    }

    // ext 폴더 등 드롭 대상 폴더가 닫혀 있으면 열기 (item-value="id" 사용)
    if (item.id && !open.value.includes(item.id)) {
      open.value = [...open.value, item.id];
    }
  }
}

function cleanupNodeData(node: any) {
  const fullPath = node.path || node.title;

  if (replStore.value && replStore.value.files[fullPath]) {
    delete replStore.value.files[fullPath];

    if (replStore.value.activeFilename === fullPath) {
      const findMainVueRecursive = (nodes: any[]): any => {
        for (const n of nodes) {
          // 확장자가 vue인 파일 발견 시 반환
          if (n.extension === "vue") {
            return n;
          }
          // 자식이 있다면 재귀 탐색
          if (n.children && n.children.length > 0) {
            const found = findMainVueRecursive(n.children);
            if (found) return found;
          }
        }
        return null;
      };

      const mainVueNode = findMainVueRecursive(items.value);
      //replStore.value.activeFilename = "src/M_LOCATION_CARD.vue";
      const mainPath = mainVueNode ? `src/${mainVueNode.title}` : "src/App.vue";

      replStore.value.activeFilename = mainPath;
    }
  }

  // 만약 폴더라서 자식이 있다면, 자식들도 싹 다 정리
  if (node.children && node.children.length > 0) {
    node.children.forEach((child: any) => cleanupNodeData(child));
  }
}

async function handleDelete(item: any) {
  if (!confirm(`'${item.title}'을(를) 삭제하시겠습니까?`)) return;

  cleanupNodeData(item);

  const pathToDelete = item.path || item.title;

  removeTitle(pathToDelete);
}

function openAddDialog(node: any) {
  targetNode.value = node;
  newFileName.value = "";

  addDialog.value = true;
  nextTick(() => nameField.value?.focus());
}

async function confirmAdd() {
  const r = await form.value?.validate();
  if (!r?.valid) return;

  if (!targetNode.value) return;

  const node = targetNode.value;
  node.children = node.children || [];

  // 중복 이름 방지 로직
  let base = newFileName.value.trim();
  let name = base;
  let i = 1;
  const exists = (n: string) => node.children.some((c: any) => c.title === n);

  while (exists(name)) {
    name = base.replace(/(\.\w+)?$/, (m) => `_${i++}${m || ""}`);
  }

  newFileType.value = name.split(".")[1] || "txt";

  // 부모 폴더의 전체 경로 찾기
  let parentPath = "";

  if (node.path && node.title !== "APP") {
    parentPath = node.path;
  } else if (node.title !== "APP") {
    const calculatedPath = getNodePath(items.value, node);
    parentPath = calculatedPath || "";
  }

  // 전체 경로 생성 (parentPath가 있으면 결합, 없으면 파일명만)
  // 만약 parentPath가 '/'로 시작한다면 제거해주는 로직 추가
  const cleanParentPath = parentPath.replace(/^\/+/, "");
  const fullPath = cleanParentPath ? `${cleanParentPath}/${name}` : name;

  console.log("최종 생성 경로:", fullPath);

  const initContent = "";

  // Mock Fetch를 위한 Blob 등록
  registerBlobUrl(fullPath, initContent);

  const s = replStore.value;
  if (s) {
    s.addFile(fullPath, initContent);

    if (typeof s.setActive === "function") {
      s.setActive(fullPath);
    } else {
      s.activeFilename = fullPath;
    }
  }

  const size = new Blob([initContent]).size;

  // 트리 노드에 추가
  node.children.push({
    id: crypto.randomUUID(),
    title: name,
    file: newFileType.value,
    content: initContent,
    type: "file",
    isLocal: true,
    path: fullPath,
    size: size,
    extension: newFileType.value,
    children: [],
  });

  addDialog.value = false;
  resourceDropdown.value = false;

  // 변경 감지 활성화
  if (typeof setModified === "function") setModified(true);
}

function cancelAdd() {
  addDialog.value = false;
}

function cancelImgPreviewAdd() {
  imgDialog.value = false;
}

function openAddFolderDialog(node: any) {
  targetNode.value = node;
  newFolderName.value = ""; // 초기화
  addFolderDialog.value = true;
}

async function confirmAddFolder() {
  const r = await folderForm.value?.validate();
  if (!r?.valid) return;

  if (!targetNode.value) return;

  const node = targetNode.value;
  node.children = node.children || [];

  // 중복 이름 방지 로직
  let base = newFolderName.value.trim();
  let name = base;
  let i = 1;
  const exists = (n: string) => node.children.some((c: any) => c.title === n);

  while (exists(name)) {
    name = `${base}_${i++}`;
  }

  // 트리 노드에 추가
  node.children.push({
    id: generateUUID(),
    title: name,
    type: "folder",
    isLocal: true,
    children: [],
    // file: undefined
  });

  addFolderDialog.value = false;
  resourceDropdown.value = false;

  setModified(true);
}

function cancelAddFolder() {
  addFolderDialog.value = false;
}
</script>

<template>
  <v-card
    class="explorer h-screen d-flex flex-column overflow-hidden font-weight-light"
    flat
    rounded="0"
  >
    <!-- Header removed to avoid duplication with layout -->
    <!-- <v-card-title ...>EXPLORER</v-card-title> -->
    <!-- <v-divider /> -->

    <div class="tree-scroll flex-1-1-auto overflow-auto custom-scrollbar">
      <v-treeview
        v-model:opened="open"
        :items="items"
        density="compact"
        item-value="id"
        activatable
        open-on-click
        class="devTreeView px-0"
        :hoverable="true"
        :hide-actions="true"
        @click:activate="onNodeClick"
        expand-icon="mdi-chevron-right"
        collapse-icon="mdi-chevron-down"
      >
        <template #prepend="{ item, isOpen }">
          <div
            class="d-flex align-center"
            @dragover.stop.prevent="onDragOver($event, item)"
            @dragleave.stop.prevent="onDragLeave($event, item)"
            @drop.stop.prevent="onDrop($event, item)"
            @contextmenu.prevent="showContextMenu($event, item)"
          >
            <v-icon
              size="small"
              v-if="!item.file"
              :icon="isOpen ? 'mdi-folder-open' : 'mdi-folder'"
              :class="{ 'drag-target-icon': dragOverNode === item }"
            />
            <v-icon
              size="small"
              v-else-if="item.file && files[item.file]"
              :icon="files[item.file]?.icon"
              :color="files[item.file]?.color"
            />
            <v-icon
              size="small"
              v-else
              icon="mdi-file-outline"
              color="#9E9E9E"
            />
          </div>
        </template>

        <template #title="{ item }">
          <div
            class="tree-item-title"
            :class="{ 'drag-target-text': dragOverNode === item }"
            @dragover.stop.prevent="onDragOver($event, item)"
            @dragleave.stop.prevent="onDragLeave($event, item)"
            @drop.stop.prevent="onDrop($event, item)"
            @contextmenu.prevent="showContextMenu($event, item)"
          >
            {{ item.title }}
          </div>
        </template>

        <template #append="{ item }">
          <div class="d-flex align-center">
            <span
              v-if="item.file && item.size !== undefined"
              class="text-caption text-medium-emphasis mr-2"
              style="
                font-size: 11px !important;
                min-width: 40px;
                text-align: right;
              "
            >
              {{ formatBytes(Number(item.size)) }}
            </span>

            <v-menu
              v-if="!item.file && item.title !== 'APP'"
              location="bottom end"
              :close-on-content-click="true"
              offset="4"
            >
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  class="show-on-hover"
                  size="x-small"
                  variant="text"
                  @click.stop
                >
                  <v-icon size="18" icon="mdi-plus" />
                </v-btn>
              </template>

              <v-list density="compact" size="small">
                <v-list-item
                  prepend-icon="mdi-file-plus"
                  @click="openAddDialog(item)"
                >
                  <v-list-item-title class="pr-2">New File</v-list-item-title>
                </v-list-item>
                <v-list-item
                  prepend-icon="mdi-folder-plus"
                  @click="openAddFolderDialog(item)"
                >
                  <v-list-item-title class="pr-2">New Folder</v-list-item-title>
                </v-list-item>
                <v-list-item
                  prepend-icon="mdi-upload"
                  @click="triggerImageUpload(item)"
                >
                  <v-list-item-title class="pr-2"
                    >File upload</v-list-item-title
                  >
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </template>
      </v-treeview>
    </div>

    <v-menu
      v-model="contextMenu.show"
      :style="{
        position: 'absolute',
        left: contextMenu.x + 'px',
        top: contextMenu.y + 'px',
      }"
      absolute
      offset-y
      min-width="0"
    >
      <v-sheet class="pa-1">
        <v-btn
          size="small"
          class="font-weight-bold"
          prepend-icon="mdi-trash-can"
          @click="executeDelete"
        >
          삭제
        </v-btn>
      </v-sheet>
    </v-menu>
  </v-card>
  <!-- 다이얼로그 -->
  <v-dialog v-model="addDialog" max-width="420" persistent>
    <v-card>
      <v-card-title class="text-subtitle-1"> 파일 생성 </v-card-title>
      <v-form ref="form" v-model="formValid" @submit.prevent="confirmAdd">
        <v-card-text>
          <v-text-field
            ref="nameField"
            v-model="newFileName"
            label="파일명"
            density="compact"
            variant="outlined"
            :rules="fileRules"
            validate-on="input"
          />
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            size="small"
            color="primary"
            type="submit"
            :disabled="!formValid"
            >추가</v-btn
          >
          <v-btn size="small" variant="text" @click="cancelAdd">취소</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
  <!-- 이미지 다이얼로그 -->
  <v-dialog v-model="imgDialog" persistent min-width="150" max-width="700">
    <v-card :subtitle="dImageFileName" title="IMAGE PREVIEW">
      <div
        class="px-4 pb-2 d-flex align-center justify-center"
        style="width: 100%"
      >
        <img
          :src="previewImgSrc"
          style="max-height: 80vh; max-width: 100%; object-fit: contain"
        />
      </div>
      <v-card-actions class="justify-end">
        <v-btn text="닫기" @click="cancelImgPreviewAdd()"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- 폴더 추가 다이얼로그 -->
  <v-dialog v-model="addFolderDialog" max-width="420" persistent>
    <v-card>
      <v-card-title class="text-subtitle-1"> 폴더 생성 </v-card-title>
      <v-form
        ref="folderForm"
        v-model="folderFormValid"
        @submit.prevent="confirmAddFolder"
      >
        <v-card-text>
          <v-text-field
            v-model="newFolderName"
            label="폴더명"
            density="compact"
            variant="outlined"
            hide-details="auto"
            :rules="folderRules"
            validate-on="input"
            autofocus
          />
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            size="small"
            color="primary"
            type="submit"
            :disabled="!folderFormValid"
          >
            추가
          </v-btn>
          <v-btn size="small" variant="text" @click="cancelAddFolder"
            >취소</v-btn
          >
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
  <input
    type="file"
    ref="fileInput"
    style="display: none"
    accept=".csv,.json,.txt,.js,image/*"
    @change="handleFileUpload"
  />
  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    :timeout="3000"
    location="top"
  >
    <span style="white-space: pre-line">{{ snackbar.message }}</span>
    <template v-slot:actions>
      <v-btn variant="text" @click="snackbar.show = false">닫기</v-btn>
    </template>
  </v-snackbar>
</template>

<style scoped>
.devTreeView .v-list-item-title {
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 22px;
  text-transform: none;
  color: #cccccc;
}

:deep(.v-list-item) {
  min-height: 22px !important; /* VS Code row height */
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  border-radius: 0 !important;
}
:deep(.v-list-item:hover) {
  background-color: rgba(var(--v-theme-on-surface), 0.08) !important;
}
:deep(.v-list-item--active) {
  background-color: rgba(
    var(--v-theme-primary),
    0.15
  ) !important; /* Selection color */
  color: rgba(var(--v-theme-on-surface), 1) !important;
}
:deep(.v-list-item-title) {
  font-size: 13px;
}
:deep(.v-icon) {
  font-size: 16px;
  color: rgba(var(--v-theme-on-surface), 0.7);
}
/* Scrollbar Customization */
.custom-scrollbar::-webkit-scrollbar {
  width: 10px;
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: transparent; /* Hidden by default */
  border-radius: 0px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background: #424242; /* Show on hover */
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #4f4f4f; /* Lighter on active hover */
}

.tree-item-title {
  cursor: pointer;
  padding: 0 4px;
  border-radius: 4px;
  width: 100%;
}

.drag-target-text {
  background-color: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  outline: 1px dashed #22c55e;
}

.drag-target-icon {
  color: #22c55e !important;
  transform: scale(1.1);
  transition: transform 0.2s;
}
</style>
