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
    <canvas
      id="container"
      style="
        width: 100%;
        height: 100%;
"
    />
    <IconPanel />
  </div>
</template>

<script setup lang="ts">
import { Renderer } from '@antv/g-canvas';
import { Canvas, Image } from '@antv/g';
import { onMounted } from 'vue';
import { addNode1, addNode2, addLine, addWheel, moveCamera } from './';
import interact from 'interactjs';

import IconPanel  from './iconPanel.vue';
import { initData, moveCameraWhenDrag } from './data';

onMounted(() => {
  initData();
  initCanvas();
})

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
  canvas.appendChild(node1);
  canvas.appendChild(addNode2());
  canvas.appendChild(edge);

  const image = new Image({
    style: {
      x: 300,
      y: 300,
      width: 200,
      height: 200,
      src: '/static/processDrawEdit/njsg.png',
      cursor: 'pointer',
      // pointerEvents: 'pixels',
    },
  });
  canvas.appendChild(image);

  // TODO:使用 interact.js 实现节点拖拽
  interact(node1 as any, {
  // 直接传入节点1
    context: canvas.document as any, // 传入上下文
  }).draggable({
    onstart: function (event) {
      // 记录下初始位置
      // node1.style.x0 = node1.getLocalPosition()[0];
      // node1.style.y0 = node1.getLocalPosition()[1];
      moveCameraWhenDrag.value = false;
    },
    onmove: function (event) {
      // interact.js 告诉我们的偏移量
      const { dx, dy } = event;
      // 改变节点1位置
      node1.translateLocal(dx, dy);
      // 获取节点1位置
      const [nx, ny] = node1.getLocalPosition();
      // 改变边的端点位置
      edge.style.x1 = nx;
      edge.style.y1 = ny;
    },
    onend: function (event) {
      setTimeout(() => {
        moveCameraWhenDrag.value = true;
      }, 100);
    },
  });

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