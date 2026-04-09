export default {
  async install(app) {
    // [HMR 지원] 항상 설치 시도 (단, 스크립트 중복 로딩은 아래에서 방지됨)
    // window.__XDWorld_Plugin_Installed__ 체크 제거하여 매번 "등록되었습니다" 메시지 출력 유도

    if (!window._XDWorldEM_loaded) {
      await new Promise((resolve, reject) => {
        // 이미 스크립트 태그가 있는지 확인
        if (document.querySelector('script[src*="XDWorldEM.js"]')) {
          window._XDWorldEM_loaded = true;
          resolve();
          return;
        }

        const s = document.createElement("script");
        const params = new URLSearchParams(window.location.search);
        const version = params.get("engine");

        s.src = version
          ? `https://cdn.xdworld.kr/${version}/XDWorldEM.js`
          : "https://cdn.xdworld.kr/latest/XDWorldEM.js";

        s.onload = () => {
          window._XDWorldEM_loaded = true;
          resolve();
        };
        s.onerror = (e) => {
          window.__XDWorld_Plugin_Installed__ = false; // 실패 시 플래그 해제
          reject(e);
        };
        document.head.appendChild(s);
      });
    }

    const XDModule = window.Module;
    if (!XDModule) {
      // 아직 모듈이 로드되지 않았을 수 있음 (비동기 로딩 등)
      // 하지만 script onload 후에 실행되므로 통상 여기 도달하면 에러임
      console.error("❌ XDWorldEM 모듈을 찾을 수 없습니다.");
      window.__XDWorld_Plugin_Installed__ = false;
      return;
    }

    app.provide("xdworld", XDModule);
    // 편의를 위해 globalProperties에도 등록
    app.config.globalProperties.$xdworld = XDModule;
    console.log("✅ XDWorldEM 모듈이 Vue 전역에 등록되었습니다.");
    window.__XDWorld_Plugin_Installed__ = true;
  },
};