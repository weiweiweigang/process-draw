<!--
 * @Author: Strayer
 * @Date: 2025-04-15
 * @LastEditors: Strayer
 * @LastEditTime: 2025-04-15
 * @Description: 元件icon面板
 * @FilePath: \processDraw\src\components\processDrawEdit\iconPanel.vue
-->

<template>
  <div class="iconPanel">
    <div 
      v-for="item in panelData" 
      :key="item.key"
      class="iconItem"
      draggable="true"
      :ondragstart="(event: any) => dragstart(event, item)"
    >
      <img :src="`/static/processDrawEdit/${item.img}`" width="100%" />
      <span class="label">{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue';
import { panelData } from './data';

function  dragstart(event: any, item: any) {
  event.dataTransfer.setData('Text', item.key);  
}

</script>

<style scoped>
.iconPanel {
  position: absolute;
  top: 10px;
  left: 10px;
  border: 1px solid #f67;
  width: 500px;
  display: flex;
  flex-wrap: wrap; /* 添加此属性使flex元素可以换行 */
  gap: 8px;

  .iconItem {
    width: 80px;
    .label {
      font-size: 12px;
      color: #666;
    }
  }
}
</style>
.