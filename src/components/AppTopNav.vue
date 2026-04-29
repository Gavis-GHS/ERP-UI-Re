<template>
  <div class="topnav">
    <div class="topnav-left">
      <span class="topnav-logo">{{ logo }}</span>
    </div>
    <div class="topnav-center">
      <div v-for="item in navItems" :key="item.key" class="topnav-item">
        <span class="star-icon" v-html="item.starred ? Icons.star : Icons.starOutline"></span>
        <span class="nav-label">{{ item.label }}</span>
      </div>
    </div>
    <div class="topnav-right">
      <div class="search-box">
        <span class="search-icon" v-html="Icons.search"></span>
        <input class="search-input" type="text" placeholder="搜索功能..." />
      </div>
      <el-dropdown @command="handleDropdownCommand">
        <span class="user-profile el-dropdown-link">
          <el-avatar :size="28" style="background:#409eff;color:#fff;font-size:12px;flex-shrink:0;">
            {{ userName.charAt(0) }}
          </el-avatar>
          <span class="user-name">{{ userName }}</span>
          <span class="user-arrow" v-html="Icons.expandMore"></span>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">个人中心</el-dropdown-item>
            <el-dropdown-item command="settings">系统设置</el-dropdown-item>
            <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Icons } from '@/data/icons'
import { logout } from '@/store/auth'

const router = useRouter()

defineProps({
  logo: { type: String, default: '企业管理系统' },
  navItems: { type: Array, required: true },
  userName: { type: String, default: '管理员' }
})

function handleDropdownCommand(command) {
  if (command === 'logout') {
    logout()
    router.push('/login')
  } else if (command === 'profile') {
    alert('个人中心')
  } else if (command === 'settings') {
    alert('系统设置')
  }
}
</script>

<style scoped>
.topnav {
  height: 56px;
  min-height: 56px;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 16px;
  color: #1d1d1f;
  border-bottom: 1px solid #e5e5e5;
}
.topnav-left {
  flex-shrink: 0;
  margin-right: 24px;
}
.topnav-logo {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 1px;
}
.topnav-center {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 4px;
  overflow-x: auto;
}
.topnav-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;
  white-space: nowrap;
  opacity: 0.9;
}
.topnav-item:hover {
  background: rgba(0,0,0,0.05);
  opacity: 1;
}
.star-icon {
  display: inline-flex;
  align-items: center;
  color: #fbbf24;
}
.nav-label { color: #1d1d1f; }
.topnav-right {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: 16px;
}
.search-box {
  display: flex;
  align-items: center;
  background: #f5f5f7;
  border-radius: 4px;
  padding: 0 10px;
  width: 200px;
  transition: background 0.2s;
}
.search-box:focus-within {
  background: #fff;
  box-shadow: 0 0 0 2px rgba(64,158,255,0.2);
}
.search-icon {
  display: flex;
  align-items: center;
  color: #999;
  margin-right: 6px;
  flex-shrink: 0;
}
.search-input {
  border: none;
  outline: none;
  background: transparent;
  height: 32px;
  font-size: 13px;
  width: 100%;
  color: #333;
}
.search-input::placeholder { color: #999; }
.user-profile {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  position: relative;
  transition: background 0.2s;
  user-select: none;
  outline: none;
}
.user-profile:hover { background: rgba(0,0,0,0.05); }
.user-avatar {
  display: flex;
  align-items: center;
}
.user-name { font-size: 13px; }
.user-arrow {
  display: flex;
  align-items: center;
  opacity: 0.7;
}
</style>
