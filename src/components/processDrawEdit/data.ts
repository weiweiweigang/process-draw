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
    width: 21,
    height: 16,
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

// 拖拽时允许移动相机
export  const moveCameraWhenDrag = ref(true);
// 当前是否正在画管道
export const isCreateLine = ref(false);

export const initData = () => {
  moveCameraWhenDrag.value = true;
};