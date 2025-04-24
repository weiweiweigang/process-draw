/*
 * @Author: Strayer
 * @Date: 2025-04-21
 * @LastEditors: Strayer
 * @LastEditTime: 2025-04-24
 * @Description: 
 * @FilePath: \processDraw\src\components\processDrawEdit\attr.ts
 */

import { ref, shallowRef } from "vue"
import type { DisplayObject, Polyline, Rect, Text } from "@antv/g";
import type { FormItemType, lineDataItem, TextDataItem } from "./dataType";
import { panelData } from "./data";

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
export const polyLineDefaultStyle: lineDataItem['style'] = {
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
export function getPolyLineAttr(el: Polyline) {
  const formObj: {[key: string]: any} = {}
  for(const key of Object.keys(polyLineDefaultStyle)) {
    formObj[key] = (el.style as any)[key]?? polyLineDefaultStyle[key as keyof lineDataItem['style']]
  }
  formObj.isDash = el.style.lineDash? 1 : 0;
  formObj.dashLen = (el.style.lineDash as any)?.[0] ?? polyLineDefaultStyle.dashLen;
  formObj.dashGap = (el.style.lineDash as any)?.[1]?? polyLineDefaultStyle.dashGap;

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
        key:'lineWidth',
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
        component:'select',
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
      }
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
export function updatePolyLineAttr(el: Polyline) {
  el.style.stroke = attrForm.value.stroke;
  el.style.lineWidth = attrForm.value.lineWidth;
  el.style.lineJoin = attrForm.value.lineJoin;
  el.style.lineCap = attrForm.value.lineCap;
  el.style.lineDash = attrForm.value.isDash? [attrForm.value.dashLen, attrForm.value.dashGap]: 0;
}

/**
 * @description: path的默认样式
 */
export const pathDefaultStyle: {[key: string]: any} = {
  fill: '',
  stroke: '',
}
/**
 * @description: 获取path的样式属性和表单选项
 * @param {Polyline} el
 */
export function getPathAttr(el: DisplayObject) {
  const formObj: {[key: string]: any} = {}
  console.log('%c [ formObj ]-162', 'font-size:13px; background:#347658; color:#78ba9c;', formObj);
  formObj.fill = el.querySelector('.imgBox__path')?.style.fill ?? pathDefaultStyle.fill;
  formObj.stroke = el.querySelector('.imgBox__path')?.style.stroke ?? pathDefaultStyle.stroke;

  const panelItem = panelData.value.find(item => item.key === el.getAttribute('data-imgKey'));

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
export function updatePathAttr(el: DisplayObject) {
  const pathEntity = el.querySelector('.imgBox__path')
  if(pathEntity) {
    pathEntity.style.fill = attrForm.value.fill;
    pathEntity.style.stroke = attrForm.value.stroke;
  }
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
    fill: '#ff0',
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
export function getTextAttr(el: DisplayObject) {
  const formObj: {[key: string]: any} = {}

  for(const key of Object.keys(textDefaultStyle.text)) {
    formObj['text'+key] = el.querySelector('.textBox__text')?.style[key] ?? textDefaultStyle.text[key as keyof TextDataItem['text']]
  }

  for(const key of Object.keys(textDefaultStyle.box)) {
    formObj['box'+key] = el.querySelector('.textBox__rect')?.style[key] ?? textDefaultStyle.box[key as keyof TextDataItem['box']]
  }
  formObj.boxwidth = formObj.boxwidth - formObj.textdx * 2;
  formObj.boxheight = formObj.boxheight - formObj.textdy * 2;

  const options: {
    groupTitle: string;
    formOptions: FormItemType[];
  }[] = [{
    groupTitle: '盒子',
    formOptions: [
      {
        key:'boxwidth',
        label: '宽度',
        inputType: 'number',
      },
      {
        key:'boxheight',
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
        key:'boxlineWidth',
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
        key:'texttext',
        label: '文本内容',
      },
      {
        key:'textfontSize',
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
        key:'textfontWeight',
        label: '字体粗细',
        component:'select',
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
        key:'textlineHeight',
        label: '行高',
        inputType: 'number',
      },
      {
        key:'textletterSpacing',
        label: '字符间距',
        inputType: 'number',
      },
      {
        key:'textdx',
        label: '左右内边距',
        inputType: 'number',
      },
      {
        key:'textdy',
        label: '上下内边距',
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
 * @description: 把样式属性更新到文字上
 */
export function updateTextAttr(el: DisplayObject) {
  const textBoxEntity = el.querySelector('.textBox__rect') as Rect;
    if(textBoxEntity) {
      const width = attrForm.value.boxwidth + attrForm.value.textdx * 2;
      const height = attrForm.value.boxheight + attrForm.value.textdy * 2;

      el.setOrigin(width / 2, height / 2);

      (el.querySelector('.textBox__inner') as DisplayObject)?.setOrigin(width / 2, height / 2);

      textBoxEntity.style.width = width;
      textBoxEntity.style.height = height;
      textBoxEntity.style.fill = attrForm.value.boxfill;
      textBoxEntity.style.lineWidth = attrForm.value.boxlineWidth;
      textBoxEntity.style.stroke = attrForm.value.boxstroke;
      textBoxEntity.style.radius = attrForm.value.boxradius;

      const textEntity = el.querySelector('.textBox__text') as Text;
      textEntity.style.text = attrForm.value.texttext;
      textEntity.style.fontSize = attrForm.value.textfontSize;
      textEntity.style.fill = attrForm.value.textfill;
      textEntity.style.fontWeight = attrForm.value.textfontWeight;
      textEntity.style.textAlign = attrForm.value.texttextAlign;
      textEntity.style.lineHeight = attrForm.value.textlineHeight;
      textEntity.style.letterSpacing = attrForm.value.textletterSpacing;
      textEntity.style.dx = attrForm.value.textdx;
      textEntity.style.dy = attrForm.value.textdy;
      textEntity.style.wordWrapWidth = attrForm.value.boxwidth;
    }
}
