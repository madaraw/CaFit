import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WorkoutSetup from '../views/WorkoutSetup.vue'
import WorkoutPlan from '../views/WorkoutPlan.vue'
import WorkoutList from '../views/WorkoutList.vue'
import About from '@/views/About.vue'
import Contact from '@/views/Contact.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/workout-setup',
      name: 'workout-setup',
      component: WorkoutSetup,
    },
    {
      path: '/workout-plan/:id',
      name: 'workout-plan',
      component: WorkoutPlan,
    },
    {
      path: '/workout-list',
      name: 'workout-list',
      component: WorkoutList,
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/contact',
      name: 'contact',
      component: Contact
    }
  ],
})

export default router
