import type { Canvas, DisplayObject } from '@antv/g';
import type { MenuDataItem } from './dataType';
import { copySource, getCanvasDataRfEl } from './data';
import { removeElHandle, updateZIndexHandle } from './comm';


/**
 * @description: img元件右键菜单数据
 */
export function getImgContextMenuData(canvas: Canvas, el: DisplayObject) {
  const res: MenuDataItem[] = [
    // {
    //   key: 'edit',
    //   label: '编辑',
    //   icon: '✏️',
    //   clickParam: el.id,
    //   clickHandle: (id: string) => {
    //     console.log('%c [ id ]-212', 'font-size:13px; background:#fff; color:#ff4bff;', id);
    //   },
    // },
    {
      key: 'copy',
      label: '复制',
      icon: '📋',
      clickParam: el.id,
      clickHandle: (id: string) => {
        copySource.value = getCanvasDataRfEl(id)!;
      },
    },
    {
      key: 'delete',
      label: '删除',
      icon: '🗑️',
      clickParam: el.id,
      clickHandle: (id: string) => {
        removeElHandle(canvas, id);
      },
    },
    {
      key: 'top',
      label: '置顶',
      icon: '⬆️',
      clickParam: el.id,
      clickHandle: (id: string) => {
        updateZIndexHandle(canvas, id, 999);
      },
    },
    {
      key: 'bottom',
      label: '置底',
      icon: '⬇️',
      clickParam: el.id,
      clickHandle: (id: string) => {
        updateZIndexHandle(canvas, id, 1);
      },
    },
  ];

  return res
}

/**
 * @description: 管道右键菜单数据
 */
export function getLineContextMenuData(canvas: Canvas, el: DisplayObject) {
  const res: MenuDataItem[] = [
    {
      key: 'copy',
      label: '复制',
      icon: '📋',
      clickParam: el.id,
      clickHandle: (id: string) => {
        copySource.value = getCanvasDataRfEl(id)!;
      },
    },
    {
      key: 'delete',
      label: '删除',
      icon: '🗑️',
      clickParam: el.id,
      clickHandle: (id: string) => {
        removeElHandle(canvas, id);
      },
    },
    {
      key: 'top',
      label: '置顶',
      icon: '⬆️',
      clickParam: el.id,
      clickHandle: (id: string) => {
        updateZIndexHandle(canvas, id, 999);
      },
    },
    {
      key: 'bottom',
      label: '置底',
      icon: '⬇️',
      clickParam: el.id,
      clickHandle: (id: string) => {
        updateZIndexHandle(canvas, id, 1);
      },
    },
  ];
  return res
}

/**
 * @description: 文本右键菜单数据
 */
export function getTextContextMenuData(canvas: Canvas, el: DisplayObject) {
  const res: MenuDataItem[] = [
    {
      key: 'copy',
      label: '复制',
      icon: '📋',
      clickParam: el.id,
      clickHandle: (id: string) => {
        copySource.value = getCanvasDataRfEl(id)!;
      },
    },
    {
      key: 'delete',
      label: '删除',
      icon: '🗑️',
      clickParam: el.id,
      clickHandle: (id: string) => {
        removeElHandle(canvas, id);
      },
    },
    {
      key: 'top',
      label: '置顶',
      icon: '⬆️',
      clickParam: el.id,
      clickHandle: (id: string) => {
        updateZIndexHandle(canvas, id, 999);
      },
    },
    {
      key: 'bottom',
      label: '置底',
      icon: '⬇️',
      clickParam: el.id,
      clickHandle: (id: string) => {
        updateZIndexHandle(canvas, id, 1);
      },
    },
  ];

  return res
}