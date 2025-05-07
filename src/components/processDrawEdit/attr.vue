<!--
 * @Author: Strayer
 * @Date: 2025-04-21
 * @LastEditors: Strayer
 * @LastEditTime: 2025-05-07
 * @Description: 
 * @FilePath: \processDraw\src\components\processDrawEdit\attr.vue
-->

<template>
  <div
    v-show="showAttrPanel"
    class="attr el-message-box"
  >
    <div class="attr__header">
      <h3>属性设置</h3>
      <el-button
        type="primary"
        size="small"
        @click="togglePanel"
      >
        {{ isPanelCollapsed ? '展开' : '收起' }}
      </el-button>
    </div>
    
    <div
      v-show="!isPanelCollapsed"
      class="attr__content"
    >
      <el-form
        :model="attrForm"
        size="small"
        label-suffix=":"
        class="white"
      >
        <div
          v-for="groupItem in attrFormOptions"
          :key="groupItem.groupTitle"
          class="attr__section"
        >
          <div class="attr__section-title">
            {{ groupItem.groupTitle }}
          </div>
        
          <template
            v-for="item of groupItem.formOptions"
            :key="item.key"
          >
            <template v-if="['dashLen', 'dashGap'].includes(item.key)">
              <el-form-item
                v-show="attrForm.isDash"
                :label="item.label"
              >
                <FormItem
                  v-model:value="attrForm[item.key]"
                  :itemObj="item"
                />
              </el-form-item>
            </template>

            <el-form-item
              v-else
              :label="item.label"
            >
              <FormItem
                v-model:value="attrForm[item.key]"
                :itemObj="item"
              />
            </el-form-item>
          </template>
        </div>

        <!-- 数据项特殊处理 -->
        <template v-if="attrForm.isDataBox">
          <div
            v-for="(dataItem, index) in attrForm.dataOption"
            :key="index"
            class="attr__section"
          >
            <div class="attr__section-title">
              数据项
            </div>
            
            <el-form-item label="对应的key">
              <el-input 
                v-model="attrForm.dataOption[index].key" 
              />
            </el-form-item>
            <el-form-item label="名称">
              <el-input 
                v-model="attrForm.dataOption[index].label" 
              />
            </el-form-item>
            <el-form-item label="单位">
              <el-input 
                v-model="attrForm.dataOption[index].unit" 
              />
            </el-form-item>
            <el-form-item label="转换公式">
              <el-input 
                v-model="attrForm.dataOption[index].equation" 
              />
            </el-form-item>
            <el-form-item label="小数位">
              <el-input-number 
                v-model.number="attrForm.dataOption[index].decimal" 
                :controls="false"
                style="width: 100%;"
              />
            </el-form-item>
            <el-button
              type="danger"
              @click="attrForm.dataOption.splice(index, 1)"
            >
              移除数据项
            </el-button>
          </div>
          <el-button
            type="primary"
            @click="attrForm.dataOption.push({ key: '', })"
          >
            新增数据项
          </el-button>
        </template>
        
        <div class="attr__actions">
          <el-button
            type="info"
            @click="updateDefaultStyle"
          >
            应用到默认样式
          </el-button>
          <el-button
            type="primary"
            @click="onSubmit"
          >
            保存
          </el-button>
          <el-button @click="cancel">
            取消
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
import { attrFormOptions, attrForm, showAttrPanel, getPolyLineAttr, getPathAttr, getTextAttr, updatePolyLineAttr, updatePathAttr, updateTextAttr, getRemotePointAttr, updateRemotePointAttr, updatePolyLineDefaultStyle, updatePathDefaultStyle, updateTextDefaultStyle } from './attr';
import FormItem from './formItem.vue';
import { chooseDevice, getCanvasDataRfEl, panelData } from './data';
import { Canvas, Polyline } from '@antv/g';
import { mapToObj } from 'remeda';

const props = defineProps<{
  canvas?: Canvas,
}>()

const isPanelCollapsed = ref(false);

function togglePanel() {
  isPanelCollapsed.value = !isPanelCollapsed.value;
}



watch(() => chooseDevice.value, (value) => {
  console.log('%c [ value ]-65', 'font-size:13px; background:#402994; color:#846dd8;', value);
  if(!value) {
    attrFormOptions.value = [];
    attrForm.value = {};
    showAttrPanel.value = false;
  } else {
    const panelObj = mapToObj(panelData.value, item => [item.key, item])

    if (chooseDevice.value?.type === 'lineData') {
      // 管道
      attrFormOptions.value = getPolyLineAttr(chooseDevice.value).options;
      attrForm.value = getPolyLineAttr(chooseDevice.value).formObj;
    } else if(chooseDevice.value?.type === 'imgData' && panelObj[chooseDevice.value?.key]?.path) {
      // 路径
      attrFormOptions.value = getPathAttr(chooseDevice.value).options;
      attrForm.value = getPathAttr(chooseDevice.value).formObj;
    } else if(chooseDevice.value?.type === 'imgData' && chooseDevice.value?.isRemotePoint) {
      // 远程点
      attrFormOptions.value = getRemotePointAttr(chooseDevice.value).options;
      attrForm.value = getRemotePointAttr(chooseDevice.value).formObj;
    } else if(chooseDevice.value?.type === 'textData') {
      // 文本
      attrFormOptions.value = getTextAttr(chooseDevice.value).options;
      attrForm.value = getTextAttr(chooseDevice.value).formObj;
    } else {
      attrFormOptions.value = [];
      attrForm.value = {};
    }

    showAttrPanel.value = true;
  }
})

function  cancel() {
  const panelObj = mapToObj(panelData.value, item => [item.key, item])
  
  if (chooseDevice.value?.type === 'lineData') {
    attrForm.value = getPolyLineAttr(chooseDevice.value).formObj;
  } else if(chooseDevice.value?.type === 'imgData' && panelObj[chooseDevice.value?.key]?.path) {
    attrForm.value = getPathAttr(chooseDevice.value).formObj;
  } else if(chooseDevice.value?.type === 'imgData' && chooseDevice.value?.isRemotePoint) {
    attrForm.value = getRemotePointAttr(chooseDevice.value).formObj;
  } else if(chooseDevice.value?.type === 'textData') {
    attrForm.value = getTextAttr(chooseDevice.value).formObj;
  } else {
    attrForm.value = {};
  }
}

function onSubmit() {
  const panelObj = mapToObj(panelData.value, item => [item.key, item])

  if (chooseDevice.value?.type === 'lineData') {
    updatePolyLineAttr(props.canvas!, chooseDevice.value)
  } else if(chooseDevice.value?.type === 'imgData' && panelObj[chooseDevice.value?.key]?.path) {
    updatePathAttr(props.canvas!, chooseDevice.value)
  } else if(chooseDevice.value?.type === 'imgData' && chooseDevice.value?.isRemotePoint) {
    updateRemotePointAttr(props.canvas!, chooseDevice.value)
  }  else if(chooseDevice.value?.type === 'textData') {
    updateTextAttr(props.canvas!, chooseDevice.value)
  }
}

function updateDefaultStyle() {
  const panelObj = mapToObj(panelData.value, item => [item.key, item])

  if (chooseDevice.value?.type === 'lineData') {
    updatePolyLineDefaultStyle();
  } else if(chooseDevice.value?.type === 'imgData' && panelObj[chooseDevice.value?.key]?.path) {
    updatePathDefaultStyle();
  } else if(chooseDevice.value?.type === 'imgData' && chooseDevice.value?.isRemotePoint) {
    
  }  else if(chooseDevice.value?.type === 'textData') {
    updateTextDefaultStyle();
  }
}

</script>

<style scoped>
.attr {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 320px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  transition: all 0.3s ease;
  color: #333;
  z-index: 2000;

  :deep(.el-input-number--small) {
    width: 100%;
  }
}

.attr__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
}

.attr__header h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
  font-weight: 600;
}

.attr__content {
  padding: 16px;
  max-height: 70vh;
  overflow-y: auto;
}

.attr__section {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px dashed #ebeef5;
}

.attr__section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.attr__section-title {
  font-size: 14px;
  color: #409eff;
  font-weight: 600;
  margin-bottom: 12px;
  padding-left: 8px;
  border-left: 3px solid #409eff;
}

.attr__checkbox-item {
  margin-bottom: 8px;
}

.attr__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}
</style>