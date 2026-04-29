# 登录页移植实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 sjsrm_Master 项目的登录功能移植到 Vue 3 项目，实现从前端登录后端 API。

**Architecture:** 全局配置 → API 层 → 状态管理 → 登录页面 → 路由守卫 → App 条件渲染。未登录用户被拦截到 `/login`，登录成功后存 localStorage 并跳转 `/home`。

**Tech Stack:** Vue 3 + Vite + Vue Router (hash mode) + Element Plus

---

### Task 1: 创建全局配置文件

**Files:**
- Create: `src/config.js`

- [ ] **Step 1: 创建 src/config.js**

```js
export const apiBaseUrl = 'http://192.168.80.83:63934'
```

- [ ] **Step 2: 提交**

```bash
git add src/config.js
git commit -m "添加全局配置，定义后端地址"
```

---

### Task 2: 创建登录 API 模块

**Files:**
- Create: `src/api/auth.js`

- [ ] **Step 1: 创建 src/api/auth.js**

```js
import { apiBaseUrl } from '@/config'

export function loginApi(userName, passWord) {
  const params = new URLSearchParams({ userName, passWord })
  return fetch(`${apiBaseUrl}/erp/User/LoginAccount?${params}`)
    .then(res => res.json())
}
```

- [ ] **Step 2: 提交**

```bash
git add src/api/auth.js
git commit -m "添加登录 API 模块"
```

---

### Task 3: 创建用户状态管理模块

**Files:**
- Create: `src/store/auth.js`

- [ ] **Step 1: 创建 src/store/auth.js**

```js
import { reactive, computed } from 'vue'
import router from '@/router'

const STORAGE_KEY = 'user_info'

function loadUserInfo() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const state = reactive({
  userInfo: loadUserInfo()
})

export const isLoggedIn = computed(() => state.userInfo != null)

export const userInfo = computed(() => state.userInfo)

export function login(user) {
  const info = {
    userName: user.userName,
    supid: user.supid,
    uid: user.uid,
    supName: user.supName,
    checkFlag: user.checkFlag
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(info))
  state.userInfo = info
  router.push('/home')
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY)
  state.userInfo = null
  router.push('/login')
}
```

- [ ] **Step 2: 提交**

```bash
git add src/store/auth.js
git commit -m "添加用户状态管理模块"
```

---

### Task 4: 创建登录页面

**Files:**
- Create: `src/pages/LoginPage.vue`

- [ ] **Step 1: 创建 src/pages/LoginPage.vue**

```vue
<template>
  <div class="login-wrapper">
    <el-card class="login-card">
      <template #header>
        <h2 class="login-title">用户登录</h2>
      </template>
      <el-form @submit.prevent="handleLogin">
        <el-form-item>
          <el-input
            ref="usernameInputRef"
            v-model="userName"
            placeholder="用户名"
            size="large"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="passWord"
            type="password"
            placeholder="密码"
            size="large"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            :disabled="loading"
            style="width:100%"
            @click="handleLogin"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { loginApi } from '@/api/auth'
import { login } from '@/store/auth'

const userName = ref('')
const passWord = ref('')
const loading = ref(false)
const usernameInputRef = ref(null)

onMounted(() => {
  usernameInputRef.value?.focus()
})

async function handleLogin() {
  if (!userName.value) {
    ElMessage.warning('请输入用户名')
    return
  }
  if (!passWord.value) {
    ElMessage.warning('请输入密码')
    return
  }
  loading.value = true
  try {
    const encryptedPwd = window.btoa(passWord.value)
    const data = await loginApi(userName.value, encryptedPwd)
    if (data.Code === '200') {
      login({
        userName: userName.value,
        supid: data.Data.supid,
        uid: data.Data.uid,
        supName: data.Data.supName,
        checkFlag: data.Data.checkFlag
      })
    } else {
      ElMessage.error(data.Msg || '用户名或密码错误')
    }
  } catch {
    ElMessage.error('网络请求失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f0f4f8;
}

.login-card {
  width: 400px;
}

.login-title {
  margin: 0;
  text-align: center;
  font-size: 20px;
  color: #1a202c;
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add src/pages/LoginPage.vue
git commit -m "添加登录页面"
```

---

### Task 5: 更新路由配置

**Files:**
- Modify: `src/router/index.js`

- [ ] **Step 1: 修改 src/router/index.js**

在 routes 数组开头添加 `/login` 路由，并在 `createRouter` 后添加 `beforeEach` 守卫：

```js
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
  // ... 其余路由保持不变 ...
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
```

- [ ] **Step 2: 提交**

```bash
git add src/router/index.js
git commit -m "添加登录路由和路由守卫"
```

---

### Task 6: 移除 topnav 静态用户名

**Files:**
- Modify: `src/data/topnav.js`

- [ ] **Step 1: 修改 src/data/topnav.js**

将 `userName` 值改为空字符串：

```js
export const TopNavData = {
  logo: '企业管理系统',
  userName: ''
}
```

- [ ] **Step 2: 提交**

```bash
git add src/data/topnav.js
git commit -m "移除顶部导航静态用户名"
```

---

### Task 7: 对接 AppTopNav 退出登录

**Files:**
- Modify: `src/components/AppTopNav.vue`

- [ ] **Step 1: 修改 src/components/AppTopNav.vue**

在 `<script setup>` 中导入 `logout`，将 `handleDropdownCommand` 中的 `alert('退出登录')` 替换为调用 `logout()`：

```diff
- import { Icons } from '@/data/icons'
+ import { Icons } from '@/data/icons'
+ import { logout } from '@/store/auth'
```

将 `handleDropdownCommand` 中的：
```js
if (command === 'logout') {
  alert('退出登录')
```
替换为：
```js
if (command === 'logout') {
  logout()
```

- [ ] **Step 2: 提交**

```bash
git add src/components/AppTopNav.vue
git commit -m "对接退出登录功能"
```

---

### Task 8: 更新 App.vue 条件渲染

**Files:**
- Modify: `src/App.vue`

- [ ] **Step 1: 修改 src/App.vue**

在 `<script setup>` 中导入 store 并传递动态用户名给 AppTopNav，模板中根据 `isLoggedIn` 切换布局：

```vue
<template>
  <div v-if="!isLoggedIn" class="login-layout">
    <router-view />
  </div>
  <template v-else>
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
        :user-name="currentUserName"
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
</template>
```

`<script setup>` 中新增导入和计算属性：

```js
import { isLoggedIn, userInfo } from '@/store/auth'

const currentUserName = computed(() => userInfo.value?.userName || '')
```

- [ ] **Step 2: 提交**

```bash
git add src/App.vue
git commit -m "根据登录状态条件渲染布局"
```

---

### Task 9: 验证完整流程

- [ ] **Step 1: 启动开发服务器**

```bash
npm run dev
```

- [ ] **Step 2: 手动验证**

1. 浏览器打开应用，应自动跳转到 `/login`
2. 在登录页输入用户名和密码，点击登录
3. 成功后应跳转到 `/home`，顶部导航显示真实用户名
4. 刷新页面，应保持登录状态（localStorage）
5. 点击顶部导航右侧头像下拉菜单 → 退出登录
6. 退出后应跳回 `/login`
7. 在已登录状态直接访问 `/login` 应自动跳回 `/home`
