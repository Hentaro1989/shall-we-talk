import Vue from 'vue';
import Router from 'vue-router';

import Login from './views/login.vue';
import Home from './views/home.vue';
import Chat from './views/chat.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
    },
    {
      path: '/chat/:roomId',
      name: 'chat',
      component: Chat,
    },
  ],
});
