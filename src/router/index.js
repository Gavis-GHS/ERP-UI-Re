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
  {
    path: '/sales/order',
    component: () => import('@/pages/PlaceholderPage.vue')
  },
  {
    path: '/sales/contract',
    component: () => import('@/pages/PlaceholderPage.vue')
  },
  {
    path: '/sales/return',
    component: () => import('@/pages/PlaceholderPage.vue')
  },
  {
    path: '/purchase/requisition',
    component: () => import('@/pages/PurchaseRequisition.vue')
  },
  { path: '/purchase/inquiry', component: () => import('@/pages/PlaceholderPage.vue') },
  { path: '/purchase/inquiry-supplier', component: () => import('@/pages/PlaceholderPage.vue') },
  { path: '/purchase/order', component: () => import('@/pages/PlaceholderPage.vue') },
  { path: '/purchase/supplier', component: () => import('@/pages/PlaceholderPage.vue') },
  { path: '/purchase/safety-stock', component: () => import('@/pages/PlaceholderPage.vue') },
  { path: '/purchase/contract', component: () => import('@/pages/PlaceholderPage.vue') },
  { path: '/purchase/material', component: () => import('@/pages/PlaceholderPage.vue') },
  { path: '/purchase/order-ledger', component: () => import('@/pages/PlaceholderPage.vue') },
  { path: '/purchase/daily-calculation', component: () => import('@/pages/PlaceholderPage.vue') },
  { path: '/purchase/revoked-supplier', component: () => import('@/pages/PlaceholderPage.vue') },
  { path: '/purchase/qualified-supplier', component: () => import('@/pages/PlaceholderPage.vue') },
  { path: '/purchase/vendor-improvement', component: () => import('@/pages/PlaceholderPage.vue') },
  { path: '/purchase/unit-price', component: () => import('@/pages/PlaceholderPage.vue') },
  { path: '/purchase/payment', component: () => import('@/pages/PlaceholderPage.vue') },
  { path: '/purchase/entrusted-processing', component: () => import('@/pages/PlaceholderPage.vue') },
  { path: '/purchase/receiving-notice', component: () => import('@/pages/PlaceholderPage.vue') },
  { path: '/purchase/other-inbound', component: () => import('@/pages/PlaceholderPage.vue') },
  { path: '/purchase/return-notice', component: () => import('@/pages/PlaceholderPage.vue') },
  { path: '/purchase/other-outbound', component: () => import('@/pages/PlaceholderPage.vue') },
  { path: '/purchase/payment-plan', component: () => import('@/pages/PlaceholderPage.vue') },
  {
    path: '/production/stats',
    component: () => import('@/pages/PlaceholderPage.vue')
  },
  {
    path: '/production/report',
    component: () => import('@/pages/PlaceholderPage.vue')
  },
  { path: '/customers', component: () => import('@/pages/PlaceholderPage.vue') },
  {
    path: '/reports/sales',
    component: () => import('@/pages/PlaceholderPage.vue')
  },
  {
    path: '/reports/production',
    component: () => import('@/pages/PlaceholderPage.vue')
  },
  {
    path: '/reports/customers',
    component: () => import('@/pages/PlaceholderPage.vue')
  },
  { path: '/settings', component: () => import('@/pages/PlaceholderPage.vue') },
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
