<!--
 * @Author: Strayer
 * @Date: 2025-04-15
 * @LastEditors: Strayer
 * @LastEditTime: 2025-04-24
 * @Description: 
 * @FilePath: \processDraw\src\App.vue
-->
<script setup lang="ts">
import HelloWorld from './components/processDrawEdit/index.vue'
import { shallowRef } from 'vue';

const canvasData = shallowRef<any>({
    "imgData": [
        {
            "id": "cfae0a4f-0ab1-49cc-8fcf-8c55d5877849",
            "zIndex": 1,
            "key": "cqxsc",
            "width": 447,
            "height": 110,
            "coord": [
                988.1276245117188,
                595.2420349121094
            ],
            "rotate": 0
        }
    ],
    "lineData": [
        {
            "id": "4ed761ca-15e9-4b70-a266-0e68de096106",
            "angle90": true,
            "coord": [
                [
                    834.5248413085938,
                    121.4151840209961
                ],
                [
                    834.5248413085938,
                    700.687744140625
                ],
                [
                    841.7243041992188,
                    700.687744140625
                ]
            ],
            "zIndex": 999,
            "style": {
                "stroke": "#1890FF",
                "lineWidth": 10,
                "lineJoin": "miter",
                "lineCap": "butt",
                "isDash": 0
            }
        }
    ],
    "textData": [
        {
            "id": "da633787-c892-45b1-943d-5a7058ce1a04",
            "coord": [
                837.5011596679688,
                363.8438720703125
            ],
            "zIndex": 10,
            "box": {
                "width": 60,
                "height": 24,
                "fill": "#0E2C46",
                "lineWidth": 0,
                "stroke": "#0E2C46",
                "radius": 0
            },
            "text": {
                "text": "文字内容",
                "fontSize": 14,
                "fill": "#ff0",
                "fontWeight": "normal",
                "textAlign": "start",
                "lineHeight": 24,
                "letterSpacing": 0,
                "dx": 12,
                "dy": 8
            }
        }
    ]
})

const panelData = shallowRef<any []>([
  {
    key: 'zhf',
    img: '',
    label: '止回阀',
    width: 28,
    height: 28,
    path: 'M19.358 4.721v3.711l-4.68-.001v1.857h2.716v2.474h1.9v-1.67h2.318v1.67l1.974-.001v-2.072h2.699l-.001 14.032h-2.698v-2.075h-1.974v1.646h-2.318v-1.646H8.64v1.646H6.51v-1.646H4.443v2.075H2V10.688h2.443v2.073l1.969.001v-1.67H8.64v1.67l1.965-.001v-2.472h2.715V8.431H8.64v-3.71h1.965V3h1.813v1.721h3.159V3h1.817v1.721z M20.499 15.221v5M7.499 15.221v5',
    color: '#000A20',
    stroke: '#EE1313',
    strokePredefine: ['#EE1313', '#2AE620'],
  },
  {
    key: 'zf',
    img: '',
    label: '闸阀',
    width: 28,
    height: 28,
    path: 'M19.359 4v3.712l-4.681-.001v1.856h2.716v2.475l2.831-.001V9.968H24l-.001 2.073.001 9.884L23.999 24h-3.773l-.001-2.075H7.774V24H4V9.967h3.774v2.074h2.832V9.568h2.715V7.711h-4.68V4z',
    color: '#000A20',
    stroke: '#EE1313',
    strokePredefine: ['#EE1313', '#2AE620'],
  },
  {
    key: 'df',
    img: '',
    label: '蝶阀',
    width: 28,
    height: 28,
    path: 'M23.097 4v3.503h-6.348v2.14c0 .135-.012.27-.04.405 1.236.523 2.25 1.583 3.043 3.18h2.622v-2.51H25v12.98l-2.625.02-.001-2.219H19.55c-.641 2.072-2.703 3.5-5.05 3.5-2.346 0-4.406-1.428-5.049-3.5H6.624v2.222L4 23.76v-13h2.624v2.47h2.624c.792-1.598 1.807-2.66 3.043-3.186a1.827 1.827 0 0 1-.043-.406V7.503H5.902L5.9 4h17.197Z M10.886 15.374a.5.5 0 0 1 .6-.224l.082.038 6.407 3.498a.5.5 0 0 1-.413.906l-.083-.038-6.407-3.498a.5.5 0 0 1-.186-.682Z M14.5 16a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z',
    color: '#000A20',
    stroke: '#EE1313',
    strokePredefine: ['#EE1313', '#2AE620'],
  },
  {
    key: 'dddf',
    img: '',
    label: '电动蝶阀',
    width: 28,
    height: 28,
    path: 'M12 5.495 13.513 4l1.769 1.495L17 4 M16.712 2a3.04 3.04 0 0 1 3.04 3.04v.037a3.003 3.003 0 0 1-2.826 2.997l-.177.005v2.14c0 .135-.012.271-.04.406 1.236.522 2.25 1.583 3.043 3.18l2.622-.001v-2.51H25v12.98l-2.625.02-.001-2.218H19.55c-.641 2.071-2.703 3.5-5.05 3.5-2.346 0-4.406-1.429-5.049-3.5H6.624v2.222L4 24.335v-13h2.624v2.471h2.624c.792-1.599 1.807-2.661 3.043-3.186a1.827 1.827 0 0 1-.043-.407V8.08A2.999 2.999 0 0 1 9.25 5.082v-.043A3.038 3.038 0 0 1 12.287 2h4.425Z M10.886 15.95a.5.5 0 0 1 .6-.223l.082.037 6.407 3.498a.5.5 0 0 1-.413.906l-.083-.037-6.407-3.498a.5.5 0 0 1-.186-.682Z M14.5 16.576a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z',
    color: '#000A20',
    stroke: '#EE1313',
    strokePredefine: ['#EE1313', '#2AE620'],
  },
  {
    key: 'dcf',
    img: '',
    label: '电磁阀',
    width: 28,
    height: 28,
    path: 'M11.5 5.5h5 M19.359 2v7.712l-4.681-.001v1.856h2.716v2.475l2.831-.001v-2.073H24l-.001 2.073.001 9.884L23.999 26h-3.773l-.001-2.075H7.774V26H4V11.967h3.774v2.074h2.832v-2.473h2.715V9.711h-4.68V2z',
    color: '#000A20',
    stroke: '#EE1313',
    strokePredefine: ['#EE1313', '#2AE620'],
  },
  {
    key: 'aqf',
    img: '/static/processDrawEdit/aqf.png',
    label: '安全阀',
    width: 38,
    height: 47,
  },
  {
    key: 'close',
    img: '/static/processDrawEdit/close.png',
    label: '关闭',
    width: 40,
    height: 31,
  },
  {
    key: 'arrow',
    img: '',
    label: '箭头',
    width: 21,
    height: 16,
    path: 'm12.312949,15.530085a1.043584,1.043584 0 0 1 -0.529097,-0.144015l-11.124602,-6.5464a1.043584,1.043584 0 0 1 0,-1.801225l11.126689,-6.505701a1.043584,1.043584 0 0 1 1.570593,0.900613l0,2.453465l5.734492,-3.354078a1.043584,1.043584 0 0 1 1.570593,0.900613l0,13.053144a1.043584,1.043584 0 0 1 -1.572681,0.899569l-5.732405,-3.372862l0,2.473293a1.043584,1.043584 0 0 1 -1.043584,1.043584z',
    color: '#3A7A98',
    colorPredefine: ['#3A7A98', '#76A32C', '#A6613C'],
    stroke: '',
  },
  {
    key: 'dataIcon',
    img: '/static/processDrawEdit/dataIcon.png',
    label: '数据标识',
    width: 24,
    height: 24,
  },
  {
    key: 'yb',
    img: '/static/processDrawEdit/yb.png',
    label: '仪表',
    width: 32,
    height: 49,
  },
  {
    key: 'xsd',
    img: '/static/processDrawEdit/xsd.png',
    label: '下水道',
    width: 40,
    height: 40,
  },
  {
    key: 'ddxhb',
    img: '/static/processDrawEdit/ddxhb.png',
    label: '电动循环泵',
    width: 102,
    height: 149,
  },
  {
    key: 'jyb',
    img: '/static/processDrawEdit/jyb.png',
    label: '加压泵',
    width: 150,
    height: 88,
  },
  {
    key: 'ssb',
    img: '/static/processDrawEdit/ssb.png',
    label: '疏水泵',
    width: 93,
    height: 158,
  },
  {
    key: 'qdxhsb',
    img: '/static/processDrawEdit/qdxhsb.png',
    label: '汽动循环水泵',
    width: 123,
    height: 149,
  },
  {
    key: 'bsb',
    img: '/static/processDrawEdit/bsb.png',
    label: '补水泵',
    width: 92,
    height: 114,
  },
  {
    key: 'rsq',
    img: '/static/processDrawEdit/rsq.png',
    label: '软水器',
    width: 124,
    height: 162,
  },
  {
    key: 'sslqq',
    img: '/static/processDrawEdit/sslqq.png',
    label: '疏水冷却器',
    width: 183,
    height: 101,
  },
  {
    key: 'glq',
    img: '/static/processDrawEdit/glq.png',
    label: '过滤器',
    width: 101,
    height: 61,
  },
  {
    key: 'gdyjrq',
    img: '/static/processDrawEdit/gdyjrq.png',
    label: '高压/低压加热器',
    width: 242,
    height: 144,
  },
  {
    key: 'cwq',
    img: '/static/processDrawEdit/cwq.png',
    label: '除污器',
    width: 85,
    height: 61,
  },
  {
    key: 'hrq',
    img: '/static/processDrawEdit/hrq.png',
    label: '换热器',
    width: 93,
    height: 172,
  },
  {
    key: 'hrq2',
    img: '/static/processDrawEdit/hrq2.png',
    label: '换热器2',
    width: 105,
    height: 171,
  },
  {
    key: 'rsx',
    img: '/static/processDrawEdit/rsx.png',
    label: '软水箱',
    width: 279,
    height:  218,
  },
  {
    key: 'xqj',
    img: '/static/processDrawEdit/xqj.png',
    label: '小汽机',
    width: 182,
    height: 167,
  },
  {
    key: 'njsg',
    img: '/static/processDrawEdit/njsg.png',
    label: '凝结水罐',
    width: 128,
    height: 132,
  },
  {
    key: 'jz',
    img: '/static/processDrawEdit/jz.png',
    label: '机组',
    width: 308,
    height: 161,
  },
  {
    key: 'cqxsc',
    img: '/static/processDrawEdit/cqxsc.png',
    label: '厂区泄水池',
    width: 447,
    height: 110,
  },
]);

function  submit(res: any) {
  console.log('%c [ res ]-12', 'font-size:13px; background:#879be4; color:#cbdfff;', res);
}
</script>

<template>
  <HelloWorld :canvasData="canvasData" :deviceData="panelData" @submit="submit"  />
</template>

<style scoped>
</style>
