# 登录页视觉重设计

## 概述

将 LoginPage.vue 改造为浅色毛玻璃极简风，Apple 设计语言，非对称布局，流体 blob 动态背景。

## 修改文件

### `src/pages/LoginPage.vue`

**脚本逻辑不变**（username/password refs、handleLogin、错误处理、路由跳转保持不变），仅替换 template 和 style。

## 布局

非对称两栏：
- 左侧（flex: 5.5）：品牌区，居中展示 `src/assets/logo.png`
- 右侧（flex: 4.5）：毛玻璃登录卡片，微向左侧侵入

## 视觉分层（从底到顶）

1. **浅灰背景** `#f5f5f7`
2. **Blob 动画层** — 4 个流体 blob，各以不同周期变形位移
3. **毛玻璃遮罩** — `backdrop-filter: blur(100px)`，`background: rgba(245,245,247,0.3)`
4. **品牌区 + 卡片区** 同层

## 色彩

| 元素 | 色值 |
|------|------|
| 背景 | `#f5f5f7` |
| 文字主 | `#1d1d1f` |
| 文字副 | `#86868b` |
| 卡片背景 | `rgba(255,255,255,0.6)` |
| 卡片边框 | `rgba(255,255,255,0.8)` |
| 卡片阴影 | `0 8px 32px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)` |
| 输入框底 | `rgba(0,0,0,0.04)` |
| 输入框边框 | `rgba(0,0,0,0.08)` |
| 按钮 | `#1d1d1f` 实心深色 |
| Blob-蓝 | `rgba(64,158,255,0.25)` |
| Blob-绿 | `rgba(0,153,102,0.2)` |
| Blob-紫 | `rgba(124,58,237,0.15)` |
| Blob-暖橙 | `rgba(255,149,0,0.12)` |

## 动效

4 个 blob 每个设置不同 `@keyframes`：
- 周期：12-20s 不等
- 动画内容：`border-radius` 变形（如 60% 40% ↔ 40% 60%）+ `translate` 位移
- 柔化：`filter: blur(30-40px)`
- `animation: infinite alternate ease-in-out`

## 卡片规格

| 属性 | 值 |
|------|-----|
| 圆角 | 20px |
| 内边距 | 40px 36px |
| 宽度 | 340px |
| 毛玻璃 | `backdrop-filter: blur(20px)` |

## 表单组件

| 元素 | 规格 |
|------|------|
| 标题 "登录" | 18px, font-weight 500, 居中 |
| 标签 | 12px, `#86868b` |
| 输入框 | 圆角 10px, 内边距 12px 14px, 字号 15px |
| 按钮 | 圆角 12px, 内边距 13px, 字号 16px, font-weight 500, 全宽 |
| Logo | `<img src="@/assets/logo.png">`, 宽约 160px, 保持比例 |

## 交互

不变：loading 禁用按钮、回车触发、输入验证、ElMessage 提示。

## 兼容性

- `backdrop-filter` 需要现代浏览器（Chrome 76+, Safari 9+, Edge 79+）
- 不加供应商前缀之外的 polyfill
