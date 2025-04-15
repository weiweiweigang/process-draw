/*
 * @Author: Strayer
 * @Date: 2025-03-20
 * @LastEditors: Strayer
 * @LastEditTime: 2025-04-15
 * @Description: 
 * @FilePath: \processDraw\src\components\processDrawEdit\index.ts
 */
import { Circle, Text, Line, Canvas } from '@antv/g';
import Hammer from 'hammerjs';
import { moveCameraWhenDrag } from './data';

/**
 * @description: 添加节点
 */
export function addNode1() {
  // 节点1
  const node1 = new Circle({
    style: {
      r: 100, // 半径
      fill: '#1890FF', // 填充色
      stroke: '#F04864', // 描边颜色
      lineWidth: 4, // 描边宽度
      zIndex: 3, // 层级
      cursor: 'pointer',
    },
  });

  // 我们只需要设置节点的位置，它的所有子节点（文本）也会跟着移动
  node1.setPosition(200, 200);

  node1.addEventListener('mouseenter', () => {
    // 修改图形样式属性
    node1.style.fill = 'red';
  });
  node1.addEventListener('mouseleave', () => {
    // 修改图形样式属性
    node1.style.fill = '#1890FF';
  });

  return node1;
}

/**
 * @description: 添加节点
 */
export function addNode2() {
  // 节点1
  const node = new Circle({
    style: {
      r: 100, // 半径
      fill: '#1890FF', // 填充色
      stroke: '#F04864', // 描边颜色
      lineWidth: 4, // 描边宽度
      zIndex: 3, // 层级
    },
  });

  // 文本应该是节点的子节点，在场景图中，这种父子关系通过 appendChild 构建：
  node.appendChild(addText()); // 添加文本

  // 我们只需要设置节点的位置，它的所有子节点（文本）也会跟着移动
  node.setPosition(500, 500);

  return node;
}

/**
 * @description: 添加文本
 */
export function addText() {
  const text = new Text({
    style: {
      text: 'Node1', // 文本内容
      fontFamily: 'Avenir', // 字体
      fontSize: 22, // 字号
      fill: '#fff', // 文本颜色
      textAlign: 'center', // 水平居中
      textBaseline: 'middle', // 垂直居中
    },
  });
  return text;
}


/**
 * @description: 添加线
 */
export function addLine() {
  const edge = new Line({
    style: {
      x1: 200,
      y1: 200,
      x2: 500,
      y2: 500,
      stroke: '#189',
      lineWidth: 2,
      zIndex: 2, // 层级
    },
  });
  return edge;
}

/**
 * @description: 使用鼠标滚轮实现相机缩放
 */
export function addWheel(canvas: Canvas) {
  const camera = canvas.getCamera();
  // 设置最小和最大缩放比例
  const minZoom = 0;
  const maxZoom = Infinity;
  canvas.addEventListener(
    'wheel',
    (e: any) => {
      e.preventDefault();
      let zoom;
      if (e.deltaY < 0) {
        zoom = Math.max(
          minZoom,
          Math.min(maxZoom, camera.getZoom() / 0.95)
        );
      } else {
        zoom = Math.max(
          minZoom,
          Math.min(maxZoom, camera.getZoom() * 0.95)
        );
      }

      // 设置相机缩放参数
      camera.setZoom(zoom);
    },
    { passive: false }
  );
}

/**
 * @description: 使用 hammer.js 实现相机移动
 */
export function moveCamera(canvas: Canvas) {
  const camera = canvas.getCamera();

  const hammer = new Hammer(canvas as any);
  let preCoord = [0, 0];
  hammer.on('panstart', (ev) => {
    if(!moveCameraWhenDrag.value) return;

    preCoord = [ev.deltaX, ev.deltaY];
    console.log('%c [ getZoom ]-161', 'font-size:13px; background:#7a969b; color:#bedadf;',  camera.getZoom());

  });
  hammer.on('pan', (ev) => {
    if(!moveCameraWhenDrag.value) return;

    // ev.deltaX/Y 为水平/垂直方向的偏移量
    // 沿水平/垂直方向移动相机

    const zoom = Math.pow(2, camera.getZoom()-1);

    camera.pan((-ev.deltaX + preCoord[0]) / zoom, (-ev.deltaY + preCoord[1]) / zoom);
    preCoord = [ev.deltaX, ev.deltaY];

  });

}