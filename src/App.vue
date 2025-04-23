<!--
 * @Author: Strayer
 * @Date: 2025-04-15
 * @LastEditors: Strayer
 * @LastEditTime: 2025-04-23
 * @Description: 
 * @FilePath: \processDraw\src\App.vue
-->
<script setup lang="ts">
import HelloWorld from './components/processDrawEdit/index.vue'
import { shallowRef } from 'vue';

const canvasData = shallowRef<any>({
    "imgData": [
        {
            "id": "33c29117-4f10-4ff4-93a2-9919025096e9",
            "key": "yb",
            "width": 32,
            "height": 49,
            "coord": [
                1756.6561279296875,
                471.3593444824219
            ],
            "rotate": 0
        },
        {
            "id": "1dff17b2-d2d7-4cf2-9222-405a88557e5e",
            "key": "arrow",
            "width": 78.62613701820374,
            "height": 59.9056282043457,
            "coord": [
                1136.1024972200394,
                385.4117069244385
            ],
            "rotate": -13.205566288478108,
            "color": "#473A98",
            "scale": 3.7441017627716064
        },
        {
            "id": "d1e029bc-55bd-4cf9-920a-0efe0014e7c2",
            "key": "rsq",
            "width": 124,
            "height": 162,
            "coord": [
                775.9291381835938,
                424.0650634765625
            ],
            "rotate": 61.04468593339473
        }
    ],
    "lineData": [
        {
            "id": "0a00eecd-e382-4436-9363-cd04d3bfc35f",
            "angle90": true,
            "coord": [
                [
                    756.1307983398438,
                    335.0419616699219
                ],
                [
                    756.1307983398438,
                    119.01492309570312
                ],
                [
                    1290.4906005859375,
                    119.01492309570312
                ],
                [
                    1290.4906005859375,
                    118.2148208618164
                ],
                [
                    1760.055419921875,
                    118.2148208618164
                ],
                [
                    1760.055419921875,
                    447.0559997558594
                ],
                [
                    1756.0556640625,
                    447.0559997558594
                ],
                [
                    1756.0556640625,
                    379.8475646972656
                ],
                [
                    1167.2650146484375,
                    350.24761962890625
                ]
            ],
            "style": {
                "stroke": "#FF188C",
                "lineWidth": 4,
                "lineJoin": "bevel",
                "lineCap": "butt",
                "isDash": 1,
                "dashLen": 8,
                "dashGap": 2
            }
        },
        {
            "id": "ef7682ef-2f46-4261-b32a-93bf5aeb8ddd",
            "angle90": false,
            "coord": [
                [
                    756.1307983398438,
                    503.8631591796875
                ],
                [
                    826.5254516601562,
                    675.0845336914062
                ],
                [
                    1081.7064208984375,
                    409.4512939453125
                ],
                [
                    1727.2579345703125,
                    493.4617919921875
                ]
            ],
            "style": {
                "stroke": "#1890FF",
                "lineWidth": 10,
                "lineJoin": "miter",
                "lineCap": "butt",
                "isDash": 1,
                "dashLen": 4,
                "dashGap": 4
            }
        }
    ],
    "textData": [
        {
            "id": "834336e0-91ad-43ec-aaad-17e3428792ec",
            "coord": [
                1475.88427734375,
                463.08441162109375
            ],
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

function  submit(res: any) {
  console.log('%c [ res ]-12', 'font-size:13px; background:#879be4; color:#cbdfff;', res);
}
</script>

<template>
  <HelloWorld :canvasData="canvasData" @submit="submit"  />
</template>

<style scoped>
</style>
