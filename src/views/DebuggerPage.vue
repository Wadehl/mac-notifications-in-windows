<script setup lang="ts">
import { ipcRenderer } from 'electron';
import { onUnmounted, reactive } from 'vue';
import axios from 'axios';
import dayjs from 'dayjs';

import { useSocket } from '@/hooks/useSocket';
import PageContainer from '../components/pageContainer.vue';
// import MarkdownEditor from '@/components/markdownEditor.vue';

const formState = reactive({
  title: '',
  msg: '',
  type: 'message',
});

const typeOptions = [
  { label: '信息', value: 'message' },
  { label: '电话', value: 'phone' },
  { label: '警告', value: 'warning' },
  { label: '微信', value: 'wechat' },
  { label: '成功', value: 'success' },
  { label: '失败', value: 'error' },
  { label: '默认', value: 'notification' },
];

const showNotificationPopup = (data: any) => {
  console.log(data);
  ipcRenderer.send('customRenderMessage', {
    title: data.sender,
    message: data.content,
    code: data.code,
    type: data.type,
    time: dayjs().format('HH:mm:ss'),
  });
};

const { socket, destroySocket } = useSocket(showNotificationPopup);

const imitateRequestData = () => {
  axios.post(
    'http://localhost:3000/api/postMsg',
    {
      sender: formState.title,
      content: formState.msg,
      type: formState.type,
    },
    { headers: { 'Content-Type': 'application/json' } },
  );
};

onUnmounted(() => {
  destroySocket(socket);
});
//
// const text = ref(`
// # Hello There 👋
// I am Kevin Kwok, a full-stack developer🧑‍💻 from China.
// Nice 2 Meet You!
//
// ## CODING TEST
// \`\`\` ts
// const debounce = (func: function, delay: number) => {
// \t let timer = null;
// \t return function() {
// \t \t clearTimeout(timer);
// \t \t const args = arguments;
// \t \t timer = setTimeout(function() {
// \t \t func.apply(this, args);
// \t \t }
// \t }
// }
// \`\`\`
//
// ## Local Uploading Test
// ![Image-1691847397204.gif](http://localhost:3000/uploads/Image-1691847397204.gif)
// `);
</script>

<template>
  <page-container title="Debug页面">
    <!--    <a-tabs :default-active-key="1" lazy-load>-->
    <!--      <a-tab-pane :key="1" title="NOTIFICATION">-->
    <!--        <a-card title="测试弹窗">-->
    <!--          <a-space>-->
    <!--            <template #split>-->
    <!--              <a-divider direction="vertical" />-->
    <!--            </template>-->
    <!--            <a-form style="width: 600px" :model="formState">-->
    <!--              <a-form-item label="title">-->
    <!--                <a-input label="标题" v-model="formState.title" />-->
    <!--              </a-form-item>-->
    <!--              <a-form-item label="信息">-->
    <!--                <a-input v-model="formState.msg" />-->
    <!--              </a-form-item>-->
    <!--              <a-form-item label="类型">-->
    <!--                <a-select v-model="formState.type" :options="typeOptions" />-->
    <!--              </a-form-item>-->
    <!--              <a-form-item>-->
    <!--                <a-button type="primary" @click="imitateRequestData"-->
    <!--                  >emit myNotification</a-button-->
    <!--                >-->
    <!--              </a-form-item>-->
    <!--            </a-form>-->
    <!--          </a-space>-->
    <!--        </a-card>-->
    <!--      </a-tab-pane>-->
    <!--      <a-tab-pane :key="2" title="MARKDOWN">-->
    <!--        <markdown-editor v-model:text="text"></markdown-editor>-->
    <!--      </a-tab-pane>-->
    <!--    </a-tabs>-->
    <a-card title="测试弹窗">
      <a-space>
        <template #split>
          <a-divider direction="vertical" />
        </template>
        <a-form style="width: 600px" :model="formState">
          <a-form-item label="title">
            <a-input label="标题" v-model="formState.title" />
          </a-form-item>
          <a-form-item label="信息">
            <a-input v-model="formState.msg" />
          </a-form-item>
          <a-form-item label="类型">
            <a-select v-model="formState.type" :options="typeOptions" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="imitateRequestData"
              >emit myNotification</a-button
            >
          </a-form-item>
        </a-form>
      </a-space>
    </a-card>
  </page-container>
</template>
