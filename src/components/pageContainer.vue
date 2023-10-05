<template>
  <template v-if="!props.withSidebar">
    <div class="navbar draggable" @dblclick="expand">
      <div class="window-controls">
        <div class="close center" @click="close">
          <icon-close :size="6" v-show="controlsHovered" />
        </div>
        <div class="minimize center" @click="minimize">
          <icon-minus :size="6" v-show="controlsHovered" />
        </div>
        <div class="zoom center" @click="expand">
          <icon-shrink :size="6" v-if="isExpanded" v-show="controlsHovered" />
          <icon-expand :size="6" v-else v-show="controlsHovered" />
        </div>
      </div>
      <div class="title-container draggable">
        <div class="title">{{ title }}</div>
      </div>
    </div>
    <div class="content-area">
      <slot />
    </div>
  </template>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ipcRenderer } from 'electron';

const props = defineProps({
  title: {
    type: String,
    default: '主页',
  },
  withSidebar: {
    type: Boolean,
    default: false,
  },
});

const { title } = props;

const isExpanded = ref(false);
const expand = () => {
  isExpanded.value = !isExpanded.value;
  ipcRenderer.send('expandWindow', isExpanded.value);
};

const close = () => {
  ipcRenderer.send('closeWindow');
};

const minimize = () => {
  ipcRenderer.send('minimizeWindow');
};

// 模拟Mac红绿灯非Hover不显示图标
const controlsHovered = ref(false);

onMounted(() => {
  const controlWindow = document.getElementsByClassName('window-controls')[0];
  controlWindow.addEventListener('mouseenter', () => {
    controlsHovered.value = true;
  });
  controlWindow.addEventListener('mouseleave', () => {
    controlsHovered.value = false;
  });
});

// 手动移动
let mouseX: number, mouseY: number;

document.addEventListener('mousedown', (e: any) => {
  // @ts-ignore
  if (
    e.target.classList.contains('draggable') ||
    e.target.classList.contains('v-md-editor__toolbar')
  ) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }
});

function onMouseMove(e: any) {
  const deltaX = e.clientX - mouseX;
  const deltaY = e.clientY - mouseY;
  // 向主进程发送 'start-dragging' 事件，传递鼠标的偏移量
  ipcRenderer.send('start-dragging', { deltaX, deltaY });
}

function onMouseUp() {
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
}
</script>

<style lang="less" scoped>
.navbar {
  align-self: stretch;
  background-color: var(--materials-controls-title-bar);
  box-shadow:
    0 0.5px 0 rgba(0, 0, 0, 0.1),
    0 1px 0 rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(30px);
  display: flex;
  flex-direction: row;
  padding: var(--padding-10xs) 4.25rem var(--padding-10xs) 0;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 48px;
  position: fixed;
  top: 0;
  z-index: 999;

  .window-controls {
    height: 0.75rem;
    display: flex;
    flex-direction: row;
    padding: 0 var(--padding-5xs);
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    gap: var(--gap-5xs);

    .close {
      position: relative;
      border-radius: var(--br-81xl);
      background-color: var(--color-tomato);
      border: 0.5px solid var(--color-gray-100);
      box-sizing: border-box;
      width: 0.75rem;
      height: 0.75rem;
      cursor: pointer;
    }

    .minimize {
      position: relative;
      border-radius: var(--br-81xl);
      background-color: var(--color-goldenrod);
      border: 0.5px solid var(--color-gray-100);
      box-sizing: border-box;
      width: 0.75rem;
      height: 0.75rem;
      cursor: pointer;
    }

    .zoom {
      position: relative;
      border-radius: var(--br-81xl);
      background-color: var(--color-limegreen);
      border: 0.5px solid var(--color-gray-100);
      box-sizing: border-box;
      width: 0.75rem;
      height: 0.75rem;
      cursor: pointer;
    }
  }

  .title-container {
    flex: 1;
    display: flex;
    flex-direction: row;
    padding: var(--padding-10xs) var(--padding-3xs);
    align-items: center;
    justify-content: center;

    .title {
      position: relative;
      line-height: 1rem;
      font-weight: 600;
      user-select: none;
    }
  }
}

.content-area {
  margin-top: 48px;
  padding: 20px;
}
</style>
