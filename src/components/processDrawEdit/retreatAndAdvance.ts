/*
 * @Author: Strayer
 * @Date: 2025-04-29
 * @LastEditors: Strayer
 * @LastEditTime: 2025-05-07
 * @Description: 前进 与 撤回
 * @FilePath: \processDraw\src\components\processDrawEdit\retreatAndAdvance.ts
 */

import { Canvas } from '@antv/g';
import { createRealEl, delateRealEl } from './comm';
import { addCanvasDataRfEl, drawLineInfo, removeCanvasDataRfEl, replaceCanvasDataRfEl } from './data';
import { type RetreatAndAdvanceItem } from './dataType';
import { clone } from 'remeda';

// 撤回  与 前进
export class RetreatAndAdvance {
  // 正在编辑中的管道特殊 处理
  retreatCurrentLine() {
    if(drawLineInfo.coord.length > 1) {
      drawLineInfo.coord.pop();
    }
  }

  retreat: RetreatAndAdvanceItem [] = [];
  advance: RetreatAndAdvanceItem [] = [];

  // 添加操作记录
  addLog = (item: RetreatAndAdvanceItem) => {
    this.retreat.push(item);
    // 最多保存50步 
    if(this.retreat.length > 50) {
      this.retreat.shift();
    }

    // 前进清空
    this.advance = [];
  }

  // 往后撤退一步
  retreatOneStep = (canvas: Canvas) => {
    const item = this.retreat.pop();
    if(!item) return;
    this.advance.push(clone(item));

    // 如果是add的话，直接删除 如果是remove的话，直接添加回来 update的话，更新
    if(item.type === 'add') {
      removeCanvasDataRfEl(item.advanceSnapshot!.id);
      delateRealEl(canvas, item.advanceSnapshot!.id);
    } else if(item.type === 'remove') {
      // 如果是新增后的删除，则需要重新添加 // 如果是本来就有的删除，则需要更新
      if(!item.advanceSnapshot) {
        addCanvasDataRfEl(item.retreatSnapshot!);
      } else {
        replaceCanvasDataRfEl(item.retreatSnapshot!);
      }
      
      createRealEl(canvas, item.retreatSnapshot!);
    } else if(item.type === 'update') {
      replaceCanvasDataRfEl(item.retreatSnapshot!);
      delateRealEl(canvas, item.retreatSnapshot!.id);
      createRealEl(canvas, item.retreatSnapshot!);
    }
  }

  // 往前前进一步
  advanceOneStep = (canvas: Canvas) => {
    const item = this.advance.pop();
    if(!item) return;
    this.retreat.push(clone(item));

    // 如果是add的话，直接新增 如果是remove的话，直接删除 update的话，更新
    if(item.type === 'add') {
      addCanvasDataRfEl(item.advanceSnapshot!);
      createRealEl(canvas, item.advanceSnapshot!);
    } else if(item.type === 'remove') {
      // 如果是新增后的删除，则直接删除 // 如果是本来就有的删除，则更新就行
      if(!item.advanceSnapshot) {
        removeCanvasDataRfEl(item.retreatSnapshot!.id);
      } else {
        replaceCanvasDataRfEl(item.advanceSnapshot!);
      }
      delateRealEl(canvas, item.retreatSnapshot!.id);
    } else if(item.type === 'update') {
      replaceCanvasDataRfEl(item.advanceSnapshot!);
      delateRealEl(canvas, item.advanceSnapshot!.id);
      createRealEl(canvas, item.advanceSnapshot!);
    }
  }
}