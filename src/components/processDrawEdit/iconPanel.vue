<!--
 * @Author: Strayer
 * @Date: 2025-04-15
 * @LastEditors: Strayer
 * @LastEditTime: 2025-04-25
 * @Description: 元件icon面板
 * @FilePath: \processDraw\src\components\processDrawEdit\iconPanel.vue
-->

<template>
  <div class="iconPanel">
    <div class="iconPanel__header">
      <div class="iconPanel__title-row">
        <div class="iconPanel__title-with-help">
          <h3 class="iconPanel__title">元件库</h3>
          <button @click="showHelpDialog" class="iconPanel__button iconPanel__button--help">
            <i class="help-icon">?</i>
          </button>
        </div>
        <div class="iconPanel__title-buttons">
          <button @click="emit('submitDrawing')" class="iconPanel__button iconPanel__button--primary">
            提交
          </button>
          <button @click="clearCanvas" class="iconPanel__button iconPanel__button--danger">
            清空画布
          </button>
          <button @click="togglePanel" class="iconPanel__toggle">
            {{ isPanelCollapsed ? '展开' : '收起' }}
          </button>
        </div>
      </div>
      <div class="iconPanel__tools">
        <button v-if="currentDrawLineType" @click="currentDrawLineType = 0" class="iconPanel__button">
          取消画线
        </button>
        <template v-else>
          <button @click="currentDrawLineType = 1" class="iconPanel__button">
            画直角实线
          </button>
          <button @click="currentDrawLineType = 2" class="iconPanel__button">
            画直角虚线
          </button>
          <button @click="currentDrawLineType = 3" class="iconPanel__button">
            画任意虚线
          </button>
          <button @click="clearCanvas" class="iconPanel__button">
            清空画布
          </button>
        </template>
      </div>
    </div>
    
    <div v-show="!isPanelCollapsed" class="iconPanel__content">
      <div
        class="iconItem"
        draggable="true"
        :ondragstart="(event: any) => dragstart(event, {key: 'text'})"
      >
        <div class="iconItem__image">
          <p>文本内容</p>
        </div>
        <p class="iconItem__label">文字</p>
      </div>

      <div
        class="iconItem"
        draggable="true"
        :ondragstart="(event: any) => dragstart(event, {key: 'dataBox'})"
      >
        <div class="iconItem__image">
          <p>数据框</p>
        </div>
        <p class="iconItem__label">数据框</p>
      </div>
      
      <div 
        v-for="item in panelData" 
        :key="item.key"
        class="iconItem"
        draggable="true"
        :ondragstart="(event: any) => dragstart(event, item)"
      >
        <div class="iconItem__image">
          <svg 
            v-if="item.path"
            class="localSvg" 
            version="1.1" 
            :viewBox="`0 0 ${item.width>100? 100:item.width} ${item.height>100? 100:item.height}`"
            :width="item.width>100? 100:item.width"
            :height="item.height>100? 100:item.height"
            xmlns="http://www.w3.org/2000/svg" 
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <path :fill="item.color ?? '#54BECC'" :stroke="item.stroke ?? 'none'" :d="item.path" />
          </svg>
          <img v-else :src="`${item.img}`" :width="item.width>100? 100:item.width" />
        </div>
        <p class="iconItem__label">{{ item.label }}</p>
      </div>
    </div>
    
    <!-- 帮助弹窗 -->
    <div v-if="isHelpDialogVisible" class="help-dialog-overlay" @click="closeHelpDialog">
      <div class="help-dialog" @click.stop>
        <div class="help-dialog__header">
          <h3>操作说明</h3>
          <button class="help-dialog__close" @click="closeHelpDialog">×</button>
        </div>
        <div class="help-dialog__content">
          <ul class="help-dialog__list">
            <li v-for="(item, index) in helpData" :key="index">
              <strong>{{ index + 1}}. {{ item.title }}：</strong>{{ item.text }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { shallowRef, ref, watch } from 'vue';
import { panelData } from './data';
import { client2Canvas, drawLine } from './comm';
import { Canvas } from '@antv/g';

const props = defineProps<{
  canvas?: Canvas,
}>()

const emit = defineEmits<{
  (e: 'submitDrawing'): void;
}>();

const helpData = shallowRef([
  {
    title: '画布移动和缩放',
    text: '鼠标左键按住画布任意位置拖动和鼠标滚轮缩放'
  },
  {
    title: '添加元件',
    text: '在元件面板上把鼠标放在元件上按住左键不放拖拽到画布上即可'
  },
  {
    title: '添加管道',
    text: '在元件面板顶部单击画线按钮。然后去画布用鼠标左键双击开始画线，单击一次生成一个折线点位。双击结束生成管道'
  },
  {
    title: '删除元件和管道',
    text: '右键元件或管道选择删除（或按键盘的delete键删除选中的元素）'
  },
  {
    title: '移动元件和管道',
    text: '鼠标左键按住元件或管道拖动即可'
  },
  {
    title: '旋转元件',
    text: '鼠标左键按住元件右上角的旋转图标拖动即可'
  },
  {
    title: '缩放元件',
    text: '鼠标左键按住元件右边的小点拖动即可'
  },
  {
    title: '管道节点拖拽',
    text: '点击一下管道，出现管道节点。鼠标左键按住管道节点拖动即可'
  },
  {
    title: '样式修改',
    text: '鼠标左键选中对应元件后，在右上角的样式修改框中修改即可'
  },
  {
    title: '文本添加',
    text: '元件面板上的文字按钮拖动到画布上即可'
  },
  {
    title: '复制粘贴',
    text: '鼠标左键选中对应元件后，ctrl+c复制，然后把鼠标移动到要放置的位置ctrl+v粘贴'
  },
  {
    title: '层级调整',
    text: '鼠标右键菜单选择置顶或置底'
  },
  {
    title: '删除画布上所有元素',
    text: '在元件库面板上点击清空画布按钮'
  }
])

const isPanelCollapsed = ref(false);
const isHelpDialogVisible = ref(false);

function togglePanel() {
  isPanelCollapsed.value = !isPanelCollapsed.value;
}

function showHelpDialog() {
  isHelpDialogVisible.value = true;
}

function closeHelpDialog() {
  isHelpDialogVisible.value = false;
}

function dragstart(event: any, item: any) {
  event.dataTransfer.setData('Text', item.key);  
}

/**
 * @description: 清空画布
 */
function  clearCanvas() {
  props.canvas?.destroyChildren();
}

// 当前画线类型
const currentDrawLineType = ref(0) // 0 不画线 1 画直角实线 2 画直角虚线 3 画任意虚线

watch(() => props.canvas, (val) => {
  if(val) {
    val.addEventListener('click', (event: MouseEvent) => {
      // 双击
      if(event.detail === 2 && currentDrawLineType.value) {
        // 计算坐标
        const point = client2Canvas(props.canvas!, [event.clientX, event.clientY])

        if(currentDrawLineType.value === 1) {
          drawLine(props.canvas!, { coord: [[point.x, point.y]], angle90: true })
        } else if(currentDrawLineType.value === 2) {
          drawLine(props.canvas!, { coord: [[point.x, point.y]], style: { lineDash: [4, 4] }, angle90: true})
        } else if(currentDrawLineType.value === 3) {
          drawLine(props.canvas!, { coord: [[point.x, point.y]], style: { lineDash: [4, 4] } })
        }
      }
    })
  }
}, { immediate: true })

</script>

<style scoped>
.iconPanel {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  width: 380px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.iconPanel__header {
  display: flex;
  flex-direction: column;
  padding: 12px 15px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
}

.iconPanel__title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px dashed #e0e0e0;
}

.iconPanel__title-with-help {
  display: flex;
  align-items: center;
  gap: 8px;
}

.iconPanel__title {
  margin: 0;
  font-size: 16px;
  color: #303133;
  font-weight: 600;
}

/* 帮助按钮样式调整 */
.iconPanel__button--help {
  background-color: #67c23a;
  color: white;
  border-color: #67c23a;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-size: 10px;
}

.iconPanel__title-buttons {
  display: flex;
  gap: 8px;
}

.iconPanel__tools {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-start;
}

/* 通用按钮样式 */
.iconPanel__button {
  background-color: #f2f6fc;
  color: #606266;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.iconPanel__button:hover {
  background-color: #ecf5ff;
  color: #409eff;
}

/* 主要按钮样式 */
.iconPanel__button--primary {
  background-color: #409eff;
  color: white;
  border-color: #409eff;
}

.iconPanel__button--primary:hover {
  background-color: #66b1ff;
  color: white;
}
.iconPanel__button--danger {
  background-color: #f56c6c;
  color: white;
  border-color: #f56c6c;
}
.iconPanel__button--danger:hover {
  background-color: #f78989;
  color: white;
}

.iconPanel__toggle {
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.iconPanel__toggle:hover {
  background-color: #66b1ff;
}

.iconPanel__content {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 15px;
  max-height: 70vh;
  overflow-y: auto;
}

.iconItem {
  width: 90px;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  border-radius: 6px;
  cursor: move;
  transition: all 0.2s ease;
  background-color: #f5f7fa;
  overflow: hidden; /* 添加溢出隐藏 */
}

.iconItem:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #ecf5ff;
}

.iconItem__image {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  width: 100%;
  overflow: hidden;
}

.iconItem__image img,
.iconItem__image svg {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
}

.iconItem__label {
  margin: 6px 0 0;
  font-size: 12px;
  color: #606266;
  text-align: center;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 自定义滚动条样式 */
.iconPanel__content::-webkit-scrollbar {
  width: 6px;
}

.iconPanel__content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.iconPanel__content::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 3px;
}

.iconPanel__content::-webkit-scrollbar-thumb:hover {
  background: #909399;
}

/* 帮助按钮样式 */
.iconPanel__button--help {
  background-color: #67c23a;
  color: white;
  border-color: #67c23a;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.iconPanel__button--help:hover {
  background-color: #85ce61;
  color: white;
}

.help-icon {
  font-style: normal;
  font-weight: bold;
}

/* 帮助弹窗样式 */
.help-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.help-dialog {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  width: 600px;
  max-width: 90vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.help-dialog__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e4e7ed;
}

.help-dialog__header h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.help-dialog__close {
  background: none;
  border: none;
  font-size: 22px;
  color: #909399;
  cursor: pointer;
}

.help-dialog__close:hover {
  color: #409eff;
}

.help-dialog__content {
  padding: 20px;
  overflow-y: auto;
}

.help-dialog__list {
  margin: 0;
  padding: 0 0 0 20px;
  list-style-type: disc;
}

.help-dialog__list li {
  margin-bottom: 12px;
  line-height: 1.5;
  color: #606266;
}
</style>