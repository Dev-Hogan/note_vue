import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import { Routes } from '@/models'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: Routes.home,
      component: HomeView,
      children: [
        {
          path: 'all',
          name: Routes.all,
          component: () => import('@/modules/All.vue')
        },
        {
          path: 'focus',
          name: Routes.focus,
          component: () => import('@/modules/Focus.vue')
        },
        {
          path: 'randomLook',
          name: Routes.randomLook,
          component: () => import('@/modules/RandomLook.vue')
        },
        {
          path: 'dev',
          name: Routes.dev,
          component: () => import('@/modules/Dev.vue')
        },
        {
          path: 'category/:categoryId',
          name: Routes.category,
          component: () => import('@/modules/Category.vue')
        }
      ]
    },
    {
      path: '/:catchAll(.*)',
      name: Routes.pageNotFound,
      component: () => import('@/views/PageNotFound.vue')
    }
  ]
})

export default router
