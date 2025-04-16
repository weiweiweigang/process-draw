<!--
 * @Author: Strayer
 * @Date: 2025-04-15
 * @LastEditors: Strayer
 * @LastEditTime: 2025-04-16
 * @Description: 
 * @FilePath: \processDraw\src\components\processDrawEdit\index.vue
-->

<template>
  <div class="demo">
    <div style="position: absolute; top: 10px; right: 10px;">
      <button @click="createLine(canvas!);">画实线</button>
      <button @click="createLine(canvas!, { lineDash: [4, 4] })">画虚线</button>

    </div>
    <div 
      :ondrop="(e: any) => imgDropHandle(canvas!, e)" 
      :ondragover="(e: any) => e.preventDefault()" 
      style="border: 1px solid #ff0;"
    >
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
import { onMounted, shallowRef } from 'vue';
import { addNode1, addNode2, addLine, addWheel, moveCamera,  } from './';
import interact from 'interactjs';
import { createImgEntity, imgDropHandle, createLine } from './comm';

import IconPanel  from './iconPanel.vue';
import { initData, moveCameraWhenDrag, panelData } from './data';

onMounted(() => {
  initData();
  initCanvas();
})

const canvas = shallowRef<Canvas>()

async function  initCanvas() {
  // 实例化渲染器和画布
  const renderer = new Renderer();
  const dom = document.getElementById('container')!;
  canvas.value = new Canvas({
    canvas: dom as any, // DOM 节点id
    renderer,
  });

  await canvas.value.ready;

  // 使用鼠标滚轮实现相机缩放
  addWheel(canvas.value);

  // 使用 hammer.js 实现相机移动
  moveCamera(canvas.value);

  // console.log('%c [ canvas.getCamera().getPosition() ]-110', 'font-size:13px; background:#3d6a2b; color:#81ae6f;', canvas.getCamera().getPosition());
  // console.log(canvas.getConfig().width)
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