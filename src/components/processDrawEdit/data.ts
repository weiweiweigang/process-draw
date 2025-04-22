import type { DisplayObject } from "@antv/g";
import { ref, shallowRef } from "vue";
import { showAttrPanel, } from "./attr";

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

// 元件列表
export const panelData = shallowRef([
  {
    key: 'aqf',
    img: 'aqf.png',
    label: '安全阀',
    width: 38,
    height: 47,
  },{
    key: 'arrow',
    img: 'arrow.svg',
    label: '箭头',
    width: 21,
    height: 16,
    path: 'm12.312949,15.530085a1.043584,1.043584 0 0 1 -0.529097,-0.144015l-11.124602,-6.5464a1.043584,1.043584 0 0 1 0,-1.801225l11.126689,-6.505701a1.043584,1.043584 0 0 1 1.570593,0.900613l0,2.453465l5.734492,-3.354078a1.043584,1.043584 0 0 1 1.570593,0.900613l0,13.053144a1.043584,1.043584 0 0 1 -1.572681,0.899569l-5.732405,-3.372862l0,2.473293a1.043584,1.043584 0 0 1 -1.043584,1.043584z',
    color: '#3A7A98'
  },
  {
    key: 'yb',
    img: 'yb.png',
    label: '仪表',
    width: 32,
    height: 49,
  },
  {
    key: 'xsd',
    img: 'xsd.png',
    label: '下水道',
    width: 40,
    height: 40,
  },
  {
    key: 'cqxsc',
    img: 'cqxsc.png',
    label: '厂区泄水池',
    width: 447,
    height: 110,
  },
  {
    key: 'ddxhb',
    img: 'ddxhb.png',
    label: '电动循环泵',
    width: 102,
    height: 149,
  },
  
  {
    key: 'rsq',
    img: 'rsq.png',
    label: '软水器',
    width: 124,
    height: 162,
  },
  {
    key: 'ssb',
    img: 'ssb.png',
    label: '疏水泵',
    width: 93,
    height: 158,
  },
  {
    key: 'sslqq',
    img: 'sslqq.png',
    label: '疏水冷却器',
    width: 183,
    height: 101,
  },
  {
    key: 'glq',
    img: 'glq.png',
    label: '过滤器',
    width: 101,
    height: 61,
  },{
    key: 'jyb',
    img: 'jyb.png',
    label: '加压泵',
    width: 150,
    height: 88,
  },
  {
    key: 'gdyjrq',
    img: 'gdyjrq.png',
    label: '高压/低压加热器',
    width: 242,
    height: 144,
  },
  
  {
    key: 'rsx',
    img: 'rsx.png',
    label: '软水箱',
    width: 279,
    height:  218,
  },
  {
    key: 'xqj',
    img: 'xqj.png',
    label: '小汽机',
    width: 182,
    height: 167,
  },
  {
    key: 'cwq',
    img: 'cwq.png',
    label: '除污器',
    width: 85,
    height: 61,
  },

  {
    key: 'qdxhsb',
    img: 'qdxhsb.png',
    label: '汽动循环水泵',
    width: 123,
    height: 149,
  },
  {
    key: 'bsb',
    img: 'bsb.png',
    label: '补水泵',
    width: 92,
    height: 114,
  },
  {
    key: 'njsg',
    img: 'njsg.png',
    label: '凝结水罐',
    width: 128,
    height: 132,
  },
  
  {
    key: 'jz',
    img: 'jz.png',
    label: '机组',
    width: 308,
    height: 161,
  },
  {
    key: 'hrq',
    img: 'hrq.png',
    label: '换热器',
    width: 93,
    height: 172,
  },
  {
    key: 'hrq2',
    img: 'hrq2.png',
    label: '换热器2',
    width: 105,
    height: 171,
  },
]);

// 是否禁止拖拽相机
export  const disableDragCamera = ref(false);
// 当前是否正在画管道
export const isCreateLine = ref(false);
// 是否禁止拖车所有元件和管道
export const disableDragDevice = ref(false);

// 当前选中的元件
export const chooseDevice = shallowRef<DisplayObject>()

export const initData = () => {
  disableDragCamera.value = false;
  isCreateLine.value = false;
  disableDragDevice.value = false;
  chooseDevice.value = undefined;
  showAttrPanel.value = false;
};