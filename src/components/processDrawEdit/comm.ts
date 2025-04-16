/*
 * @Author: Strayer
 * @Date: 2025-04-15
 * @LastEditors: Strayer
 * @LastEditTime: 2025-04-16
 * @Description: 
 * @FilePath: \processDraw\src\components\processDrawEdit\comm.ts
 */
import { Canvas, Group, Image, Polyline, Rect, type ImageStyleProps } from '@antv/g';
import interact from 'interactjs';
import { isCreateLine, moveCameraWhenDrag, panelData } from './data';
import { v4 as uuidv4 } from 'uuid';

/**
 * @description: 给图片元素添加鼠标移入高亮
 */
export function addEmphaticToImgGroupWhenHover(el: any) {
  const element: any = el.querySelector('.imgBox__Rect');
  if(!element) return;
  // 存储原始的图形样式属性
  // const primitiveBorder = {
  //   stroke: element.style.stroke,
  //   lineWidth: element.style.lineWidth,
  //   opacity: element.style.opacity,
  // };

  el.addEventListener('mouseenter', (e: any) => {
    // 修改图形样式属性
    element.style.stroke = '#16bdf0';
    element.style.lineWidth = 4;
    element.style.opacity = 0.3;
  });

  el.addEventListener('mouseleave', (e: any) => {
    // 还原图形样式属性
    // element.style.stroke = primitiveBorder.stroke;
    // element.style.lineWidth = primitiveBorder.lineWidth;
    // element.style.opacity = primitiveBorder.opacity;
    element.style.lineWidth = 0;

  });
}

/**
 * @description: 给图片元素添加拖拽效果
 */
export function addDragToImgGroup(canvas: Canvas, el: any) {
  const camera = canvas.getCamera();

  interact(el as any, {
  // 直接传入节点1
    context: canvas.document as any, // 传入上下文
  }).draggable({
    onstart: function (event) {
      // 禁止画布移动
      moveCameraWhenDrag.value = false;
    },
    onmove: function (event) {
      // interact.js 告诉我们的偏移量
      const { dx, dy } = event;
      const zoom = camera.getZoom();

      // 改变节点1位置
      el.translateLocal(dx / zoom, dy / zoom);
      // 获取节点1位置
      const [nx, ny] = el.getLocalPosition();
      // 改变边的端点位置
      // edge.style.x1 = nx;
      // edge.style.y1 = ny;
    },
    onend: function (event) {
      console.log('%c [ event ]-67', 'font-size:13px; background:#afb2d7; color:#f3f6ff;', event);
      // 恢复画布移动
      setTimeout(() => {
        moveCameraWhenDrag.value = true;
      }, 100);
      },
    });
}

/**
 * @description: 新建一个img元素
 */
export  function createImgEntity(canvas: Canvas, param: {
  x: number,
  y: number,
  src: string,
  width: number,
  height: number,
}) {
  const paddingPx = 8;
  const width = param.width + paddingPx * 2;
  const height = param.height + paddingPx * 2;

  const group = new Group({
    name: 'imgBox',
    className: 'imgBox',
    style: {
      cursor: 'pointer',
      // transform: 'translate(-100px, -100px)',
      // transformOrigin: 'center',
    }
  });
  group.setPosition(param.x, param.y);
  group.translate(-width/2, -height/2)

  // 用矩形做高亮的边框
  const box = new Rect({
    name: 'imgBox__Rect',
    className: 'imgBox__Rect',
    style: {
      width: width,
      height: height,
    }
  })
  group.appendChild(box);

  const imageEntity = new Image({
    name: 'imgBox__img',
    className: 'imgBox__img',
    style: {
      width: param.width,
      height: param.height,
      src: param.src,
    },
  });
  imageEntity.translateLocal(paddingPx, paddingPx)
  group.appendChild(imageEntity);
  
  // 高亮
  addEmphaticToImgGroupWhenHover(group);

  canvas.appendChild(group);

  // 拖拽, 已添加到画布时前提
  addDragToImgGroup(canvas, group)

  return group;
}

/**
 * @description: 拓扑元件过来新增
 */
export function imgDropHandle(canvas: Canvas, event:any) {
  event.preventDefault();
  
  const data = event.dataTransfer.getData('Text');
  const item = panelData.value.find(item => item.key === data);
  console.log('%c [ item ]-160', 'font-size:13px; background:#000; color:#fdffcd;', item);
  if(item) {
    const point = client2Canvas(canvas, [event.clientX, event.clientY])

    createImgEntity(canvas, {
      x: point.x,
      y: point.y,
      width: item.width,
      height: item.height,
      src: '/static/processDrawEdit/'+item.img,
    })
  }
}

/**
 * @description: 把输入的屏幕坐标转换为画布坐标
 */
export function client2Canvas(canvas: Canvas, clientPoint: [number, number]) {
  // - 计算当前点坐标
  const point = canvas.client2Viewport({ x: clientPoint[0], y: clientPoint[1]});
  // -  计算当前点和画布中心点的距离，
  const distance = {
    x: (point.x - canvas.getConfig().width! / 2),
    y: (point.y - canvas.getConfig().height! / 2),
  }
  // 再把距离除以缩放比例，
  distance.x /= canvas.getCamera().getZoom();
  distance.y /= canvas.getCamera().getZoom();
  // - 该距离加上相机的移动距离
  distance.x += canvas.getCamera().getPosition()[0];
  distance.y += canvas.getCamera().getPosition()[1];

  return distance
}

/**
 * @description: 绘制管道
 * 鼠标左键点击一下记下一个点的坐标，鼠标双击完成绘制
 */
export function createLine(canvas: Canvas, style?: any) {
  if(isCreateLine.value) return;
  isCreateLine.value = true;
  let lineCoords: [number, number][] = [];

  const polyline = new Polyline({
    id: uuidv4(),
    name: 'line',
    class: 'line',
    style: {
      points: JSON.parse(JSON.stringify(lineCoords)),
      stroke: '#1890FF',
      lineWidth: 10,
      cursor: 'pointer',
      // lineDash: [4, 4],
      ...style,
    },
  });
  console.log('polyline.id:', polyline.id)

  // 鼠标左键点击一下记下一个点的坐标，鼠标双击完成绘制
  let perTapTime = new Date();
  const clickHandle = (event: any) => {
    console.log('click')
    // 计算坐标
    const point = client2Canvas(canvas, [event.clientX, event.clientY])
    lineCoords.push([point.x, point.y]);
    polyline.style.points = JSON.parse(JSON.stringify(lineCoords));

    if(lineCoords.length === 1) {
      canvas.appendChild(polyline);
      addDragToImgGroup(canvas, polyline)
    }

    // 两次点击的时间少于500ms判断为双击
    const nowTapTime = new Date();
    if(nowTapTime.getTime() - perTapTime.getTime() < 300) {
      isCreateLine.value = false;
      canvas.removeEventListener('click', clickHandle);
      canvas.removeEventListener('mousemove', hoverHandle);
    }
    perTapTime = nowTapTime;
  };
  canvas.addEventListener('click', clickHandle);

  // 鼠标悬浮移动时 线的终点跟随移动
  const hoverHandle = (event: any) => {
    // 计算坐标
    const point = client2Canvas(canvas, [event.clientX, event.clientY])
    polyline.style.points = JSON.parse(JSON.stringify([...lineCoords, [point.x, point.y]]));
  }
  canvas.addEventListener('mousemove', hoverHandle);
}
