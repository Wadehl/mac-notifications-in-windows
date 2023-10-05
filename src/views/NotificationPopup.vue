<template>
  <Transition>
    <div
      v-show="visible"
      class="container"
      @mouseover="clearTimer"
      @mouseleave="closePopup"
    >
      <div
        class="close-button"
        v-show="showClose"
        @click="closePopupImmediately"
      >
        <icon-close />
      </div>
      <div class="notification-default">
        <div class="app-icon">
          <img
            v-if="type === 'message'"
            class="no-app-icon"
            alt="message"
            src="@/assets/types/message.png"
          />
          <img
            v-else-if="type === 'wechat'"
            class="no-app-icon"
            alt="wechat"
            src="@/assets/types/wechat.png"
          />
          <img
            v-else-if="type === 'phone'"
            class="no-app-icon"
            alt="phone"
            src="@/assets/types/phone.png"
          />
          <img
            v-else-if="type === 'warning'"
            class="no-app-icon"
            alt="warning"
            src="@/assets/types/warning.png"
          />
          <img
            v-else-if="type === 'success'"
            class="no-app-icon"
            alt="success"
            src="@/assets/types/success.png"
          />
          <img
            v-else-if="type === 'error'"
            class="no-app-icon"
            alt="notification"
            src="@/assets/types/notification.png"
          />
          <img
            v-else
            class="no-app-icon"
            alt="notification"
            src="@/assets/types/notification.png"
          />
        </div>
        <div class="title-description">
          <b class="title">{{ customTitle }}</b>
          <div class="description">{{ customMessage }}</div>
        </div>
        <div class="right-side">
          <div class="timestamp">{{ time }}</div>
          <!--        <img class="image-icon" alt="" src="/vite.svg"/>-->
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import { ipcRenderer } from 'electron';

const route = useRoute();

const visible = ref(false);

// 计时器
const timer = ref<any>(null);
const timer2 = ref<any>(null);

// 关闭按钮
const showClose = ref(false);

onMounted(() => {
  setTimeout(() => {
    visible.value = true;
  }, 100);
  // closePopup();
});

const closePopup = () => {
  showClose.value = false;
  timer.value = setTimeout(() => {
    visible.value = false;
  }, 1000);
  timer2.value = setTimeout(() => {
    if (visible.value) {
      visible.value = false;
    }
    ipcRenderer.send('destroyNotificationPopup');
  }, 5000);
};

const closePopupImmediately = () => {
  visible.value = false;
  setTimeout(() => {
    if (visible.value) {
      visible.value = false;
    }
    ipcRenderer.send('destroyNotificationPopup');
  }, 0);
};

const clearTimer = () => {
  clearTimeout(timer.value);
  clearTimeout(timer2.value);
  showClose.value = true;
  // closePopup();
};

const customTitle = ref('');
const customMessage = ref('');
const type = ref('');
const time = ref('');

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

if (VITE_DEV_SERVER_URL) {
  customTitle.value = route.query.customTitle as string;
  customMessage.value = route.query.customMessage as string;
  type.value = route.query.type as string;
  time.value = route.query.time as string;
} else {
  // 获取 URL 中的查询参数字符串
  const queryString = window.location.search;

  // 将查询参数字符串解析成对象
  const params = new URLSearchParams(queryString);

  // 将查询参数对象存储到组件的 data 中
  const query = Object.fromEntries(params.entries());
  customTitle.value = query.customTitle as string;
  customMessage.value = query.customMessage as string;
  type.value = query.type as string;
  time.value = query.time as string;
}

const copy = () => {
  const el = document.createElement('textarea');
  el.value = customMessage.value;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};
</script>
<style lang="less" scoped>
.v-enter-active {
  transition: all 0.5s ease;
  transform: translateX(100%); /* 初始位置在右边 */
  opacity: 0; /* 初始透明度为0，进入时渐变显示 */
}

.v-enter-to {
  transform: translateX(0); /* 进入后移动到原始位置 */
  opacity: 1; /* 完全显示 */
}

/* 离开动画 */
.v-leave-active {
  transition: all 0.2s ease 3s;
}

.v-leave-to {
  transform: translateX(100%); /* 离开时向右离开 */
  opacity: 0; /* 离开时渐变消失 */
}

.container {
  position: absolute;
  left: 10px;
  top: 10px;
}

.no-app-icon {
  position: relative;
  width: 2.5rem;
  height: 2.5rem;
  object-fit: cover;
}

.app-icon {
  display: flex;
  flex-direction: column;
  padding: var(--padding-8xs) 0rem;
  align-items: flex-start;
  justify-content: flex-start;
}

.title {
  align-self: stretch;
  position: relative;
  line-height: 1rem;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 1rem;
  flex-shrink: 0;
}

.description {
  align-self: stretch;
  position: relative;
  line-height: 1rem;
  max-height: 2rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.title-description {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: var(--gap-11xs);
}

.timestamp {
  position: relative;
  line-height: 0.88rem;
}

.image-icon {
  position: relative;
  border-radius: var(--br-7xs);
  width: 2rem;
  height: 2rem;
  object-fit: cover;
}

.right-side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
  gap: var(--gap-6xs);
  text-align: right;
  font-size: var(--subheadline-regular-size);
  color: var(--fills-tertiary);
}

.notification-default {
  position: relative;
  border-radius: var(--br-base);
  background-color: var(--materials-ultrathick);
  box-shadow:
    0px 0px 1px rgba(255, 255, 255, 0.1) inset,
    0px 0px 2px rgba(0, 0, 0, 0.25),
    0px 0px 9px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(30px);
  width: 344px;
  display: flex;
  flex-direction: row;
  padding: var(--padding-xs);
  box-sizing: border-box;
  align-items: flex-start;
  justify-content: flex-start;
  gap: var(--gap-5xs);
  text-align: left;
  font-size: var(--body-regular-size);
  color: var(--text-primary);
  font-family: var(--subheadline-regular);
}

.close-button {
  position: absolute;
  top: -5px;
  left: -5px;
  border-radius: 50%;
  background-color: #f5f5f5;
  width: 20px;
  height: 20px;
  cursor: pointer;
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;
}
</style>
