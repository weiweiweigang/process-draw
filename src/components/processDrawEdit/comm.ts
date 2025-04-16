/*
 * @Author: Strayer
 * @Date: 2025-04-15
 * @LastEditors: Strayer
 * @LastEditTime: 2025-04-16
 * @Description: 
 * @FilePath: \processDraw\src\components\processDrawEdit\comm.ts
 */
import { Canvas, Group, Image, Rect, type ImageStyleProps } from '@antv/g';
import interact from 'interactjs';
import { moveCameraWhenDrag } from './data';

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
      console.log('%c [ event ]-56', 'font-size:13px; background:#954c7b; color:#d990bf;', event);
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
  group.translate(-param.width/2, -param.height/2)

  // 用矩形做高亮的边框
  const box = new Rect({
    name: 'imgBox__Rect',
    className: 'imgBox__Rect',
    style: {
      width: param.width,
      height: param.height,
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
  group.appendChild(imageEntity);
  
  // 高亮
  addEmphaticToImgGroupWhenHover(group);

  canvas.appendChild(group);

  // 拖拽, 已添加到画布时前提
  addDragToImgGroup(canvas, group)

  return group;
}
