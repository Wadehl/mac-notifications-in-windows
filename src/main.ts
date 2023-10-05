import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
// public components
import pageContainer from './components/pageContainer.vue';
import markdownEditor from './components/markdownEditor.vue';
import macAlert from './components/macAlert.vue';

// icon
import ArcoVueIcon from '@arco-design/web-vue/es/icon';

// router
import router from './router';

// VueMarkdownEditor
import VueMarkdownEditor from '@/config/vueMd.config.ts';

const app = createApp(App);
app
  .use(router)
  .use(ArcoVueIcon)
  .use(VueMarkdownEditor)
  .component('macAlert', macAlert)
  .component('pageContainer', pageContainer)
  .component('markdownEditor', markdownEditor);
app
  .mount('#app')
  .$nextTick(() => postMessage({ payload: 'removeLoading' }, '*'));
