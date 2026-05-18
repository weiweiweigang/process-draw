<!--
 * @Author: Strayer
 * @Date: 2025-04-15
 * @LastEditors: Strayer
 * @LastEditTime: 2025-05-07
 * @Description: 
 * @FilePath: \processDraw\src\App.vue
-->
<script setup lang="ts">
import HelloWorld from './components/processDrawEdit/index.vue'
import { shallowRef } from 'vue';
import aqfImg from './assets/processDrawEdit/aqf.png';
import gearImg from './assets/processDrawEdit/gear.png';
import closeImg from './assets/processDrawEdit/close.png';
import dataIconImg from './assets/processDrawEdit/dataIcon.png';
import ybImg from './assets/processDrawEdit/yb.png';
import xsdImg from './assets/processDrawEdit/xsd.png';
import ddxhbImg from './assets/processDrawEdit/ddxhb.png';
import jybImg from './assets/processDrawEdit/jyb.png';
import ssbImg from './assets/processDrawEdit/ssb.png';
import qdxhsbImg from './assets/processDrawEdit/qdxhsb.png';
import bsbImg from './assets/processDrawEdit/bsb.png';
import rsqImg from './assets/processDrawEdit/rsq.png';
import sslqqImg from './assets/processDrawEdit/sslqq.png';
import glqImg from './assets/processDrawEdit/glq.png';
import gdyjrqImg from './assets/processDrawEdit/gdyjrq.png';
import cwqImg from './assets/processDrawEdit/cwq.png';
import hrqImg from './assets/processDrawEdit/hrq.png';
import hrq2Img from './assets/processDrawEdit/hrq2.png';
import rsxImg from './assets/processDrawEdit/rsx.png';
import xqjImg from './assets/processDrawEdit/xqj.png';
import njsgImg from './assets/processDrawEdit/njsg.png';
import jzImg from './assets/processDrawEdit/jz.png';
import cqxscImg from './assets/processDrawEdit/cqxsc.png';

const canvasData = shallowRef<any>({
    "imgData": [
        {
            "key": "hrq2",
            "img": hrq2Img,
            "label": "换热器2",
            "width": 105,
            "height": 171,
            "type": "imgData",
            "id": "e78dac05-aa42-4359-bc7b-fe22cda92f3c",
            "coord": [
                1380.6669764518738,
                862.7560062408447
            ],
            "zIndex": 10,
            "rotate": 89.50518945005659
        },
        {
            "key": "aqf",
            "img": aqfImg,
            "label": "安全阀",
            "width": 38,
            "height": 47,
            "type": "imgData",
            "id": "f690cb49-10ec-464c-bae1-15a21f9ebabd",
            "coord": [
                1608.5436861366034,
                661.1828125566244
            ],
            "zIndex": 10,
            "rotate": 0
        },
        {
            "key": "yb",
            "img": ybImg,
            "label": "仪表",
            "width": 32,
            "height": 49,
            "type": "imgData",
            "id": "260100ee-b5ff-4b45-9ceb-bbefbeeb910a",
            "coord": [
                1612.7775056147948,
                1249.5398958195
            ],
            "zIndex": 10,
            "rotate": 0
        },
        {
            "key": "ddxhb",
            "img": ddxhbImg,
            "label": "电动循环泵",
            "width": 102,
            "height": 149,
            "type": "imgData",
            "id": "c618f785-49f2-4202-b34f-7f8abbd3f175",
            "coord": [
                867.7003600355238,
                1261.5425108494237
            ],
            "zIndex": 10,
            "rotate": -90.87714222788037
        },
        {
            "key": "rsx",
            "img": rsxImg,
            "label": "软水箱",
            "width": 279,
            "height": 218,
            "type": "imgData",
            "id": "f5d31904-cdbc-4e3c-af58-0223ae95954e",
            "coord": [
                1321.7007738109678,
                1481.8747597355396
            ],
            "zIndex": 10,
            "rotate": 0
        },
        {
            "key": "bsb",
            "img": bsbImg,
            "label": "补水泵",
            "width": 92,
            "height": 114,
            "type": "imgData",
            "id": "c8bf9c3c-a9f5-4d15-a914-0195c7b517da",
            "coord": [
                868.3868882316165,
                1428.0667421263643
            ],
            "zIndex": 10,
            "rotate": 0
        },
        {
            "key": "yb",
            "img": ybImg,
            "label": "仪表",
            "width": 32,
            "height": 49,
            "type": "imgData",
            "id": "10ede5ba-6486-444b-a8c5-faa275d9e155",
            "coord": [
                1053.2277509113774,
                1453.158044114709
            ],
            "zIndex": 10,
            "rotate": 0
        }
    ],
    "lineData": [
        {
            "id": "8a079581-2417-4b94-bd57-b530d2a2255f",
            "type": "lineData",
            "angle90": true,
            "coord": [
                [
                    397.53635036945343,
                    679.6776218414307
                ],
                [
                    1340.020389676094,
                    676.5042705535889
                ],
                [
                    1341.607059597969,
                    816.1315441131592
                ],
                [
                    1343.193729519844,
                    811.3715190887451
                ]
            ],
            "zIndex": 9,
            "style": {
                "stroke": "#1890FF",
                "lineWidth": 10,
                "lineJoin": "miter",
                "lineCap": "butt",
                "isDash": 0
            }
        },
        {
            "id": "47d9f8f5-ed91-4486-b859-34fcfc4f47a5",
            "type": "lineData",
            "angle90": true,
            "coord": [
                [
                    1436.4385514259338,
                    819.7968010902405
                ],
                [
                    1433.2652115821838,
                    673.8228402137756
                ]
            ],
            "zIndex": 9,
            "style": {
                "stroke": "#1890FF",
                "lineWidth": 10,
                "lineJoin": "miter",
                "lineCap": "butt",
                "isDash": 0
            }
        },
        {
            "id": "5f208023-b564-4627-91c0-9a889f4ff85e",
            "type": "lineData",
            "angle90": true,
            "coord": [
                [
                    1432.6703233718872,
                    676.5995717048645
                ],
                [
                    1747.6443717996942,
                    674.481841166117
                ]
            ],
            "zIndex": 9,
            "style": {
                "stroke": "#1890FF",
                "lineWidth": 10,
                "lineJoin": "miter",
                "lineCap": "butt",
                "isDash": 0,
                "dashLen": 4,
                "dashGap": 4
            }
        },
        {
            "id": "f9523745-498b-4f52-b197-69440c848b5a",
            "type": "lineData",
            "angle90": true,
            "coord": [
                [
                    1744.6896982192993,
                    674.3385581970215
                ],
                [
                    2127.0778818130493,
                    674.3385581970215
                ]
            ],
            "zIndex": 9,
            "style": {
                "stroke": "#1890FF",
                "lineWidth": 10,
                "lineJoin": "miter",
                "lineCap": "butt",
                "isDash": 0
            }
        },
        {
            "id": "1d78275b-5e3c-45b7-9422-ac0baaed2f31",
            "type": "lineData",
            "angle90": true,
            "coord": [
                [
                    1434.9313507080078,
                    881.5978217124939
                ],
                [
                    1438.1046905517578,
                    1202.1058478355408
                ]
            ],
            "zIndex": 9,
            "style": {
                "stroke": "#1890FF",
                "lineWidth": 10,
                "lineJoin": "miter",
                "lineCap": "butt",
                "isDash": 1,
                "dashLen": 4,
                "dashGap": 4
            }
        },
        {
            "id": "cfff8608-6a92-46e4-be3c-2be943b94e98",
            "type": "lineData",
            "angle90": true,
            "coord": [
                [
                    398.8448409880082,
                    1267.452491270747
                ],
                [
                    1348.9880159388888,
                    1262.115460307542
                ]
            ],
            "zIndex": 9,
            "style": {
                "stroke": "#1890FF",
                "lineWidth": 10,
                "lineJoin": "miter",
                "lineCap": "butt",
                "isDash": 1,
                "dashLen": 4,
                "dashGap": 4
            }
        },
        {
            "id": "9920d74c-55dd-45a5-8848-86b33ccb2a58",
            "type": "lineData",
            "angle90": true,
            "coord": [
                [
                    1349.0133289902308,
                    1265.9694808465613
                ],
                [
                    1346.7523193359375,
                    904.5252904891968
                ]
            ],
            "zIndex": 9,
            "style": {
                "stroke": "#1890FF",
                "lineWidth": 10,
                "lineJoin": "miter",
                "lineCap": "butt",
                "isDash": 1,
                "dashLen": 4,
                "dashGap": 4
            }
        },
        {
            "id": "6584b665-e032-4353-ace6-1b54b33c358a",
            "type": "lineData",
            "angle90": true,
            "coord": [
                [
                    1437.192626953125,
                    1198.1392822265625
                ],
                [
                    1437.192626953125,
                    1261.447509765625
                ],
                [
                    2144.888671875,
                    1259.1865234375
                ]
            ],
            "zIndex": 9,
            "style": {
                "stroke": "#1890FF",
                "lineWidth": 10,
                "lineJoin": "miter",
                "lineCap": "butt",
                "isDash": 1,
                "dashLen": 4,
                "dashGap": 4
            }
        },
        {
            "id": "d2628511-bc5d-4423-a431-4a156c4aaea3",
            "type": "lineData",
            "angle90": true,
            "coord": [
                [
                    2144.888671875,
                    673.5849609375
                ],
                [
                    2144.888671875,
                    673.5849609375
                ],
                [
                    2142.627685546875,
                    673.5849609375
                ]
            ],
            "zIndex": 9,
            "style": {
                "stroke": "#1890FF",
                "lineWidth": 10,
                "lineJoin": "miter",
                "lineCap": "butt",
                "isDash": 1,
                "dashLen": 4,
                "dashGap": 4
            }
        },
        {
            "id": "a6a6a43a-9dfb-4532-aa9e-61aabc289a03",
            "type": "lineData",
            "angle90": true,
            "coord": [
                [
                    2147.149658203125,
                    673.5849609375
                ],
                [
                    2147.149658203125,
                    673.5849609375
                ],
                [
                    2147.149658203125,
                    673.5849609375
                ]
            ],
            "zIndex": 9,
            "style": {
                "stroke": "#1890FF",
                "lineWidth": 10,
                "lineJoin": "miter",
                "lineCap": "butt",
                "isDash": 1,
                "dashLen": 4,
                "dashGap": 4
            }
        },
        {
            "id": "ac68ebe0-9a4a-49f8-bff6-241fd6ba9cd0",
            "type": "lineData",
            "coord": [
                [
                    615.3005981445312,
                    1268.1903076171875
                ],
                [
                    615.0380249023438,
                    1471.214111328125
                ]
            ],
            "zIndex": 9,
            "style": {
                "stroke": "#1890FF",
                "lineWidth": 10,
                "lineJoin": "miter",
                "lineCap": "butt",
                "isDash": 1,
                "dashLen": 4,
                "dashGap": 4
            }
        },
        {
            "id": "70598981-7ee5-4f20-a649-82574bea60bb",
            "type": "lineData",
            "coord": [
                [
                    614.0015258789062,
                    1475.664794921875
                ],
                [
                    1189.900634765625,
                    1470.2579345703125
                ]
            ],
            "zIndex": 9,
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
            "id": "afc1f308-4bc6-49df-b9c6-2e50834c4e82",
            "type": "textData",
            "coord": [
                355.67604637145996,
                683.3825902938843
            ],
            "box": {
                "width": 60,
                "height": 40,
                "fill": "#0E2C46",
                "lineWidth": 0,
                "stroke": "#0E2C46",
                "radius": 0
            },
            "text": {
                "text": "用户供水",
                "fontSize": 14,
                "fill": "#fff",
                "fontWeight": "normal",
                "textAlign": "start",
                "lineHeight": 24,
                "letterSpacing": 0,
                "dx": 12,
                "dy": 8
            },
            "dataOption": [],
            "zIndex": 11
        },
        {
            "id": "d464192b-a313-4742-bd57-5512834ffa89",
            "type": "textData",
            "coord": [
                376.258180052042,
                1266.5975755588152
            ],
            "box": {
                "width": 60,
                "height": 40,
                "fill": "#0E2C46",
                "lineWidth": 0,
                "stroke": "#0E2C46",
                "radius": 0
            },
            "text": {
                "text": "用户回水",
                "fontSize": 14,
                "fill": "#fff",
                "fontWeight": "normal",
                "textAlign": "start",
                "lineHeight": 24,
                "letterSpacing": 0,
                "dx": 12,
                "dy": 8
            },
            "dataOption": [],
            "zIndex": 11
        },
        {
            "id": "02958f99-f2b9-45cd-bf17-7802bf401381",
            "type": "textData",
            "coord": [
                2144.8886380195618,
                669.0629830360413
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
                "text": "热网供水",
                "fontSize": 14,
                "fill": "#fff",
                "fontWeight": "normal",
                "textAlign": "start",
                "lineHeight": 24,
                "letterSpacing": 0,
                "dx": 12,
                "dy": 8
            },
            "zIndex": 11,
            "dataOption": []
        },
        {
            "id": "925a9e1a-428d-4783-80fe-cadd3128e169",
            "type": "textData",
            "coord": [
                2150.9180026054382,
                1262.9548859596252
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
                "text": "热网回水",
                "fontSize": 14,
                "fill": "#fff",
                "fontWeight": "normal",
                "textAlign": "start",
                "lineHeight": 24,
                "letterSpacing": 0,
                "dx": 12,
                "dy": 8
            },
            "zIndex": 11,
            "dataOption": []
        },
        {
            "id": "43daa013-8127-4c9e-a152-c13d58ed4569",
            "type": "textData",
            "coord": [
                1983.7155333985575,
                616.2213478358462
            ],
            "box": {
                "width": 120,
                "height": 40,
                "fill": "#0E2C46",
                "lineWidth": 0,
                "stroke": "#0E2C46",
                "radius": 0
            },
            "text": {
                "text": "压力 -- MPa\n温度 -- ℃",
                "fontSize": 20,
                "fill": "#fff",
                "fontWeight": "normal",
                "textAlign": "start",
                "lineHeight": 24,
                "letterSpacing": 0,
                "dx": 12,
                "dy": 8
            },
            "isDataBox": true,
            "dataOption": [
                {
                    "key": "a-15",
                    "label": "",
                    "unit": "MPa"
                },
                {
                    "key": "a-11",
                    "label": "",
                    "unit": "℃"
                }
            ],
            "zIndex": 11
        },
        {
            "id": "03178f1d-7aca-4435-bf4c-252462ab0f00",
            "type": "textData",
            "coord": [
                2010.9856745004654,
                1192.530030965805
            ],
            "box": {
                "width": 120,
                "height": 40,
                "fill": "#0E2C46",
                "lineWidth": 0,
                "stroke": "#0E2C46",
                "radius": 0
            },
            "text": {
                "text": "一网回压 -- MPa\n一网回温 -- ℃",
                "fontSize": 20,
                "fill": "#fff",
                "fontWeight": "normal",
                "textAlign": "start",
                "lineHeight": 24,
                "letterSpacing": 0,
                "dx": 12,
                "dy": 8
            },
            "isDataBox": true,
            "dataOption": [
                {
                    "key": "a-16",
                    "label": "",
                    "unit": "MPa"
                },
                {
                    "key": "a-12",
                    "label": "",
                    "unit": "℃"
                }
            ],
            "zIndex": 11
        },
        {
            "id": "e764c585-8955-44e1-bbab-128eba5d3b0a",
            "type": "textData",
            "coord": [
                867.8630992341787,
                1530.7156942263246
            ],
            "box": {
                "width": 120,
                "height": 40,
                "fill": "#0E2C46",
                "lineWidth": 0,
                "stroke": "#0E2C46",
                "radius": 0
            },
            "text": {
                "text": " -- HZ",
                "fontSize": 20,
                "fill": "#fff",
                "fontWeight": "normal",
                "textAlign": "start",
                "lineHeight": 24,
                "letterSpacing": 0,
                "dx": 12,
                "dy": 8
            },
            "isDataBox": true,
            "dataOption": [
                {
                    "key": "a-26",
                    "label": "",
                    "unit": "HZ"
                }
            ],
            "zIndex": 11
        },
        {
            "id": "0d96c69f-2738-4c3b-bd09-9ab18e0d4f04",
            "type": "textData",
            "coord": [
                868.1776396119967,
                1169.931647669524
            ],
            "box": {
                "width": 120,
                "height": 40,
                "fill": "#0E2C46",
                "lineWidth": 0,
                "stroke": "#0E2C46",
                "radius": 0
            },
            "text": {
                "text": "循环泵频率 -- HZ",
                "fontSize": 20,
                "fill": "#fff",
                "fontWeight": "normal",
                "textAlign": "start",
                "lineHeight": 24,
                "letterSpacing": 0,
                "dx": 12,
                "dy": 8
            },
            "isDataBox": true,
            "dataOption": [
                {
                    "key": "a-23",
                    "label": "",
                    "unit": "HZ"
                }
            ],
            "zIndex": 11
        },
        {
            "id": "d82dec04-153e-4dd2-83eb-55b6e9e31f6f",
            "type": "textData",
            "coord": [
                525.6380192041397,
                601.1901109218597
            ],
            "box": {
                "width": 120,
                "height": 40,
                "fill": "#0E2C46",
                "lineWidth": 0,
                "stroke": "#0E2C46",
                "radius": 0
            },
            "text": {
                "text": "二网供压 -- MPa\n二网供温 -- ℃",
                "fontSize": 20,
                "fill": "#fff",
                "fontWeight": "normal",
                "textAlign": "start",
                "lineHeight": 24,
                "letterSpacing": 0,
                "dx": 12,
                "dy": 8
            },
            "isDataBox": true,
            "dataOption": [
                {
                    "key": "a-17",
                    "label": "",
                    "unit": "MPa"
                },
                {
                    "key": "a-13",
                    "label": "",
                    "unit": "℃"
                }
            ],
            "zIndex": 11
        },
        {
            "id": "f4b1d571-0bb9-4398-9a09-f2af99f88242",
            "type": "textData",
            "coord": [
                536.190072638914,
                1175.205137164332
            ],
            "box": {
                "width": 120,
                "height": 40,
                "fill": "#0E2C46",
                "lineWidth": 0,
                "stroke": "#0E2C46",
                "radius": 0
            },
            "text": {
                "text": "压力 -- MPa\n温度 -- ℃",
                "fontSize": 20,
                "fill": "#fff",
                "fontWeight": "normal",
                "textAlign": "start",
                "lineHeight": 24,
                "letterSpacing": 0,
                "dx": 12,
                "dy": 8
            },
            "isDataBox": true,
            "dataOption": [
                {
                    "key": "a-18",
                    "label": "",
                    "unit": "MPa"
                },
                {
                    "key": "a-14",
                    "label": "",
                    "unit": "℃"
                }
            ],
            "zIndex": 11
        },
        {
            "id": "8ed0611e-4fbd-459d-9239-9b28c687e693",
            "type": "textData",
            "coord": [
                1622.0489816493355,
                594.3637754116207
            ],
            "box": {
                "width": 100,
                "height": 40,
                "fill": "#0E2C46",
                "lineWidth": 0,
                "stroke": "#0E2C46",
                "radius": 0
            },
            "text": {
                "text": "调节阀开度 -- %",
                "fontSize": 20,
                "fill": "#fff",
                "fontWeight": "normal",
                "textAlign": "start",
                "lineHeight": 24,
                "letterSpacing": 0,
                "dx": 12,
                "dy": 8
            },
            "isDataBox": true,
            "dataOption": [
                {
                    "key": "a-21",
                    "label": "",
                    "unit": "%"
                }
            ],
            "zIndex": 11
        },
        {
            "id": "12612892-688f-4044-a798-d350995a7a81",
            "type": "textData",
            "coord": [
                1611.9759854692966,
                1186.41353071481
            ],
            "box": {
                "width": 120,
                "height": 40,
                "fill": "#0E2C46",
                "lineWidth": 0,
                "stroke": "#0E2C46",
                "radius": 0
            },
            "text": {
                "text": " -- ",
                "fontSize": 20,
                "fill": "#fff",
                "fontWeight": "normal",
                "textAlign": "start",
                "lineHeight": 24,
                "letterSpacing": 0,
                "dx": 12,
                "dy": 8
            },
            "isDataBox": true,
            "dataOption": [
                {
                    "key": "a-90",
                    "label": "",
                    "unit": "m³/h"
                },
                {
                    "key": "a-91",
                    "unit": "GJ/h"
                }
            ],
            "zIndex": 11
        },
        {
            "id": "19c5f325-8e7f-47d9-941f-b37f016c45fa",
            "type": "textData",
            "coord": [
                1329.3008303493261,
                1500.4514274075627
            ],
            "box": {
                "width": 120,
                "height": 40,
                "fill": "#0E2C46",
                "lineWidth": 0,
                "stroke": "#0E2C46",
                "radius": 0
            },
            "text": {
                "text": " -- m",
                "fontSize": 20,
                "fill": "#fff",
                "fontWeight": "normal",
                "textAlign": "start",
                "lineHeight": 24,
                "letterSpacing": 0,
                "dx": 12,
                "dy": 8
            },
            "isDataBox": true,
            "dataOption": [
                {
                    "key": "a-29",
                    "unit": "m"
                }
            ],
            "zIndex": 11
        },
        {
            "id": "ab37ff5a-88cf-45e3-bc40-e5c042d52008",
            "type": "textData",
            "coord": [
                1064.1723099686205,
                1387.8895075693727
            ],
            "box": {
                "width": 120,
                "height": 40,
                "fill": "#0E2C46",
                "lineWidth": 0,
                "stroke": "#0E2C46",
                "radius": 0
            },
            "text": {
                "text": " -- m³/h",
                "fontSize": 20,
                "fill": "#fff",
                "fontWeight": "normal",
                "textAlign": "start",
                "lineHeight": 24,
                "letterSpacing": 0,
                "dx": 12,
                "dy": 8
            },
            "isDataBox": true,
            "dataOption": [
                {
                    "key": "a-98",
                    "unit": "m³/h"
                }
            ],
            "zIndex": 11
        }
    ]
})

const panelData = shallowRef<any []>([
    {"key":"zhf","img":"","label":"止回阀","width":28,"height":28,"path":"M19.358 4.721v3.711l-4.68-.001v1.857h2.716v2.474h1.9v-1.67h2.318v1.67l1.974-.001v-2.072h2.699l-.001 14.032h-2.698v-2.075h-1.974v1.646h-2.318v-1.646H8.64v1.646H6.51v-1.646H4.443v2.075H2V10.688h2.443v2.073l1.969.001v-1.67H8.64v1.67l1.965-.001v-2.472h2.715V8.431H8.64v-3.71h1.965V3h1.813v1.721h3.159V3h1.817v1.721z M20.499 15.221v5M7.499 15.221v5","color":"#000A20","stroke":"#EE1313","strokePredefine":["#EE1313","#2AE620"]},
    {"key":"zf","img":"","label":"闸阀","width":28,"height":28,"path":"M19.359 4v3.712l-4.681-.001v1.856h2.716v2.475l2.831-.001V9.968H24l-.001 2.073.001 9.884L23.999 24h-3.773l-.001-2.075H7.774V24H4V9.967h3.774v2.074h2.832V9.568h2.715V7.711h-4.68V4z","color":"#000A20","stroke":"#EE1313","strokePredefine":["#EE1313","#2AE620"]},
    {"key":"df","img":"","label":"蝶阀","width":28,"height":28,"path":"M23.097 4v3.503h-6.348v2.14c0 .135-.012.27-.04.405 1.236.523 2.25 1.583 3.043 3.18h2.622v-2.51H25v12.98l-2.625.02-.001-2.219H19.55c-.641 2.072-2.703 3.5-5.05 3.5-2.346 0-4.406-1.428-5.049-3.5H6.624v2.222L4 23.76v-13h2.624v2.47h2.624c.792-1.598 1.807-2.66 3.043-3.186a1.827 1.827 0 0 1-.043-.406V7.503H5.902L5.9 4h17.197Z M10.886 15.374a.5.5 0 0 1 .6-.224l.082.038 6.407 3.498a.5.5 0 0 1-.413.906l-.083-.038-6.407-3.498a.5.5 0 0 1-.186-.682Z M14.5 16a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z","color":"#000A20","stroke":"#EE1313","strokePredefine":["#EE1313","#2AE620"]},
    {"key":"dddf","img":"","label":"电动蝶阀","width":28,"height":28,"path":"M12 5.495 13.513 4l1.769 1.495L17 4 M16.712 2a3.04 3.04 0 0 1 3.04 3.04v.037a3.003 3.003 0 0 1-2.826 2.997l-.177.005v2.14c0 .135-.012.271-.04.406 1.236.522 2.25 1.583 3.043 3.18l2.622-.001v-2.51H25v12.98l-2.625.02-.001-2.218H19.55c-.641 2.071-2.703 3.5-5.05 3.5-2.346 0-4.406-1.429-5.049-3.5H6.624v2.222L4 24.335v-13h2.624v2.471h2.624c.792-1.599 1.807-2.661 3.043-3.186a1.827 1.827 0 0 1-.043-.407V8.08A2.999 2.999 0 0 1 9.25 5.082v-.043A3.038 3.038 0 0 1 12.287 2h4.425Z M10.886 15.95a.5.5 0 0 1 .6-.223l.082.037 6.407 3.498a.5.5 0 0 1-.413.906l-.083-.037-6.407-3.498a.5.5 0 0 1-.186-.682Z M14.5 16.576a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z","color":"#000A20","stroke":"#EE1313","strokePredefine":["#EE1313","#2AE620"]},
    {"key":"dcf","img":"","label":"电磁阀","width":28,"height":28,"path":"M11.5 5.5h5 M19.359 2v7.712l-4.681-.001v1.856h2.716v2.475l2.831-.001v-2.073H24l-.001 2.073.001 9.884L23.999 26h-3.773l-.001-2.075H7.774V26H4V11.967h3.774v2.074h2.832v-2.473h2.715V9.711h-4.68V2z","color":"#000A20","stroke":"#EE1313","strokePredefine":["#EE1313","#2AE620"]},
    {"key":"aqf","img":aqfImg,"label":"安全阀","width":38,"height":47},
    {"key":"remotePoint","img":gearImg,"label":"远控点","isRemotePoint":true,"width":42,"height":42},
    {"key":"close","img":closeImg,"label":"关闭","width":40,"height":31},
    {"key":"arrow","img":"","label":"箭头","width":21,"height":16,"path":"m12.312949,15.530085a1.043584,1.043584 0 0 1 -0.529097,-0.144015l-11.124602,-6.5464a1.043584,1.043584 0 0 1 0,-1.801225l11.126689,-6.505701a1.043584,1.043584 0 0 1 1.570593,0.900613l0,2.453465l5.734492,-3.354078a1.043584,1.043584 0 0 1 1.570593,0.900613l0,13.053144a1.043584,1.043584 0 0 1 -1.572681,0.899569l-5.732405,-3.372862l0,2.473293a1.043584,1.043584 0 0 1 -1.043584,1.043584z","color":"#3A7A98","colorPredefine":["#3A7A98","#76A32C","#A6613C"],"stroke":""},
    {"key":"dataIcon","img":dataIconImg,"label":"数据标识","width":24,"height":24},
    {"key":"yb","img":ybImg,"label":"仪表","width":32,"height":49},
    {"key":"xsd","img":xsdImg,"label":"下水道","width":40,"height":40},
    {"key":"ddxhb","img":ddxhbImg,"label":"电动循环泵","width":102,"height":149},
    {"key":"jyb","img":jybImg,"label":"加压泵","width":150,"height":88},
    {"key":"ssb","img":ssbImg,"label":"疏水泵","width":93,"height":158},
    {"key":"qdxhsb","img":qdxhsbImg,"label":"汽动循环水泵","width":123,"height":149},
    {"key":"bsb","img":bsbImg,"label":"补水泵","width":92,"height":114},
    {"key":"rsq","img":rsqImg,"label":"软水器","width":124,"height":162},
    {"key":"sslqq","img":sslqqImg,"label":"疏水冷却器","width":183,"height":101},
    {"key":"glq","img":glqImg,"label":"过滤器","width":101,"height":61},
    {"key":"gdyjrq","img":gdyjrqImg,"label":"高压/低压加热器","width":242,"height":144},
    {"key":"cwq","img":cwqImg,"label":"除污器","width":85,"height":61},
    {"key":"hrq","img":hrqImg,"label":"换热器","width":93,"height":172},
    {"key":"hrq2","img":hrq2Img,"label":"换热器2","width":105,"height":171},
    {"key":"rsx","img":rsxImg,"label":"软水箱","width":279,"height":218},
    {"key":"xqj","img":xqjImg,"label":"小汽机","width":182,"height":167},
    {"key":"njsg","img":njsgImg,"label":"凝结水罐","width":128,"height":132},
    {"key":"jz","img":jzImg,"label":"机组","width":308,"height":161},
    {"key":"cqxsc","img":cqxscImg,"label":"厂区泄水池","width":447,"height":110}
])

const cameraData = shallowRef<{ zoom: number; position: [number, number, number]; }>({
        "zoom": 0.7737809375,
        "position": [1276.8662109375, 982.9466552734375, 500]
    })

function  submit(res: any) {
  console.log('%c [ res ]-12', 'font-size:13px; background:#879be4; color:#cbdfff;', res);
}
</script>

<template>
  <HelloWorld :canvasData="canvasData" :camera="cameraData" :deviceData="panelData" @submit="submit"  />
</template>

<style scoped>
</style>
