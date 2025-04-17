/*
 * @Author: Strayer
 * @Date: 2025-04-15
 * @LastEditors: Strayer
 * @LastEditTime: 2025-04-17
 * @Description: 
 * @FilePath: \processDraw\src\components\processDrawEdit\comm.ts
 */
import { Canvas, Circle, DisplayObject, ElementEvent, Group, HTML, Image, Path, Polyline, Rect, type ImageStyleProps } from '@antv/g';
import interact from 'interactjs';
import { disableDragDevice, isCreateLine, disableDragCamera, panelData, type MenuDataItem } from './data';
import { v4 as uuidv4 } from 'uuid';

/**
 * @description: 给图片元素添加鼠标移入高亮
 */
function addEmphaticToImgGroupWhenHover(el: any) {
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
function addDragToImgGroup(canvas: Canvas, el: any) {
  const camera = canvas.getCamera();

  interact(el as any, {
  // 直接传入节点1
    context: canvas.document as any, // 传入上下文
  }).draggable({
    onstart: function (event) {
      if(disableDragDevice.value) return;
      // 禁止画布移动
      disableDragCamera.value = true;
    },
    onmove: function (event) {
      if(disableDragDevice.value) return;

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
      if(disableDragDevice.value) return;

      console.log('%c [ event ]-67', 'font-size:13px; background:#afb2d7; color:#f3f6ff;', event);
      // 恢复画布移动
      setTimeout(() => {
        disableDragCamera.value = false;
      }, 100);
      },
    });
}

/**
 * @description: 给元素自定义右键菜单
 */
function customContextMenu(canvas: Canvas, el: DisplayObject, menuData: MenuDataItem []) {
  el.addEventListener('rightup', (e: any) => {
    // e.preventDefault(); // 阻止浏览器默认的右键菜单
    // e.stopPropagation(); // 阻止事件传播
    console.log('%c [ el ]-90', 'font-size:13px; background:#f62979; color:#ff6dbd;', el.id);
    
    const point = client2Canvas(canvas, [e.clientX+10, e.clientY]);

    let innerHtml = `<div class="context-menu">`
    for(const item of menuData) {
      innerHtml += `
        <div class="context-menu__item" data-key="${item.key}">
          <i class="context-menu__icon">${ item.icon }</i>${ item.label }
        </div>
      `
    }
    innerHtml += `</div>`;
    
    // 自定义右键菜单
    const html = new HTML({
        id: 'antVGContextMenu',
        style: {
            x: point.x,
            y: point.y,
            width: 100,
            height: 100,
            innerHTML: innerHtml,
            pointerEvents: 'all',
        },
    });
    canvas.appendChild(html);

    setTimeout(() => {
      // 监听菜单选项点击事件
      const items = document.querySelectorAll('#antVGContextMenu .context-menu__item');
      for(const item of items) {
        item.addEventListener('click', (e: any) => {
          console.log('%c [ e ]-133', 'font-size:13px; background:#3277e3; color:#76bbff;', e);
          const menuKey = e.target.dataset.key;
          const menuItem = menuData.find(item => item.key === menuKey);
          menuItem?.clickHandle(menuItem.clickParam);
          html.remove();
          canvas.removeEventListener('click', clickRemoveHand);
        })
      }

      const clickRemoveHand = (e: any) => {
        html.remove();
        canvas.removeEventListener('click', clickRemoveHand);
      }
      // 监听画布点击事件移除菜单
      canvas.addEventListener('click', clickRemoveHand);
    }, 200)
  })
}

/**
 * @description: 新建一个img元素
 */
function createImgEntity(canvas: Canvas, param: {
  x: number,
  y: number,
  src: string,
  width: number,
  height: number,
  path?: string,
  color?: string,
}) {
  const paddingPx = 8;
  const width = param.width + paddingPx * 2;
  const height = param.height + paddingPx * 2;

  const group = new Group({
    id: uuidv4(),
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
  group.setOrigin(width/2, height/2)

  // 内部加个box做旋转
  const groupInner = new Group({
    name: 'imgBox__inner',
    className: 'imgBox__inner',
  });
  groupInner.setOrigin(width/2, height/2)
  group.appendChild(groupInner);

  // 用矩形做高亮的边框
  const box = new Rect({
    name: 'imgBox__Rect',
    className: 'imgBox__Rect',
    style: {
      width: width,
      height: height,
    }
  })
  groupInner.appendChild(box);

  let imageEntity: DisplayObject = new Image({
    name: 'imgBox__img',
    className: 'imgBox__img',
    style: {
      width: param.width,
      height: param.height,
      src: param.src,
    },
  });
  if(param.path) {
    imageEntity = new Path({
      name: 'imgBox__path',
      className: 'imgBox__path',
      style: {
        d: param.path,
        fill: param.color ?? '#54BECC',
        // cursor: 'pointer',
      },
    });
    // imageEntity.setLocalScale(0.5) // TODO: 这里要去掉
  }

  imageEntity.translateLocal(paddingPx, paddingPx)
  groupInner.appendChild(imageEntity);
  
  // 高亮
  addEmphaticToImgGroupWhenHover(group);

  canvas.appendChild(group);

  // 拖拽, 已添加到画布时前提
  addDragToImgGroup(canvas, group)

  // 添加旋转功能
  addRotateToEntity(canvas, groupInner)

  // 自定义右键菜单
  customContextMenu(canvas, group, [
    {
      key: 'edit',
      label: '编辑',
      icon: '✏️',
      clickParam: group.id,
      clickHandle: (id: string) => {
        console.log('%c [ id ]-212', 'font-size:13px; background:#fff; color:#ff4bff;', id);
      },
    },
    {
      key: 'copy',
      label: '复制',
      icon: '📋',
      clickParam: group.id,
      clickHandle: (id: string) => {
        console.log('%c [ id ]-212', 'font-size:13px; background:#fff; color:#ff4bff;', id);
      },
    },
    {
      key: 'delete',
      label: '删除',
      icon: '🗑️',
      clickParam: group.id,
      clickHandle: (id: string) => {
        console.log('%c [ id ]-212', 'font-size:13px; background:#fff; color:#ff4bff;', id);
        canvas.document.querySelector('#'+id)?.remove();
      },
    },
    {
      key: 'top',
      label: '置顶',
      icon: '⬆️',
      clickParam: group.id,
      clickHandle: (id: string) => {
        console.log('%c [ id ]-212', 'font-size:13px; background:#fff; color:#ff4bff;', id);
      },
    },
    {
      key: 'bottom',
      label: '置底',
      icon: '⬇️',
      clickParam: group.id,
      clickHandle: (id: string) => {
        console.log('%c [ id ]-212', 'font-size:13px; background:#fff; color:#ff4bff;', id);
      },
    },
  ])

  return group;
}

/**
 * @description: 拖拽元件过来新增
 */
function imgDropHandle(canvas: Canvas, event:any) {
  event.preventDefault();
  
  const data = event.dataTransfer.getData('Text');
  const item = panelData.value.find(item => item.key === data);
  console.log('%c [ item ]-160', 'font-size:13px; background:#000; color:#fdffcd;', item);
  if(item) {
    const point = client2Canvas(canvas, [event.clientX, event.clientY])

    createImgEntity(canvas, {
      ...item,
      x: point.x,
      y: point.y,
      src: '/static/processDrawEdit/'+item.img,
    })
  }
}

/**
 * @description: 把输入的屏幕坐标转换为画布坐标
 */
function client2Canvas(canvas: Canvas, clientPoint: [number, number]) {
  // - 计算当前点坐标
  let point = canvas.client2Viewport({ x: clientPoint[0], y: clientPoint[1]});
  point =canvas.viewport2Canvas(point);
  // -  计算当前点和画布中心点的距离，
  // const distance = {
  //   x: (point.x - canvas.getConfig().width! / 2),
  //   y: (point.y - canvas.getConfig().height! / 2),
  // }
  // // 再把距离除以缩放比例，
  // distance.x /= canvas.getCamera().getZoom();
  // distance.y /= canvas.getCamera().getZoom();
  // // - 该距离加上相机的移动距离
  // distance.x += canvas.getCamera().getPosition()[0];
  // distance.y += canvas.getCamera().getPosition()[1];

  return point;
}

/**
 * @description: 绘制管道
 * 鼠标左键点击一下记下一个点的坐标，鼠标双击完成绘制
 */
function createLine(canvas: Canvas, param?: {
  style?: any,
  angle90?: boolean, // 转角是否必须90度
}) {
  if(isCreateLine.value) return;
  isCreateLine.value = true;

  disableDragCamera.value = true;
  disableDragDevice.value = true;

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
      ...param?.style,
    },
  });
  console.log('polyline.id:', polyline.id)

  // 鼠标左键点击一下记下一个点的坐标，鼠标双击完成绘制
  let perTapTime = new Date();
  const clickHandle = (event: any) => {
    console.log('click')
    // 计算坐标
    const point = client2Canvas(canvas, [event.clientX, event.clientY])

    if(param?.angle90 && lineCoords.length) {
      const cornerPoint: [number, number] = [lineCoords[lineCoords.length - 1][0], point.y];
      lineCoords.push(cornerPoint)
    }

    lineCoords.push([point.x, point.y]);
    polyline.style.points = JSON.parse(JSON.stringify(lineCoords));

    if(lineCoords.length === 1) {
      canvas.appendChild(polyline);
      addDragToImgGroup(canvas, polyline);
      customContextMenu(canvas, polyline, [
        {
          key: 'edit',
          label: '编辑',
          icon: '✏️',
          clickParam: polyline.id,
          clickHandle: (id: string) => {
            console.log('%c [ id ]-212', 'font-size:13px; background:#fff; color:#ff4bff;', id);
          },
        },
        {
          key: 'copy',
          label: '复制',
          icon: '📋',
          clickParam: polyline.id,
          clickHandle: (id: string) => {
            console.log('%c [ id ]-212', 'font-size:13px; background:#fff; color:#ff4bff;', id);
          },
        },
        {
          key: 'delete',
          label: '删除',
          icon: '🗑️',
          clickParam: polyline.id,
          clickHandle: (id: string) => {
            console.log('%c [ id ]-212', 'font-size:13px; background:#fff; color:#ff4bff;', id);
            canvas.document.querySelector('#'+id)?.remove();
          },
        },
        {
          key: 'top',
          label: '置顶',
          icon: '⬆️',
          clickParam: polyline.id,
          clickHandle: (id: string) => {
            console.log('%c [ id ]-212', 'font-size:13px; background:#fff; color:#ff4bff;', id);
          },
        },
        {
          key: 'bottom',
          label: '置底',
          icon: '⬇️',
          clickParam: polyline.id,
          clickHandle: (id: string) => {
            console.log('%c [ id ]-212', 'font-size:13px; background:#fff; color:#ff4bff;', id);
          },
        },
      ])
    }

    // 两次点击的时间少于500ms判断为双击
    const nowTapTime = new Date();
    if(nowTapTime.getTime() - perTapTime.getTime() < 300) {
      isCreateLine.value = false;
      canvas.removeEventListener('click', clickHandle);
      canvas.removeEventListener('mousemove', hoverHandle);
      disableDragCamera.value = false;
      disableDragDevice.value = false;
    }
    perTapTime = nowTapTime;
  };
  canvas.addEventListener('click', clickHandle);

  // 鼠标悬浮移动时 线的终点跟随移动
  const hoverHandle = (event: any) => {
    let temCoord = JSON.parse(JSON.stringify(lineCoords))
    // 计算坐标
    const point = client2Canvas(canvas, [event.clientX, event.clientY])

    if(param?.angle90 && temCoord.length) {
      const cornerPoint: [number, number] = [temCoord[temCoord.length - 1][0], point.y];
      temCoord.push(cornerPoint)
    }

    polyline.style.points = [...temCoord, [point.x, point.y]];
  }
  canvas.addEventListener('mousemove', hoverHandle);
}

/**
 * @description: 求一个点伸出的两条线的夹角(带正负)
 * @param {*} centerA 中心点坐标
 * @param {*} pointB 旋转起点末端坐标
 * @param {*} pointC 旋转终点末端坐标
 * @param {*} isRadian 是否要弧度值(默认拿角度值)
 * @return {*} 返回旋转角度(带正负)
 */
function getAngleOfThreePoint(
  centerA: [number, number], 
  pointB: [number, number], 
  pointC: [number, number],
  isRadian?: boolean
): number  {
  // 0.根据向量法求出旋转方向
  const AB = [0, 0];
  const AC = [0, 0];
  AB[0] = (pointB[0] - centerA[0]);
  AB[1] = (pointB[1] - centerA[1]);
  AC[0] = (pointC[0] - centerA[0]);
  AC[1] = (pointC[1] - centerA[1]); // 分别求出AB,AC的向量坐标表示
  const direct = (AB[0] * AC[1]) - (AB[1] * AC[0]); // AB与AC叉乘求出逆时针还是顺时针旋转

  // 1.先算出三条边的长度
  // 2.利用两点坐标求直线公式算出AB,AC,BC线段的长度
  const lengthAB = Math.sqrt(Math.pow(centerA[0] - pointB[0], 2) + Math.pow(centerA[1] - pointB[1], 2));
  const lengthAC = Math.sqrt(Math.pow(centerA[0] - pointC[0], 2) + Math.pow(centerA[1] - pointC[1], 2));
  const lengthBC = Math.sqrt(Math.pow(pointB[0] - pointC[0], 2) + Math.pow(pointB[1] - pointC[1], 2));

  // 3.已知三角形的三边长，求cos值的公式：cos A=(b²+c²-a²)/2bc
  const cosA = (Math.pow(lengthAB, 2) + Math.pow(lengthAC, 2) - Math.pow(lengthBC, 2)) / (2 * lengthAB * lengthAC); //   余弦定理求出旋转角

  // 4.在根据公式,转换成度数
  const angle = isRadian? Math.acos(cosA) : Math.acos(cosA) * 180 / Math.PI;
  
  return direct < 0? -angle:angle;
}

/**
 * @description: 给元素添加旋转功能
 */
function addRotateToEntity(canvas: Canvas, group: DisplayObject) {
  const rotateImg = new Image({
    name: 'imgBox__rotateImg',
    className: 'imgBox__rotateImg',
    style: {
      width: 20,
      height: 20,
      src: 'data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgdmVyc2lvbj0iMS4xIj48cGF0aCBzdHJva2U9IiMyOWI2ZjIiIGZpbGw9IiMyOWI2ZjIiIGQ9Ik0xNS41NSA1LjU1TDExIDF2My4wN0M3LjA2IDQuNTYgNCA3LjkyIDQgMTJzMy4wNSA3LjQ0IDcgNy45M3YtMi4wMmMtMi44NC0uNDgtNS0yLjk0LTUtNS45MXMyLjE2LTUuNDMgNS01LjkxVjEwbDQuNTUtNC40NXpNMTkuOTMgMTFjLS4xNy0xLjM5LS43Mi0yLjczLTEuNjItMy44OWwtMS40MiAxLjQyYy41NC43NS44OCAxLjYgMS4wMiAyLjQ3aDIuMDJ6TTEzIDE3Ljl2Mi4wMmMxLjM5LS4xNyAyLjc0LS43MSAzLjktMS42MWwtMS40NC0xLjQ0Yy0uNzUuNTQtMS41OS44OS0yLjQ2IDEuMDN6bTMuODktMi40MmwxLjQyIDEuNDFjLjktMS4xNiAxLjQ1LTIuNSAxLjYyLTMuODloLTIuMDJjLS4xNC44Ny0uNDggMS43Mi0xLjAyIDIuNDh6Ii8+PC9zdmc+',
      cursor: 'crosshair',
    },
  })

  
  let boxBound = group.getBBox();
  rotateImg.translateLocal(boxBound.width, -20)

  group.appendChild(rotateImg);

  let beginCoord: [number, number] = [0, 0];
  let centerCoord: [number, number] = [0, 0]
  let beginRotate = 0;

  // 这三个点做调试用，后期确定程序没问题了可以删除这三个点
  const centerP = new Circle({
    style: {
      r: 4,
      fill: '#f04864',
      pointerEvents: 'none',
      visibility: 'hidden',
    },
  });
  const beginP = new Circle({
    style: {
      r: 4,
      fill: '#4af047',
      pointerEvents: 'none',
      visibility: 'hidden',
    },
  });
  const endP = new Circle({
    style: {
      r: 4,
      fill: '#47c8f0',
      pointerEvents: 'none',
      visibility: 'hidden',
    },
  });
  canvas.appendChild(centerP);
  canvas.appendChild(beginP);
  canvas.appendChild(endP);


  interact(rotateImg as any, {
    // 直接传入节点1
      context: canvas.document as any, // 传入上下文
    }).draggable({
      onstart: function (event) {
        if(disableDragDevice.value) return;
        boxBound = group.getBBox();
        // 禁止画布移动
        disableDragCamera.value = true;
        const beginCanvasP = client2Canvas(canvas, [event.clientX, event.clientY])
        beginCoord = [beginCanvasP.x, beginCanvasP.y];
        centerCoord = [boxBound.x + boxBound.width / 2, boxBound.y+boxBound.height / 2] // [group.getPosition()[0]+boxBound.width / 2, group.getPosition()[1]+boxBound.height / 2];
        beginRotate = group.getLocalEulerAngles();

        beginP.setPosition(beginCoord).style.visibility = 'visible';
        centerP.setPosition(centerCoord).style.visibility = 'visible';
        endP.setPosition(beginCoord).style.visibility = 'visible';
      },
      onmove: function (event) {
        if(disableDragDevice.value) return;
        const endCanvasP = client2Canvas(canvas, [event.clientX, event.clientY])

        const angle = getAngleOfThreePoint(centerCoord, beginCoord, [endCanvasP.x, endCanvasP.y])
        group.setLocalEulerAngles(angle+beginRotate)

        endP.setPosition([endCanvasP.x, endCanvasP.y])
      },
      onend: function (event) {
        if(disableDragDevice.value) return;
        centerP.style.visibility = 'hidden';
        beginP.style.visibility = 'hidden';
        endP.style.visibility = 'hidden';

        // 恢复画布移动
        setTimeout(() => {
          disableDragCamera.value = false;
        }, 100);
      },
    });

  return rotateImg;
}

export {
  // 给图片元素添加鼠标移入高亮
  addEmphaticToImgGroupWhenHover,
  // 给图片元素添加拖拽
  addDragToImgGroup,
  // 给元素添加右键菜单
  customContextMenu,
  // 新建一个img元素
  createImgEntity,
  // 拖拽元件过来新增
  imgDropHandle,
  // 把输入的屏幕坐标转换为画布坐标
  client2Canvas,
  // 绘制管道
  createLine,
  // 求一个点伸出的两条线的夹角(带正负)
  getAngleOfThreePoint,
  // 给元素添加旋转功能
  addRotateToEntity,
}