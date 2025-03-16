import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WorkoutSetup from '../views/WorkoutSetup.vue'
import WorkoutPlan from '../views/WorkoutPlan.vue'

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
      component: WorkoutSetup,
    },
    {
      path: '/workout-plan/:id',
      name: 'workout-plan',
      component: WorkoutPlan,
    }
  ],
})

export default router
