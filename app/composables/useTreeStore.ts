import { ref } from 'vue'
import JSZip from "jszip";


export type Node = {
  title: string
  file?: string
  disabled?: boolean
  children?: Node[]
  isRoot?: boolean;
  isLocal?: boolean;
  blobUrl?: string;
  path?: string; // 전체 경로
  size?: string;
}

const items = ref<Node[]>([])
const blobMap = ref<Record<string, string>>({});

const selectedAppData = ref({ id: '', appId: '', appNm: '', type: '', isApproved: false });
const selectedAppVrsnData = ref<any>(null);

const IMG_RE = /\.(png|jpe?g|gif|webp|svg|bmp|ico)$/i;

if (import.meta.client) {
  const saved = sessionStorage.getItem('LAST_SELECTED_APP');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      selectedAppData.value = {
        id: parsed.id || '',
        appId: parsed.appId || '',
        appNm: parsed.appNm || '',
        type: parsed.type || 'develop',
        isApproved: parsed.isApproved ?? false
      };
    } catch (e) {
      console.error("저장된 앱 데이터를 불러오는데 실패했습니다.", e);
    }
  }
}

function registerBlobUrl(filename: string, content: Blob | File | string) {
  if (blobMap.value[filename]) {
    URL.revokeObjectURL(blobMap.value[filename]);
  }

  let blob: Blob;
  if (typeof content === 'string') {
    blob = new Blob([content], { type: 'text/plain' });
  } else {
    blob = content;
  }

  const url = URL.createObjectURL(blob);
  blobMap.value[filename] = url;
  return url;
}

function removeByPath(root: Node[], pathToRemove: string): Node[] {
  return root
    .filter(n => {
      const currentPath = n.path || n.title;
      return currentPath !== pathToRemove;
    })
    .map(n => n.children ? { ...n, children: removeByPath(n.children, pathToRemove) } : n);
}

function findFirstVueFile(nodes: Node[]): Node | null {
  for (const node of nodes) {
    if (node.children && node.children.length > 0) {
      const childVue = findFirstVueFile(node.children);
      if (childVue) return childVue;
    } else if (node.title.endsWith(".vue")) {
      return node;
    }
  }
  return null;
}

function removeByTitle(root: Node[], title: string): Node[] {
  return root.filter(n => n.title !== title).map(n => n.children ? { ...n, children: removeByTitle(n.children, title) } : n);
}

async function addNodeToZip(zip: JSZip, node: Node, replStoreValue: any, appId: string) {

  if (!node.file) {
    console.log(`[Zip] 폴더 생성: ${node.title}`);
    const folder = zip.folder(node.title); // ZIP 내부에 폴더 생성

    if (folder && node.children && node.children.length > 0) {
      for (const child of node.children) {
        // 하위 자식들을 해당 폴더(folder) 안에 생성하도록 재귀 호출
        await addNodeToZip(folder, child, replStoreValue, appId);
      }
    }
  }
  // 2. 파일인 경우 (node.file이 있는 경우)
  else {
    const storageKey = node.path || node.title;
    const filename = node.title;
    const isImage = IMG_RE.test(filename);
    let content: any = null;

    try {
      if (isImage) {
        const url = (node.isLocal && node.blobUrl) ? node.blobUrl : `/api/apps/file/${appId}/${selectedAppData.value.type}/${storageKey}`;
        const res = await fetch(url, { credentials: "include" });
        if (res.ok) content = await res.blob();
      } else {
        // 스토어 우선 확인 (path 기준)
        const fileInStore = replStoreValue?.files[storageKey] ||
          replStoreValue?.files[filename] ||
          replStoreValue?.files[`src/${storageKey}`];

        if (fileInStore) {
          content = fileInStore.code;
        } else if (node.isLocal && blobMap.value[storageKey]) {
          const res = await fetch(blobMap.value[storageKey]);
          content = await res.text();
        } else {
          const fetchUrl = `/api/apps/file/${appId}/${selectedAppData.value.type}/${storageKey}`;
          const res = await fetch(fetchUrl, { credentials: "include" });
          if (res.ok) content = await res.text();
        }
      }

      if (content !== null && content !== undefined) {
        zip.file(filename, content);
        console.log(`[Zip] 파일 추가 완료: ${filename}`);
      }
    } catch (e) {
      console.error(`[Zip Error] ${filename} 처리 중 오류:`, e);
    }
  }
}

async function downloadZipFiles() {
  const zip = new JSZip();
  const replStore = useState<any>("repl-store");
  const replStoreValue = replStore.value;

  // selectedAppData에서 appId 추출
  const appId = selectedAppData.value?.appId || 'default';

  for (const node of items.value) {
    // APP 폴더 제외 및 appId 전달
    await addNodeToZip(zip, node, replStoreValue, appId);
  }

  let zipFileName = "project.zip";
  const firstVueNode = findFirstVueFile(items.value);
  if (firstVueNode) zipFileName = firstVueNode.title.replace(/\.\w+$/, ".zip");

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.body.appendChild(document.createElement("a"));
  a.href = url;
  a.download = zipFileName;
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function useTreeStore() {

  function removeTitle(pathToRemove: string) {
    if (blobMap.value[pathToRemove]) {
      URL.revokeObjectURL(blobMap.value[pathToRemove]);
      delete blobMap.value[pathToRemove];
    }
    items.value = removeByPath(items.value, pathToRemove);
  }

  function setInitialItems(newItems: Node[]) {
    items.value = newItems;
  }

  return {
    items,
    removeTitle,
    setInitialItems,
    downloadZipFiles,
    blobMap,
    selectedAppData,
    selectedAppVrsnData,
    registerBlobUrl
  }
}