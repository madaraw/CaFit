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
      meta: {
        title: 'CaFit - Home'
      }
    },
    {
      path: '/workout-setup',
      name: 'workout-setup',
      component: WorkoutSetup,
      meta: {
        title: 'CaFit - Setup Your Workout'
      }
    },
    {
      path: '/workout-plan/:id',
      name: 'workout-plan',
      component: WorkoutPlan,
      meta: {
        title: 'CaFit - Workout Plan'
      }
    },
    {
      path: '/workout-list',
      name: 'workout-list',
      component: WorkoutList,
      meta: {
        title: 'CaFit - Workout List'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: About,
      meta: {
        title: 'CaFit - About'
      }
    },
    {
      path: '/contact',
      name: 'contact',
      component: Contact,
      meta: {
        title: 'CaFit - Contact'
      }
    }
  ],
})

export default router
