// ~/stores/appStore.js
import { reactive } from "vue";

const state = reactive({
  myApps: [],
  selectedAppIndexes: [],
});

export function useAppStore() {
  return {
    state,

    // 현재 실행 중인 앱 목록
    get activeApps() {
      return state.selectedAppIndexes.map((i) => state.myApps[i]);
    },

    // 앱 목록 설정
    setMyApps(list) {
      state.myApps = list;
    },

    // 앱 선택 토글
    toggleSelection(index) {
      const i = state.selectedAppIndexes.indexOf(index);
      if (i === -1) {
        state.selectedAppIndexes.push(index);
      } else {
        state.selectedAppIndexes.splice(i, 1);
      }
    },

    clearSelection(index) {
      const i = state.selectedAppIndexes.indexOf(index);
      if (i !== -1) {
        state.selectedAppIndexes.splice(i, 1);
      }
    },

    clearAllSelections() {
      state.selectedAppIndexes = [];
    },
    isAppActive(appcode) {
      return true;
    },
  };
}
