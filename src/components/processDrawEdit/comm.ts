/*
 * @Author: Strayer
 * @Date: 2025-04-15
 * @LastEditors: Strayer
 * @LastEditTime: 2025-05-07
 * @Description: 
 * @FilePath: \processDraw\src\components\processDrawEdit\comm.ts
 */
import { Canvas, Circle, DisplayObject, Text, Group, HTML, Image, Path, Polyline, Rect, ElementEvent  } from '@antv/g';
import interact from 'interactjs';
import { disableDragDevice, isCreateLine, disableDragCamera, panelData, chooseDevice, imgPadding, copySource, serverData, disableEdit, getCanvasDataRfEl, canvasDataRef, emitRef, retreatAndAdvance, removeCanvasDataRfEl, addCanvasDataRfEl, drawLineInfo } from './data';
import { polyLineDefaultStyle, textDefaultStyle } from './attr';
import Hammer from 'hammerjs';
import type { MenuDataItem, LineDataItem, TextDataItem, ImgDataItem } from './dataType';
import { getImgContextMenuData, getLineContextMenuData } from './contextMenu';
import { clone, mapToObj } from 'remeda';
import { v4 as uuidv4 } from 'uuid';

/**
 * @description: 添加高亮效果
 * @param {DisplayObject} element
 */
function addEmphatic(element: DisplayObject) {
  if(disableEdit.value) return;
  if(disableDragDevice.value) return;

  const elementAll = element.querySelectorAll('.chooseView');
  for(const item of elementAll) {
    item.style.visibility = 'visible';
  }
}

// 移除高亮效果
function  removeEmphatic(element: DisplayObject) {
  const elementAll = element.querySelectorAll('.chooseView');
  for(const item of elementAll) {
    item.style.visibility = 'hidden';
  }
}

/**
 * @description: 给元素添加点击选中效果
 */
function addClickChooseForReal(canvas: Canvas, el: DisplayObject) {


  el.addEventListener('click', (e: any) => {
    if(chooseDevice.value) removeEmphatic(canvas.document.querySelector(`#${chooseDevice.value.id}`)!);

    if(disableEdit.value) return;
    if(disableDragDevice.value) return;

    chooseDevice.value = getCanvasDataRfEl(el.id)!;
    addEmphatic(el);
  });

  // 移入高亮的会影响管线绘制，先注释
  // el.addEventListener('mouseenter', (e: any) => {
  //   if(chooseDevice.value?.id === el.id) return;

  //   addEmphatic(el);
  // });

  // el.addEventListener('mouseleave', (e: any) => {
  //   if(chooseDevice.value?.id === el.id) return;

  //   removeEmphatic(el);
  // });
}

/**
 * @description: 给图片元素添加拖拽效果
 */
function addDragToImgGroup(canvas: Canvas, el: DisplayObject) {
  const camera = canvas.getCamera();

  let retreatSnapshot: ImgDataItem | LineDataItem | TextDataItem;

  const interactable = interact(el as any, {
  // 直接传入节点1
    context: canvas.document as any, // 传入上下文
    // 设置更高的优先级
    actionChecker: function(pointer: any, event: any, action: any) {
      // 返回一个更高的优先级值
      return action ? { name: action.name, priority: 10 } : null;
    }
  }).draggable({
    onstart: function (event) {
      if(disableDragDevice.value) return;
      // 禁止画布移动
      disableDragCamera.value = true;
      retreatSnapshot = clone(getCanvasDataRfEl(el.id)!);
    },
    onmove: function (event) {
      if(disableDragDevice.value) return;

      // interact.js 告诉我们的偏移量
      const { dx, dy } = event;
      const zoom = camera.getZoom();

      // 改变节点1位置
      el.translateLocal(dx / zoom, dy / zoom);

      // 更新映射的数据
      updateCanvasDataRfElByReal(el)

      // 获取节点1位置
      const [nx, ny] = el.getLocalPosition();
      // 改变边的端点位置
      // edge.style.x1 = nx;
      // edge.style.y1 = ny;
    },
    onend: function (event) {
      if(disableDragDevice.value) return;

      const canvasDataEl = getCanvasDataRfEl(el.id)!;
      canvasDataEl.editType.isUpdate = true;

      retreatAndAdvance.value.addLog({
        type: 'update',
        retreatSnapshot,
        advanceSnapshot: clone(canvasDataEl),
      })

      // console.log('%c [ event ]-67', 'font-size:13px; background:#afb2d7; color:#f3f6ff;', event);
      // 恢复画布移动
      setTimeout(() => {
        disableDragCamera.value = false;
      }, 100);
    },
  });

  // 在元素上存储 interactable 引用，以便后续可以销毁
  (el as any)._interactable = interactable;

  // 监听元素销毁事件
  el.addEventListener(ElementEvent.REMOVED, () => {
    if ((el as any)._interactable) {
      (el as any)._interactable.unset(); // 销毁 interact 实例
      (el as any)._interactable = null;
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

    let innerHtml = '<div class="context-menu">'
    for(const item of menuData) {
      innerHtml += `
        <div class="context-menu__item" data-key="${item.key}">
          <i class="context-menu__icon">${ item.icon }</i>${ item.label }
        </div>
      `
    }
    innerHtml += '</div>';
    
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
      }
      // 监听画布点击事件移除菜单
      canvas.addEventListener('click', clickRemoveHand, { once: true });
    }, 200)
  })
}

/**
 * @description: 新建一个img元素
 */
function createImgReal(canvas: Canvas, param: ImgDataItem) {
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
    const panelObj = mapToObj(panelData.value, item => [item.key, item])[param.key];

    imageEntity = new Path({
      name: 'imgBox__path',
      className: 'imgBox__path imgBox__contentIcon',
      style: {
        d: deviceItem.path,
        fill: param.color ?? panelObj.color,
        stroke: param.stroke ?? panelObj.stroke,
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

  group.addEventListener('click', (e: MouseEvent) => {
    emitRef.value('deviceClick', { device: group, event: e });
  })

  // 高亮
  addClickChooseForReal(canvas, group);
  
  // 添加旋转功能
  addRotateToEntity(canvas, group)

  // 添加缩放功能
  addScaleToEntity(canvas, group)

  // 拖拽, 已添加到画布时前提
  addDragToImgGroup(canvas, group)

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
  rotateEntity.setLocalPosition(rectEntity?.style.width ?? 0, -20);

  // 更新映射
  updateCanvasDataRfElByReal(group);
}

/**
 * @description: 拖拽元件过来新增
 */
function canvasOutBoxDropHandle(canvas: Canvas, event:any) {
  event.preventDefault();
  const point = client2Canvas(canvas, [event.clientX, event.clientY])
  
  const data = event.dataTransfer.getData('Text');
  const item = panelData.value.find(item => item.key === data);
  console.log('%c [ item ]-160', 'font-size:13px; background:#000; color:#fdffcd;', item);
  let newEl: undefined | ImgDataItem | TextDataItem = undefined;
  
  if(item) {
    newEl = {
      ...item,
      type: 'imgData',
      id: uuidv4(),
      coord: [point.x, point.y],
      editType: {
        isAdd: true
      }
    }
  } else if(data === 'text') {
    newEl = {
      id: uuidv4(),
      type: 'textData',
      coord: [point.x, point.y],
      box: { ...textDefaultStyle.box },
      text: { ...textDefaultStyle.text },
      editType: {
        isAdd: true
      }
    }
  }else if(data === 'dataBox') {
    newEl = {
      id: uuidv4(),
      type: 'textData',
      coord: [point.x, point.y],
      box: textDefaultStyle.box,
      text: textDefaultStyle.text,
      isDataBox: true,
      dataOption: [{
        key: '',
      }],
      editType: {
        isAdd: true
      }
    }
  }

  if(newEl) {
    createRealEl(canvas, newEl);
    addCanvasDataRfEl(newEl);
    retreatAndAdvance.value.addLog({
      type: 'add',
      advanceSnapshot: clone(newEl),
    })
  }
}

/**
 * @description: 把输入的屏幕坐标转换为画布坐标
 */
function client2Canvas(canvas: Canvas, clientPoint: [number, number]) {
  // - 计算当前点坐标
  let point = canvas.client2Viewport({ x: clientPoint[0], y: clientPoint[1] });
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
function drawLineReal(canvas: Canvas, param: {
  coord: [number, number] [],
  style?: any,
  angle90?: boolean, // 转角是否必须90度
}) {
  if(isCreateLine.value) return;
  isCreateLine.value = true;

  disableDragCamera.value = true;
  disableDragDevice.value = true;

  if(chooseDevice.value) removeEmphatic(canvas.document.querySelector(`#${chooseDevice.value.id}`)!);
  chooseDevice.value = undefined;

  drawLineInfo.coord = param?.coord ?? [];

  const polyline = new Polyline({
    id: uuidv4(),
    name: 'line',
    class: 'line',
    style: {
      ...polyLineDefaultStyle,
      lineDash: polyLineDefaultStyle.isDash? [polyLineDefaultStyle.dashLen, polyLineDefaultStyle.dashGap]: 0,
      points: JSON.parse(JSON.stringify(drawLineInfo.coord)),
      cursor: 'pointer',
      zIndex: 9,
      ...param?.style,
    },
  });

  const newEl: LineDataItem = {
    id: polyline.id,
    type: 'lineData',
    angle90: param.angle90,
    coord: drawLineInfo.coord,
    zIndex: 9,
    editType: {
      isAdd: true
    },
    
    style: {
      stroke: polyline.style.stroke as string,
      lineWidth: polyline.style.lineWidth as number,
      lineJoin: polyline.style.lineJoin!,
      lineCap: polyline.style.lineCap!,
      isDash: polyline.style.lineDash? 1 : 0,
      dashLen: (polyline.style.lineDash as any)?.[0],
      dashGap: (polyline.style.lineDash as any)?.[1],
    }
  }

  console.log('polyline.id:', polyline.id)

  canvas.appendChild(polyline);
  addCanvasDataRfEl(newEl);
  drawLineInfo.realEl = polyline;
  drawLineInfo.rfEl = newEl;

  polyline.addEventListener('click', (e: MouseEvent) => {
    console.log('%c [ e ]-266', 'font-size:13px; background:#28ccc9; color:#6cffff;', e);
    emitRef.value('deviceClick', { device: polyline, event: e });
  })

  // 添加可拖拽功能
  addDragToImgGroup(canvas, polyline);
  // 添加自定义右键菜单
  customContextMenu(canvas, polyline, getLineContextMenuData(canvas, polyline))
  // 添加移入高亮效果
  addClickChooseForReal(canvas, polyline);

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

      newEl.coord = drawLineInfo.coord;

      retreatAndAdvance.value.addLog({
        type: 'add',
        advanceSnapshot: clone(newEl),
      })
      return;
    }
    perTapTime = nowTapTime;

    // 计算坐标
    const point = client2Canvas(canvas, [event.clientX, event.clientY])

    if(param?.angle90 && drawLineInfo.coord.length && (Math.abs(point.x - drawLineInfo.coord[drawLineInfo.coord.length - 1][0]) > 10 && Math.abs(point.y - drawLineInfo.coord[drawLineInfo.coord.length - 1][1]) > 10) ) {
      const cornerPoint: [number, number] = [drawLineInfo.coord[drawLineInfo.coord.length - 1][0], point.y];
      drawLineInfo.coord.push(cornerPoint)
    }

    drawLineInfo.coord.push([point.x, point.y]);
    polyline.style.points = JSON.parse(JSON.stringify(drawLineInfo.coord));
  };
  canvas.addEventListener('click', clickHandle);

  // 鼠标悬浮移动时 线的终点跟随移动
  const hoverHandle = (event: any) => {
    // console.log('%c [ event ]-544', 'font-size:13px; background:#11bd91; color:#55ffd5;', clone(event));
    const temCoord = JSON.parse(JSON.stringify(drawLineInfo.coord))
    // 计算坐标
    const point = client2Canvas(canvas, [event.clientX, event.clientY])

    if(param?.angle90 && temCoord.length && (Math.abs(point.x - temCoord[temCoord.length - 1][0]) > 10 && Math.abs(point.y - temCoord[temCoord.length - 1][1]) > 10) ) {
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
function createLineReal(canvas: Canvas, param: LineDataItem) {
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
      zIndex: param.zIndex ?? 9,
    },
  });

  canvas.appendChild(polyline);

  polyline.addEventListener('click', (e: MouseEvent) => {
    emitRef.value('deviceClick', { device: polyline, event: e });
  })

  // 添加移入高亮效果
  addClickChooseForReal(canvas, polyline);

  // 添加可拖拽节点
  addDragNodePointToLine(canvas, polyline, { defaultHidden: true })

  // 添加可拖拽功能
  addDragToImgGroup(canvas, polyline);

  // 添加自定义右键菜单
  customContextMenu(canvas, polyline, getLineContextMenuData(canvas, polyline));

  return polyline;
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
  let retreatSnapshot: ImgDataItem | LineDataItem | TextDataItem;

  for(const nodePoint of nodePoints) {
    const interactable =  interact(nodePoint as any, {
      // 直接传入节点1
      context: canvas.document as any, // 传入上下文
    }).draggable({
      onstart: function (event) {
        if(disableDragDevice.value) return;
        // 禁止画布移动
        disableDragCamera.value = true;
        retreatSnapshot = clone(getCanvasDataRfEl(polyline.id)!);
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

        // 更新映射的数据
        updateCanvasDataRfElByReal(polyline);
      },
      onend: function (event) {
        if(disableDragDevice.value) return;

        const canvasDataEl = getCanvasDataRfEl(polyline.id)!;
        canvasDataEl.editType.isUpdate = true;

        retreatAndAdvance.value.addLog({
          type: 'update',
          retreatSnapshot,
          advanceSnapshot: clone(canvasDataEl),
        })
    
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
  const rectEntity: DisplayObject = group.querySelector('.imgBox__rect')!;
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

  let retreatSnapshot: ImgDataItem | LineDataItem | TextDataItem;

  const interactable = interact(rotateImg as any, {
    // 直接传入节点1
    context: canvas.document as any, // 传入上下文
  }).draggable({
    onstart: function (event) {
      console.log('%c [ event ]-749', 'font-size:13px; background:#6c15fa; color:#b059ff;', event);
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

      retreatSnapshot = clone(getCanvasDataRfEl(group.id)!);
    },
    onmove: function (event) {
      if(disableDragDevice.value) return;
      const endCanvasP = client2Canvas(canvas, [event.clientX, event.clientY])

      const angle = getAngleOfThreePoint(centerCoord, beginCoord, [endCanvasP.x, endCanvasP.y])
      innerEntity.setLocalEulerAngles(angle+beginRotate)

      endP.setPosition([endCanvasP.x, endCanvasP.y])

      // 更新映射的数据
      updateCanvasDataRfElByReal(group);
    },
    onend: function (event) {
      if(disableDragDevice.value) return;
      centerP.style.visibility = 'hidden';
      beginP.style.visibility = 'hidden';
      endP.style.visibility = 'hidden';

      const canvasDataEl = getCanvasDataRfEl(group.id)!;
      canvasDataEl.editType.isUpdate = true;

      retreatAndAdvance.value.addLog({
        type: 'update',
        retreatSnapshot,
        advanceSnapshot: clone(canvasDataEl),
      })

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
      visibility: 'hidden',
      // 增加z-index提高优先级
      zIndex: 100
    },
  });

  const rectEntity = group.querySelector('.imgBox__rect')!
  circle.translateLocal(rectEntity.style.width, rectEntity.style.height / 2)

  innerEntity.appendChild(circle);

  let beginStatus = {
    scale: [1, 1, 1] as [number, number, number],
  }
  let beginCoord: [number, number] = [0, 0];

  let retreatSnapshot: ImgDataItem | LineDataItem | TextDataItem;

  interact(circle as any, {
  // 直接传入节点1
    context: canvas.document as any, // 传入上下文
    // 设置更高的优先级
    actionChecker: function(pointer: any, event: any, action: any) {
      // 返回一个更高的优先级值
      return action ? { name: action.name, priority: 1000 } : null;
    },
    // 在这里设置 preventDefault
    preventDefault: 'always',
  }).draggable({
    // 阻止事件冒泡，防止触发父元素的拖拽
    // 设置更高的优先级
    ignoreFrom: '.imgBox__contentIcon',
    onstart: function (event) {
      // 阻止事件冒泡
      event.stopPropagation();
      event.stopImmediatePropagation();
      
      console.log('%c [ event ]-835', 'font-size:13px; background:#68fc3b; color:#acff7f;', event);
      if(disableDragDevice.value) return;
      // 禁止画布移动
      disableDragCamera.value = true;

      const imageEntity: DisplayObject = group.querySelector('.imgBox__contentIcon')!;

      beginStatus = {
        scale: [1, 1, 1], // imageEntity.getLocalScale() as any,
      }

      const beginPoint = client2Canvas(canvas, [event.clientX, event.clientY]);
      beginCoord = [beginPoint.x, beginPoint.y];

      retreatSnapshot = clone(getCanvasDataRfEl(group.id)!);
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
      console.log('%c [ curToCenterDistance ]-702', 'font-size:13px; background:#000; color:#61f7ff;', curToCenterDistance);

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

      const canvasDataEl = getCanvasDataRfEl(group.id)!;
      canvasDataEl.editType.isUpdate = true;

      retreatAndAdvance.value.addLog({
        type: 'update',
        retreatSnapshot,
        advanceSnapshot: clone(canvasDataEl),
      })


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
    // camera.setZoom(zoom);
  }, { passive: false } );
}

/**
 * @description: 使用 hammer.js 实现相机移动
 */
function moveCamera(canvas: Canvas) {
  const hammer = new Hammer(canvas as any);

  let preCoord = [0, 0];
  hammer.on('panstart', (ev) => {
    if(disableDragCamera.value) return;
    preCoord = [ev.deltaX, ev.deltaY];
  });
  hammer.on('pan', (ev) => {
    if(disableDragCamera.value) return;

    // const zoom = Math.pow(2, camera.getZoom()-1); // 如果需要实现类似3d空间的近快远慢 用这个
    const zoom = canvas.getCamera().getZoom();
    canvas.getCamera().pan((-ev.deltaX + preCoord[0]) / zoom, (-ev.deltaY + preCoord[1]) / zoom);
    preCoord = [ev.deltaX, ev.deltaY];
  });

}

function getDataOptionText(dataOption: TextDataItem['dataOption']) {
  if(!dataOption) return '';

  let text = '';
  for(let i = 0; i<dataOption.length; i++) {
    const item = dataOption[i];
    let value = serverData.value[item.key];
    if(item.equation && value) {
      // value = Tool.GetValueOfEvaluate(value, item.equation);
    }
    if(value) {
      // value = Tool.NumberRoundTo(value, item.decimal ?? 2);
    }
    if(i !== 0) text += '\n'
    text += `${item.label ?? ''} ${ value ?? '--' } ${ item.unit ?? ''}`
  }

  return text
}

/**
 * @description: 添加文本框
 */
function createTextReal(canvas: Canvas, param: TextDataItem) {
  const width = param.box.width + param.text.dx * 2;
  const height = param.box.height + param.text.dy * 2;

  const group = new Group({
    id: param.id,
    name: 'textBox',
    className: 'textBox',
    style: {
      cursor: 'pointer',
      zIndex: param.zIndex ?? 11,
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

  let text = param.text.text;
  if(param.isDataBox && param.dataOption) text = getDataOptionText(param.dataOption);

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
      text: text,
      textBaseline: 'top',
      wordWrap: true,
      wordWrapWidth: param.box.width,
    }
  })

  groupInner.appendChild(textEntity);

  canvas.appendChild(group);

  group.addEventListener('click', (e: MouseEvent) => {
    // console.log('%c [ e ]-266', 'font-size:13px; background:#28ccc9; color:#6cffff;', e);
    emitRef.value('deviceClick', { device: group, event: e });
  })

  // 高亮
  addClickChooseForReal(canvas, group);

  // 拖拽, 已添加到画布时前提
  addDragToImgGroup(canvas, group)

  // 添加自定义右键菜单
  customContextMenu(canvas, group, getLineContextMenuData(canvas, group))

  return group;
}


/**
 * @description: 删除元素
 */
function delateRealEl(canvas: Canvas, id: string) {
  if(chooseDevice.value?.id === id) chooseDevice.value= undefined;

  canvas.document.querySelector('#'+id)?.remove();

  // 更新映射的数据
  // for(const key of Object.keys(canvasDataRef.value)) {
  //   for(let i = 0; i< canvasDataRef.value[key].length; i++) {
  //     if(canvasDataRef.value[key][i].id === id) {
  //       retreatAndAdvance.value.addLog({  type: 'remove', snipObj: canvasDataRef.value[key][i] });

  //       canvasDataRef.value[key].splice(i, 1);
  //       break;
  //     }
  //   }
  // }
}

/**
 * @description: 根据画布元素更新映射
 * @param {DisplayObject} el
 */
function updateCanvasDataRfElByReal(el: DisplayObject) {
  if(el.name === 'imgBox') {
    return updateImgDataByEl(el)
  } else if(el.name === 'line') {
    return updateLineDataByEl(el)
  } else if(el.name === 'textBox') {
    return updateTextDataByEl(el)
  }
}

function updateImgDataByEl(el: DisplayObject): ImgDataItem {
  const canvasDataEl = getCanvasDataRfEl(el.id) as ImgDataItem;

  const rectEntity = el.querySelector('.imgBox__rect') as DisplayObject;

  canvasDataEl.zIndex = el.style.zIndex;
  canvasDataEl.width = rectEntity.style.width - imgPadding * 2;
  canvasDataEl.height = rectEntity.style.height - imgPadding * 2;
  canvasDataEl.coord = [
    el.getLocalPosition()[0] + rectEntity.style.width / 2, 
    el.getLocalPosition()[1] + rectEntity.style.height / 2,
  ]
  canvasDataEl.rotate = (el.querySelector('.imgBox__inner') as DisplayObject).getLocalEulerAngles();

  if(el.classList[1] === 'pathEntityBox') {
    canvasDataEl.color = el.querySelector('.imgBox__path')?.style.fill ?? '';
    canvasDataEl.stroke = el.querySelector('.imgBox__path')?.style.stroke ?? '';
    canvasDataEl.scale = (el.querySelector('.imgBox__path') as DisplayObject).getLocalScale()[0]
  }

  return canvasDataEl
}

function updateLineDataByEl(el: DisplayObject): LineDataItem {
  const canvasDataEl = getCanvasDataRfEl(el.id) as LineDataItem;

  const offset = el.getLocalPosition();

  canvasDataEl.coord = el.style.points.map((item: any) => [item[0]+offset[0], item[1]+offset[1]]);
  canvasDataEl.zIndex = el.style.zIndex;
  canvasDataEl.style = {
    stroke: el.style.stroke,
    lineWidth: el.style.lineWidth,
    lineJoin: el.style.lineJoin,
    lineCap: el.style.lineCap,
    isDash: el.style.lineDash? 1 : 0,
    dashLen: (el.style.lineDash as any)?.[0],
    dashGap: (el.style.lineDash as any)?.[1],
  }

  return canvasDataEl
}

function updateTextDataByEl(el: DisplayObject): TextDataItem {
  const canvasDataEl = getCanvasDataRfEl(el.id) as TextDataItem;

  const rectEntity = el.querySelector('.textBox__rect') as DisplayObject;
  const textEntity = el.querySelector('.textBox__text') as DisplayObject;

  canvasDataEl.coord = [
    (el as DisplayObject).getLocalPosition()[0] + rectEntity.style.width / 2, 
    (el as DisplayObject).getLocalPosition()[1] + rectEntity.style.height / 2,
  ];
  canvasDataEl.zIndex = el.style.zIndex;
  canvasDataEl.box = {
    width: rectEntity.style.width,
    height: rectEntity.style.height,
    fill: rectEntity.style.fill,
    lineWidth: rectEntity.style.lineWidth,
    stroke: rectEntity.style.stroke,
    radius: rectEntity.style.radius,
  };
  canvasDataEl.text = {
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
  canvasDataEl.box.width -= canvasDataEl.text.dx * 2;
  canvasDataEl.box.height -= canvasDataEl.text.dy * 2;

  return canvasDataEl
}

/**
 * @description: 调整元素zIndex
 */
function updateZIndexHandle(canvas: Canvas, id: string, zIndex: number) {
  const element = canvas.document.querySelector(`#${id}`) as DisplayObject;
  const canvasDataEl = getCanvasDataRfEl(id)!;
  const retreatSnapshot =  clone(canvasDataEl);

  canvasDataEl.zIndex = zIndex;
  element.remove();
  createRealEl(canvas, canvasDataEl);

  canvasDataEl.editType.isUpdate = true;
  retreatAndAdvance.value.addLog({
    type: 'update',
    retreatSnapshot,
    advanceSnapshot: clone(canvasDataEl),
  })
}

/**
 * @description: 删除元素
 */
function removeElHandle(canvas: Canvas, id: string) {
  delateRealEl(canvas, id);

  // 如果是新增后的删除，则需要重新添加 // 如果是本来就有的删除，则需要更新
  const canvasDataEl = getCanvasDataRfEl(id)!;
  const retreatSnapshot =  clone(canvasDataEl);

  if(canvasDataEl?.editType.isAdd) {
    removeCanvasDataRfEl(id);
    retreatAndAdvance.value.addLog({
      type: 'remove',
      retreatSnapshot,
    })
  } else {
    canvasDataEl.editType.isRemove = true;
    retreatAndAdvance.value.addLog({
      type: 'remove',
      retreatSnapshot,
      advanceSnapshot: clone(canvasDataEl),
    })
  }
}

/**
 * @description: 粘贴元素
 */
function pasteElHandle(canvas: Canvas, lastMouseEvent: MouseEvent) {
  if(!copySource.value) return;

  const canvasDataEl = copySource.value;
  let newEl:  undefined | ImgDataItem | LineDataItem | TextDataItem;

  if(canvasDataEl.type === 'imgData') {
    newEl = clone(canvasDataEl);
    newEl.id = uuidv4();

    const point = client2Canvas(canvas, [lastMouseEvent.clientX ?? 0, lastMouseEvent.clientY ?? 0])
    newEl.coord = [point.x, point.y];
  } else if(canvasDataEl.type === 'lineData') {
    newEl = clone(canvasDataEl);
    newEl.id = uuidv4();

    const point = client2Canvas(canvas, [lastMouseEvent.clientX ?? 0, lastMouseEvent.clientY ?? 0])
    const originBeginPoint = newEl.coord[0];
    const offset = [point.x - originBeginPoint[0], point.y - originBeginPoint[1]];
    newEl.coord = newEl.coord.map( item => [item[0] + offset[0], item[1] + offset[1]])
  } else if(canvasDataEl.type === 'textData') {
    newEl = clone(canvasDataEl);
    newEl.id = uuidv4();

    const point = client2Canvas(canvas, [lastMouseEvent.clientX ?? 0, lastMouseEvent.clientY ?? 0])
    newEl.coord = [point.x, point.y];
  }

  if(newEl) {
    createRealEl(canvas, newEl);
    addCanvasDataRfEl(newEl);
    retreatAndAdvance.value.addLog({
      type: 'add',
      advanceSnapshot: clone(newEl),
    })
  }
}

/**
 * @description: 新建元素
 */
function createRealEl(canvas: Canvas, item: ImgDataItem | LineDataItem | TextDataItem) {
  if(item.type === 'imgData') createImgReal(canvas, item);
  else if(item.type === 'lineData') createLineReal(canvas, item);
  else if(item.type === 'textData') createTextReal(canvas, item);
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

  // 这一块仅操作画布数据
  // 新增元素
  createRealEl,
  // 删除元素
  delateRealEl,
  // 面板元件拖拽过来新增
  canvasOutBoxDropHandle,
  // 新建一个img元素
  createImgReal,
  // 绘制管道
  drawLineReal,
  // 新增管道
  createLineReal,
  // 添加文字
  createTextReal,
  
  // 这一块同时操作画布数据和映射数据
  // 根据画布数据更新映射
  updateCanvasDataRfElByReal,
  // 调整元素zIndex
  updateZIndexHandle,
  // 粘贴元素
  pasteElHandle,
  // 删除元素
  removeElHandle,

  // 给元素添加右键菜单
  customContextMenu,
  // 给元素添加点击选中效果
  addClickChooseForReal,
  // 给图片元素添加拖拽
  addDragToImgGroup,
  // 给元素添加旋转功能
  addRotateToEntity,
  // 给元素添加缩放功能
  addScaleToEntity,
  // 数据转文本
  getDataOptionText
}