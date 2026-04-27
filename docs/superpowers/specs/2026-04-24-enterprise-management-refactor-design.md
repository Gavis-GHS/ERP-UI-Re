# 企业管理系统首页重构设计

## 概述

基于旧系统首页设计图，重构现有 Vue 企业管理系统。采用混合模式：提取旧系统的布局结构元素（树形菜单、Element Plus 设计参考），保留当前项目的业务数据（销售、产值、客户）。

## 技术方案

- **Vue 3** (CDN) + **Element Plus** (CDN) — 保持免构建方式
- **Chart.js** (CDN) — 图表库
- 保留现有 `js/components/` 组件结构，升级引用 Element Plus 组件
- Element Plus CDN: 引入 CSS + JS 完整版（含所有组件和图标）

## 布局架构

```
┌─────────────────────────────────────────────────┐
│  左侧菜单栏(240px) │  顶部导航栏 (50px)         │
│  el-menu 树形结构  ├────────────────────────────┤
│  背景: #1e3a8a    │  页签栏 (el-tabs 40px)      │
│  文字: #fff       ├────────────────────────────┤
│  激活: #409eff    │  内容区域 (flex:1, 滚动)    │
│                   │    el-card 网格布局 (2列)    │
│                   │    └─ 首页图表看板          │
└─────────────────────────────────────────────────┘
```

## 模块设计

### 1. 侧栏菜单 (app-sidebar)

- **组件**: 使用 `el-menu` 替换自定义侧栏
- **属性**:
  - `default-active`: 当前选中菜单 key
  - `background-color`: `#1e3a8a`
  - `text-color`: `#ffffff`
  - `active-text-color`: `#409eff`
- **菜单结构**（树形）:

```
首页                          → el-menu-item
销售管理 ─┬─ 销售订单          → el-sub-menu
          ├─ 销售合同
          └─ 销售退货
产值管理 ─┬─ 产值统计          → el-sub-menu
          └─ 产值报表
客户管理                       → el-menu-item
报表统计 ─┬─ 销售报表          → el-sub-menu
          ├─ 产值报表
          └─ 客户报表
系统设置                       → el-menu-item
```

- **图标**: 使用 Element Plus 内置图标（HomeFilled, TrendCharts, DataBoard, UserFilled, DataAnalysis, Setting）
- **交互**: 点击菜单项 → 发射 menu-click 事件 → 添加/切换页签
- **选中态**: 侧栏选中与页签选中同步

### 2. 顶部导航栏 (app-topnav)

- **组件**: 保留自定义组件，样式适配 Element Plus 风格
- **背景色**: `#409eff`（Element Plus 主色）
- **布局**:
  - 左侧：系统名称（16px, 加粗, 白色）
  - 中间：快捷导航项，带星标收藏（黄色 ☆/★ 切换）
  - 右侧：搜索框 + 用户头像下拉（el-dropdown）
- **搜索框**: 参考 el-input 样式，带搜索图标，placeholder "搜索功能..."

### 3. 页签栏

- **组件**: 使用 `el-tabs` 替换自定义页签栏
- **属性**: `type="card"`, `closable`, `@tab-remove`
- **行为**:
  - 首页页签不可关闭
  - 点击菜单或快捷导航，自动添加新页签（如已存在则切换）
  - 关闭页签后自动切换到相邻页签
  - 页签切换同步更新侧栏选中态

### 4. 首页图表看板

- **容器**: `el-card` 组件，2 列网格布局（`display: grid; grid-template-columns: 1fr 1fr; gap: 16px`）
- **图表卡片**:
  1. **年销售情况（折线图）** — 占满2列，显示12月销售额趋势
  2. **月度产值（柱状图）** — 左侧，显示12月产值
  3. **新增客户情况统计（KPI卡片）** — 右侧，显示累计客户数、本月新增、环比增长、成交总额
  4. **销售额排名（横向柱状图）** — 占满2列，按区域排名
- **图表库**: Chart.js，在组件 mounted 时初始化，beforeUnmount 时销毁
- **数据**: 沿用现有 `DashboardData` 数据源

### 5. 其他功能页

- 非首页页签统一显示占位页面
- 图标 + "功能开发中" 提示

## 数据流

```
app.js (根实例)
  │
  ├─ menuItems ──────────→ app-sidebar
  │                          │ menu-click
  │                          ▼
  ├─ activeMenu ←──── app.js (handleMenuClick)
  │                   更新 tabs, activeTab, activeMenu
  │
  ├─ tabs ──────────────→ app-dashboard
  │   activeTab              │ tab-click / tab-close
  │                          ▼
  │                     app.js (handleTabClick/TabClose)
  │
  ├─ navItems ──────────→ app-topnav
  ├─ chartData ──────────→ app-dashboard (首页图表)
  └─ userName ──────────→ app-topnav
```

## 文件变更清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `index.html` | 修改 | 添加 Element Plus CDN、重置样式 |
| `app.js` | 修改 | 更新组件注册、数据流 |
| `js/data.js` | 修改 | 更新菜单结构（树形）、添加子菜单数据 |
| `js/components/sidebar.js` | 重写 | 使用 el-menu + el-sub-menu |
| `js/components/topnav.js` | 修改 | 适配 Element Plus 风格 |
| `js/components/dashboard.js` | 重写 | 使用 el-tabs + el-card |

## 颜色规范

| 用途 | 色值 |
|------|------|
| 侧栏背景 | `#1e3a8a` |
| 侧栏文字 | `#ffffff` |
| 侧栏激活文字 | `#409eff` (Element Plus 主色) |
| 顶栏背景 | `#409eff` |
| 顶栏文字 | `#ffffff` |
| 卡片背景 | `#ffffff` |
| 页面背景 | `#f0f4f8` |
| 星标收藏 | `#fbbf24` (黄色) |
| 折线图线条 | `#409eff` |
| 柱状图颜色 | `rgba(64,158,255,0.65)` |

## 交互细节

- **菜单展开**: el-menu 原生折叠动画
- **标签切换**: 菜单点击与页签点击双向同步
- **卡片 hover**: el-card 原生 shadow 变化
- **图表 resize**: 响应式适配，Chart.js maintainAspectRatio: false
- **用户下拉**: el-dropdown 组件
