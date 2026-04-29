# 登录页重设计 v2 — 左侧轮播 + 右侧登录

## 概述

在现有 blob 动态背景 + 毛玻璃基础上，将布局改为 7:3 左右分栏：左侧全高公司宣传轮播图，右侧白色底登录卡片。

## 修改文件

### `src/pages/LoginPage.vue`

脚本逻辑不变（username/password refs、handleLogin、错误处理、路由跳转保持不变），仅替换 template 和 style。

### 新增依赖

- `swiper` — Swiper 轮播库，fade 效果

## 布局

- **左侧（flex: 7）**：全高 Swiper 轮播图，8 张图片 `object-fit: cover` 填满区域
- **右侧（flex: 3）**：白色底毛玻璃卡片，居中显示登录表单

## 视觉分层

1. **浅灰背景** `#f5f5f7`（不变）
2. **Blob 动画层** — 4 个流体 blob（不变）
3. **毛玻璃遮罩** — `backdrop-filter: blur(60px) saturate(1.2)`（不变）
4. **内容区** — 左侧轮播 + 右侧卡片 同层

## 轮播区规格

| 属性 | 值 |
|------|-----|
| 库 | Swiper |
| 效果 | `fade`（淡入淡出） |
| 自动播放 | 4s 间隔 |
| 分页器 | 底部圆点，白色半透明 |
| 图片 | 8 张，`src/assets/loginCarousel/` |
| 填充方式 | `object-fit: cover`，占满 |

## 右侧卡片规格

| 属性 | 值 |
|------|-----|
| 背景 | `#ffffff` |
| 圆角 | 20px |
| 内边距 | 40px 36px |
| 宽度 | 340px |
| 阴影 | `0 8px 32px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)` |

## Logo

- `src/assets/logo.png`，宽度 120px，居中
- 位于卡片顶部，标题上方

## 表单组件（不变）

| 元素 | 规格 |
|------|------|
| 标题 "登录" | 18px, font-weight 500, 居中 |
| 标签 | 12px, `#86868b` |
| 输入框 | 圆角 10px, 内边距 12px 14px, 字号 15px |
| 按钮 | `#1d1d1f` 深色, 圆角 12px, 内边距 13px, 字号 16px, 全宽 |

## 交互（不变）

loading 禁用按钮、回车触发、输入验证、ElMessage 提示。

## 轮播图片清单

```
src/assets/loginCarousel/
  wallhaven-9d17m1_2560x1440.png
  wallhaven-d6o77l_3840x2160.png
  wallhaven-jxp7x5_2560x1440.png
  wallhaven-l8qw7y_2560x1440.png
  wallhaven-o5j7v7_1920x1080.png
  wallhaven-o5qwl7_2560x1440.png
  wallhaven-rdvxxj_2560x1440.png
  wallhaven-rr85dm_2560x1440.png
```
