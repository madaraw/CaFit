import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/WorkoutSetup',
      name: 'WorkoutSetup',
      component: () => import('../views/WorkoutSetup.vue'),
    },
    {
      path: '/workout-plan',
      name: 'workout-plan',
      component: () => import('../views/WorkoutPlan.vue'),
    }
  ],
})

export default router
