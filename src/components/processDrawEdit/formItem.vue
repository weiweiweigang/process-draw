<!--
 * @Author: Strayer
 * @Date: 2022-12-09
 * @LastEditors: Strayer
 * @LastEditTime: 2025-04-21
 * @Description: 表单选项内容封装
-->
<template>
  <!-- number框 -->
  <el-input-number
    v-if="(!props.itemObj.component && props.itemObj.inputType === 'number' && (typeof formItemValue === 'number' || typeof formItemValue === 'undefined' || formItemValue === null))"
    v-model.number="formItemValue"
    :disabled="(props.itemObj.disabled || props.disabled) ?? false"
    :controls="false"
    :style="{width: props.itemObj.width+'px'}"
  />
  <!-- 文本框 -->
  <el-input 
    v-else-if="!props.itemObj.component"
    v-model="formItemValue" 
    :disabled="(props.itemObj.disabled || props.disabled) ?? false"
    :style="{width: props.itemObj.width+'px'}"
  />
  <!-- 下拉框 -->
  <el-select 
    v-else-if="props.itemObj.component === 'select'"
    v-model="formItemValue"
    :disabled="(props.itemObj.disabled || props.disabled) ?? false"
    :style="{width: props.itemObj.width+'px'}"
  >
    <el-option
      v-for="optionItem in props.itemObj.selectOption"
      :key="optionItem.dictValue"
      :label="optionItem.dictLabel"
      :value="optionItem.dictValue"
    />
  </el-select>
  <!-- 开关 -->
  <el-switch
    v-else-if="props.itemObj.component === 'switch'"
    v-model="formItemValue"
    :disabled="(props.itemObj.disabled || props.disabled) ?? false"
    :active-value="props.itemObj.switchActiveValue"
    :inactive-value="props.itemObj.switchInactiveValue"
  />
  <!-- 颜色 -->
  <el-color-picker 
    v-else-if="props.itemObj.component === 'color'"
    v-model="(formItemValue as string)" 
    :show-alpha="props.itemObj.showAlpha" 
  />
  <!-- 容错 -->
  <el-input 
    v-else
    v-model="formItemValue" 
    :disabled="(props.itemObj.disabled || props.disabled) ?? false"
    :style="{width: props.itemObj.width+'px'}"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { FormItemType } from "./data"

type ValueType = undefined | null | string | number;

const props = defineProps<{
  itemObj: FormItemType,
  value: ValueType,
  disabled?: boolean,
}>()

const emit = defineEmits<{
  (e: 'update:value', value: ValueType): void,
}>()

const formItemValue = computed<undefined | string | number>({
  get() {
    if(props.itemObj.customValue) return props.itemObj.customValue(props.value)
    return (props.value ?? undefined)
  },
  set(value: ValueType) {
    emit('update:value', value)
  }
})

</script>

<style lang="scss" scoped>
</style>