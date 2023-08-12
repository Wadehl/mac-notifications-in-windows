<script setup lang="ts">
import { onMounted, reactive, ref, toRefs, watch } from 'vue';
import { ipcRenderer } from 'electron';

import message from '@/utils/message';
import axios from 'axios';

const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  autofocus: {
    type: Boolean,
    default: true,
  },
  leftToolbar: {
    type: String,
    default:
      'undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code | emoji todo-list | open save ',
  },
});

const emits = defineEmits(['update:text']);

const bindText = ref('');

const { text, autofocus, leftToolbar } = toRefs(props);

bindText.value = text?.value;

watch(text, newVal => {
  emits('update:text', newVal);
});

// 打开文件
const uploadRef = ref<any>(null);

const saveMarkdown = (text: string) => {
  ipcRenderer.send('saveMarkdown', text);
};

const toolBar = reactive({
  open: {
    icon: 'v-md-icon-folder',
    title: '打开文件',
    action: function () {
      uploadRef?.value.click();
    },
  },
});

onMounted(() => {
  uploadRef?.value.addEventListener('change', (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event: any) {
      bindText.value = event.target.result;
    };

    reader.readAsText(file); // 读取文件内容为文本
  });
});

// 上传图片
const handleUploadImage = async (
  _event: any,
  insertImage: any,
  files: File[],
) => {
  const formData = new FormData();
  formData.append('image', files[0]);
  try {
    const res: { data: { data: { filePath: string; fileName: string } } } =
      await axios.post('http://localhost:3000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    const { filePath, fileName } = res.data.data;
    await insertImage({
      url: filePath,
      desc: fileName,
    });
  } catch (e: any) {
    message.error(e, '上传失败');
  }
};

const handleCopyCodeSuccess = () => {
  message.success('复制成功');
};
</script>

<template>
  <input
    ref="uploadRef"
    id="mdReader"
    type="file"
    style="display: none"
    accept="text/plain, .md"
  />
  <v-md-editor
    v-bind="$attrs"
    v-model="bindText"
    height="60vh"
    :left-toolbar="leftToolbar"
    :toolbar="toolBar"
    :autofocus="autofocus"
    :disabled-menus="[]"
    :default-fullscreen="true"
    @save="saveMarkdown"
    @upload-image="handleUploadImage"
    @copy-code-success="handleCopyCodeSuccess"
  ></v-md-editor>
</template>

<style scoped lang="less"></style>
