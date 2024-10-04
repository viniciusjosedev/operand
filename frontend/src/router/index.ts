import LoginView from '@/views/LoginView.vue'
import TasksView from '@/views/TasksView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    }, {
			path: '/tasks',
			name: 'tasks',
			component: TasksView
		}, {
			path: '/:pathMatch(.*)*',
			redirect: '/tasks'
		}
  ]
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();

  if (!userStore.isAuthenticatedChecked) {
    try {
      await userStore.fetchUser();
      if (to.path === '/') {
        next('/tasks');  
      } else {
        next(); 
      }
    } catch (error) {
			userStore.isAuthenticatedChecked = true;
      next('/');
    }
  } else {
    if (!userStore.user.email && to.path !== '/') {
      next('/');
    } else if (userStore.user.email && to.path === '/') {
      next('/tasks'); 
    } else {
      next();
    }
  }
});

export default router
