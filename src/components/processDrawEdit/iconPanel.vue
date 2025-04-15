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
    >
      <img :src="`/static/processDrawEdit/${item.img}`" width="100%" />
      <span class="label">{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue';

const panelData = shallowRef([
  {
    key: 'cqxsc',
    img: 'cqxsc.png',
    label: '厂区泄水池',
  },
  {
    key: 'rsx',
    img: 'rsx.png',
    label: '软水箱',
  },
  {
    key: 'rsq',
    img: 'rsq.png',
    label: '软水器',
  },
  {
    key: 'hrq',
    img: 'hrq.png',
    label: '换热器',
  },
  {
    key: 'ddxhb',
    img: 'ddxhb.png',
    label: '电动循环泵',
  },
  {
    key: 'qdxhsb',
    img: 'qdxhsb.png',
    label: '汽动循环水泵',
  },{
    key: 'cqxsc',
    img: 'cqxsc.png',
    label: '厂区泄水池',
  },
  {
    key: 'bsb',
    img: 'bsb.png',
    label: '补水泵',
  },
  {
    key: 'glq',
    img: 'glq.png',
    label: '过滤器',
  },{
    key: 'jyb',
    img: 'jyb.png',
    label: '加压泵',
  },
  {
    key: 'cwq',
    img: 'cwq.png',
    label: '除污器',
  },
  {
    key: 'xqj',
    img: 'xqj.png',
    label: '小汽机',
  },
  {
    key: 'cwq',
    img: 'cwq.png',
    label: '除污器',
  },
  {
    key: 'gdyjrq',
    img: 'gdyjrq.png',
    label: '高压/低压加热器',
  },{
    key: 'sslqq',
    img: 'sslqq.png',
    label: '',
  },{
    key: 'njsg',
    img: 'njsg.png',
    label: '凝结水罐',
  },{
    key: 'ssb',
    img: 'ssb.png',
    label: '疏水泵',
  },{
    key: 'jz',
    img: 'jz.png',
    label: '机组',
  },{
    key: 'aqf',
    img: 'aqf.png',
    label: '安全阀',
  },{
    key: 'yb',
    img: 'yb.png',
    label: '仪表',
  },{
    key: 'xsd',
    img: 'xsd.png',
    label: '下水道',
  },{
    key: 'arrow',
    img: 'arrow.svg',
    label: '箭头',
  },
]);

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