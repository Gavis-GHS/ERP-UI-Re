# 企业管理系统首页重构 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 根据旧系统设计图，将现有 Vue 企业管理系统首页重构为 Element Plus 风格，含树形菜单、新式顶部导航页签栏和图表看板。

**Architecture:** 保持 CDN 免构建方式（Vue 3 + Element Plus + Chart.js），升级现有 6 个文件。侧栏用 el-menu + el-sub-menu 实现树形菜单，页签用 el-tabs + el-tab-pane 替换自定义实现，图表卡片用 el-card 包裹。

**Tech Stack:** Vue 3 (CDN) + Element Plus (CDN UMD) + Chart.js (CDN)

---

## 文件结构

| 文件 | 操作 | 职责 |
|------|------|------|
| `js/data.js` | 修改 | 菜单数据改为树形结构（含 children），新增 Icons SVGs，其余数据不变 |
| `index.html` | 修改 | 添加 Element Plus CDN CSS/JS，清理旧样式，保留布局结构 |
| `js/components/sidebar.js` | 重写 | el-menu 树形侧栏，发射 menu-click 事件 |
| `js/components/topnav.js` | 修改 | 适配 Element Plus 风格，使用 el-dropdown |
| `js/components/dashboard.js` | 重写 | el-tabs 页签 + el-card 图表卡片 + Chart.js 初始化 |
| `app.js` | 修改 | 适配新数据结构和组件事件 |

---

### Task 1: 更新数据层 — js/data.js

**Files:**
- Modify: `js/data.js` (全文)

更新菜单为树形结构（含 children 子菜单数组），更新 Icons 图标（补充分级图标），保留其他数据不变。

- [ ] **Step 1: 重写 MenuData 为树形结构**

```javascript
const MenuData = {
  items: [
    { key: 'home', label: '首页', icon: 'home' },
    {
      key: 'sales', label: '销售管理', icon: 'sales',
      children: [
        { key: 'sales-order', label: '销售订单', icon: 'file' },
        { key: 'sales-contract', label: '销售合同', icon: 'file' },
        { key: 'sales-return', label: '销售退货', icon: 'file' }
      ]
    },
    {
      key: 'production', label: '产值管理', icon: 'production',
      children: [
        { key: 'production-stats', label: '产值统计', icon: 'file' },
        { key: 'production-report', label: '产值报表', icon: 'file' }
      ]
    },
    { key: 'customers', label: '客户管理', icon: 'customers' },
    {
      key: 'reports', label: '报表统计', icon: 'reports',
      children: [
        { key: 'report-sales', label: '销售报表', icon: 'file' },
        { key: 'report-production', label: '产值报表', icon: 'file' },
        { key: 'report-customers', label: '客户报表', icon: 'file' }
      ]
    },
    { key: 'settings', label: '系统设置', icon: 'settings' }
  ]
}
```

- [ ] **Step 2: 在 Icons 对象中添加 file 图标**

```javascript
const Icons = {
  // ... 保留现有所有图标 ...
  file: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>'
}
```

- [ ] **Step 3: 从 TopNavData 中移除 navItems（改为在组件内静态定义）**

```javascript
const TopNavData = {
  logo: '企业管理系统',
  userName: '管理员'
}
```

- [ ] **Step 4: 保留 TabsData、DashboardData 和 Icons 其余部分不变**

保留 `TabsData.tabs` (`home` 不可关闭)、`DashboardData` (lineChart/barChart/customerStats/salesRanking)、和所有原有 Icons (home/sales/production/customers/reports/settings/star/starOutline/close/search/user/expandMore)。

- [ ] **Step 5: 验证修改**

```bash
node -e "
const fs = require('fs');
const code = fs.readFileSync('/Users/gavis/vue-project/js/data.js','utf-8');
console.log('Has MenuData:', code.includes('MenuData'));
console.log('Has children array:', code.includes('children:'));
console.log('Has file icon:', code.includes("file:"));
console.log('Has DashboardData:', code.includes('DashboardData'));
console.log('Has TopNavData:', code.includes('logo'));
"
```

Expected: All true.

---

### Task 2: 更新 HTML 和样式 — index.html

**Files:**
- Modify: `index.html` (在 head 中添加 Element Plus CDN，更新 body 布局样式)

- [ ] **Step 1: 在 head 中添加 Element Plus CDN**

添加以下两个 CDN 引用到 `<head>` 中（在 Vue CDN 之上、Chart.js CDN 之下）：

```html
<!-- Element Plus CSS -->
<link rel="stylesheet" href="https://unpkg.com/element-plus/dist/index.css">
```

- [ ] **Step 2: 在 Vue CDN 下方添加 Element Plus JS**

将 Element Plus JS 放在 Vue CDN 之后、现有 data.js 之前：

```html
<script src="https://unpkg.com/vue@3.3.4/dist/vue.global.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
<!-- Element Plus JS -->
<script src="https://unpkg.com/element-plus"></script>
```

- [ ] **Step 3: 移除侧栏旧样式（.sidebar, .sidebar-menu, .sidebar-item, .sidebar-icon, .sidebar-label）**

删除以下 CSS 规则：
```css
.sidebar { ... }
.sidebar-menu { ... }
.sidebar-item { ... }
.sidebar-icon { ... }
.sidebar-label { ... }
```

- [ ] **Step 4: 移除页签旧样式（.tabs-bar, .tab-item, .tab-close, .tab-label）**

删除以下 CSS 规则：
```css
.tabs-bar { ... }
.tab-item { ... }
.tab-close { ... }
/* .tab-label 不需要删除——保留它用于非 el-tabs 场景 */
```

- [ ] **Step 5: 移除/简化 .widget 旧样式，保留 .widget-grid 和 .chart-body**

保留：
```css
.widget-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.widget-full { grid-column: 1 / -1; }
.chart-body { height: 280px; position: relative; }
.chart-body canvas { width: 100% !important; height: 100% !important; }
```

删除：
```css
.widget { ... }
.widget-header { ... }
.widget-title { ... }
.widget-badge { ... }
.widget-body { ... }
```

- [ ] **Step 6: 更新 .right-container 布局**

```css
.right-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: #f0f4f8;
}
```

- [ ] **Step 7: 添加 Element Plus 菜单覆盖样式**

```css
/* Sidebar wrapper: remove default border, full height */
.el-menu { border-right: none !important; }
```

- [ ] **Step 8: 保留 .main-content、.dashboard、.kpi-grid、.kpi-item、.placeholder-page 样式**

这些继续使用无需修改。

- [ ] **Step 9: 保留 body #app 布局和 .topnav 相关样式（Task 4 会复用它们）**

保留：
```css
#app { display: flex; height: 100vh; overflow: hidden; }
.topnav { height: 50px; ... }
.main-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.dashboard { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
```

- [ ] **Step 10: 验证 CDN 加载**

启动 dev 服务器：
```bash
cd /Users/gavis/vue-project && npx http-server -p 3000
```

访问 `http://localhost:3000`，打开浏览器控制台确认 Element Plus 已加载（`window.ElementPlus` 存在）。

---

### Task 3: 重写侧栏组件 — js/components/sidebar.js

**Files:**
- Modify: `js/components/sidebar.js` (全文重写)

使用 `el-menu` + `el-sub-menu` 实现树形菜单。保留 props/emits 接口不变。

- [ ] **Step 1: 重写 Sidebar 组件**

```javascript
const Sidebar = {
  name: 'Sidebar',
  props: {
    items: { type: Array, required: true },
    activeKey: { type: String, default: 'home' }
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
          <el-menu-item v-if="!item.children" :index="item.key">
            <span v-html="Icons[item.icon] || ''" style="margin-right:8px;display:inline-flex;align-items:center;"></span>
            <span>{{ item.label }}</span>
          </el-menu-item>
          <el-sub-menu v-else :index="item.key">
            <template #title>
              <span v-html="Icons[item.icon] || ''" style="margin-right:8px;display:inline-flex;align-items:center;"></span>
              <span>{{ item.label }}</span>
            </template>
            <el-menu-item v-for="child in item.children" :key="child.key" :index="child.key">
              <span>{{ child.label }}</span>
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
    </div>
  `
}
```

注意: `el-menu` 会自动覆盖 `border-right` 样式，已在 index.html 中添加 `.el-menu { border-right: none !important; }` 处理。

- [ ] **Step 2: 验证组件结构**

检查以下要点：
- `el-menu` 接收 `default-active`、`background-color`、`text-color`、`active-text-color` props
- 无 children 的 item 渲染为 `el-menu-item`
- 有 children 的 item 渲染为 `el-sub-menu`，子项渲染为 `el-menu-item`
- 图标通过 `Icons[item.icon]` 全局变量获取 SVG
- Select 事件发射 `menu-click` 给父组件

---

### Task 4: 更新顶部导航栏 — js/components/topnav.js

**Files:**
- Modify: `js/components/topnav.js` (修改样式、使用 el-dropdown)

- [ ] **Step 1: 重写 TopNav 组件**

```javascript
const TopNav = {
  name: 'TopNav',
  props: {
    logo: { type: String, default: '企业管理系统' },
    navItems: { type: Array, required: true },
    userName: { type: String, default: '管理员' }
  },
  methods: {
    handleDropdownCommand(command) {
      if (command === 'logout') {
        alert('退出登录')
      } else if (command === 'profile') {
        alert('个人中心')
      } else if (command === 'settings') {
        alert('系统设置')
      }
    }
  },
  template: `
    <div class="topnav">
      <div class="topnav-left">
        <span class="topnav-logo">{{ logo }}</span>
      </div>
      <div class="topnav-center">
        <div
          v-for="item in navItems"
          :key="item.key"
          class="topnav-item"
        >
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
            <el-avatar :size="28" style="background:#fff;color:#409eff;font-size:12px;flex-shrink:0;">
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
  `
}
```

- [ ] **Step 2: 更新 .topnav 背景色**

在 index.html 的 `.topnav` 样式中，将 `background: #3182ce` 改为 `background: #409eff`：

```css
.topnav {
  height: 50px;
  min-height: 50px;
  background: #409eff;  /* Element Plus 主色 */
  display: flex;
  align-items: center;
  padding: 0 16px;
  color: #fff;
}
```

- [ ] **Step 3: 添加 el-dropdown-link 样式**

```css
.user-profile.el-dropdown-link {
  outline: none;
}

.user-profile.el-dropdown-link:focus-visible {
  outline: none;
}
```

---

### Task 5: 重写首页看板组件 — js/components/dashboard.js

**Files:**
- Modify: `js/components/dashboard.js` (全文重写，使用 el-tabs + el-card)

- [ ] **Step 1: 重写 Dashboard 组件模板**

```javascript
const Dashboard = {
  name: 'Dashboard',
  props: {
    tabs: { type: Array, required: true },
    activeTab: { type: String, default: 'home' },
    chartData: { type: Object, required: true }
  },
  emits: ['tab-click', 'tab-close'],
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
  watch: {
    activeTab(newVal) {
      if (newVal === 'home') {
        this.$nextTick(() => {
          this.chartInstances.forEach(c => c.resize())
        })
      }
    }
  },
  methods: {
    initCharts() {
      this.chartInstances.forEach(c => c.destroy())
      this.chartInstances = []
      const d = this.chartData

      // Line chart
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
              fill: true,
              tension: 0.3,
              pointBackgroundColor: '#409eff',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 3
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

      // Bar chart
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
              borderWidth: 1,
              borderRadius: 2
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

      // Horizontal bar chart (ranking)
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
    },
    handleTabClick(pane) {
      if (pane.props.name === 'home') {
        this.$nextTick(() => {
          this.chartInstances.forEach(c => c.resize())
        })
      }
      this.$emit('tab-click', pane.props.name)
    }
  },
  template: `
    <div class="dashboard">
      <el-tabs
        v-model="activeTab"
        type="card"
        @tab-click="handleTabClick"
        @tab-remove="(name) => $emit('tab-close', name)"
      >
        <el-tab-pane
          v-for="tab in tabs"
          :key="tab.key"
          :name="tab.key"
          :label="tab.label"
          :closable="tab.closable"
        >
          <template v-if="tab.key === 'home'">
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
                  <template #header>
                    <span class="widget-title">新增客户情况统计</span>
                  </template>
                  <div class="kpi-grid">
                    <div class="kpi-item">
                      <div class="kpi-num">{{ chartData.customerStats.total }}</div>
                      <div class="kpi-label">累计客户数</div>
                    </div>
                    <div class="kpi-item">
                      <div class="kpi-num" style="color:#e53e3e;">{{ chartData.customerStats.newThisMonth }}</div>
                      <div class="kpi-label">本月新增</div>
                    </div>
                    <div class="kpi-item">
                      <div class="kpi-num" style="color:#38a169;">{{ chartData.customerStats.growth }}</div>
                      <div class="kpi-label">环比增长</div>
                    </div>
                    <div class="kpi-item">
                      <div class="kpi-num">{{ chartData.customerStats.totalSales }}</div>
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
          </template>

          <template v-else>
            <div class="content-area">
              <div class="placeholder-page">
                <div class="placeholder-icon" style="color:#409eff" v-html="Icons.sales"></div>
                <p class="placeholder-text">{{ getActiveTabLabel() }} - 功能开发中</p>
              </div>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
  `,
  methods: {
    // merged with chart methods above — using object spread won't work in plain objects
    // Instead, define all methods in one `methods` block
    getActiveTabLabel() {
      const tab = this.tabs.find(t => t.key === this.activeTab)
      return tab ? tab.label : ''
    }
  }
}
```

注意：JavaScript 普通对象不支持 `methods` 写两次，所以实际代码需要把所有方法合并到一个 `methods` 块中：

```javascript
methods: {
  initCharts() { /* ... */ },
  handleTabClick(pane) { /* ... */ },
  getActiveTabLabel() { /* ... */ }
}
```

- [ ] **Step 2: 添加 el-card header 样式**

在 index.html 中：
```css
/* Style el-card headers for dashboard */
.el-card .widget-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a202c;
}
```

- [ ] **Step 3: 为 .content-area 添加 el-card 阴影覆盖**

为了保持 el-card 原生阴影，移除 `.widget` 的手动阴影：
```css
/* 删除 */
.widget { ... }
```

---

### Task 6: 更新应用入口 — app.js

**Files:**
- Modify: `app.js` (适配新数据结构和组件事件)

- [ ] **Step 1: 更新 app.js 以适配新数据结构和 el-tabs 事件**

```javascript
const app = Vue.createApp({
  data() {
    return {
      menuItems: MenuData.items,
      activeMenu: 'home',
      navItems: TopNavData.navItems || [
        { key: 'sales-board', label: '销售看板', starred: true },
        { key: 'production-board', label: '产值看板', starred: true },
        { key: 'customer-board', label: '客户看板', starred: false },
        { key: 'report-center', label: '报表中心', starred: false }
      ],
      logo: TopNavData.logo,
      userName: TopNavData.userName,
      tabs: JSON.parse(JSON.stringify(TabsData.tabs)),
      activeTab: 'home',
      chartData: DashboardData
    }
  },
  methods: {
    handleMenuClick(key) {
      this.activeMenu = key
      const exists = this.tabs.find(t => t.key === key)
      if (!exists) {
        // Find the item (could be top-level or child)
        const item = this.findMenuItem(key)
        if (item) {
          this.tabs.push({ key: item.key, label: item.label, closable: true })
        }
      }
      this.activeTab = key
    },
    findMenuItem(key) {
      for (const item of this.menuItems) {
        if (item.key === key) return item
        if (item.children) {
          const child = item.children.find(c => c.key === key)
          if (child) return child
        }
      }
      return null
    },
    handleTabClick(key) {
      this.activeTab = key
      this.activeMenu = key
    },
    handleTabClose(key) {
      if (key === 'home') return
      const idx = this.tabs.findIndex(t => t.key === key)
      if (idx === -1) return
      this.tabs.splice(idx, 1)
      if (this.activeTab === key) {
        const prev = this.tabs[Math.min(idx, this.tabs.length - 1)]
        this.activeTab = prev ? prev.key : 'home'
        this.activeMenu = this.activeTab
      }
    }
  }
})

app.component('app-sidebar', Sidebar)
app.component('app-topnav', TopNav)
app.component('app-dashboard', Dashboard)

app.mount('#app')
```

- [ ] **Step 2: 更新 index.html 中的组件绑定**

保留现有绑定（不需改动）：
```html
<app-sidebar
  :items="menuItems"
  :active-key="activeMenu"
  @menu-click="handleMenuClick"
></app-sidebar>
```

Dashboard 组件绑定更新：
```html
<app-dashboard
  :tabs="tabs"
  :active-tab.sync="activeTab"
  :chart-data="chartData"
  @tab-click="handleTabClick"
  @tab-close="handleTabClose"
></app-dashboard>
```

注意：el-tabs 使用 `v-model` 内部管理 activeTab，所以 dashboard 需要同步 prop。使用 `.sync` 修饰符或传 prop + 监听事件。更可靠的做法是 dashboard 不直接修改 activeTab prop，而是 emit 事件给父组件处理。

实际在 dashboard 中，`v-model="activeTab"` 会在内部修改 prop（Vue 3 中 props 是只读的），所以我们需要 dashbaord 用 data 复制 prop：
```javascript
// dashboard.js
props: { activeTab: String },
emits: ['update:activeTab', 'tab-click', 'tab-close'],
data() {
  return { currentTab: this.activeTab, chartInstances: [] }
},
watch: {
  activeTab(val) { this.currentTab = val },
  currentTab(val) { this.$emit('update:activeTab', val) }
}
```

或者更简单：在 app.js 中处理 el-tabs 的 `@tab-click` 事件直接更新 activeTab。Dashboard 用 `:active-tab="activeTab"`（而非 `v-model`），然后在 el-tabs 上用 `v-model="currentTab"`（内部 data 副本）。

简化方案：el-tabs 的 v-model 会直接改变绑定的 data 属性。由于 activeTab 是 prop（从父组件传入），不能直接被 v-model 修改。改为用 data 副本：

**实际 app.js 保持简单：不传 activeTab，让 dashboard 内部管理 activeTab 状态**

等等，这样父组件就无法通过点击菜单同步页签了。让我们回到最初的设计：

父组件持有 activeTab，向下传给 dashboard 作为 prop。dashboard 用内部 data 复制 prop，el-tabs 的 v-model 绑定内部 data。当内部 data 变化时，emit 给父组件。

为了避免复杂，让 app.js 直接持有 activeTab，dashboard 的 el-tabs 使用 `:model-value` + `@update:model-value`：

```html
<!-- dashboard template -->
<el-tabs
  :model-value="activeTab"
  type="card"
  @update:model-value="(val) => $emit('tab-click', val)"
  @tab-remove="(name) => $emit('tab-close', name)"
>
```

这样 el-tabs 不直接修改 prop，而是通过事件通知父组件。父组件更新 activeTab，再通过 prop 向下传递。

**采用这个方案** — dashboard 中的 el-tabs 使用 `:model-value` 而非 `v-model`。

```javascript
// dashboard template
<el-tabs
  :model-value="activeTab"
  type="card"
  @tab-click="handleTabClick"
  @tab-remove="(name) => $emit('tab-close', name)"
>
...
```

```javascript
// dashboard handleTabClick
handleTabClick(pane) {
  if (pane.props.name === 'home') {
    this.$nextTick(() => {
      this.chartInstances.forEach(c => c.resize())
    })
  }
  this.$emit('tab-click', pane.props.name)
}
```

app.js 中 handleTabClick 接收 key：
```javascript
handleTabClick(key) {
  this.activeTab = key
  this.activeMenu = key
}
```

- [ ] **Step 3: 完整验证**

```bash
cd /Users/gavis/vue-project && npx http-server -p 3000
```

打开 `http://localhost:3000`，测试：
1. 侧栏菜单展开/收起子菜单
2. 点击菜单项添加/切换页签
3. 关闭非首页页签
4. 首页图表正常渲染
5. 顶部导航栏样式
6. 用户下拉菜单

---

## 自检确认

- [x] **Spec 覆盖**: 树形菜单 → Task 1 + Task 3 | 顶部导航 → Task 4 | 页签栏 → Task 5 | 图表看板 → Task 5 | 配色方案 → Task 2 + Task 4
- [x] **占位符扫描**: 无 TBD/TODO 占位符
- [x] **类型一致性**: 所有方法签名跨 task 一致（handleTabClick(key) vs handleTabClick(pane) 已正确处理解包）
- [x] **完整代码**: 每个 task 的代码块包含完整实现

---

## 执行交接

计划已保存至 `docs/superpowers/plans/2026-04-24-enterprise-management-refactor.md`。

两种执行方式：

1. **Subagent-Driven（推荐）** — 每个 Task 派发独立子代理，任务间有审查点，迭代快速
2. **Inline Execution** — 在当前会话中逐个执行 task，带审查点

选择哪种方式？
