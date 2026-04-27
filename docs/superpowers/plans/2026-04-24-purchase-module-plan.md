# 采购管理模块（请购单）实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增采购管理模块（请购单页），同时将页面切换从自定义页签系统升级为 vue-router 路由驱动。

**Architecture:** 引入 vue-router 4 CDN，所有功能页变为路由组件，侧栏 `el-menu-item` 的 `:index` 绑定为路由 path，`@select` 直接发射 path 驱动 router.push。页签栏独立为 TabBar 组件，与 `$route.path` 同步。请购单页面作为一个完整路由组件实现。

**Tech Stack:** Vue 3 (CDN) + Element Plus (CDN UMD) + Chart.js + vue-router 4 (CDN)

---

## 文件结构

| 文件 | 操作 | 职责 |
|------|------|------|
| `index.html` | 修改 | 添加 vue-router CDN + 新脚本引用 |
| `js/router.js` | **新增** | Vue Router 实例创建 + 路由表定义 |
| `js/data.js` | 修改 | 菜单添加采购管理（含请购单子项），所有菜单项增加 path 字段 |
| `js/data/purchase.js` | **新增** | 请购单模拟数据（50条） |
| `js/components/sidebar.js` | 修改 | `el-menu-item` 的 `:index` 改为 `item.path`，emit path |
| `js/components/dashboard.js` | 删除 | 整个文件替换为 tabbar.js + home.js |
| `js/components/tabbar.js` | **新增** | 页签栏组件（从 dashboard.js 提取 tab 功能） |
| `js/pages/home.js` | **新增** | 首页组件（从 dashboard.js 提取图表内容） |
| `js/pages/purchase-requisition.js` | **新增** | 请购单完整页面 |
| `js/pages/placeholder.js` | **新增** | 其他功能页占位组件 |
| `app.js` | 修改 | 引入 router，使用 `app.use(router)`，注册新组件 |

---

### Task 1: 更新菜单数据 — js/data.js

**Files:**
- Modify: `js/data.js`

为所有菜单项添加 `path` 字段，新增采购管理模块（带请购单子项），新增采购图标 SVG。

- [ ] **Step 1: 为每个菜单项添加 path 字段**

修改 `MenuData.items`，为每个 `el-menu-item` 添加 `path` 属性（`el-sub-menu` 父节点不需要 path）：

```javascript
const MenuData = {
  items: [
    { key: 'home', label: '首页', icon: 'home', path: '/home' },
    {
      key: 'sales', label: '销售管理', icon: 'sales',
      children: [
        { key: 'sales-order', label: '销售订单', icon: 'file', path: '/sales/order' },
        { key: 'sales-contract', label: '销售合同', icon: 'file', path: '/sales/contract' },
        { key: 'sales-return', label: '销售退货', icon: 'file', path: '/sales/return' }
      ]
    },
    {
      key: 'purchase', label: '采购管理', icon: 'purchase',
      children: [
        { key: 'purchase-requisition', label: '请购单', icon: 'file', path: '/purchase/requisition' }
      ]
    },
    {
      key: 'production', label: '产值管理', icon: 'production',
      children: [
        { key: 'production-stats', label: '产值统计', icon: 'file', path: '/production/stats' },
        { key: 'production-report', label: '产值报表', icon: 'file', path: '/production/report' }
      ]
    },
    { key: 'customers', label: '客户管理', icon: 'customers', path: '/customers' },
    {
      key: 'reports', label: '报表统计', icon: 'reports',
      children: [
        { key: 'report-sales', label: '销售报表', icon: 'file', path: '/reports/sales' },
        { key: 'report-production', label: '产值报表', icon: 'file', path: '/reports/production' },
        { key: 'report-customers', label: '客户报表', icon: 'file', path: '/reports/customers' }
      ]
    },
    { key: 'settings', label: '系统设置', icon: 'settings', path: '/settings' }
  ]
}
```

- [ ] **Step 2: 在 Icons 中添加 purchase 图标**

```javascript
purchase: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>'
```

- [ ] **Step 3: 移除不再需要的 TopNavData.navItems 和 defaultNavItems（因为顶栏导航改为从路由取数据）**

不再需要单独的 `defaultNavItems`——现在所有菜单项都有 `path`，顶栏导航可以直接复用 `MenuData.items` 或删除 TopNavData 简化。

简化 TopNavData:
```javascript
const TopNavData = {
  logo: '企业管理系统',
  userName: '管理员'
}
```

删除 `defaultNavItems`（不再引用）。

---

### Task 2: 创建模拟数据文件 — js/data/purchase.js

**Files:**
- Create: `js/data/purchase.js`

50 条请购单模拟数据，覆盖所有表格字段。

- [ ] **Step 1: 创建 purchase.js**

```javascript
const PurchaseData = {
  total: 50,
  list: [
    {
      id: 1, status: '已审核', bizType: '备品备件', purchaseType: '按安全库存采购',
      materialCode: '04.01.09.0198', materialName: '中黄地坪漆（桶）', spec: '油通用',
      unit: 'PCS', productCode: '', artNo: '', qty: 6.00,
      orderedAuditing: 0, ordered: 0, unOrdered: 6.00,
      price: 6.00, applyDate: '2026-04-24', requiredDate: '2026-04-30',
      applicant: '薛宇智', purpose: '生活区停车位划线用（预计使用时间：到货使用）F SQ202604240004',
      orderNo: 'SQ202604240004'
    },
    {
      id: 2, status: '开启', bizType: '维护保养', purchaseType: '维护保养',
      materialCode: '03.02.05.0102', materialName: '分切圆刀片', spec: '100*40*2（合金）',
      unit: 'M', productCode: '', artNo: '', qty: 2.00,
      orderedAuditing: 0, ordered: 0, unOrdered: 2.00,
      price: 10.00, applyDate: '2026-04-24', requiredDate: '2026-04-30',
      applicant: '张士珠', purpose: '设备维护保养用',
      orderNo: 'SQ202604240005'
    },
    {
      id: 3, status: '已审核', bizType: '设备改造', purchaseType: '设备改造',
      materialCode: '05.01.03.0021', materialName: 'PLC控制器', spec: 'S7-1200',
      unit: 'PCS', productCode: 'PLC-1200', artNo: '6ES7214', qty: 1.00,
      orderedAuditing: 0, ordered: 0, unOrdered: 1.00,
      price: 3500.00, applyDate: '2026-04-23', requiredDate: '2026-05-15',
      applicant: '李明', purpose: '生产线自动化改造项目',
      orderNo: 'SQ202604230003'
    },
    {
      id: 4, status: '开启', bizType: '加工件', purchaseType: '按订单采购',
      materialCode: '06.02.01.0005', materialName: '不锈钢法兰盘', spec: 'DN100 PN16',
      unit: 'PCS', productCode: 'FL-100', artNo: '', qty: 20.00,
      orderedAuditing: 0, ordered: 0, unOrdered: 20.00,
      price: 85.00, applyDate: '2026-04-23', requiredDate: '2026-05-10',
      applicant: '王工', purpose: '管道安装工程用',
      orderNo: 'SQ202604230004'
    },
    {
      id: 5, status: '已作废', bizType: '原材料', purchaseType: '按安全库存采购',
      materialCode: '01.01.01.0001', materialName: 'Q235钢板', spec: '10mm*1500*3000',
      unit: 'PCS', productCode: '', artNo: '', qty: 50.00,
      orderedAuditing: 0, ordered: 30, unOrdered: 20.00,
      price: 450.00, applyDate: '2026-04-22', requiredDate: '2026-05-05',
      applicant: '赵工', purpose: '结构件生产用',
      orderNo: 'SQ202604220002'
    }
    // ... 其余45条，可以用程序生成或手动编写变体
  ],
  generateMore() {
    // 基于已有数据生成剩余记录
    for (let i = 6; i <= 50; i++) {
      const statuses = ['已审核', '开启', '已审核', '开启', '已审核'];
      const bizTypes = ['备品备件', '维护保养', '设备改造', '加工件', '原材料'];
      const purchaseTypes = ['按安全库存采购', '维护保养', '设备改造', '按订单采购', '按安全库存采购'];
      const units = ['PCS', 'M', 'PCS', 'PCS', 'PCS'];
      const applicants = ['薛宇智', '张士珠', '李明', '王工', '赵工'];
      const idx = i % 5;
      const base = this.list[idx % this.list.length];
      this.list.push({
        id: i,
        status: statuses[idx],
        bizType: bizTypes[idx],
        purchaseType: purchaseTypes[idx],
        materialCode: base.materialCode.replace(/\d+$/, m => String(Number(m) + i)),
        materialName: base.materialName,
        spec: base.spec,
        unit: units[idx],
        productCode: '',
        artNo: '',
        qty: Math.round((Math.random() * 100 + 1) * 100) / 100,
        orderedAuditing: 0,
        ordered: 0,
        unOrdered: 0,
        price: Math.round((Math.random() * 500 + 5) * 100) / 100,
        applyDate: '2026-04-' + String(20 + (i % 10)).padStart(2, '0'),
        requiredDate: '2026-05-' + String(1 + (i % 15)).padStart(2, '0'),
        applicant: applicants[idx],
        purpose: '请购用途描述 #' + i,
        orderNo: 'SQ' + new Date().getFullYear() + '0' + String(400 + i).slice(-4)
      });
    }
    return this.list;
  }
}

// 生成完整50条数据
PurchaseData.generateMore()
```

- [ ] **Step 2: 验证数据完整性**

用 node 快速验证：
```bash
node -e "
const fs = require('fs');
const code = fs.readFileSync('/Users/gavis/vue-project/js/data/purchase.js','utf-8');
console.log('File loaded, length:', code.length);
console.log('Has PurchaseData:', code.includes('PurchaseData'));
"
```

---

### Task 3: 创建路由器 — js/router.js

**Files:**
- Create: `js/router.js`

定义 vue-router 路由表，创建 router 实例。

- [ ] **Step 1: 创建 router.js**

```javascript
const { createRouter, createWebHashHistory } = VueRouter

const routes = [
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

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
```

注意：`HomePage`、`PurchaseRequisition`、`PlaceholderPage` 是在各自文件中定义的全局变量，router.js 在它们之后被加载（见 index.html 脚本顺序），所以可以直接引用。

---

### Task 4: 更新 HTML 模板 — index.html

**Files:**
- Modify: `index.html`

添加 vue-router CDN，更新 body 模板，调整脚本顺序。

- [ ] **Step 1: 在 head 中添加 vue-router CDN**

在 Vue CDN 之后、Chart.js 之前添加：
```html
<script src="https://unpkg.com/vue@3.3.4/dist/vue.global.js"></script>
<script src="https://unpkg.com/vue-router@4"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
```

- [ ] **Step 2: 更新 body 中的组件绑定**

将原有的 `app-dashboard` 替换为 `app-tabbar` + `router-view`：

```html
<div id="app">
  <app-sidebar
    :items="menuItems"
    :active-key="activeMenu"
    @menu-click="handleMenuClick"
  ></app-sidebar>

  <div class="right-container">
    <app-topnav
      :logo="logo"
      :nav-items="navItems"
      :user-name="userName"
    ></app-topnav>

    <div class="main-content">
      <app-tabbar
        :opened-tabs="openedTabs"
        @tab-close="handleTabClose"
      ></app-tabbar>
      <router-view />
    </div>
  </div>
</div>
```

- [ ] **Step 3: 更新脚本引用顺序**

```html
<script src="https://unpkg.com/element-plus"></script>
<script src="js/data.js"></script>
<script src="js/data/purchase.js"></script>
<script src="js/router.js"></script>
<script src="js/components/sidebar.js"></script>
<script src="js/components/topnav.js"></script>
<script src="js/components/tabbar.js"></script>
<script src="js/pages/home.js"></script>
<script src="js/pages/placeholder.js"></script>
<script src="js/pages/purchase-requisition.js"></script>
<script src="app.js"></script>
```

顺序说明：
1. element-plus（Element Plus 插件）
2. data.js（全局数据）
3. data/purchase.js（请购单数据）
4. router.js（路由定义，依赖 HomePage/PlaceholderPage/PurchaseRequisition 作为全局变量——但这些变量在后面定义）

等等——router.js 引用了 `HomePage`、`PlaceholderPage`、`PurchaseRequisition`，但这些组件是在 router.js 之后才加载的。这是有问题的。

**修正方案：router.js 只定义路由配置对象，在 app.js 中创建 router 实例。**

或者：将 route 配置与 router 创建分离——router.js 导出配置对象，app.js 创建实例。

由于这是 CDN 非模块化项目，最简单的方式是：**在 app.js 中创建 router**，而不是在 router.js 中。

修正后的 router.js（仅配置）：
```javascript
const routeConfig = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: 'HomePage' },
  { path: '/sales/order', component: 'PlaceholderPage' },
  // ...
]
```

然后在 app.js 中：
```javascript
const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes: routeConfig.map(r => {
    // 将 component 名字符串解析为实际组件引用
    if (typeof r.component === 'string') {
      r.component = window[r.component]
    }
    return r
  })
})
```

实际上这有点复杂。最简单的方案：**把路由定义直接放在 app.js 中**，所有组件变量在创建 router 时已就绪。

```javascript
// app.js
const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/home', component: HomePage },
    { path: '/sales/order', component: PlaceholderPage },
    // ...
  ]
})
```

这样 router.js 就不需要了。**简化方案：删掉 router.js，路由定义直接放 app.js**。

- [ ] **Step 4: 更新脚本引用（移除 router.js，改为直接在 app.js 中定义路由）**

```html
<script src="https://unpkg.com/element-plus"></script>
<script src="js/data.js"></script>
<script src="js/data/purchase.js"></script>
<script src="js/components/sidebar.js"></script>
<script src="js/components/topnav.js"></script>
<script src="js/components/tabbar.js"></script>
<script src="js/pages/home.js"></script>
<script src="js/pages/placeholder.js"></script>
<script src="js/pages/purchase-requisition.js"></script>
<script src="app.js"></script>
```

---

### Task 5: 重写侧栏组件 — js/components/sidebar.js

**Files:**
- Modify: `js/components/sidebar.js`

将 `el-menu-item` 的 `:index` 从 `item.key` 改为 `item.path`，`@select` 发射 path 而非 key。

- [ ] **Step 1: 重写 Sidebar 组件**

```javascript
const Sidebar = {
  name: 'Sidebar',
  props: {
    items: { type: Array, required: true },
    activeKey: { type: String, default: '/home' }
  },
  emits: ['menu-click'],
  template: `
    <div class="sidebar">
      <el-menu
        :default-active="activeKey"
        background-color="#1e3a8a"
        text-color="#ffffff"
        active-text-color="#409eff"
        @select="(index) => $emit('menu-click', index)"
      >
        <template v-for="item in items" :key="item.key">
          <el-menu-item v-if="!item.children" :index="item.path || item.key">
            <span v-html="Icons[item.icon] || ''" style="margin-right:8px;display:inline-flex;align-items:center;"></span>
            <span>{{ item.label }}</span>
          </el-menu-item>
          <el-sub-menu v-else :index="item.key">
            <template #title>
              <span v-html="Icons[item.icon] || ''" style="margin-right:8px;display:inline-flex;align-items:center;"></span>
              <span>{{ item.label }}</span>
            </template>
            <el-menu-item v-for="child in item.children" :key="child.key" :index="child.path">
              <span>{{ child.label }}</span>
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
    </div>
  `
}
```

关键变化：
- `el-menu-item` 的 `:index="item.path || item.key"`（优先使用 path，兼容无 path 的场景）
- `el-sub-menu` 的 `:index="item.key"`（sub-menu 没有 path 属性，用 key）
- 子 `el-menu-item` 的 `:index="child.path"`（使用路径）
- `activeKey` 默认值从 `'home'` 改为 `'/home'`

---

### Task 6: 创建页签栏组件 — js/components/tabbar.js

**Files:**
- Create: `js/components/tabbar.js`

从原来的 dashboard.js 提取页签栏功能为独立组件，与 `$route` 同步。

- [ ] **Step 1: 创建 TabBar 组件**

```javascript
const TabBar = {
  name: 'TabBar',
  props: {
    openedTabs: { type: Array, required: true }
  },
  emits: ['tab-close'],
  computed: {
    currentPath() {
      return this.$route.path
    }
  },
  methods: {
    handleTabClick(tab) {
      this.$router.push(tab.props.name)
    }
  },
  template: `
    <div class="tabbar-wrapper">
      <el-tabs
        :model-value="currentPath"
        type="card"
        closable
        @tab-click="handleTabClick"
        @tab-remove="(name) => $emit('tab-close', name)"
      >
        <el-tab-pane
          v-for="tab in openedTabs"
          :key="tab.path"
          :name="tab.path"
          :label="tab.label"
          :closable="tab.closable"
        />
      </el-tabs>
    </div>
  `
}
```

- [ ] **Step 2: 添加 tabbar-wrapper CSS**

在 index.html 中添加：
```css
.tabbar-wrapper {
  flex-shrink: 0;
  background: #fff;
}

.tabbar-wrapper .el-tabs {
  padding: 0 8px;
}

.tabbar-wrapper .el-tabs__header {
  margin: 0;
}

.tabbar-wrapper .el-tabs__nav-wrap::after {
  height: 0;
}

.tabbar-wrapper .el-tabs__item {
  height: 36px;
  line-height: 36px;
}
```

---

### Task 7: 创建首页组件 — js/pages/home.js

**Files:**
- Create: `js/pages/home.js`

从原来的 dashboard.js 中提取首页图表内容为独立组件。

- [ ] **Step 1: 创建 HomePage 组件**

```javascript
const HomePage = {
  name: 'HomePage',
  data() {
    return { chartInstances: [] }
  },
  mounted() {
    this.$nextTick(() => this.initCharts())
  },
  beforeUnmount() {
    this.chartInstances.forEach(c => c.destroy())
    this.chartInstances = []
  },
  methods: {
    initCharts() {
      if (typeof Chart === 'undefined') return
      this.chartInstances.forEach(c => c.destroy())
      this.chartInstances = []
      const d = DashboardData

      // Line chart - 年销售情况
      const lineCtx = document.getElementById('salesLineChart')
      if (lineCtx) {
        this.chartInstances.push(new Chart(lineCtx, {
          type: 'line',
          data: {
            labels: d.lineChart.labels,
            datasets: [{
              label: '销售额（万元）',
              data: d.lineChart.sales,
              borderColor: '#409eff',
              backgroundColor: 'rgba(64,158,255,0.08)',
              fill: true, tension: 0.3,
              pointBackgroundColor: '#409eff',
              pointBorderColor: '#fff',
              pointBorderWidth: 2, pointRadius: 3
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' } },
              x: { grid: { display: false } }
            }
          }
        }))
      }

      // Bar chart - 月度产值
      const barCtx = document.getElementById('productionBarChart')
      if (barCtx) {
        this.chartInstances.push(new Chart(barCtx, {
          type: 'bar',
          data: {
            labels: d.barChart.labels,
            datasets: [{
              label: '产值（万元）',
              data: d.barChart.values,
              backgroundColor: 'rgba(64,158,255,0.65)',
              borderColor: '#409eff',
              borderWidth: 1, borderRadius: 2
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' } },
              x: { grid: { display: false } }
            }
          }
        }))
      }

      // Ranking chart
      const rankCtx = document.getElementById('salesRankChart')
      if (rankCtx) {
        const r = d.salesRanking
        this.chartInstances.push(new Chart(rankCtx, {
          type: 'bar',
          data: {
            labels: r.regions,
            datasets: [{
              label: '销售额（万元）',
              data: r.values,
              backgroundColor: [
                'rgba(64,158,255,0.85)', 'rgba(64,158,255,0.7)',
                'rgba(64,158,255,0.55)', 'rgba(64,158,255,0.4)',
                'rgba(64,158,255,0.25)', 'rgba(64,158,255,0.1)'
              ],
              borderRadius: 2
            }]
          },
          options: {
            indexAxis: 'y',
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' } },
              y: { grid: { display: false } }
            }
          }
        }))
      }
    }
  },
  template: `
    <div class="content-area">
      <div class="widget-grid">
        <el-card class="widget-full">
          <template #header>
            <span class="widget-title">年销售情况</span>
            <span class="widget-badge" style="margin-left:8px;font-size:12px;color:#999;">折线图</span>
          </template>
          <div class="chart-body">
            <canvas id="salesLineChart"></canvas>
          </div>
        </el-card>

        <el-card>
          <template #header>
            <span class="widget-title">月度产值</span>
            <span class="widget-badge" style="margin-left:8px;font-size:12px;color:#999;">柱状图</span>
          </template>
          <div class="chart-body">
            <canvas id="productionBarChart"></canvas>
          </div>
        </el-card>

        <el-card>
          <template #header><span class="widget-title">新增客户情况统计</span></template>
          <div class="kpi-grid">
            <div class="kpi-item">
              <div class="kpi-num">{{ DashboardData.customerStats.total }}</div>
              <div class="kpi-label">累计客户数</div>
            </div>
            <div class="kpi-item">
              <div class="kpi-num" style="color:#e53e3e;">{{ DashboardData.customerStats.newThisMonth }}</div>
              <div class="kpi-label">本月新增</div>
            </div>
            <div class="kpi-item">
              <div class="kpi-num" style="color:#38a169;">{{ DashboardData.customerStats.growth }}</div>
              <div class="kpi-label">环比增长</div>
            </div>
            <div class="kpi-item">
              <div class="kpi-num">{{ DashboardData.customerStats.totalSales }}</div>
              <div class="kpi-label">成交总额</div>
            </div>
          </div>
        </el-card>

        <el-card class="widget-full">
          <template #header>
            <span class="widget-title">销售额排名</span>
            <span class="widget-badge" style="margin-left:8px;font-size:12px;color:#999;">按区域</span>
          </template>
          <div class="chart-body">
            <canvas id="salesRankChart"></canvas>
          </div>
        </el-card>
      </div>
    </div>
  `
}
```

---

### Task 8: 创建占位页组件 — js/pages/placeholder.js

**Files:**
- Create: `js/pages/placeholder.js`

显示"功能开发中"提示。

- [ ] **Step 1: 创建 PlaceholderPage**

```javascript
const PlaceholderPage = {
  name: 'PlaceholderPage',
  template: `
    <div class="content-area">
      <div class="placeholder-page">
        <div class="placeholder-icon" style="color:#409eff">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M9 12h6m-6 4h6m2-10H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2z"/>
          </svg>
        </div>
        <p class="placeholder-text">功能开发中</p>
      </div>
    </div>
  `
}
```

---

### Task 9: 创建请购单页面 — js/pages/purchase-requisition.js

**Files:**
- Create: `js/pages/purchase-requisition.js`

完整的请购单列表页面，包含工具栏、筛选区、数据表格和分页。

- [ ] **Step 1: 创建 PurchaseRequisition 组件**

```javascript
const PurchaseRequisition = {
  name: 'PurchaseRequisition',
  data() {
    return {
      tableData: PurchaseData.list,
      total: PurchaseData.total,
      pageSize: 50,
      currentPage: 1,
      filters: {
        applyDate: '2025-04-24',
        voidStatus: '正常',
        lineStatus: '开启',
        auditStatus: '全部',
        materialCode: '',
        spec: '',
        orderNo: '',
        applicant: '',
        orderType: '全部',
        bizType: '全部',
        purchaseType: '全部',
        materialCategory: '全部'
      },
      selectedRows: [],
      dialogVisible: false,
      formData: {
        materialCode: '',
        materialName: '',
        spec: '',
        qty: null,
        unit: 'PCS',
        applicant: '',
        applyDate: '',
        purpose: ''
      }
    }
  },
  computed: {
    filteredData() {
      let data = PurchaseData.list
      const f = this.filters
      if (f.auditStatus !== '全部') {
        data = data.filter(d => d.status === f.auditStatus)
      }
      if (f.materialCode) {
        data = data.filter(d => d.materialCode.includes(f.materialCode))
      }
      if (f.spec) {
        data = data.filter(d => d.spec.includes(f.spec))
      }
      if (f.orderNo) {
        data = data.filter(d => d.orderNo.includes(f.orderNo))
      }
      if (f.applicant) {
        data = data.filter(d => d.applicant.includes(f.applicant))
      }
      if (f.bizType !== '全部') {
        data = data.filter(d => d.bizType === f.bizType)
      }
      if (f.purchaseType !== '全部') {
        data = data.filter(d => d.purchaseType === f.purchaseType)
      }
      return data
    },
    pagedData() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.filteredData.slice(start, start + this.pageSize)
    }
  },
  methods: {
    handleSearch() {
      this.currentPage = 1
    },
    handleReset() {
      this.filters = {
        applyDate: '2025-04-24',
        voidStatus: '正常',
        lineStatus: '开启',
        auditStatus: '全部',
        materialCode: '',
        spec: '',
        orderNo: '',
        applicant: '',
        orderType: '全部',
        bizType: '全部',
        purchaseType: '全部',
        materialCategory: '全部'
      }
      this.currentPage = 1
    },
    handleAdd() {
      this.formData = {
        materialCode: '', materialName: '', spec: '',
        qty: null, unit: 'PCS', applicant: '', applyDate: '', purpose: ''
      }
      this.dialogVisible = true
    },
    handleSubmitAdd() {
      const newItem = {
        id: PurchaseData.list.length + 1,
        status: '开启',
        bizType: '备品备件',
        purchaseType: '按订单采购',
        materialCode: this.formData.materialCode || 'NEW-' + Date.now(),
        materialName: this.formData.materialName,
        spec: this.formData.spec,
        unit: this.formData.unit,
        productCode: '', artNo: '',
        qty: this.formData.qty || 0,
        orderedAuditing: 0, ordered: 0, unOrdered: this.formData.qty || 0,
        price: 0,
        applyDate: this.formData.applyDate || new Date().toISOString().slice(0, 10),
        requiredDate: '',
        applicant: this.formData.applicant || '管理员',
        purpose: this.formData.purpose || '',
        orderNo: 'SQ' + Date.now()
      }
      PurchaseData.list.unshift(newItem)
      PurchaseData.total++
      this.total++
      this.dialogVisible = false
    },
    handlePageChange(page) {
      this.currentPage = page
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
    },
    getStatusType(status) {
      if (status === '已审核') return 'success'
      if (status === '开启') return 'primary'
      if (status === '已作废') return 'info'
      return ''
    }
  },
  template: `
    <div class="content-area">
      <!-- Toolbar -->
      <el-card shadow="never" style="margin-bottom:12px;">
        <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
          <el-button type="success" size="small" @click="handleAdd">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px;"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>新增
          </el-button>
          <el-button plain size="small">合并请购单</el-button>
          <el-button plain size="small">作废</el-button>
          <el-button plain size="small">送审</el-button>
          <el-button plain size="small">撤销</el-button>
          <el-button plain size="small">刷新状态</el-button>
          <el-button plain size="small">重算</el-button>
          <el-button plain size="small">导入请购单</el-button>
          <el-button plain size="small">审核</el-button>
          <el-button plain size="small">反审核</el-button>
          <el-button plain size="small">反作废</el-button>
          <el-button plain size="small">导出Excel</el-button>
          <el-button plain size="small">导出报表单</el-button>
          <el-button type="success" size="small">下载</el-button>
          <el-button type="success" size="small">模板下载</el-button>
        </div>
      </el-card>

      <!-- Filter Area -->
      <el-card shadow="never" style="margin-bottom:12px;">
        <el-form :model="filters" label-width="0" size="small">
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;">
            <el-form-item label="申请日期">
              <el-date-picker v-model="filters.applyDate" type="date" style="width:100%;" />
            </el-form-item>
            <el-form-item label="作废状态">
              <el-select v-model="filters.voidStatus" style="width:100%;">
                <el-option label="正常" value="正常" />
                <el-option label="作废" value="作废" />
              </el-select>
            </el-form-item>
            <el-form-item label="行状态">
              <el-select v-model="filters.lineStatus" style="width:100%;">
                <el-option label="开启" value="开启" />
                <el-option label="关闭" value="关闭" />
              </el-select>
            </el-form-item>
            <el-form-item label="审核状态">
              <el-select v-model="filters.auditStatus" style="width:100%;">
                <el-option label="全部" value="全部" />
                <el-option label="已审核" value="已审核" />
                <el-option label="未审核" value="未审核" />
              </el-select>
            </el-form-item>
            <el-form-item label="物料代码">
              <el-input v-model="filters.materialCode" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="规格型号">
              <el-input v-model="filters.spec" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="申请单号">
              <el-input v-model="filters.orderNo" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="申请人">
              <el-input v-model="filters.applicant" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="订单类型">
              <el-select v-model="filters.orderType" style="width:100%;">
                <el-option label="全部" value="全部" />
                <el-option label="备品备件" value="备品备件" />
                <el-option label="维护保养" value="维护保养" />
                <el-option label="设备改造" value="设备改造" />
              </el-select>
            </el-form-item>
            <el-form-item label="业务类型">
              <el-select v-model="filters.bizType" style="width:100%;">
                <el-option label="全部" value="全部" />
                <el-option label="备品备件" value="备品备件" />
                <el-option label="维护保养" value="维护保养" />
                <el-option label="设备改造" value="设备改造" />
                <el-option label="加工件" value="加工件" />
                <el-option label="原材料" value="原材料" />
              </el-select>
            </el-form-item>
            <el-form-item label="采购类型">
              <el-select v-model="filters.purchaseType" style="width:100%;">
                <el-option label="全部" value="全部" />
                <el-option label="按安全库存采购" value="按安全库存采购" />
                <el-option label="按订单采购" value="按订单采购" />
                <el-option label="维护保养" value="维护保养" />
              </el-select>
            </el-form-item>
            <el-form-item label="物料分类">
              <el-select v-model="filters.materialCategory" style="width:100%;">
                <el-option label="全部" value="全部" />
                <el-option label="备品备件" value="备品备件" />
                <el-option label="原材料" value="原材料" />
                <el-option label="加工件" value="加工件" />
              </el-select>
            </el-form-item>
          </div>
          <div style="margin-top:12px;display:flex;gap:12px;">
            <el-button type="primary" @click="handleSearch">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>搜索
            </el-button>
            <el-button @click="handleReset">重置</el-button>
          </div>
        </el-form>
      </el-card>

      <!-- Table -->
      <el-card shadow="never">
        <el-table
          :data="pagedData"
          border
          stripe
          max-height="480"
          style="width:100%"
          @selection-change="v => selectedRows = v"
        >
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="状态" width="90" align="center">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)" size="small">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="bizType" label="业务类型" width="100" />
          <el-table-column prop="purchaseType" label="采购类型" width="120" />
          <el-table-column prop="materialCode" label="物料代码" width="130" />
          <el-table-column prop="materialName" label="物料名称" width="150" show-overflow-tooltip />
          <el-table-column prop="spec" label="规格型号" width="130" />
          <el-table-column prop="unit" label="单位" width="70" align="center" />
          <el-table-column prop="productCode" label="产品编码" width="110" />
          <el-table-column prop="artNo" label="货号" width="110" />
          <el-table-column prop="qty" label="申请数量" width="100" align="right" />
          <el-table-column prop="orderedAuditing" label="已下单量(审核中)" width="130" align="right" />
          <el-table-column prop="ordered" label="已下单量" width="100" align="right" />
          <el-table-column prop="unOrdered" label="未下单量" width="100" align="right" />
          <el-table-column prop="price" label="单价" width="90" align="right" />
          <el-table-column prop="applyDate" label="申请日期" width="120" align="center" />
          <el-table-column prop="requiredDate" label="要求日期" width="120" align="center" />
          <el-table-column prop="applicant" label="申请人" width="90" />
          <el-table-column prop="purpose" label="用途" width="200" show-overflow-tooltip />
          <el-table-column prop="orderNo" label="申请单号" width="150" />
        </el-table>

        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;">
          <span style="font-size:13px;color:#666;">共 {{ filteredData.length }} 条</span>
          <el-pagination
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="filteredData.length"
            layout="prev, pager, next, jumper, sizes"
            background
            small
            @current-change="handlePageChange"
            @size-change="handleSizeChange"
          />
        </div>
      </el-card>

      <!-- Add Dialog -->
      <el-dialog v-model="dialogVisible" title="新增请购单" width="500px">
        <el-form :model="formData" label-width="80px" size="small">
          <el-form-item label="物料代码">
            <el-input v-model="formData.materialCode" />
          </el-form-item>
          <el-form-item label="物料名称">
            <el-input v-model="formData.materialName" />
          </el-form-item>
          <el-form-item label="规格型号">
            <el-input v-model="formData.spec" />
          </el-form-item>
          <el-form-item label="数量">
            <el-input-number v-model="formData.qty" :min="1" style="width:100%;" />
          </el-form-item>
          <el-form-item label="单位">
            <el-select v-model="formData.unit" style="width:100%;">
              <el-option label="PCS" value="PCS" />
              <el-option label="M" value="M" />
              <el-option label="KG" value="KG" />
            </el-select>
          </el-form-item>
          <el-form-item label="申请人">
            <el-input v-model="formData.applicant" />
          </el-form-item>
          <el-form-item label="申请日期">
            <el-date-picker v-model="formData.applyDate" type="date" style="width:100%;" />
          </el-form-item>
          <el-form-item label="用途">
            <el-input v-model="formData.purpose" type="textarea" :rows="2" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitAdd">确认</el-button>
        </template>
      </el-dialog>
    </div>
  `
}
```

---

### Task 10: 重写应用入口 — app.js

**Files:**
- Modify: `app.js`

引入 vue-router，创建 router 实例，管理 openedTabs 和路由同步。

- [ ] **Step 1: 重写 app.js**

```javascript
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
      // 子菜单项 → 导航
      if (path && path.startsWith('/')) {
        const exists = this.openedTabs.find(t => t.path === path)
        if (!exists) {
          const item = this.findMenuItemByPath(path)
          if (item) {
            this.openedTabs.push({ path: item.path, label: item.label, closable: item.path !== '/home' })
          }
        }
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
        // 确保该路由在 openedTabs 中
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

app.use(ElementPlus)
app.use(router)

app.component('app-sidebar', Sidebar)
app.component('app-topnav', TopNav)
app.component('app-tabbar', TabBar)

app.mount('#app')
```

---

## 执行顺序说明

请按以下顺序执行 Task，确保依赖关系正确：

1. **Task 1** — 更新 data.js 菜单数据（添加 path、采购管理、purchase 图标）
2. **Task 4 Step 1** — 添加 vue-router CDN 到 index.html
3. **Task 2** — 创建 js/data/purchase.js 模拟数据
4. **Task 5** — 修改 sidebar.js（emit path）
5. **Task 6** — 创建 js/components/tabbar.js
6. **Task 7** — 创建 js/pages/home.js
7. **Task 8** — 创建 js/pages/placeholder.js
8. **Task 9** — 创建 js/pages/purchase-requisition.js
9. **Task 10** — 重写 app.js（包括 router 创建、TopNav 调整等）
10. **Task 4 Steps 2-4** — 更新 index.html 模板和脚本引用

---

## 自检

- [x] **Spec 覆盖**: 路由架构、采购菜单、请购单页面、页签栏、首页迁移 — 全部覆盖
- [x] **占位符扫描**: 无 TBD/TODO；所有模板代码完整
- [x] **类型一致性**: 路径字符串 `/xxx` 在所有组件中统一使用；`handleMenuClick(path)` 在所有地方一致
- [x] **依赖顺序**: Task 10 (app.js) 在所有组件文件创建之后执行；router 在 app.js 中创建（确保所有组件变量已就绪）
- [x] **文件完整性**: 删除 dashboard.js（功能分解为 tabbar.js + home.js）；删除 router.js（路由定义移入 app.js）
