/*
 * @Author: Strayer
 * @Date: 2025-04-15
 * @LastEditors: Strayer
 * @LastEditTime: 2025-04-23
 * @Description: 
 * @FilePath: \processDraw\src\components\processDrawEdit\data.ts
 */
import type { DisplayObject } from "@antv/g";
import { ref, shallowRef } from "vue";
import { showAttrPanel, } from "./attr";
import type { PanelImgType } from "./dataType";

// 元件列表
export const panelData = shallowRef<PanelImgType []>([]);

// 是否禁止拖拽相机
export  const disableDragCamera = ref(false);
// 当前是否正在画管道
export const isCreateLine = ref(false);
// 是否禁止拖车所有元件和管道
export const disableDragDevice = ref(false);

// img图标的内边距
export const imgPadding = 8;

// 当前选中的元件
export const chooseDevice = shallowRef<DisplayObject>()


export const initData = () => {
  disableDragCamera.value = false;
  isCreateLine.value = false;
  disableDragDevice.value = false;
  chooseDevice.value = undefined;
  showAttrPanel.value = false;
};