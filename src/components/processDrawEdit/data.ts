/*
 * @Author: Strayer
 * @Date: 2025-04-15
 * @LastEditors: Strayer
 * @LastEditTime: 2025-05-07
 * @Description: 
 * @FilePath: \processDraw\src\components\processDrawEdit\data.ts
 */
import { ref, shallowRef } from 'vue';
import { showAttrPanel } from './attr';
import type { ImgDataItem, PanelImgType, TextDataItem, LineDataItem } from './dataType';
import { RetreatAndAdvance } from './retreatAndAdvance';
import { DisplayObject } from '@antv/g';

// 元件列表
export const panelData = shallowRef<PanelImgType []>([]);

// 是否禁止拖拽相机
export  const disableDragCamera = ref(false);
// 当前是否正在画管道
export const isCreateLine = ref(false);
// 正在画的管道信息
export const drawLineInfo = {
  coord: [] as [number, number][],
  realEl: null as DisplayObject | null,
  rfEl: null as LineDataItem | null
};
// 是否禁止拖车所有元件和管道
export const disableDragDevice = ref(false);

// img图标的内边距
export const imgPadding = 8;

// 当前选中的元件
export const chooseDevice = shallowRef<ImgDataItem |  LineDataItem | TextDataItem>()
// 当前复制的源对象
export const copySource = shallowRef<ImgDataItem |  LineDataItem | TextDataItem>();

// 外部数据， 数据框内的数据展示
export const serverData = ref<{[key: string]: any}>({})

// emit映射
export const emitRef = shallowRef<any>();

// 画布所有元件数据映射
export const canvasDataRef = ref<{
  imgData: ImgDataItem [];
  lineData: LineDataItem [];
  textData: TextDataItem [];
}>({
  imgData: [],
  lineData: [],
  textData: [],
})

export function getCanvasDataRfEl(id: string) {
  for(const item of [...canvasDataRef.value.imgData, ...canvasDataRef.value.lineData, ...canvasDataRef.value.textData]) {
    if(item.id === id)  return item;
  }
}

export function removeCanvasDataRfEl(id: string) {
  for(const key of Object.keys(canvasDataRef.value)) {
    for(let i = 0; i< (canvasDataRef.value as any)[key].length; i++) {
      if((canvasDataRef.value as any)[key][i].id === id) {
        (canvasDataRef.value as any)[key].splice(i, 1);
        return true;
      }
    }
  }
}

export function replaceCanvasDataRfEl(item: ImgDataItem | LineDataItem | TextDataItem) {
  for(const key of Object.keys(canvasDataRef.value)) {
    for(let i = 0; i< (canvasDataRef.value as any)[key].length; i++) {
      if((canvasDataRef.value as any)[key][i].id === item.id) {
        (canvasDataRef.value as any)[key].splice(i, 1, item);
        return true;
      }
    }
  }
}

export function addCanvasDataRfEl(item: ImgDataItem | LineDataItem | TextDataItem) {
  if(item.type === 'imgData') {
    canvasDataRef.value.imgData.push(item);
    return true;
  }
  if(item.type === 'lineData') {
    canvasDataRef.value.lineData.push(item);
    return true;
  }
  if(item.type === 'textData') {
    canvasDataRef.value.textData.push(item);
    return true;
  }
}

// 整个画布只展示，不编辑
export const disableEdit = ref(false);

// 撤回  与 前进
export const retreatAndAdvance = shallowRef(new RetreatAndAdvance());

export const initData = () => {
  isCreateLine.value = false;
  drawLineInfo.coord = [];
  drawLineInfo.realEl = null;
  drawLineInfo.rfEl = null;
  disableDragCamera.value = false;
  chooseDevice.value = undefined;
  copySource.value = undefined;
  showAttrPanel.value = false;
  (window as any).wg = retreatAndAdvance.value = new RetreatAndAdvance();
};


export function updateDisableEdit(value: boolean) {
  disableEdit.value = value;
  disableDragDevice.value = value? true : false;
}