const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/home', component: HomePage },
    { path: '/sales/order', component: PlaceholderPage },
    { path: '/sales/contract', component: PlaceholderPage },
    { path: '/sales/return', component: PlaceholderPage },
    { path: '/purchase/requisition', component: PurchaseRequisition },
    { path: '/production/stats', component: PlaceholderPage },
    { path: '/production/report', component: PlaceholderPage },
    { path: '/customers', component: PlaceholderPage },
    { path: '/reports/sales', component: PlaceholderPage },
    { path: '/reports/production', component: PlaceholderPage },
    { path: '/reports/customers', component: PlaceholderPage },
    { path: '/settings', component: PlaceholderPage },
    { path: '/:pathMatch(.*)*', redirect: '/home' }
  ]
})

const app = Vue.createApp({
  data() {
    return {
      menuItems: MenuData.items,
      activeMenu: '/home',
      navItems: [],
      logo: TopNavData.logo,
      userName: TopNavData.userName,
      openedTabs: [
        { path: '/home', label: '首页', closable: false }
      ]
    }
  },
  methods: {
    handleMenuClick(path) {
      if (path && path.startsWith('/')) {
        this.$router.push(path)
      }
    },
    findMenuItemByPath(path) {
      for (const item of this.menuItems) {
        if (item.path === path) return item
        if (item.children) {
          const child = item.children.find(c => c.path === path)
          if (child) return child
        }
      }
      return null
    },
    handleTabClose(path) {
      if (path === '/home') return
      const idx = this.openedTabs.findIndex(t => t.path === path)
      if (idx === -1) return
      this.openedTabs.splice(idx, 1)
      if (this.$route.path === path) {
        const prev = this.openedTabs[Math.min(idx, this.openedTabs.length - 1)]
        this.$router.push(prev ? prev.path : '/home')
      }
    }
  },
  watch: {
    '$route.path': {
      handler(path) {
        this.activeMenu = path
        const exists = this.openedTabs.find(t => t.path === path)
        if (!exists && path !== '/') {
          const item = this.findMenuItemByPath(path)
          if (item) {
            this.openedTabs.push({ path: item.path, label: item.label, closable: path !== '/home' })
          }
        }
      },
      immediate: true
    }
  }
})

app.config.globalProperties.Icons = Icons
app.config.globalProperties.DashboardData = DashboardData

app.use(ElementPlus)
app.use(router)

app.component('app-sidebar', Sidebar)
app.component('app-topnav', TopNav)
app.component('app-tabbar', TabBar)

app.mount('#app')
