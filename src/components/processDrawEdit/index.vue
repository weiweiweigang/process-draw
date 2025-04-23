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
import { createImgEntity, imgDropHandle,addWheel, moveCamera, createLine, createText, deleteElement } from './comm';
import Attr from './attr.vue'
import {type ImgDataItem, type lineDataItem, type PanelImgType, type TextDataItem } from './dataType';

import IconPanel  from './iconPanel.vue';
import { chooseDevice, imgPadding, initData, panelData } from './data';

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
  
  document.addEventListener('keydown', keyDownHandle);
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', keyDownHandle);
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
    createImgEntity(canvas.value!, item)
  }
  for(const item of props.canvasData.lineData) {
    createLine(canvas.value!, item)
  }
  for(const item of props.canvasData.textData) {
    createText(canvas.value!, item)
  }
}

/**
 * @description: 提交画布数据
 */
function submitDrawing() {
  console.log('提交绘图');
  const imgEntities = (canvas.value?.document.documentElement.children.filter(item => item.name === 'imgBox') as DisplayObject []) ?? [];
  const lineEntities = canvas.value?.document.documentElement.children.filter(item => item.name === 'line') ?? [];
  const textEntities = canvas.value?.document.documentElement.children.filter(item => item.name === 'textBox') ?? [];

  // 这里可以实现提交逻辑
  // 组装图片元件数据
  const imgData: any [] = [];
  for(const item of imgEntities) {
    const rectEntity = item.querySelector('.imgBox__rect') as DisplayObject;

    const itemObj: ImgDataItem = {
      id: item.id,
      key: item.getAttribute('data-imgKey'),
      width: rectEntity.style.width - imgPadding * 2,
      height: rectEntity.style.height - imgPadding * 2,
      coord: [
        item.getLocalPosition()[0] + rectEntity.style.width / 2, 
        item.getLocalPosition()[1] + rectEntity.style.height / 2
      ],
      rotate: (item.querySelector('.imgBox__inner') as DisplayObject).getLocalEulerAngles(),
    }

    if(item.classList[1] === 'pathEntityBox') {
      itemObj.color = item.querySelector('.imgBox__path')?.style.fill ?? '';
      itemObj.scale = (item.querySelector('.imgBox__path') as DisplayObject).getLocalScale()[0]
    }
    imgData.push(itemObj);
  }

  // 组装管道数据
  const lineData: any [] = [];
  for(const item of lineEntities) {
    const itemObj: lineDataItem = {
      id: item.id,
      angle90: item.getAttribute('data-angle90'),
      coord: item.style.points,
      
      style: {
        stroke: item.style.stroke,
        lineWidth: item.style.lineWidth,
        lineJoin: item.style.lineJoin,
        lineCap: item.style.lineCap,
        isDash: item.style.lineDash? 1 : 0,
        dashLen: (item.style.lineDash as any)?.[0],
        dashGap: (item.style.lineDash as any)?.[1],
      }
    }
    lineData.push(itemObj);
  }

  // 组装文字数据
  const textData: any [] = [];
  for(const item of textEntities) {
    const rectEntity = item.querySelector('.textBox__rect') as DisplayObject;
    const textEntity = item.querySelector('.textBox__text') as DisplayObject;

    const itemObj: TextDataItem = {
      id: item.id,
      coord: [
        (item as DisplayObject).getLocalPosition()[0] + rectEntity.style.width / 2, 
        (item as DisplayObject).getLocalPosition()[1] + rectEntity.style.height / 2,
      ],
      box: {
        width: rectEntity.style.width,
        height: rectEntity.style.height,
        fill: rectEntity.style.fill,
        lineWidth: rectEntity.style.lineWidth,
        stroke: rectEntity.style.stroke,
        radius: rectEntity.style.radius,
      },
      text: {
        text: textEntity.style.text,
        fontSize: textEntity.style.fontSize,
        fill: textEntity.style.fill,
        fontWeight: textEntity.style.fontWeight,
        textAlign: textEntity.style.textAlign,
        lineHeight: textEntity.style.lineHeight,
        letterSpacing: textEntity.style.letterSpacing,
        dx: textEntity.style.dx,
        dy: textEntity.style.dy,
      }
    }
    itemObj.box.width -= itemObj.text.dx * 2;
    itemObj.box.height -= itemObj.text.dy * 2;
    textData.push(itemObj);
  }
  const resData = {
    imgData,
    lineData,
    textData,
  }

  emit('submit', resData);
}

/**
 * @description: 键盘按下事件
 */
function  keyDownHandle(event: KeyboardEvent) {
  if(event.code === 'Delete') {
    if(['imgBox', 'line', 'textBox'].includes(chooseDevice.value?.name ?? '')) {
      deleteElement(canvas.value!, chooseDevice.value?.id ?? '')
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