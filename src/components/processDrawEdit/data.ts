import { ref, shallowRef } from "vue";

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
    width: 42,
    height: 32,
    path: 'M 41.5,1.5 C 41.5,10.8333 41.5,20.1667 41.5,29.5C 39.9317,30.4731 38.265,30.6397 36.5,30C 33.5815,28.2912 30.7482,26.4579 28,24.5C 28.6121,29.0829 26.7787,30.9163 22.5,30C 15.8333,26 9.16667,22 2.5,18C 1.83333,17 1.16667,16 0.5,15C 7.83333,10.3333 15.1667,5.66667 22.5,1C 26.7787,0.0837431 28.6121,1.91708 28,6.5C 30.7482,4.54209 33.5815,2.70876 36.5,1C 38.265,0.360257 39.9317,0.526924 41.5,1.5 Z',
    color: '#78a42f'
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

export const initData = () => {
  disableDragCamera.value = false;
  isCreateLine.value = false;
  disableDragDevice.value = false;
};