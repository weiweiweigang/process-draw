<!--
 * @Author: Strayer
 * @Date: 2025-04-15
 * @LastEditors: Strayer
 * @LastEditTime: 2025-04-17
 * @Description: 元件icon面板
 * @FilePath: \processDraw\src\components\processDrawEdit\iconPanel.vue
-->

<template>
  <div class="iconPanel">
    <h3>元件库</h3>
    <div class="iconPanel__header">
      <div class="iconPanel__tools">
        <button @click="createLine(canvas!, {angle90: true})" class="iconPanel__button">
          画直角实线
        </button>
        <button @click="createLine(canvas!, {style: { lineDash: [4, 4] }, angle90: true})" class="iconPanel__button">
          画直角虚线
        </button>
        <button @click="createLine(canvas!, {style: { lineDash: [4, 4] } })" class="iconPanel__button">
          画任意虚线
        </button>
        <button @click="submitDrawing" class="iconPanel__button iconPanel__button--primary">
          提交
        </button>
        <button @click="togglePanel" class="iconPanel__toggle">
          {{ isPanelCollapsed ? '展开' : '收起' }}
        </button>
      </div>
    </div>
    
    <div v-show="!isPanelCollapsed" class="iconPanel__content">
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
            <path :fill="item.color ?? '#54BECC'" :d="item.path" />
          </svg>
          <img v-else :src="`/static/processDrawEdit/${item.img}`" :width="item.width>100? 100:item.width" />
        </div>
        <p class="iconItem__label">{{ item.label }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { shallowRef, ref } from 'vue';
import { panelData } from './data';
import { createLine } from './comm';
import { Canvas } from '@antv/g';

const props = defineProps<{
  canvas?: Canvas,
}>()

const isPanelCollapsed = ref(false);

function togglePanel() {
  isPanelCollapsed.value = !isPanelCollapsed.value;
}

function dragstart(event: any, item: any) {
  event.dataTransfer.setData('Text', item.key);  
}

function submitDrawing() {
  // 提交绘图
  console.log('提交绘图');
  // 这里可以实现提交逻辑
}
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
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
  flex-wrap: wrap ;
}

h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
  text-align: center;
  line-height: 48px;
}

.iconPanel__tools {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
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
</style>