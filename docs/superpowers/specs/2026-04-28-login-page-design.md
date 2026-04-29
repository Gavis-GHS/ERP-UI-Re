# 登录页移植设计

## 概述

从 sjsrm_Master（jQuery + layui）项目将登录页移植到 vue-project（Vue 3 + Vite + Element Plus），连接后端 `http://192.168.80.83:63934`。

## 新增文件

### `src/config.js` — 全局配置

```js
export const apiBaseUrl = 'http://192.168.80.83:63934'
```

IIS 多系统部署时只需修改此文件。

### `src/api/auth.js` — 登录 API

```js
// GET /erp/User/LoginAccount?userName=xxx&passWord=xxx
// 参数: { userName, passWord }  (passWord 已 base64 编码)
// 响应: { Code: "200"|"300", Msg: string, Data: { supid, uid, supName, checkFlag } }
```

密码在调用前用 `btoa()` base64 编码，与旧项目保持一致。

### `src/store/auth.js` — 用户状态

reactive 单例，提供：

- `login(userInfo)` — 登录成功后将用户信息存入 localStorage
- `logout()` — 清除 localStorage 用户信息，跳转到 `/login`
- `isLoggedIn` — computed，判断是否已登录
- `userInfo` — 当前用户信息（supid, uid, supName, checkFlag, userName）

登出时清除 localStorage 并 router.push('/login')。

### `src/pages/LoginPage.vue` — 登录页面

Element Plus 风格：
- 全屏居中布局，浅灰背景（`#f0f4f8`，与主项目一致）
- 居中白色卡片（`el-card`），宽度约 400px
- 标题「用户登录」
- 用户名输入框（`el-input`）
- 密码输入框（`el-input type=password`）
- 登录按钮（`el-button type=primary`，全宽）
- 登录中显示 loading 状态，按钮禁用
- 错误提示使用 `ElMessage`
- 支持回车键触发登录
- 页面加载时自动聚焦用户名输入框

## 修改文件

### `src/router/index.js`

- 新增路由：`{ path: '/login', component: LoginPage }`
- 新增路由守卫 `beforeEach`：未登录用户访问非 `/login` 页面时重定向到 `/login`；已登录用户访问 `/login` 时重定向到 `/home`

### `src/App.vue`

- 通过 `isLoggedIn` 判断：未登录渲染 `<router-view />`（即 LoginPage），已登录渲染现有管理后台布局
- 顶部导航栏的用户名从 store 读取真实用户名

### `src/components/AppTopNav.vue`

- 退出登录下拉项改为调用 store 的 `logout()` 方法，不再使用 `alert`

### `src/data/topnav.js`

- `userName` 初始值改为空字符串，由 store 动态提供

## 不涉及

- 不移植注册功能（用户确认不需要）
- 不引入 token 机制（后端不修改）
- 不修改后端 API 路径和参数格式
- 不修改其余页面和组件
