<template>
  <app-sidebar
    :items="menuItems"
    :active-key="activeMenu"
    :collapsed="isSidebarCollapsed"
    @menu-click="handleMenuClick"
    @toggle-collapse="isSidebarCollapsed = !isSidebarCollapsed"
  />
  <div class="right-container">
    <AppTopNav
      :logo="logo"
      :nav-items="navItems"
      :user-name="userName"
    />
    <div class="main-content">
      <AppTabBar
        :opened-tabs="openedTabs"
        @tab-close="handleTabClose"
      />
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { MenuData } from '@/data/menu'
import { TopNavData } from '@/data/topnav'
import AppSidebar from '@/components/AppSidebar.vue'
import AppTopNav from '@/components/AppTopNav.vue'
import AppTabBar from '@/components/AppTabBar.vue'

const router = useRouter()
const route = useRoute()

const menuItems = ref(MenuData.items)
const activeMenu = ref('/home')
const navItems = ref([])
const logo = ref(TopNavData.logo)
const userName = ref(TopNavData.userName)
const isSidebarCollapsed = ref(false)
const openedTabs = ref([
  { path: '/home', label: '首页', closable: false }
])

function findMenuItemByPath(path) {
  for (const item of MenuData.items) {
    if (item.path === path) return item
    if (item.children) {
      for (const child of item.children) {
        if (child.path === path) return child
        if (child.children) {
          const gc = child.children.find(c => c.path === path)
          if (gc) return gc
        }
      }
    }
  }
  return null
}

function handleMenuClick(path) {
  if (path && path.startsWith('/')) {
    router.push(path)
  }
}

function handleTabClose(path) {
  if (path === '/home') return
  const idx = openedTabs.value.findIndex(t => t.path === path)
  if (idx === -1) return
  openedTabs.value.splice(idx, 1)
  if (route.path === path) {
    const prev = openedTabs.value[Math.min(idx, openedTabs.value.length - 1)]
    router.push(prev ? prev.path : '/home')
  }
}

watch(() => route.path, (path) => {
  activeMenu.value = path
  const exists = openedTabs.value.find(t => t.path === path)
  if (!exists && path !== '/') {
    const item = findMenuItemByPath(path)
    if (item) {
      openedTabs.value.push({ path: item.path, label: item.label, closable: path !== '/home' })
    }
  }
}, { immediate: true })
</script>

<style>
/* Global layout styles */
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background: #f0f4f8;
  color: #333;
  overflow: hidden;
  height: 100vh;
}

#app {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.right-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: #f0f4f8;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f0f4f8;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.el-card .widget-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a202c;
}

.dashboard {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
