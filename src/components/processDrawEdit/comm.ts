/*
 * @Author: Strayer
 * @Date: 2025-04-15
 * @LastEditors: Strayer
 * @LastEditTime: 2025-04-25
 * @Description: 
 * @FilePath: \processDraw\src\components\processDrawEdit\comm.ts
 */
import { Canvas, Circle, DisplayObject, Text, Group, HTML, Image, Path, Polyline, Rect, ElementEvent  } from '@antv/g';
import interact from 'interactjs';
import { disableDragDevice, isCreateLine, disableDragCamera, panelData, chooseDevice, imgPadding, copySource } from './data';
import { v4 as uuidv4 } from 'uuid';
import { pathDefaultStyle, polyLineDefaultStyle, textDefaultStyle } from './attr';
import Hammer from 'hammerjs';
import type { MenuDataItem, lineDataItem, TextDataItem, ImgDataItem } from './dataType';
import { getImgContextMenuData, getLineContextMenuData } from './contextMenu';

/**
 * @description: 给图片元素添加鼠标移入高亮
 */
function addEmphaticToImgGroupWhenHover(el: DisplayObject) {
  const addEmphatic = (element: DisplayObject) => {
    const elementAll = element.querySelectorAll('.chooseView');
    for(const item of elementAll) {
      item.style.visibility = 'visible';
    }
  }

  const removeEmphatic = (element: DisplayObject) => {
    const elementAll = element.querySelectorAll('.chooseView');
    for(const item of elementAll) {
      item.style.visibility = 'hidden';
    }
  }

  el.addEventListener('click', (e: any) => {
    if(chooseDevice.value) removeEmphatic(chooseDevice.value);

    chooseDevice.value = el;
    addEmphatic(el);
  });

  el.addEventListener('mouseenter', (e: any) => {
    if(chooseDevice.value?.id === el.id) return;

    addEmphatic(el);
  });

  el.addEventListener('mouseleave', (e: any) => {
    if(chooseDevice.value?.id === el.id) return;

    removeEmphatic(el);
  });
}

/**
 * @description: 给图片元素添加拖拽效果
 */
function addDragToImgGroup(canvas: Canvas, el: any) {
  const camera = canvas.getCamera();

  const interactable = interact(el as any, {
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

      // console.log('%c [ event ]-67', 'font-size:13px; background:#afb2d7; color:#f3f6ff;', event);
      // 恢复画布移动
      setTimeout(() => {
        disableDragCamera.value = false;
      }, 100);
      },
    });

  // 在元素上存储 interactable 引用，以便后续可以销毁
  el._interactable = interactable;

  // 监听元素销毁事件
  el.addEventListener(ElementEvent.REMOVED, () => {
    if (el._interactable) {
      el._interactable.unset(); // 销毁 interact 实例
      el._interactable = null;
    }
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
    const zoom = canvas.getCamera().getZoom();
    
    const point = client2Canvas(canvas, [e.clientX+ 10, e.clientY]);

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
    html.setLocalScale(1/zoom);
    html.translateLocal(-50+50/zoom, -50+50/zoom)
    canvas.appendChild(html);

    setTimeout(() => {
      // 监听菜单选项点击事件
      const items = document.querySelectorAll('#antVGContextMenu .context-menu__item');
      for(const item of items) {
        item.addEventListener('click', (e: any) => {
          // console.log('%c [ e ]-133', 'font-size:13px; background:#3277e3; color:#76bbff;', e);
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
function createImgEntity(canvas: Canvas, param: ImgDataItem) {
  const deviceItem = panelData.value.find(item => item.key === param.key)!;
  const width = param.width + imgPadding * 2;
  const height = param.height + imgPadding * 2;

  const group = new Group({
    id: param.id ?? uuidv4(),
    name: 'imgBox',
    className: 'imgBox',
    style: {
      cursor: 'pointer',
      zIndex: param.zIndex?? 10,
    }
  });
  group.setAttribute('data-imgKey', param.key);
  group.setPosition(param.coord[0], param.coord[1]);
  group.translate(-width/2, -height/2);
  group.setOrigin(width/2, height/2);

  // 内部加个box做旋转
  const groupInner = new Group({
    name: 'imgBox__inner',
    className: 'imgBox__inner',
  });
  groupInner.setOrigin(width/2, height/2);
  if(param.rotate) groupInner.setLocalEulerAngles(param.rotate);
  group.appendChild(groupInner);

  // 用矩形做高亮的边框
  const box = new Rect({
    name: 'imgBox__rect',
    className: 'imgBox__rect chooseView',
    style: {
      width: width,
      height: height,
      stroke: '#16bdf0',
      lineWidth: 4,
      opacity: 0.3,
      visibility: 'hidden'
    }
  })
  groupInner.appendChild(box);

  let imageEntity: DisplayObject;
  if(deviceItem.path) {
    imageEntity = new Path({
      name: 'imgBox__path',
      className: 'imgBox__path imgBox__contentIcon',
      style: {
        d: deviceItem.path,
        fill: param.color ?? pathDefaultStyle.fill,
        stroke: param.stroke ?? pathDefaultStyle.stroke,
        zIndex: param.zIndex?? 10,
        // cursor: 'pointer',
      },
    });
    if(param.scale) imageEntity.setLocalScale(param.scale);
    group.className += ' pathEntityBox'
  } else {
    imageEntity = new Image({
      name: 'imgBox__img',
      className: 'imgBox__img imgBox__contentIcon',
      style: {
        width: param.width,
        height: param.height,
        src: deviceItem.img,
        zIndex: param.zIndex?? 10,
      },
    })
    group.className += ' imgEntityBox';
  }


  imageEntity.translateLocal(imgPadding, imgPadding)
  groupInner.appendChild(imageEntity);
  
  canvas.appendChild(group);

  // 高亮
  addEmphaticToImgGroupWhenHover(group);

  // 拖拽, 已添加到画布时前提
  addDragToImgGroup(canvas, group)

  // 添加旋转功能
  addRotateToEntity(canvas, group)

  // 添加缩放功能
  addScaleToEntity(canvas, group)

  // 自定义右键菜单
  customContextMenu(canvas, group, getImgContextMenuData(canvas, group))

  return group;
}

/**
 * @description: 根据img元素的scale更新width
 */
function updateImgEntityWidth(canvas: Canvas, group: DisplayObject) {
  const groupInner = group.querySelector('.imgBox__inner') as DisplayObject;
  const imgEntity = group.querySelector('.imgBox__contentIcon') as DisplayObject;
  const rectEntity = group.querySelector('.imgBox__rect') as DisplayObject;
  const scaleEntity = group.querySelector('.imgBox__scale') as DisplayObject;
  const rotateEntity = group.querySelector('.imgBox__rotateImg') as DisplayObject;

  const originWidth  = rectEntity.style.width - imgPadding * 2;
  const originHeight = rectEntity.style.height - imgPadding * 2;
  const scale = group.getLocalScale()[0];
  const newWidth = originWidth * scale;
  const newHeight = originHeight * scale;

  group.setLocalScale(1);
  group.setOrigin(newWidth/2, newHeight/2);
  group.translateLocal(-(newWidth - originWidth)/2, -(newHeight - originHeight)/2)

  groupInner.setOrigin((newWidth + imgPadding * 2)/2, (newHeight+ imgPadding * 2)/2);
  rectEntity.style.width = newWidth + imgPadding * 2;
  rectEntity.style.height = newHeight + imgPadding * 2;

  if(imgEntity.name === 'imgBox__img') {
    imgEntity.style.width = newWidth;
    imgEntity.style.height = newHeight;
  } else {
    imgEntity.setLocalScale(imgEntity.getLocalScale()[0]*scale);
  }
  
  scaleEntity.setLocalPosition(rectEntity.style.width, rectEntity.style.height / 2);
  rotateEntity.setLocalPosition(rectEntity?.style.width ?? 0, -20)
}

/**
 * @description: 拖拽元件过来新增
 */
function imgDropHandle(canvas: Canvas, event:any) {
  event.preventDefault();
  const point = client2Canvas(canvas, [event.clientX, event.clientY])
  
  const data = event.dataTransfer.getData('Text');
  const item = panelData.value.find(item => item.key === data);
  console.log('%c [ item ]-160', 'font-size:13px; background:#000; color:#fdffcd;', item);
  if(item) {

    createImgEntity(canvas, {
      ...item,
      id: uuidv4(),
      coord: [point.x, point.y],
    })
  } else if(data === 'text') {
    createText(canvas, {
      id: uuidv4(),
      coord: [point.x, point.y],
      box: textDefaultStyle.box,
      text: textDefaultStyle.text,
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
function drawLine(canvas: Canvas, param?: {
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
      ...polyLineDefaultStyle,
      lineDash: polyLineDefaultStyle.isDash? [polyLineDefaultStyle.dashLen, polyLineDefaultStyle.dashGap]: 0,
      points: JSON.parse(JSON.stringify(lineCoords)),
      cursor: 'pointer',
      zIndex: 10,
      ...param?.style,
    },
  });
  (polyline as DisplayObject).setAttribute('data-angle90', param?.angle90 ?? false);

  console.log('polyline.id:', polyline.id)

  // 添加移入高亮效果
  addEmphaticToImgGroupWhenHover(polyline);

  // 鼠标左键点击一下记下一个点的坐标，鼠标双击完成绘制
  let perTapTime = new Date();
  const clickHandle = (event: any) => {

    // 两次点击的时间少于500ms判断为双击
    const nowTapTime = new Date();
    if(nowTapTime.getTime() - perTapTime.getTime() < 300) {
      // 添加可拖拽节点
      addDragNodePointToLine(canvas, polyline)
      
      isCreateLine.value = false;
      canvas.removeEventListener('click', clickHandle);
      canvas.removeEventListener('mousemove', hoverHandle);
      disableDragCamera.value = false;
      disableDragDevice.value = false;
      return;
    }
    perTapTime = nowTapTime;

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
      // 添加可拖拽功能
      addDragToImgGroup(canvas, polyline);
      // 添加自定义右键菜单
      customContextMenu(canvas, polyline, getLineContextMenuData(canvas, polyline))
    
    }
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
 * @description: 新增管道
 */
function createLine(canvas: Canvas, param: lineDataItem) {
  const polyline = new Polyline({
    id: param.id,
    name: 'line',
    class: 'line',
    style: {
      ...polyLineDefaultStyle,
      ...param.style,
      lineDash: param.style.isDash? [param.style.dashLen ?? 0, param.style.dashGap ?? 0]: 0,
      points: JSON.parse(JSON.stringify(param.coord)),
      cursor: 'pointer',
      zIndex: param.zIndex ?? 10,
    },
  });
  (polyline as DisplayObject).setAttribute('data-angle90', param?.angle90 ?? false);

  console.log('polyline.id:', polyline.id)

  canvas.appendChild(polyline);

  // 添加移入高亮效果
  addEmphaticToImgGroupWhenHover(polyline);

  // 添加可拖拽节点
  addDragNodePointToLine(canvas, polyline, { defaultHidden: true })

  // 添加可拖拽功能
  addDragToImgGroup(canvas, polyline);

  // 添加自定义右键菜单
  customContextMenu(canvas, polyline, getLineContextMenuData(canvas, polyline))
}


/**
 * @description: 给管道添加可拖拽节点
 */
function addDragNodePointToLine(canvas: Canvas, polyline: Polyline, param?: {
  defaultHidden?: boolean, // 默认隐藏
}) {

  const nodePoints: Circle [] = [];

  for(let i = 0; i<polyline.style.points.length; i++) {
    const point = polyline.style.points[i];

    const nodePoint =  new Circle({
      name: 'lineNodePoint',
      className: 'lineNodePoint chooseView '+i,
      style: {
        r: polyLineDefaultStyle.lineWidth,
        cx: point[0],
        cy: point[1],
        fill: polyLineDefaultStyle.stroke,
        opacity: 0.5,
        pointerEvents: 'all',
        visibility: param?.defaultHidden? 'hidden': 'visible',
      },
    });
    nodePoints.push(nodePoint)
    polyline.appendChild(nodePoint);
  }

  const camera = canvas.getCamera();

  for(const nodePoint of nodePoints) {
    const interactable =  interact(nodePoint as any, {
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

          const pointIndex = event.target.classList[2];
    
          // interact.js 告诉我们的偏移量
          const { dx, dy } = event;
          const zoom = camera.getZoom();

          polyline.style.points[pointIndex][0] += dx / zoom;
          polyline.style.points[pointIndex][1] += dy / zoom;
    
          // 改变节点1位置
          nodePoint.translateLocal(dx / zoom, dy / zoom);
        },
        onend: function (event) {
          if(disableDragDevice.value) return;
    
          // console.log('%c [ event ]-67', 'font-size:13px; background:#afb2d7; color:#f3f6ff;', event);
          // 恢复画布移动
          setTimeout(() => {
            disableDragCamera.value = false;
          }, 100);
        },
      });

    // 在元素上存储 interactable 引用，以便后续可以销毁
    (nodePoint as any)._interactable = interactable;

    // 监听元素销毁事件
    nodePoint.addEventListener(ElementEvent.REMOVED, () => {
      if ((nodePoint as any)._interactable) {
        (nodePoint as any)._interactable.unset(); // 销毁 interact 实例
        (nodePoint as any)._interactable = null;
      }
    });
  }
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
  let rectEntity: DisplayObject = group.querySelector('.imgBox__rect')!;
  const innerEntity: DisplayObject = group.querySelector('.imgBox__inner')!;

  const rotateImg = new Image({
    name: 'imgBox__rotateImg',
    className: 'imgBox__rotateImg chooseView',
    style: {
      width: 20,
      height: 20,
      src: 'data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgdmVyc2lvbj0iMS4xIj48cGF0aCBzdHJva2U9IiMyOWI2ZjIiIGZpbGw9IiMyOWI2ZjIiIGQ9Ik0xNS41NSA1LjU1TDExIDF2My4wN0M3LjA2IDQuNTYgNCA3LjkyIDQgMTJzMy4wNSA3LjQ0IDcgNy45M3YtMi4wMmMtMi44NC0uNDgtNS0yLjk0LTUtNS45MXMyLjE2LTUuNDMgNS01LjkxVjEwbDQuNTUtNC40NXpNMTkuOTMgMTFjLS4xNy0xLjM5LS43Mi0yLjczLTEuNjItMy44OWwtMS40MiAxLjQyYy41NC43NS44OCAxLjYgMS4wMiAyLjQ3aDIuMDJ6TTEzIDE3Ljl2Mi4wMmMxLjM5LS4xNyAyLjc0LS43MSAzLjktMS42MWwtMS40NC0xLjQ0Yy0uNzUuNTQtMS41OS44OS0yLjQ2IDEuMDN6bTMuODktMi40MmwxLjQyIDEuNDFjLjktMS4xNiAxLjQ1LTIuNSAxLjYyLTMuODloLTIuMDJjLS4xNC44Ny0uNDggMS43Mi0xLjAyIDIuNDh6Ii8+PC9zdmc+',
      cursor: 'crosshair',
      visibility: 'hidden',
    },
  })

  
  rotateImg.translateLocal(rectEntity?.style.width ?? 0, -20)

  let boxBound = rectEntity.getBBox();

  innerEntity.appendChild(rotateImg);

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


  const interactable = interact(rotateImg as any, {
    // 直接传入节点1
      context: canvas.document as any, // 传入上下文
    }).draggable({
      onstart: function (event) {
        if(disableDragDevice.value) return;
        boxBound = rectEntity.getBBox();
        // 禁止画布移动
        disableDragCamera.value = true;
        const beginCanvasP = client2Canvas(canvas, [event.clientX, event.clientY])
        beginCoord = [beginCanvasP.x, beginCanvasP.y];
        centerCoord = [boxBound.x + boxBound.width / 2, boxBound.y+boxBound.height / 2]
        beginRotate = innerEntity.getLocalEulerAngles();

        beginP.setPosition(beginCoord).style.visibility = 'visible';
        centerP.setPosition(centerCoord).style.visibility = 'visible';
        endP.setPosition(beginCoord).style.visibility = 'visible';
      },
      onmove: function (event) {
        if(disableDragDevice.value) return;
        const endCanvasP = client2Canvas(canvas, [event.clientX, event.clientY])

        const angle = getAngleOfThreePoint(centerCoord, beginCoord, [endCanvasP.x, endCanvasP.y])
        innerEntity.setLocalEulerAngles(angle+beginRotate)

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

  // 在元素上存储 interactable 引用，以便后续可以销毁
  (rotateImg as any)._interactable = interactable;

  // 监听元素销毁事件
  (rotateImg as any).addEventListener(ElementEvent.REMOVED, () => {
    if ((rotateImg as any)._interactable) {
      (rotateImg as any)._interactable.unset(); // 销毁 interact 实例
      (rotateImg as any)._interactable = null;
    }
  });

  return rotateImg;
}

/**
 * @description: 给元素添加缩放功能 
 */
function addScaleToEntity(canvas: Canvas, group: DisplayObject) {
  const innerEntity: DisplayObject = group.querySelector('.imgBox__inner')!;

  const circle = new Circle({
    name: 'imgBox__scale',
    className: 'imgBox__scale chooseView',
    style: {
      r: 6,
      fill: '#1890FF',
      cursor: 'ew-resize',
      visibility: 'hidden'
    },
  });

  let rectEntity = group.querySelector('.imgBox__rect')!
  circle.translateLocal(rectEntity.style.width, rectEntity.style.height / 2)

  innerEntity.appendChild(circle);

  let beginStatus = {
    scale: [1, 1, 1] as [number, number, number],
  }
  let beginCoord: [number, number] = [0, 0];


  interact(circle as any, {
  // 直接传入节点1
    context: canvas.document as any, // 传入上下文
  }).draggable({
    onstart: function (event) {
      if(disableDragDevice.value) return;
      // 禁止画布移动
      disableDragCamera.value = true;

      const imageEntity: DisplayObject = group.querySelector('.imgBox__contentIcon')!;

      beginStatus = {
        scale: [1, 1, 1], // imageEntity.getLocalScale() as any,
      }

      let beginPoint = client2Canvas(canvas, [event.clientX, event.clientY]);
      beginCoord = [beginPoint.x, beginPoint.y];
    },
    onmove: function (event) {
      if(disableDragDevice.value) return;
      const bbox = (group.querySelector('.imgBox__rect') as DisplayObject).getBBox();
      // 计算中点
      const centerPoint: [number, number] = [bbox.x + bbox.width / 2, bbox.y + bbox.height / 2];
      // 计算当前点到中心点的距离
      const curPoint = client2Canvas(canvas, [event.clientX, event.clientY]);
      const curCoord: [number, number] = [curPoint.x, curPoint.y];
      const curToCenterDistance = Math.sqrt(
        Math.pow(curCoord[0] - centerPoint[0], 2) +
        Math.pow(curCoord[1] - centerPoint[1], 2)
      );
      // console.log('%c [ curToCenterDistance ]-702', 'font-size:13px; background:#000; color:#61f7ff;', curToCenterDistance);

      // 计算开始点到中心点的距离
      const beginToCenterDistance = Math.sqrt(
        Math.pow(beginCoord[0] - centerPoint[0], 2) + 
        Math.pow(beginCoord[1] - centerPoint[1], 2)
      );

      // 计算当前点到中心的距离在开始点方向上的投影长度
      const angle = getAngleOfThreePoint(centerPoint, beginCoord, curCoord, true);
      // console.log('%c [ angle ]-715', 'font-size:13px; background:#7cdb0b; color:#c0ff4f;', angle);
      const curLenOnBegin = curToCenterDistance * Math.cos(angle);
      // console.log('%c [ curLenOnBegin ]-717', 'font-size:13px; background:#46d474; color:#8affb8;', curLenOnBegin);
      // 计算缩放比例
      const scaleOffset = curLenOnBegin / beginToCenterDistance;
      // console.log('%c [ scaleOffset ]-717', 'font-size:13px; background:#edc755; color:#ffff99;', scaleOffset);

      const newScale: [number, number, number] = [
        beginStatus.scale[0] * scaleOffset,
        beginStatus.scale[1] * scaleOffset,
        beginStatus.scale[2],
      ]

      group.setLocalScale(newScale);
    },
    onend: function (event) {
      if(disableDragDevice.value) return;
      updateImgEntityWidth(canvas, group)

      setTimeout(() => {
        disableDragCamera.value = false;
      }, 100)
    },
  });
}

/**
 * @description: 使用鼠标滚轮实现相机缩放
 */
function addWheel(canvas: Canvas) {
  const camera = canvas.getCamera();
  // 设置最小和最大缩放比例
  const minZoom = 0;
  const maxZoom = Infinity;
  canvas.addEventListener('wheel', (e: any) => {
      e.preventDefault();

      let zoom = e.deltaY < 0? camera.getZoom()  / 0.95: camera.getZoom() * 0.95;
      zoom = Math.max(minZoom, Math.min(maxZoom, zoom));

      const { x, y } = canvas.client2Viewport({ x: e.clientX, y: e.clientY });

      camera.setZoomByViewportPoint(zoom, [x, y])
    }, { passive: false } );
}

/**
 * @description: 使用 hammer.js 实现相机移动
 */
function moveCamera(canvas: Canvas) {
  const camera = canvas.getCamera();
  const hammer = new Hammer(canvas as any);

  let preCoord = [0, 0];
  hammer.on('panstart', (ev) => {
    if(disableDragCamera.value) return;
    preCoord = [ev.deltaX, ev.deltaY];
  });
  hammer.on('pan', (ev) => {
    if(disableDragCamera.value) return;

    // const zoom = Math.pow(2, camera.getZoom()-1); // 如果需要实现类似3d空间的近快远慢 用这个
    const zoom = camera.getZoom();
    camera.pan((-ev.deltaX + preCoord[0]) / zoom, (-ev.deltaY + preCoord[1]) / zoom);
    preCoord = [ev.deltaX, ev.deltaY];
  });

}

/**
 * @description: 添加文本框
 */
function createText(canvas: Canvas, param: TextDataItem) {
  const width = param.box.width + param.text.dx * 2;
  const height = param.box.height + param.text.dy * 2;

  const group = new Group({
    id: param.id,
    name: 'textBox',
    className: 'textBox',
    style: {
      cursor: 'pointer',
      zIndex: param.zIndex ?? 10,
    }
  });
  group.setLocalPosition(param.coord[0], param.coord[1]);
  group.translateLocal(-width/2, -height/2);
  group.setOrigin(width/2, height/2);

  // 内部加个box做旋转
  const groupInner = new Group({
    name: 'textBox__inner',
    className: 'textBox__inner',
  });
  groupInner.setOrigin(width/2, height/2);
  // if(param.box.rotate) groupInner.setLocalEulerAngles(param.box.rotate);
  group.appendChild(groupInner);

  // 用矩形背景框
  const box = new Rect({
    name: 'textBox__rect',
    class: 'textBox__rect',
    style: {
      ...param.box,
      width: width,
      height: height,
    }
  })
  groupInner.appendChild(box);

  const textEntity = new Text({
    name: 'textBox__text',
    class: 'textBox__text',
    style: {
      ...param.text,
      text: param.text.text,
      textBaseline: 'top',
      wordWrap: true,
      wordWrapWidth: param.box.width,
    }
  })

  groupInner.appendChild(textEntity);

  canvas.appendChild(group);

  // 高亮
  addEmphaticToImgGroupWhenHover(group);

  // 拖拽, 已添加到画布时前提
  addDragToImgGroup(canvas, group)

  // 添加自定义右键菜单
  customContextMenu(canvas, group, getLineContextMenuData(canvas, group))
}


/**
 * @description: 添加文字Html-暂时不用，因为不方便做拖拽
 */
function addTextHtml(canvas: Canvas, param: {
  event:any
  text?: string,
}) {
  const point = client2Canvas(canvas, [param.event.clientX, param.event.clientY])
  const zoom = canvas.getCamera().getZoom();

  let innerHtml = `
    <div class="textBox" style="background-color: #0E2C46; color: #fff; padding: 4px 8px;">
      ${param?.text ?? '文字内容'}
    </div>
  `
  
  // 自定义右键菜单
  const html = new HTML({
      id: uuidv4(),
      name: 'textBoxHtml',
      class: 'textBoxHtml',
      style: {
          x: point.x,
          y: point.y,
          width: 100,
          height: 100,
          innerHTML: innerHtml,
          pointerEvents: 'all',
      },
  });
  html.setLocalScale(1/zoom);
  html.translateLocal(-50+50/zoom, -50+50/zoom)
  canvas.appendChild(html);
}

/**
 * @description: 删除元素
 */
function deleteElement(canvas: Canvas, id: string) {
  if(chooseDevice.value?.id === id) chooseDevice.value= undefined;

  canvas.document.querySelector('#'+id)?.remove();
}

/**
 * @description: img元素转外部数据
 */
function imgToDataItem(el: DisplayObject): ImgDataItem {
  const rectEntity = el.querySelector('.imgBox__rect') as DisplayObject;

  const itemObj: ImgDataItem = {
    id: el.id,
    zIndex: el.style.zIndex,
    key: el.getAttribute('data-imgKey'),
    width: rectEntity.style.width - imgPadding * 2,
    height: rectEntity.style.height - imgPadding * 2,
    coord: [
      el.getLocalPosition()[0] + rectEntity.style.width / 2, 
      el.getLocalPosition()[1] + rectEntity.style.height / 2
    ],
    rotate: (el.querySelector('.imgBox__inner') as DisplayObject).getLocalEulerAngles(),
  }

  if(el.classList[1] === 'pathEntityBox') {
    itemObj.color = el.querySelector('.imgBox__path')?.style.fill ?? '';
    itemObj.stroke = el.querySelector('.imgBox__path')?.style.stroke ?? '';
    itemObj.scale = (el.querySelector('.imgBox__path') as DisplayObject).getLocalScale()[0]
  }

  return JSON.parse(JSON.stringify(itemObj))
}

/**
 * @description: 管道元素转为外部数据
 */
function lineToDataItem(el: DisplayObject): lineDataItem {
  const offset = el.getLocalPosition();
  const itemObj: lineDataItem = {
    id: el.id,
    angle90: el.getAttribute('data-angle90'),
    coord: el.style.points.map((item: any) => [item[0]+offset[0], item[1]+offset[1]]),
    zIndex: el.style.zIndex,
    
    style: {
      stroke: el.style.stroke,
      lineWidth: el.style.lineWidth,
      lineJoin: el.style.lineJoin,
      lineCap: el.style.lineCap,
      isDash: el.style.lineDash? 1 : 0,
      dashLen: (el.style.lineDash as any)?.[0],
      dashGap: (el.style.lineDash as any)?.[1],
    }
  }

  return JSON.parse(JSON.stringify(itemObj))
}

/**
 * @description: 文本元素转为外部数据
 */
function textToDataItem(el: DisplayObject): TextDataItem {
  const rectEntity = el.querySelector('.textBox__rect') as DisplayObject;
  const textEntity = el.querySelector('.textBox__text') as DisplayObject;

  const itemObj: TextDataItem = {
    id: el.id,
    coord: [
      (el as DisplayObject).getLocalPosition()[0] + rectEntity.style.width / 2, 
      (el as DisplayObject).getLocalPosition()[1] + rectEntity.style.height / 2,
    ],
    zIndex: el.style.zIndex,

    box: {
      width: rectEntity.style.width,
      height: rectEntity.style.height,
      fill: rectEntity.style.fill,
      lineWidth: rectEntity.style.lineWidth,
      stroke: rectEntity.style.stroke,
      radius: rectEntity.style.radius,
    },
    text: {
      text: textEntity.style.text,
      fontSize: textEntity.style.fontSize,
      fill: textEntity.style.fill,
      fontWeight: textEntity.style.fontWeight,
      textAlign: textEntity.style.textAlign,
      lineHeight: textEntity.style.lineHeight,
      letterSpacing: textEntity.style.letterSpacing,
      dx: textEntity.style.dx,
      dy: textEntity.style.dy,
    }
  }
  itemObj.box.width -= itemObj.text.dx * 2;
  itemObj.box.height -= itemObj.text.dy * 2;

  return JSON.parse(JSON.stringify(itemObj))
}

/**
 * @description: 调整元素zIndex
 */
function updateZIndex(canvas: Canvas, id: string, zIndex: number) {
  const element = canvas.document.querySelector(`#${id}`) as DisplayObject;
        
  let dataItem: ImgDataItem | lineDataItem | TextDataItem | undefined;

  if(element.name === 'imgBox') {
    dataItem = imgToDataItem(element);
    dataItem.zIndex = zIndex;
    element.remove();
    createImgEntity(canvas, dataItem)
  } else if(element.name === 'line') {
    dataItem = lineToDataItem(element);
    dataItem.zIndex = zIndex;
    element.remove();
    createLine(canvas, dataItem)
  } else if(element.name === 'textBox') {
    dataItem = textToDataItem(element);
    dataItem.zIndex = zIndex;
    element.remove();
    createText(canvas, dataItem)
  }
}

/**
 * @description: 粘贴元素
 */
function pasteElement(canvas: Canvas, lastMouseEvent: MouseEvent) {
  if(copySource.value?.name === 'imgBox') {
    const newElement = imgToDataItem(copySource.value);
    newElement.id = uuidv4();

    const point = client2Canvas(canvas, [lastMouseEvent.clientX ?? 0, lastMouseEvent.clientY ?? 0])
    newElement.coord = [point.x, point.y];
    
    createImgEntity(canvas, newElement)
  } else if(copySource.value?.name === 'line') {
    const newElement = lineToDataItem(copySource.value);
    newElement.id = uuidv4();

    const point = client2Canvas(canvas, [lastMouseEvent.clientX ?? 0, lastMouseEvent.clientY ?? 0])
    const originBeginPoint = newElement.coord[0];
    const offset = [point.x - originBeginPoint[0], point.y - originBeginPoint[1]];
    newElement.coord = newElement.coord.map( item => [item[0] + offset[0], item[1] + offset[1]])
    
    createLine(canvas, newElement)
  } else if(copySource.value?.name === 'textBox') {
    const newElement = textToDataItem(copySource.value);
    newElement.id = uuidv4();

    const point = client2Canvas(canvas, [lastMouseEvent.clientX ?? 0, lastMouseEvent.clientY ?? 0])
    newElement.coord = [point.x, point.y];
    
    createText(canvas, newElement)
  }
}

export {
  // 使用鼠标滚轮实现相机缩放
  addWheel,
  // 使用 hammer.js 实现相机移动
  moveCamera,
  // 把输入的屏幕坐标转换为画布坐标
  client2Canvas,
  // 求一个点伸出的两条线的夹角(带正负)
  getAngleOfThreePoint,

  // 删除元素
  deleteElement,
  // 拖拽元件过来新增
  imgDropHandle,
  // 新建一个img元素
  createImgEntity,
  // 绘制管道
  drawLine,
  // 新增管道
  createLine,
  // 添加文字
  createText,
  
  // img元素转外部数据
  imgToDataItem,
  // 管道元素转为外部数据
  lineToDataItem,
  // 文本元素转为外部数据
  textToDataItem,
  // 调整元素zIndex
  updateZIndex,
  // 粘贴元素
  pasteElement,

  // 给元素添加右键菜单
  customContextMenu,
  // 给图片元素添加鼠标移入高亮
  addEmphaticToImgGroupWhenHover,
  // 给图片元素添加拖拽
  addDragToImgGroup,
  // 给元素添加旋转功能
  addRotateToEntity,
  // 给元素添加缩放功能
  addScaleToEntity,
}