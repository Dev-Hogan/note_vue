import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import { Routes } from '@/models'
import { useUserInfo } from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/register',
      name: Routes.register,
      component: () => import('@/views/Register.vue')
    },
    {
      path: '/login',
      name: Routes.login,
      component: () => import('@/views/Login2.vue')
    },
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
          path: 'wastebasket',
          name: Routes.wastebasket,
          component: () => import('@/modules/Trash.vue')
        },
        {
          path: 'waitingAnswer',
          name: Routes.waitingAnswer,
          component: () => import('@/modules/waitingAnswer.vue')
        },
        {
          path: 'tags',
          name: Routes.tags,
          component: () => import('@/modules/Tag.vue')
        },
        {
          path: 'category/:categoryId',
          name: Routes.category,
          component: () => import('@/modules/Category.vue')
        },
        {
          path: 'setting',
          name: Routes.settings,
          component: () => import('@/modules/Setting.vue')
        },
        {
          path: 'statistic',
          name: Routes.statistic,
          component: () => import('@/modules/Statistics.vue')
        },

        {
          path: 'dev',
          name: Routes.dev,
          component: () => import('@/modules/Dev.vue')
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

router.beforeEach((to) => {
  const isLogin = useUserInfo().isLogin()
  const whiteList = [Routes.login, Routes.register, Routes.pageNotFound]
  if (!isLogin && !whiteList.includes(to?.name as Routes)) {
    return { name: Routes.login }
  }
})

export default router
