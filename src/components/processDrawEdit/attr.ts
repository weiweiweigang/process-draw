/*
 * @Author: Strayer
 * @Date: 2025-04-21
 * @LastEditors: Strayer
 * @LastEditTime: 2025-04-22
 * @Description: 
 * @FilePath: \processDraw\src\components\processDrawEdit\attr.ts
 */

import { ref, shallowRef, watch } from "vue"
import { chooseDevice, type FormItemType } from "./data"
import type { DisplayObject, Polyline } from "@antv/g";

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
export const polyLineDefaultStyle: {[key: string]: any} = {
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
    formObj[key] = (el.style as any)[key]?? polyLineDefaultStyle[key]
  }
  formObj.isDash = el.style.lineDash? 1 : 0;
  formObj.dashLen = (el.style.lineDash as any)?.[0] ?? polyLineDefaultStyle.dashLen;
  formObj.dashGap = (el.style.lineDash as any)?.[1]?? polyLineDefaultStyle.dashGap;

  // console.log('%c [ formObj ]-57', 'font-size:13px; background:#c484a1; color:#ffc8e5;', formObj);


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
 * @description: path的默认样式
 */
export const pathDefaultStyle: {[key: string]: any} = {
  fill: '#3A7A98'
}
/**
 * @description: 获取管道的样式属性和表单选项
 * @param {Polyline} el
 */
export function getPathAttr(el: DisplayObject) {
  const formObj: {[key: string]: any} = {}
  for(const key of Object.keys(pathDefaultStyle)) {
    formObj[key] = (el.style as any)[key]?? pathDefaultStyle[key]
  }
  formObj.fill = el.querySelector('.imgBox__path')?.style.fill ?? pathDefaultStyle.fill;

  // console.log('%c [ formObj ]-57', 'font-size:13px; background:#c484a1; color:#ffc8e5;', formObj);

  const options: {
    groupTitle: string;
    formOptions: FormItemType[];
  }[] = [{
    groupTitle: '样式',
    formOptions: [
      {
        key: 'fill',
        label: '颜色',
        component: 'color',
      },
    ]
  }]

  return {
    options,
    formObj,
  }
}