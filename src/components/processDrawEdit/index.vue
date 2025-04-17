<!--
 * @Author: Strayer
 * @Date: 2025-04-15
 * @LastEditors: Strayer
 * @LastEditTime: 2025-04-17
 * @Description: 
 * @FilePath: \processDraw\src\components\processDrawEdit\index.vue
-->

<template>
  <div class="demo">
    <div 
      :ondrop="(e: any) => imgDropHandle(canvas!, e)" 
      :ondragover="(e: any) => e.preventDefault()" 
      style="border: 1px solid #ff0; width: 100%; height: 100%;"
    >
      <canvas
        id="container"
        style="
          width: 100%;
          height: 100%;"
      />
    </div>
    <IconPanel :canvas="canvas"/>
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
import { initData } from './data';

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

  // 阻止默认的右键菜单
  canvas.value!.getContextService()!.getDomElement()!.addEventListener('contextmenu', (e) => {
      e.preventDefault();
  });

  // 使用鼠标滚轮实现相机缩放
  addWheel(canvas.value);

  // 使用 hammer.js 实现相机移动
  moveCamera(canvas.value);

  // console.log('%c [ canvas.getCamera().getPosition() ]-110', 'font-size:13px; background:#3d6a2b; color:#81ae6f;', canvas.getCamera().getPosition());
  // console.log(canvas.getConfig().width)
}
</script>

<style>
#antVGContextMenu {
  .context-menu {
    background: white;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    padding: 5px 0;
    min-width: 150px;
    font-family: 'Arial', sans-serif;
    font-size: 14px;
  }
  .context-menu__item {
    padding: 8px 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    color: #333;
    transition: background-color 0.2s;
  }
  .context-menu__item:hover {
    background-color: #f0f0f0;
  }
  .context-menu__icon {
    margin-right: 8px;
    font-style: normal;
  }
  .context-menu__divider {
    height: 1px;
    background-color: #e0e0e0;
    margin: 5px 0;
  }
}
</style>

<style scoped>
.demo {
  position: relative;
  margin: 0 auto;
  width: 96vw;
  height: 96vh;
}
</style>
.