<!--
 * @Author: Strayer
 * @Date: 2025-04-15
 * @LastEditors: Strayer
 * @LastEditTime: 2025-04-23
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
    <!-- 元件面板 -->
    <IconPanel :canvas="canvas" @submitDrawing="submitDrawing" />
    <!-- 属性面板 -->
    <Attr />
  </div>
</template>

<script setup lang="ts">
import { Renderer } from '@antv/g-canvas';
import { Canvas, DisplayObject } from '@antv/g';
import { onMounted, shallowRef, watch, onBeforeUnmount } from 'vue';
import { createImgEntity, imgDropHandle,addWheel, moveCamera, createLine, createText, deleteElement, imgToDataItem, lineToDataItem, textToDataItem, client2Canvas } from './comm';
import Attr from './attr.vue'
import {type ImgDataItem, type lineDataItem, type PanelImgType, type TextDataItem } from './dataType';
import { v4 as uuidv4 } from 'uuid';

import IconPanel  from './iconPanel.vue';
import { chooseDevice, copySource, imgPadding, initData, panelData } from './data';

(window as any).__g_instances__ = [];

const props = defineProps<{
  canvasData: {
    imgData: ImgDataItem [];
    lineData: lineDataItem [];
    textData: TextDataItem [];
  },
  deviceData: PanelImgType [];
}>();

const emit = defineEmits<{
  (e: 'submit', value: {
    imgData: ImgDataItem [];
    lineData: lineDataItem [];
    textData: TextDataItem [];
  }): void;
}>();



onMounted(() => {
  initData();
  initCanvas();
  
  // 键盘按下事件
  document.addEventListener('keydown', keyDownHandle);
  // 鼠标移动事件
  document.addEventListener('mousemove', mouseMoveHandle);
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', keyDownHandle);
  document.removeEventListener('mousemove', mouseMoveHandle);
})

watch(() => props.deviceData, (val) => {
  panelData.value = val;
}, { immediate: true  })

const canvas = shallowRef<Canvas>()

/**
 * @description: 初始化画布
 */
async function  initCanvas() {
  // 实例化渲染器和画布
  const renderer = new Renderer();
  const dom = document.getElementById('container')!;
  canvas.value = new Canvas({
    canvas: dom as any, // DOM 节点id
    renderer,
  });

  await canvas.value.ready;

  (window as any).__g_instances__.push(canvas);

  // 阻止默认的右键菜单
  canvas.value!.getContextService()!.getDomElement()!.addEventListener('contextmenu', (e) => {
      e.preventDefault();
  });

  // 使用鼠标滚轮实现相机缩放
  addWheel(canvas.value);

  // 使用 hammer.js 实现相机移动
  moveCamera(canvas.value);

  // 渲染数据
  watch(() => props.canvasData, () => {
    renderData();
  }, { immediate: true })
}

/**
 * @description: 渲染外部数据
 */
function  renderData() {
  for(const item of props.canvasData.imgData) {
    createImgEntity(canvas.value!, JSON.parse(JSON.stringify(item)))
  }
  for(const item of props.canvasData.lineData) {
    createLine(canvas.value!, JSON.parse(JSON.stringify(item)))
  }
  for(const item of props.canvasData.textData) {
    createText(canvas.value!, JSON.parse(JSON.stringify(item)))
  }
}

/**
 * @description: 提交画布数据
 */
function submitDrawing() {
  console.log('提交绘图');
  const imgEntities = (canvas.value?.document.documentElement.children.filter(item => item.name === 'imgBox') as DisplayObject []) ?? [];
  const lineEntities = (canvas.value?.document.documentElement.children.filter(item => item.name === 'line') as DisplayObject []) ?? [];
  const textEntities = (canvas.value?.document.documentElement.children.filter(item => item.name === 'textBox') as DisplayObject []) ?? [];

  const resData = {
    imgData: imgEntities.map(item => imgToDataItem(item)),
    lineData: lineEntities.map(item => lineToDataItem(item)),
    textData: textEntities.map(item => textToDataItem(item)),
  }

  emit('submit', resData);
}

/**
 * @description: 随时记录鼠标信息
 */
// 最后一次鼠标信息
const lastMouseEvent = shallowRef<MouseEvent>()
function mouseMoveHandle(event: MouseEvent) {
  lastMouseEvent.value = event;
}

/**
 * @description: 键盘按下事件
 */
function  keyDownHandle(event: KeyboardEvent) {
  console.log('%c [ event ]-230', 'font-size:13px; background:#9897c7; color:#dcdbff;', event);
  if(event.code === 'Delete') {
    // 删除
    if(['imgBox', 'line', 'textBox'].includes(chooseDevice.value?.name ?? '')) {
      deleteElement(canvas.value!, chooseDevice.value?.id ?? '')
    }
  } else if(event.code === 'KeyC' && event.ctrlKey) {
    // 复制
    if(chooseDevice.value) copySource.value = chooseDevice.value;
  } else if(event.code === 'KeyV' && event.ctrlKey) {
    // 粘贴
    if(copySource.value?.name === 'imgBox') {
      const newElement = imgToDataItem(copySource.value);
      newElement.id = uuidv4();

      const point = client2Canvas(canvas.value!, [lastMouseEvent.value?.clientX ?? 0, lastMouseEvent.value?.clientY ?? 0])
      newElement.coord = [point.x, point.y];
      
      createImgEntity(canvas.value!, newElement)
    } else if(copySource.value?.name === 'line') {
      const newElement = lineToDataItem(copySource.value);
      newElement.id = uuidv4();

      const point = client2Canvas(canvas.value!, [lastMouseEvent.value?.clientX ?? 0, lastMouseEvent.value?.clientY ?? 0])
      const originBeginPoint = newElement.coord[0];
      const offset = [point.x - originBeginPoint[0], point.y - originBeginPoint[1]];
      newElement.coord = newElement.coord.map( item => [item[0] + offset[0], item[1] + offset[1]])
      
      createLine(canvas.value!, newElement)
    } else if(copySource.value?.name === 'textBox') {
      const newElement = textToDataItem(copySource.value);
      newElement.id = uuidv4();

      const point = client2Canvas(canvas.value!, [lastMouseEvent.value?.clientX ?? 0, lastMouseEvent.value?.clientY ?? 0])
      newElement.coord = [point.x, point.y];
      
      createText(canvas.value!, newElement)
    }
  }
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