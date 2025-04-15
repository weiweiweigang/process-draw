import { ref } from "vue";

// 拖拽时允许移动相机
export  const moveCameraWhenDrag = ref(true);

export const initData = () => {
  moveCameraWhenDrag.value = true;
};