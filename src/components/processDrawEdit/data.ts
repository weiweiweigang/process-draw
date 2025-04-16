import { ref, shallowRef } from "vue";

// 元件列表
export const panelData = shallowRef([
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

// 拖拽时允许移动相机
export  const moveCameraWhenDrag = ref(true);

export const initData = () => {
  moveCameraWhenDrag.value = true;
};