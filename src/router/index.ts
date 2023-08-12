import { createRouter, createWebHashHistory } from 'vue-router';
import HelloWorld from '@/views/HelloWorld.vue';
import NotificationPopup from '@/views/NotificationPopup.vue';
import MarkdownPages from '@/views/MarkdownPages.vue';

const routes = [
  {
    path: '/',
    component: HelloWorld,
    name: 'HomePage',
  },
  {
    name: 'notification',
    path: '/notification',
    component: NotificationPopup,
  },
  {
    name: 'markdown-pages',
    path: '/markdown-pages',
    component: MarkdownPages,
  },
];

export default createRouter({
  history: createWebHashHistory(),
  routes,
});
