import { createRouter, createWebHashHistory } from 'vue-router';
import DebuggerPage from '@/views/DebuggerPage.vue';
import NotificationPopup from '@/views/NotificationPopup.vue';
import MarkdownPages from '@/views/MarkdownPages.vue';

const routes = [
  {
    path: '/debug',
    component: DebuggerPage,
    name: 'DebuggerPage',
  },
  {
    name: 'notification',
    path: '/notification',
    component: NotificationPopup,
  },
  {
    name: 'markdown-pages',
    path: '/',
    component: MarkdownPages,
  },
];

export default createRouter({
  history: createWebHashHistory(),
  routes,
});
