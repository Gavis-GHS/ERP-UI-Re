import { createRouter, createWebHashHistory } from 'vue-router'
import { isLoggedIn } from '@/store/auth'

const routes = [
  { path: '/', redirect: '/home' },
  {
    path: '/login',
    component: () => import('@/pages/LoginPage.vue')
  },
  {
    path: '/home',
    component: () => import('@/pages/HomePage.vue')
  },
  // 原料送货管理
  { path: '/delivery/purchase-order', component: () => import('@/pages/PlaceholderPage.vue') },
  { path: '/delivery/shipping-notice', component: () => import('@/pages/PlaceholderPage.vue') },
  { path: '/delivery/vendor-improvement', component: () => import('@/pages/PlaceholderPage.vue') },
  // 排程管理
  { path: '/scheduling/task-release', component: () => import('@/pages/PlaceholderPage.vue') },
  { path: '/scheduling/machine-schedule', component: () => import('@/pages/PlaceholderPage.vue') },
  { path: '/scheduling/label-query', component: () => import('@/pages/PlaceholderPage.vue') },
  // 报价管理
  { path: '/quotation/manage', component: () => import('@/pages/PlaceholderPage.vue') },
  // 资产备件送货管理
  { path: '/asset-delivery/purchase-order', component: () => import('@/pages/PlaceholderPage.vue') },
  { path: '/asset-delivery/shipping-notice', component: () => import('@/pages/PlaceholderPage.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/home' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to) => {
  if (to.path === '/login') {
    if (isLoggedIn.value) return '/home'
    return true
  }
  if (!isLoggedIn.value) return '/login'
  return true
})

export default router
