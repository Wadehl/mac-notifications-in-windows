<script setup lang="ts">
import { ref } from 'vue';
import PageContainer from '@/components/pageContainer.vue';

const text = ref('');
</script>

<template>
  <page-container title="Markdown">
    <markdown-editor
      v-model="text"
      height="80vh"
      style="min-height: 600px; -webkit-app-region: drag"
    ></markdown-editor>
  </page-container>
</template>
