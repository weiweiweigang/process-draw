<!--
 * @Author: Strayer
 * @Date: 2025-04-15
 * @LastEditors: Strayer
 * @LastEditTime: 2025-05-07
 * @Description: 
 * @FilePath: \processDraw\src\components\processDrawEdit\index.vue
-->

<template>
  <div class="processDrawEdit">
    <div 
      :ondrop="(e: any) => canvasOutBoxDropHandle(canvas!, e)" 
      :ondragover="(e: any) => e.preventDefault()" 
      style="
          width: 100%;
          height: 100%;"
    >
      <canvas
        id="container"
        style="
          width: 100%;
          height: calc(100% - 12px);"
      />
    </div>
    <!-- 元件面板 -->
    <IconPanel
      v-if="!disableEdit"
      :canvas="canvas"
      @submitDrawing="submitDrawing"
    />
    <!-- 属性面板 -->
    <Attr 
      v-if="!disableEdit" 
      :canvas="canvas"
    />
  </div>
</template>

<script setup lang="ts">
import { Renderer } from '@antv/g-canvas';
import { Canvas } from '@antv/g';
import { onMounted, shallowRef, watch, onBeforeUnmount } from 'vue';
import { createImgReal, canvasOutBoxDropHandle, addWheel, moveCamera, createLineReal, createTextReal, removeElHandle, pasteElHandle } from './comm';
import Attr from './attr.vue'
import { type ImgDataItem, type LineDataItem, type PanelImgType, type TextDataItem } from './dataType';

import IconPanel  from './iconPanel.vue';
import { canvasDataRef, chooseDevice, copySource, disableEdit, emitRef, initData, isCreateLine, panelData, retreatAndAdvance, serverData, updateDisableEdit } from './data';
import { clone } from 'remeda';

(window as any).__g_instances__ = [];

const props = defineProps<{
  canvasData: {
    imgData: ImgDataItem [];
    lineData: LineDataItem [];
    textData: TextDataItem [];
  },
  camera?: {
    zoom: number;
    position: [number,  number, number];
  },
  deviceData: PanelImgType [];
  dataBoxData?: {[key: string]: any};
  disable?: boolean; // 是否禁止编辑
}>();

const emit = defineEmits<{
  (e: 'submit', value: {
    canvasData: {
      imgData: ImgDataItem [];
      lineData: LineDataItem [];
      textData: TextDataItem [];
    },
    camera: {
      zoom: number;
      position: [number,  number, number];
    }
  }): void;
  (e: 'deviceClick', value: {device: ImgDataItem, event: MouseEvent}): void;
}>();

emitRef.value = emit

onMounted(() => {
  initData();
  initCanvas();
  
  // 键盘按下事件
  document.addEventListener('keydown', keyDownHandle);
  // 鼠标移动事件
  document.addEventListener('mousemove', mouseMoveHandle);
})

onBeforeUnmount(() => {
  canvas.value?.destroy();
  document.removeEventListener('keydown', keyDownHandle);
  document.removeEventListener('mousemove', mouseMoveHandle);
})

watch(() => props.disable, (val) => {
  updateDisableEdit(val ?? false);
}, { immediate: true });
watch(() => props.deviceData, (val) => {
  panelData.value = val;
}, { immediate: true  })
watch(() => props.dataBoxData, (val) => {
  serverData.value = val ?? {};
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

  // 初始化画布等级和位置
  watch(() => props.camera, () => {
    if(props.camera) {
      canvas.value?.getCamera().setPosition(props.camera.position);
      canvas.value?.getCamera().setZoomByViewportPoint(props.camera.zoom, [canvas.value.getConfig().width! / 2, canvas.value.getConfig().height! / 2])
    }
  }, { immediate: true })

  // 使用鼠标滚轮实现相机缩放
  addWheel(canvas.value);

  // 使用 hammer.js 实现相机移动
  moveCamera(canvas.value);

  // 渲染数据
  watch(() => props.canvasData, () => {
    canvasDataRef.value = {
      imgData: props.canvasData.imgData.map(item => ({ ...clone(item), editType: {} })),
      lineData: props.canvasData.lineData.map(item => ({ ...clone(item), editType: {} })),
      textData: props.canvasData.textData.map(item => ({ ...clone(item), editType: {} })),
    };
    initData();
    canvas.value?.destroyChildren();
    renderData();
  }, { immediate: true })
}

/**
 * @description: 渲染外部数据
 */
function  renderData() {
  for(const item of canvasDataRef.value.lineData) {
    if(item.editType.isRemove) continue;

    createLineReal(canvas.value!, JSON.parse(JSON.stringify(item)))
  }
  for(const item of canvasDataRef.value.imgData) {
    if(item.editType.isRemove) continue;

    createImgReal(canvas.value!, JSON.parse(JSON.stringify(item)))
  }
  for(const item of canvasDataRef.value.textData) {
    if(item.editType.isRemove) continue;

    createTextReal(canvas.value!, JSON.parse(JSON.stringify(item)))
  }
}

/**
 * @description: 提交画布数据
 */
function submitDrawing() {
  console.log('提交绘图');

  emit('submit', {
    canvasData: canvasDataRef.value,
    camera: {
      zoom: canvas.value!.getCamera().getZoom(),
      position: canvas.value!.getCamera().getPosition() as any,
    }
  });
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
  if(event.code === 'Delete') {
    // 删除
    if(['imgData', 'lineData', 'textData'].includes(chooseDevice.value?.type ?? '')) {
      removeElHandle(canvas.value!, chooseDevice.value?.id ?? '')
    }
  } else if(event.code === 'KeyC' && event.ctrlKey) {
    // 复制
    if(chooseDevice.value) copySource.value = chooseDevice.value;
  } else if(event.code === 'KeyV' && event.ctrlKey) {
    // 粘贴
    pasteElHandle(canvas.value!, lastMouseEvent.value!)
  } else if(event.code === 'KeyZ' && event.ctrlKey) {
    // 撤回
    if(isCreateLine.value) retreatAndAdvance.value.retreatCurrentLine();
    else retreatAndAdvance.value.retreatOneStep(canvas.value!);
  } else if(event.code === 'KeyY' && event.ctrlKey) {
    // 前进
    if(!isCreateLine.value) retreatAndAdvance.value.advanceOneStep(canvas.value!);
  }
}

defineExpose({ renderData, canvas })
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
.processDrawEdit {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
.