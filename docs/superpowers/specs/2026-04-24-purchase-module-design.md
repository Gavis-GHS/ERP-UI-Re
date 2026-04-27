# 采购管理模块（请购单）设计与路由架构

## 概述

在企业管理系统 Vue 项目中新增采购管理模块，含请购单完整页面。同时引入 vue-router 进行路由架构升级，将页面切换从自定义页签系统改为路由驱动。

## 路由架构

### 技术方案

- **vue-router 4** (CDN) — `https://unpkg.com/vue-router@4`
- Hash 模式路由 (`createWebHashHistory`)，无需服务端配置
- 页面切换由 `router.push()` 驱动，页签栏与路由同步

### 路由表

| 路径 | 组件 | 说明 |
|------|------|------|
| `/` | 重定向 → `/home` | 根路径 |
| `/home` | `HomePage` | 首页看板（图表） |
| `/sales/order` | `PlaceholderPage` | 销售订单 |
| `/sales/contract` | `PlaceholderPage` | 销售合同 |
| `/sales/return` | `PlaceholderPage` | 销售退货 |
| `/purchase/requisition` | `PurchaseRequisition` | 请购单 |
| `/production/stats` | `PlaceholderPage` | 产值统计 |
| `/production/report` | `PlaceholderPage` | 产值报表 |
| `/customers` | `PlaceholderPage` | 客户管理 |
| `/reports/sales` | `PlaceholderPage` | 销售报表 |
| `/reports/production` | `PlaceholderPage` | 产值报表 |
| `/reports/customers` | `PlaceholderPage` | 客户报表 |
| `/settings` | `PlaceholderPage` | 系统设置 |
| `*` | 重定向 → `/home` | 404 处理 |

### 路由与菜单映射

菜单 item 的 `key` 对应路由 `path`：

```javascript
items: [
  { key: 'home', path: '/home', label: '首页', icon: 'home' },
  { key: 'sales', label: '销售管理', icon: 'sales', children: [
    { key: 'sales-order', path: '/sales/order', label: '销售订单', icon: 'file' },
    { key: 'sales-contract', path: '/sales/contract', label: '销售合同', icon: 'file' },
    { key: 'sales-return', path: '/sales/return', label: '销售退货', icon: 'file' }
  ]},
  { key: 'purchase', label: '采购管理', icon: 'purchase', children: [
    { key: 'purchase-requisition', path: '/purchase/requisition', label: '请购单', icon: 'file' }
  ]},
  // ...
]
```

### 页面加载机制

侧栏 `el-menu-item` 的 `:index` 绑定为 `item.path`（而非原来的 `item.key`），`@select` 直接发射 path：

```
sidebar click → @select(path)
    → $emit('menu-click', path)
    → app.js: handleMenuClick(path)
    → router.push(path)
    → vue-router 激活对应组件
    → 页签栏 watch $route.path:
        → 查 openTabs 中是否已有该路由
        → 没有则添加
        → 激活该 tab（el-tabs v-model = $route.path）
```

对于 `el-sub-menu`（有子菜单的父节点），其 `:index` 使用 `item.key`（无对应路由，仅用于菜单展开）。

### 页签栏机制

页签栏从 `dashboard.js` 中分离为独立组件 `TabBar`，只负责导航功能：

- `openedTabs`: 数组，记录已访问的页面路由（title + path + closable）
- `v-model` 绑定 `$route.path`，切换激活态
- `@tab-click`: `router.push(tab.path)`
- `@tab-remove`: 移除 tab + 导航到前一个
- 首页 `/home` 不可关闭，始终存在
- 侧栏点击某个菜单项 → 如果 tabs 中没有则添加

### 数据流

```
app.js
  ├─ router (vue-router)
  │    └─ <router-view> 渲染当前路由组件
  ├─ app-sidebar (菜单变更 → router.push)
  ├─ app-topnav (不变)
  └─ app-tabbar (watch $route → 管理 openedTabs)
```

## 文件变更清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `index.html` | 修改 | vue-router CDN + script 引用 |
| `app.js` | 重构 | 引入 router, 注册全局组件, mount |
| `js/router.js` | **新增** | 路由定义 |
| `js/data.js` | 修改 | 菜单添加采购管理子项, 增加 path 字段 |
| `js/data/purchase.js` | **新增** | 请购单模拟数据 |
| `js/components/sidebar.js` | 修改 | menu-click 改为 emit path 字符串 |
| `js/components/topnav.js` | 不变 | — |
| `js/components/dashboard.js` | 重构 | 提取首页图表，改为 `HomePage` |
| `js/pages/home.js` | **新增** | 首页组件（从 dashboard.js 提取） |
| `js/pages/purchase-requisition.js` | **新增** | 请购单完整页面 |
| `js/pages/placeholder.js` | **新增** | 占位页组件 |

## 请购单页面设计

### 布局结构

```
┌─ 工具栏 ──────────────────────────────────────────────────┐
│ [新增] [合并请购单] [作废] [送审] [撤销] [刷新状态] [重算] ...  │
├─ 筛选区 ──────────────────────────────────────────────────┤
│ Row 1: 申请日期 | 作废状态 | 行状态  | 审核状态            │
│ Row 2: 物料代码 | 规格型号 | 申请单号 | 申请人              │
│ Row 3: 订单类型 | 业务类型 | 采购类型 | 物料分类  [搜索][重置]│
├─ 数据表格 (横向滚动) ──────────────────────────────────────┤
│ 序号 | 选择 | 状态 | 业务类型 | 采购类型 | 物料代码 |       │
│ 物料名称 | 规格型号 | 单位 | 产品编码 | 货号 |            │
│ 申请数量 | 已下单量(审核中) | 已下单量 | 未下单量 |        │
│ 单价 | 申请日期 | 要求日期 | 申请人 | 用途 | 申请单号     │
├─ 分页 ────────────────────────────────────────────────────┤
│ 共50条   1 2 3 ... 下一页    每页50条                     │
└──────────────────────────────────────────────────────────┘
```

### 组件实现: `PurchaseRequisition`

**状态管理 (data)**:
- `tableData`: 表格数据（来自模拟数据）
- `total`: 总条数
- `pageSize`: 每页条数 (默认 50)
- `currentPage`: 当前页码 (默认 1)
- `filters`: 筛选条件对象（日期、状态下拉、文本输入等）
- `selectedRows`: 选中的行
- `dialogVisible`: 新增弹窗开关
- `formData`: 新增表单数据

**模板结构**:

```
template:
  el-card
    Toolbar (el-button)
  el-card
    FilterArea (el-form + inline)
  el-card
    el-table (border, max-height, @selection-change)
      el-table-column (序号/选择/状态/业务类型/...)
    el-pagination
  el-dialog (新增请购单表单)
```

**筛选条件默认值**:

| 字段 | 组件 | 默认值 |
|------|------|--------|
| 申请日期 | el-date-picker | 2025-04-24 |
| 作废状态 | el-select | 正常 |
| 行状态 | el-select | 开启 |
| 审核状态 | el-select | 全部 |
| 物料代码 | el-input | — |
| 规格型号 | el-input | — |
| 申请单号 | el-input | — |
| 申请人 | el-input | — |
| 订单类型 | el-select | 全部 |
| 业务类型 | el-select | 全部 |
| 采购类型 | el-select | 全部 |
| 物料分类 | el-select | 全部 |

**表格列定义**:

| 列名 | 宽度 | 对齐 | 说明 |
|------|------|------|------|
| 序号 | 60 | 居中 | 自动递增 |
| 选择 | 50 | 居中 | type="selection" |
| 状态 | 90 | 居中 | el-tag (颜色区分) |
| 业务类型 | 100 | 左 | — |
| 采购类型 | 120 | 左 | — |
| 物料代码 | 130 | 左 | — |
| 物料名称 | 150 | 左 | — |
| 规格型号 | 130 | 左 | — |
| 单位 | 70 | 居中 | — |
| 产品编码 | 110 | 左 | — |
| 货号 | 110 | 左 | — |
| 申请数量 | 100 | 右 | 数字格式 |
| 已下单量(审核中) | 130 | 右 | 数字格式 |
| 已下单量 | 100 | 右 | 数字格式 |
| 未下单量 | 100 | 右 | 数字格式 |
| 单价 | 90 | 右 | 数字格式 |
| 申请日期 | 120 | 居中 | 日期格式 |
| 要求日期 | 120 | 居中 | 日期格式 |
| 申请人 | 90 | 左 | — |
| 用途 | 200 | 左 | 展示前20字，tooltip全文 |
| 申请单号 | 150 | 左 | — |

**工具栏按钮**:

| 按钮 | 操作 |
|------|------|
| 新增 (success) | 打开 el-dialog |
| 合并请购单 | alert (演示) |
| 作废 | alert (演示) |
| 送审 | alert (演示) |
| 撤销 | alert (演示) |
| 刷新状态 | alert (演示) |
| 重算 | alert (演示) |
| 导入请购单 | alert (演示) |
| 审核 | alert (演示) |
| 反审核 | alert (演示) |
| 反作废 | alert (演示) |
| 导出Excel | alert (演示) |
| 导出报表单 | alert (演示) |
| 下载 (success) | alert (演示) |
| 模板下载 (success) | alert (演示) |

### 模拟数据 (`purchase.js`)

50 条请购单模拟数据，包含完整字段：
- id, 状态, 业务类型, 采购类型, 物料代码, 物料名称, 规格型号
- 单位, 产品编码, 货号, 申请数量, 已下单量审核中, 已下单量, 未下单量
- 单价, 申请日期, 要求日期, 申请人, 用途, 申请单号

数据来源：参考请购单.png 中的示例数据。

## 颜色规范

| 用途 | 色值 |
|------|------|
| 采购模块图标 | 用 'shopping-cart' SVG 区分 |
| 状态·已审核 | el-tag type="success" |
| 状态·开启 | el-tag type="primary" |
| 状态·已作废 | el-tag type="info" |
| 工具栏主按钮 | el-button type="success" |
| 工具栏次要按钮 | el-button plain |

## 交互细节

- 筛选搜索：点击"搜索"按钮根据条件过滤表格
- 重置：清空所有筛选条件，恢复默认值
- 表格排序：el-table 默认支持列排序
- 新增弹窗：el-dialog 为中心弹窗，带表单验证
- 分页：切换页码/每页条数时更新表格
