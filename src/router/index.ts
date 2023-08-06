import { createRouter, createWebHashHistory } from 'vue-router';
import HelloWorld from '@/views/HelloWorld.vue';
import NotificationPopup from '@/views/NotificationPopup.vue';

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
];

export default createRouter({
  history: createWebHashHistory(),
  routes,
});
