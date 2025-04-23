import type { Canvas, DisplayObject } from "@antv/g";
import type { MenuDataItem } from "./dataType";
import { chooseDevice, copySource } from "./data";
import { deleteElement } from "./comm";

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
        console.log('%c [ id ]-212', 'font-size:13px; background:#fff; color:#ff4bff;', id);
        copySource.value = canvas.document.querySelector(`#${id}`) as DisplayObject;
      },
    },
    {
      key: 'delete',
      label: '删除',
      icon: '🗑️',
      clickParam: el.id,
      clickHandle: (id: string) => {
        deleteElement(canvas, id);
      },
    },
    {
      key: 'top',
      label: '置顶',
      icon: '⬆️',
      clickParam: el.id,
      clickHandle: (id: string) => {
        console.log('%c [ id ]-212', 'font-size:13px; background:#fff; color:#ff4bff;', id);
      },
    },
    {
      key: 'bottom',
      label: '置底',
      icon: '⬇️',
      clickParam: el.id,
      clickHandle: (id: string) => {
        console.log('%c [ id ]-212', 'font-size:13px; background:#fff; color:#ff4bff;', id);
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
        console.log('%c [ id ]-212', 'font-size:13px; background:#fff; color:#ff4bff;', id);
      },
    },
    {
      key: 'delete',
      label: '删除',
      icon: '🗑️',
      clickParam: el.id,
      clickHandle: (id: string) => {
        deleteElement(canvas, id);
      },
    },
    {
      key: 'top',
      label: '置顶',
      icon: '⬆️',
      clickParam: el.id,
      clickHandle: (id: string) => {
        console.log('%c [ id ]-212', 'font-size:13px; background:#fff; color:#ff4bff;', id);
      },
    },
    {
      key: 'bottom',
      label: '置底',
      icon: '⬇️',
      clickParam: el.id,
      clickHandle: (id: string) => {
        console.log('%c [ id ]-212', 'font-size:13px; background:#fff; color:#ff4bff;', id);
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
      key: 'delete',
      label: '删除',
      icon: '🗑️',
      clickParam: el.id,
      clickHandle: (id: string) => {
        deleteElement(canvas, id);
      },
    },
    {
      key: 'top',
      label: '置顶',
      icon: '⬆️',
      clickParam: el.id,
      clickHandle: (id: string) => {
        console.log('%c [ id ]-212', 'font-size:13px; background:#fff; color:#ff4bff;', id);
      },
    },
    {
      key: 'bottom',
      label: '置底',
      icon: '⬇️',
      clickParam: el.id,
      clickHandle: (id: string) => {
        console.log('%c [ id ]-212', 'font-size:13px; background:#fff; color:#ff4bff;', id);
      },
    },
  ];

  return res
}