<script setup lang="ts">
import { ipcRenderer } from "electron";
import { onUnmounted, ref } from "vue";
import axios from "axios";
import dayjs from "dayjs";

import { useSocket } from "@/hooks/useSocket";
import PageContainer from "../components/pageContainer.vue";

const title = ref("");
const msg = ref("");
const type = ref("message");

const typeOptions = [
  { label: "信息\n", value: "message" },
  { label: "电话", value: "phone" },
  { label: "警告", value: "warning" },
  { label: "微信", value: "wechat" },
];

const showNotificationPopup = (data: any) => {
  ipcRenderer.send("customRenderMessage", {
    title: data.sender,
    message: data.content,
    type: data.type,
    time: dayjs().format("HH:mm:ss"),
  });
};

const { socket, destroySocket } = useSocket(showNotificationPopup);

const imitateRequestData = () => {
  axios.post(
    "http://localhost:3000/api/postMsg",
    {
      sender: title.value,
      content: msg.value,
      type: type.value,
    },
    { headers: { "Content-Type": "application/json" } },
  );
};

onUnmounted(() => {
  destroySocket(socket);
});
</script>

<template>
  <page-container title="Debug页面">
    <a-card title="测试弹窗">
      <a-space>
        <template #split>
          <a-divider direction="vertical" />
        </template>
        <a-form style="width: 600px">
          <a-form-item label="title">
            <a-input label="标题" v-model="title" />
          </a-form-item>
          <a-form-item label="信息">
            <a-input v-model="msg" />
          </a-form-item>
          <a-form-item label="类型">
            <a-select v-model="type" :options="typeOptions" />
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
