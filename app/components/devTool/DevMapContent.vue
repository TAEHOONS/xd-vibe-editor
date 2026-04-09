<script setup lang="ts">
import { ref, onMounted } from "vue";

const canvas_id = ref("egisEngine");

onMounted(async () => {
  const tryInit = () => {
    const Module = (window as any).Module;
    if (Module && typeof Module.initialize === "function") {
      Module.initialize({
        container: document.getElementById("egisEngine"), // id="egisEngine"과 연결
        terrain: {
          dem: {
            url: "https://3dmap.egiscloud.com",
            name: "dem",
            encoding: false,
            servername: "XDServer",
          },
          image: {
            url: "https://basemap.egiscloud.com",
            name: "EGIS_hMap_World",
            servername: "XDServer",
          },
        },
        worker: {
          use: false,
          path: "./worker/XDWorldWorker.js",
          count: 5,
        },
        defaultKey: "dJe!e!iaEpHmEpCrD5QpEQf2#FBrdzDmd(BQDQEQDJdaE(iB",
      });
    } else if (Module && Module.onRuntimeInitialized !== undefined) {
      Module.onRuntimeInitialized = () => {
        // 실제 초기화 코드
      };
    } else {
      setTimeout(tryInit, 100);
    }
  };
  tryInit();
});
</script>
<template>
  <div>
    <div :id="canvas_id"></div>
  </div>
</template>
<style>
#egisEngine {
  width: 100%;
  height: 100%;
  position: absolute;
  padding: 0;
  margin: 0;
  border: 0px;
}
#canvas {
  width: 100%;
  height: 100%;
}
</style>
