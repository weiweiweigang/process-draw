/*
 * @Author: Strayer
 * @Date: 2025-04-23
 * @LastEditors: Strayer
 * @LastEditTime: 2025-04-25
 * @Description: 
 * @FilePath: \processDraw\src\components\processDrawEdit\dataType.ts
 */
// 表单选项公共组件数据格式
export interface FormItemType {
  label: string,
  key: string,
  component?: 'select' | 'switch' | 'radio' | 'color', //所使用的组件 默认Input
  disabled?: true, //是否禁止编辑
  width?: number,
  customValue?: (value: any) => any, //如果值需要特殊转换,把特殊转换的方法写在这里,注意：该值应该禁止编辑
  // -----input-----------
  inputType?: string, // input类型： 'number' 'text' 
  // ---------select-----
  selectOption?: Array<{
    dictValue: number | string,
    dictLabel: string,
  }>
  // ---------switch----
  switchActiveValue?: number | string
  switchInactiveValue?: number | string
  // ---------radio-----
  radioOption?: Array<{
    dictValue: number | string,
    dictLabel: string,
  }>
  // color
  showAlpha?: boolean, // 是否显示透明度
  predefine?: string [], // 预设颜色

  // 是否必填
  required?: boolean,

  // 是否隐藏该项
  hidden?: (value: any) => boolean,
}

// 右键菜单数据类型
export type MenuDataItem = {
  key: string,
  label: string,
  icon?: string,
  data?: any,
  clickParam: string,
  clickHandle: (param: string) => void,
}

// 元件面板的元件类型
export type PanelImgType = {
  key: string;
  img: string;
  label: string;
  width: number;
  height: number;
  path?: string;
  color?: string;
  colorPredefine?: string [];
  stroke: string,
  strokePredefine?: string [];
}

// 图片元件数据
export type ImgDataItem = {
  id: string,
  zIndex?: number,
  key: string,
  width: number,
  height: number,
  coord: [number, number],
  rotate?: number,

  color?: string,
  stroke?: string,
  scale?: number,
}

// 管道数据
export type lineDataItem = {
  id: string;
  angle90?: boolean;
  coord:  [number, number][];
  zIndex?: number,

  style: {
    stroke: string;
    lineWidth: number;
    lineJoin: CanvasLineJoin;
    lineCap: CanvasLineCap;
    isDash: number;
    dashLen?: number;
    dashGap?: number;
  }
}

// 文本数据
export type TextDataItem = {
  id: string;
  coord: [number, number];
  zIndex?: number,

  box: {
      width: number;
      height: number;
      fill: string;
      lineWidth: number;
      stroke: string;
      radius: number;
  };
  text: {
      text: string;
      fontSize: number;
      fill: string;
      fontWeight: number | "normal" | "bold" | "bolder" | "lighter" | undefined;
      textAlign: "middle" | "start" | "center" | "end" | "left" | "right" | undefined;
      lineHeight: number;
      letterSpacing: number;
      dx: number;
      dy: number;
  };

  // 数据框
  isDataBox?: boolean,
  dataOption?: Array<{
    key: string; // 数据对应的key
    label?: string; // 数据展示的标签
    unit?: string; // 数据展示的单位
    equation?: string; // 单位转换的公式
    decimal?: number; // 保留的小数位
  }>
}