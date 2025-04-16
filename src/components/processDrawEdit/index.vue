<!--
 * @Author: Strayer
 * @Date: 2025-04-15
 * @LastEditors: Strayer
 * @LastEditTime: 2025-04-15
 * @Description: 
 * @FilePath: \processDraw\src\components\processDrawEdit\index.vue
-->

<template>
  <div class="demo">
    <div :ondrop="dropHandle" :ondragover="(e: any) => e.preventDefault()" style="border: 1px solid #ff0;">
      <canvas
        id="container"
        style="
          width: 100%;
          height: 100%;"
      />
    </div>
    <IconPanel />
  </div>
</template>

<script setup lang="ts">
import { Renderer } from '@antv/g-canvas';
import { Canvas, Image, FederatedEvent } from '@antv/g';
import { onMounted } from 'vue';
import { addNode1, addNode2, addLine, addWheel, moveCamera } from './';
import interact from 'interactjs';
import { createImgEntity, addDragToImgGroup } from './comm';

import IconPanel  from './iconPanel.vue';
import { initData, moveCameraWhenDrag } from './data';

onMounted(() => {
  initData();
  initCanvas();
})

function dropHandle(event:any) {
  // layerX
  console.log('%c [ event ]-41', 'font-size:13px; background:#0b8fcd; color:#4fd3ff;', event);
  event.preventDefault();
  const data = event.dataTransfer.getData('Text');
  console.log('%c [ data ]-43', 'font-size:13px; background:#7529a8; color:#b96dec;', data);
}

async function  initCanvas() {
  // TODO:实例化渲染器和画布
  const renderer = new Renderer();
  const dom = document.getElementById('container')!;
  const canvas = new Canvas({
    canvas: dom as any, // DOM 节点id
    renderer,
  });

  await canvas.ready;

  // TODO:添加节点和边
  const node1 = addNode1();
  const edge = addLine();
  const node2 = addNode2();
  canvas.appendChild(node1);
  canvas.appendChild(node2);
  canvas.appendChild(edge);

//   node1.addEventListener(
//     'click',
//     (e: FederatedEvent) => {
//         console.log(node1.getPosition()); // e.CAPTURING_PHASE
//         console.log(node1.getLocalTransform()); // e.CAPTURING_PHASE

//     },
//     { capture: true },
// );

  const imageEntity = createImgEntity(canvas, {
    x: 600,
    y: 200,
    width: 200,
    height: 200,
    src: '/static/processDrawEdit/njsg.png',
  })

  canvas.appendChild(imageEntity);

  // TODO:使用 interact.js 实现节点拖拽
  addDragToImgGroup(canvas, node1);
  addDragToImgGroup(canvas, node2);

  // TODO:使用鼠标滚轮实现相机缩放
  addWheel(canvas);

  // TODO: 使用 hammer.js 实现相机移动
  moveCamera(canvas);
  
}
</script>

<style scoped>
.demo {
  position: relative;
  margin: 0 auto;
  width: 96vw;
  height: 96vh;
}
</style>
.