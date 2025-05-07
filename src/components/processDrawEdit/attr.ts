/*
 * @Author: Strayer
 * @Date: 2025-04-21
 * @LastEditors: Strayer
 * @LastEditTime: 2025-05-07
 * @Description: 
 * @FilePath: \processDraw\src\components\processDrawEdit\attr.ts
 */

import { ref, shallowRef } from 'vue'
import type { Canvas, DisplayObject, Polyline, Rect, Text } from '@antv/g';
import type { FormItemType, ImgDataItem, LineDataItem, TextDataItem } from './dataType';
import { chooseDevice, emitRef, getCanvasDataRfEl, panelData, retreatAndAdvance } from './data';
import { createImgReal, createLineReal, createTextReal, getDataOptionText } from './comm';
import { clone, mapToObj } from 'remeda';

// 是否展示
export const showAttrPanel = ref(false);

/**
 * @description: 属性表单选项
 */
export const attrFormOptions = shallowRef<Array<{
  groupTitle: string,
  formOptions: FormItemType []
}>>([])

/**
 * @description: 当前选中对象的属性
 */
export const attrForm = ref<{[key: string]: any}>({})

/**
 * @description: 管道的默认样式
 */
export const polyLineDefaultStyle: LineDataItem['style'] = {
  stroke: '#1890FF',
  lineWidth: 10,
  lineJoin: 'miter',
  lineCap: 'butt',
  isDash: 0,
  dashLen: 4,
  dashGap: 4,
}

/**
 * @description: 获取管道的样式属性和表单选项
 * @param {Polyline} el
 */
export function getPolyLineAttr(canvasDataEl: LineDataItem) {
  const formObj: {[key: string]: any} = {}
  for(const key of Object.keys(polyLineDefaultStyle)) {
    formObj[key] = (canvasDataEl.style as any)[key]?? (polyLineDefaultStyle as any)[key]
  }

  const options: {
    groupTitle: string;
    formOptions: FormItemType[];
  }[] = [{
    groupTitle: '样式',
    formOptions: [
      {
        key: 'stroke',
        label: '颜色',
        component: 'color',
        showAlpha: true,
      },
      {
        key: 'lineWidth',
        label: '宽度',
        inputType: 'number',
      },
      {
        key: 'lineJoin',
        label: '转折点',
        component: 'select',
        selectOption: [
          {
            dictValue: 'miter',
            dictLabel: '尖角',
          },
          {
            dictValue: 'round',
            dictLabel: '圆角',
          },
          {
            dictValue: 'bevel',
            dictLabel: '斜角',
          },
        ]
      },
      {
        key: 'lineCap',
        label: '端点',
        component: 'select',
        selectOption: [
          {
            dictValue: 'butt',
            dictLabel: '平头',
          },
          {
            dictValue: 'round',
            dictLabel: '圆头',
          },
          {
            dictValue: 'square',
            dictLabel: '方头',
          },
        ]
      },
      {
        key: 'isDash',
        label: '是否虚线',
        component: 'switch',
        switchActiveValue: 1,
        switchInactiveValue: 0,
      },
      {
        key: 'dashLen',
        label: '虚线长度',
        inputType: 'number',
      },
      {
        key: 'dashGap',
        label: '虚线间隔',
        inputType: 'number',
      },
    ]
  }]

  return {
    options,
    formObj,
  }
}

/**
 * @description: 把样式属性更新到管道上
 */
export function updatePolyLineAttr(canvas: Canvas, canvasDataEl: LineDataItem) {
  const retreatSnapshot = clone(canvasDataEl);

  for(const key of Object.keys(polyLineDefaultStyle)) {
    (canvasDataEl.style as any)[key] = (attrForm.value as any)[key]
  }
  canvasDataEl.editType.isUpdate = true;

  const advanceSnapshot = clone(canvasDataEl);

  canvas.document.querySelector(`#${canvasDataEl.id}`)!.remove();
  createLineReal(canvas, canvasDataEl);

  retreatAndAdvance.value.addLog({
    type: 'update',
    retreatSnapshot,
    advanceSnapshot,
  })
}

/**
 * @description: 更新管道的默认样式
 */
export function updatePolyLineDefaultStyle() {
  for(const key of Object.keys(polyLineDefaultStyle)) {
    (polyLineDefaultStyle as any)[key] = (attrForm.value as any)[key]
  }
}

/**
 * @description: 获取path的样式属性和表单选项
 * @param {Polyline} el
 */
export function getPathAttr(canvasDataEl: ImgDataItem) {
  const panelObj = mapToObj(panelData.value, item => [item.key, item])[canvasDataEl.key];

  const formObj: {[key: string]: any} = {}
  formObj.fill = canvasDataEl.color ?? panelObj.color;
  formObj.stroke = canvasDataEl.stroke ?? panelObj.stroke;

  const panelItem = panelData.value.find(item => item.key === canvasDataEl.key);

  const options: {
    groupTitle: string;
    formOptions: FormItemType[];
  }[] = [{
    groupTitle: '样式',
    formOptions: [
      {
        key: 'fill',
        label: '填充色',
        component: 'color',
        showAlpha: true,
        predefine: panelItem?.colorPredefine,
      },
      {
        key: 'stroke',
        label: '边框色',
        component: 'color',
        showAlpha: true,
        predefine: panelItem?.strokePredefine,
      },
    ]
  }]

  return {
    options,
    formObj,
  }
}

/**
 * @description: 把样式属性更新到path上
 */
export function updatePathAttr(canvas: Canvas, canvasDataEl: ImgDataItem) {
  const retreatSnapshot = clone(canvasDataEl);

  canvasDataEl.color = attrForm.value.fill;
  canvasDataEl.stroke = attrForm.value.stroke;
  canvasDataEl.editType.isUpdate = true;

  const advanceSnapshot = clone(canvasDataEl);

  canvas.document.querySelector(`#${canvasDataEl.id}`)!.remove();
  createImgReal(canvas, canvasDataEl);

  retreatAndAdvance.value.addLog({
    type: 'update',
    retreatSnapshot,
    advanceSnapshot,
  })
}

/**
 * @description: 更新path的默认样式
 */
export function updatePathDefaultStyle() {
  const panelObj = mapToObj(panelData.value, item => [item.key, item])[(chooseDevice.value as ImgDataItem).key];

  panelObj.color = attrForm.value.fill;
  panelObj.stroke = attrForm.value.stroke;
}

/**
 * @description: 获取远控点的样式属性和表单选项
 * @param {Polyline} el
 */
export function getRemotePointAttr(canvasDataEl: ImgDataItem) {
  const formObj: {[key: string]: any} = {}
  formObj.name = canvasDataEl.name;
  formObj.controlGetKey = canvasDataEl.controlGetKey;
  formObj.controlSetKey = canvasDataEl.controlSetKey;
  formObj.controlType = canvasDataEl.controlType;


  const options: {
    groupTitle: string;
    formOptions: FormItemType[];
  }[] = [{
    groupTitle: '远控信息',
    
    formOptions: [
      {
        key: 'controlType',
        label: '远控类型',
        component: 'select',
        selectOption: [
          {
            dictValue: 1,
            dictLabel: '阀-开度',
          },
          {
            dictValue: 2,
            dictLabel: '泵-频率',
          },
        ]
      },
      {
        key: 'name',
        label: '名称',
      },
      {
        key: 'controlGetKey',
        label: '读取key',
      },
      {
        key: 'controlSetKey',
        label: '控制key',
      },
    ]
  }]

  return {
    options,
    formObj,
  }
}

/**
 * @description: 把样式属性更新到远控点上
 */
export function updateRemotePointAttr(canvas: Canvas, canvasDataEl: ImgDataItem) {
  const retreatSnapshot = clone(canvasDataEl);
  
  canvasDataEl.controlGetKey = attrForm.value.controlGetKey;
  canvasDataEl.controlSetKey = attrForm.value.controlSetKey;
  canvasDataEl.controlType = attrForm.value.controlType;
  canvasDataEl.name = attrForm.value.name;
  canvasDataEl.editType.isUpdate = true;

  const advanceSnapshot = clone(canvasDataEl);

  canvas.document.querySelector(`#${canvasDataEl.id}`)!.remove();
  createImgReal(canvas, canvasDataEl);
  retreatAndAdvance.value.addLog({
    type: 'update',
    retreatSnapshot,
    advanceSnapshot,
  })
}

/**
 * @description: 文本框默认样式
 */
export const textDefaultStyle: {
  box: TextDataItem['box'],
  text: TextDataItem['text']
} = {
  box: {
    width: 60,
    height: 24,
    fill: '#0E2C46',
    lineWidth: 0,
    stroke: '#0E2C46',
    radius: 0,
  },
  text: {
    text: '文字内容',
    fontSize: 14,
    fill: '#fff',
    fontWeight: 'normal',
    textAlign: 'start',
    lineHeight: 24,
    letterSpacing: 0,
    dx: 12,
    dy: 8,
  }
}

/**
 * @description: 获取文字的样式属性和表单选项
 * @param {Polyline} el
 */
export function getTextAttr(canvasDataEl: TextDataItem) {
  const formObj: {[key: string]: any} = {}

  for(const key of Object.keys(textDefaultStyle.text)) {
    formObj['text'+key] = canvasDataEl.text[key as keyof typeof textDefaultStyle.text] ?? textDefaultStyle.text[key as keyof typeof textDefaultStyle.text]
  }

  for(const key of Object.keys(textDefaultStyle.box)) {
    formObj['box'+key] = canvasDataEl.box[key as keyof typeof textDefaultStyle.box] ?? textDefaultStyle.box[key as keyof typeof textDefaultStyle.box]
  }

  formObj.isDataBox = canvasDataEl.isDataBox;
  formObj.dataOption = clone(canvasDataEl.dataOption ?? []);

  const options: {
    groupTitle: string;
    formOptions: FormItemType[];
  }[] = [{
    groupTitle: '盒子',
    formOptions: [
      {
        key: 'boxwidth',
        label: '宽度',
        inputType: 'number',
      },
      {
        key: 'boxheight',
        label: '高度',
        inputType: 'number',
      },
      {
        key: 'boxfill',
        label: '背景颜色',
        component: 'color',
        showAlpha: true,
      },
      {
        key: 'boxlineWidth',
        label: '边框宽度',
        inputType: 'number',
      },
      {
        key: 'boxstroke',
        label: '边框颜色',
        component: 'color',
        showAlpha: true,
      },
      {
        key: 'boxradius',
        label: '边框圆角',
        inputType: 'number',
      },
    ]
  }, {
    groupTitle: '文本',
    formOptions: [
      {
        key: 'textfontSize',
        label: '字号大小',
        inputType: 'number',
      },
      {
        key: 'textfill',
        label: '字体颜色',
        component: 'color',
        showAlpha: true,
      },
      {
        key: 'textfontWeight',
        label: '字体粗细',
        component: 'select',
        selectOption: [
          {
            dictValue: 'normal',
            dictLabel: '正常',
          },
          {
            dictValue: 'bold',
            dictLabel: '加粗',
          },
          {
            dictValue: 'lighter',
            dictLabel: '变细',
          },
        ]
      },
      {
        key: 'textlineHeight',
        label: '行高',
        inputType: 'number',
      },
      {
        key: 'textletterSpacing',
        label: '字符间距',
        inputType: 'number',
      },
      {
        key: 'textdx',
        label: '左右内边距',
        inputType: 'number',
      },
      {
        key: 'textdy',
        label: '上下内边距',
        inputType: 'number',
      },
    ]
  }]

  if(!formObj.isDataBox) {
    options[1].formOptions.unshift({
      key: 'texttext',
      label: '文本内容',
    })
  }

  return {
    options,
    formObj,
  }
}

/**
 * @description: 把样式属性更新到文字上
 */
export function updateTextAttr(canvas: Canvas, canvasDataEl: TextDataItem) {
  const retreatSnapshot = clone(canvasDataEl);

  for(const key of Object.keys(textDefaultStyle.text)) {
    (canvasDataEl.text[key as keyof typeof textDefaultStyle.text] as any) = attrForm.value['text'+key];
  }

  for(const key of Object.keys(textDefaultStyle.box)) {
    (canvasDataEl.box[key as keyof typeof textDefaultStyle.box]  as any)= attrForm.value['box'+key];
  }

  canvasDataEl.isDataBox = attrForm.value.isDataBox;
  canvasDataEl.dataOption = clone(attrForm.value.dataOption ?? []);
  canvasDataEl.editType.isUpdate = true;

  const advanceSnapshot = clone(canvasDataEl);

  canvas.document.querySelector(`#${canvasDataEl.id}`)!.remove();
  createTextReal(canvas, canvasDataEl);
  retreatAndAdvance.value.addLog({
    type: 'update',
    retreatSnapshot,
    advanceSnapshot,
  })
}

/**
 * @description: 更新默认的文本框样式
 */
export function updateTextDefaultStyle() {
  for(const key of Object.keys(textDefaultStyle.text)) {
    (textDefaultStyle as any).text[key] = attrForm.value['text'+key];
  }

  for(const key of Object.keys(textDefaultStyle.box)) {
    (textDefaultStyle as any).box[key] = attrForm.value['box'+key];
  }

}
