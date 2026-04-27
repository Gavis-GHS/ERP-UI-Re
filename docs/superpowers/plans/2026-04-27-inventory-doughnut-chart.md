# 首页库存金额分布环形图 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在首页新增库存金额分布环形图卡片，含 KPI 汇总、悬停切换中心文字、图例点击显隐扇区、入场动画。

**Architecture:** 修改 `src/data/dashboard.js` 新增 `inventoryStats` 数据；修改 `src/pages/HomePage.vue` 新增卡片模板、Chart.js doughnut 实例化、中心文字插件、图例交互逻辑、入场动画配置、作用域样式。不新增文件，不引入新依赖。

**Tech Stack:** Vue 3 + Chart.js 4.4 + Element Plus

---

## 文件结构

| 文件 | 职责 | 操作 |
|------|------|------|
| `src/data/dashboard.js` | 提供 `inventoryStats` 数据（KPI + 物料分布） | 修改 |
| `src/pages/HomePage.vue` | 模板：环形图卡片 + 图例；脚本：Chart.js 实例化、中心文字插件、悬停/图例交互、动画；样式：KPI 行、图表行、图例 | 修改 |

---

### Task 1: 新增库存数据

**文件:**
- 修改: `src/data/dashboard.js`

- [ ] **Step 1: 在 DashboardData 对象末尾新增 inventoryStats 字段**

在 `purchaseStats` 闭括号 `}` 之后、导出对象闭括号 `}` 之前插入：

```js
  inventoryStats: {
    totalAmount: '¥12,680万',
    momChange: '-3.2%',
    categories: [
      { name: '气罐材料', value: 5730, color: '#409eff' },
      { name: '空间布材料', value: 3626, color: '#67c23a' },
      { name: 'PVC膜', value: 2003, color: '#e6a23c' },
      { name: '网格材料', value: 926, color: '#f56c6c' },
      { name: '水膜材料', value: 395, color: '#909399' }
    ]
  }
```

最终 `dashboard.js` 应为：

```js
export const DashboardData = {
  lineChart: {
    labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    sales: [1250, 1900, 1600, 2100, 1800, 2400, 2200, 2600, 2300, 2800, 2500, 3100]
  },
  barChart: {
    labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    values: [980, 1450, 1320, 1680, 1550, 1890, 1780, 2100, 1950, 2250, 2080, 2560]
  },
  customerStats: {
    total: 2586,
    newThisMonth: 186,
    growth: '+12.5%',
    totalSales: '¥12,680万'
  },
  salesRanking: {
    regions: ['华东区', '华南区', '华北区', '西南区', '西北区', '东北区'],
    values: [5800, 5200, 4600, 3200, 2800, 2100]
  },
  purchaseStats: {
    monthlyAmount: '¥8,520万',
    costChange: '-3.2%',
    inTransitOrders: 47,
    inventoryDays: 28
  },
  inventoryStats: {
    totalAmount: '¥12,680万',
    momChange: '-3.2%',
    categories: [
      { name: '气罐材料', value: 5730, color: '#409eff' },
      { name: '空间布材料', value: 3626, color: '#67c23a' },
      { name: 'PVC膜', value: 2003, color: '#e6a23c' },
      { name: '网格材料', value: 926, color: '#f56c6c' },
      { name: '水膜材料', value: 395, color: '#909399' }
    ]
  }
}
```

- [ ] **Step 2: 提交**

```bash
git add src/data/dashboard.js
git commit -m "feat: add inventoryStats data for doughnut chart"
```

---

### Task 2: 添加环形图 script 逻辑

**文件:**
- 修改: `src/pages/HomePage.vue`

> 注：先加 script 再加模板，确保每个 commit 都是可运行状态。script 新增的 ref/函数在模板未引用时不会影响现有页面。

- [ ] **Step 1: 更新 import 并新增响应式声明**

当前 import 行：
```js
import { onMounted, onBeforeUnmount, nextTick } from 'vue'
```

替换为：
```js
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
```

在 `let chartInstances = []` 之后、`onMounted` 之前插入：

```js
const legendItems = ref([])
let inventoryChart = null

const isMomNegative = computed(() => {
  const v = DashboardData.inventoryStats.momChange
  return v.startsWith('-')
})
```

- [ ] **Step 2: 新增中心文字插件和图表函数**

在 `initCharts` 函数之前插入 `centerTextPlugin`：

```js
const centerTextPlugin = {
  id: 'centerText',
  afterDraw(chart) {
    const text = chart._centerText
    const sub = chart._centerSubText
    if (!text) return
    const { ctx, chartArea: { top, bottom, left, right } } = chart
    const cx = (left + right) / 2
    const cy = (top + bottom) / 2

    ctx.save()
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.font = '600 14px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif'
    ctx.fillStyle = '#1a365d'
    ctx.fillText(text, cx, cy - 6)

    ctx.font = '12px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif'
    ctx.fillStyle = '#999'
    ctx.fillText(sub, cx, cy + 14)

    ctx.restore()
  }
}
```

紧接着插入 `initInventoryChart`：

```js
function initInventoryChart() {
  const canvas = document.getElementById('inventoryDoughnutChart')
  if (!canvas) return null

  const d = DashboardData.inventoryStats
  const cats = d.categories
  const total = cats.reduce((s, c) => s + c.value, 0)
  const maxCat = cats.reduce((a, b) => (a.value > b.value ? a : b))

  legendItems.value = cats.map(c => ({
    name: c.name,
    color: c.color,
    pct: ((c.value / total) * 100).toFixed(1) + '%',
    hidden: false
  }))

  let centerName = maxCat.name
  let centerPct = ((maxCat.value / total) * 100).toFixed(1) + '%'

  const chart = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: cats.map(c => c.name),
      datasets: [{
        data: cats.map(c => c.value),
        backgroundColor: cats.map(c => c.color),
        borderColor: '#fff',
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverBorderColor: '#fff',
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '65%',
      animation: {
        animateRotate: true,
        duration: 800,
        easing: 'easeInOutQuart'
      },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true }
      },
      onHover(_event, elements) {
        canvas.style.cursor = elements.length ? 'pointer' : 'default'
        if (elements.length) {
          const c = cats[elements[0].index]
          centerName = c.name
          centerPct = ((c.value / total) * 100).toFixed(1) + '%'
        } else {
          centerName = maxCat.name
          centerPct = ((maxCat.value / total) * 100).toFixed(1) + '%'
        }
        chart._centerText = centerName
        chart._centerSubText = centerPct
        chart.draw()
      }
    },
    plugins: [centerTextPlugin]
  })

  chart._centerText = centerName
  chart._centerSubText = centerPct

  return chart
}
```

接着插入 `toggleLegend`：

```js
function toggleLegend(idx) {
  const item = legendItems.value[idx]
  item.hidden = !item.hidden

  const visible = legendItems.value.filter(it => !it.hidden)
  const allCats = DashboardData.inventoryStats.categories

  if (visible.length === 0) {
    item.hidden = false
    return
  }

  inventoryChart.data.labels = visible.map(it => it.name)
  inventoryChart.data.datasets[0].data = visible.map(it => allCats.find(c => c.name === it.name).value)
  inventoryChart.data.datasets[0].backgroundColor = visible.map(it => it.color)
  inventoryChart.update()
}
```

- [ ] **Step 3: 在 initCharts 末尾调用 initInventoryChart**

在 `initCharts` 函数体中、闭合 `}` 之前插入：

```js
  inventoryChart = initInventoryChart()
  if (inventoryChart) chartInstances.push(inventoryChart)
```

- [ ] **Step 4: 提交**

```bash
git add src/pages/HomePage.vue
git commit -m "feat: add doughnut chart script — plugin, init, hover, legend toggle"
```

---

### Task 3: 新增环形图卡片模板和样式

**文件:**
- 修改: `src/pages/HomePage.vue`

- [ ] **Step 1: 在采购概览卡片和月度产值卡片之间插入新卡片模板**

在采购概览 `<el-card>`（含 `purchaseStats`）闭合标签 `</el-card>` 之后、月度产值 `<el-card>` 之前插入：

```html
      <el-card>
        <template #header><span class="widget-title">库存金额分布</span></template>
        <div class="inv-kpi-row">
          <div class="kpi-item">
            <div class="kpi-num">{{ DashboardData.inventoryStats.totalAmount }}</div>
            <div class="kpi-label">总库存金额</div>
          </div>
          <div class="kpi-item">
            <div class="kpi-num" :class="{ green: isMomNegative, accent: !isMomNegative }">{{ DashboardData.inventoryStats.momChange }}</div>
            <div class="kpi-label">环比变化</div>
          </div>
        </div>
        <div class="inv-chart-row">
          <div class="chart-body inv-chart-body">
            <canvas id="inventoryDoughnutChart"></canvas>
          </div>
          <div class="inv-legend">
            <div
              v-for="(item, idx) in legendItems"
              :key="item.name"
              class="inv-legend-item"
              :class="{ dimmed: item.hidden }"
              @click="toggleLegend(idx)"
            >
              <span class="inv-legend-dot" :style="{ background: item.color }"></span>
              <span class="inv-legend-name">{{ item.name }}</span>
              <span class="inv-legend-pct">{{ item.pct }}</span>
            </div>
          </div>
        </div>
      </el-card>
```

- [ ] **Step 2: 在 `<style scoped>` 末尾添加新样式**

在 `</style>` 之前插入：

```css
.inv-kpi-row {
  display: flex;
  justify-content: space-around;
  padding: 4px 0 8px;
}
.inv-chart-row {
  display: flex;
  align-items: center;
  gap: 16px;
}
.inv-chart-body {
  width: 150px;
  height: 150px;
  flex-shrink: 0;
}
.inv-legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.inv-legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: opacity 0.2s;
  user-select: none;
}
.inv-legend-item.dimmed {
  opacity: 0.35;
}
.inv-legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.inv-legend-name {
  font-size: 12px;
  color: #555;
  flex: 1;
}
.inv-legend-pct {
  font-size: 12px;
  color: #999;
  white-space: nowrap;
}
```

- [ ] **Step 3: 提交**

```bash
git add src/pages/HomePage.vue
git commit -m "feat: add inventory doughnut card template and styles"
```

---

### Task 4: 验证

- [ ] **Step 1: 启动开发服务器**

```bash
npm run dev
```

- [ ] **Step 2: 浏览器中检查**

打开 http://localhost:5173，验证：
1. 首页出现「库存金额分布」卡片
2. 顶部显示总库存金额 ¥12,680万 和环比 -3.2%（绿色）
3. 环形图正常渲染，5 种物料颜色正确
4. 环形图中心默认显示占比最大物料（气罐材料 45.2%）和百分比
5. 鼠标悬停扇区时扇区外扩，中心文字切换为对应物料
6. 鼠标移开后中心文字恢复默认
7. 入场时有旋转展开动画（约 0.8s）
8. 点击图例项后对应扇区隐藏/显示，图例项变灰/恢复
9. 切换页面后返回，图表正常重新渲染

- [ ] **Step 3: 验证无控制台错误**

打开浏览器 DevTools Console，确认无错误或警告。

---

### Task 5: 验证

- [ ] **Step 1: 启动开发服务器**

```bash
npm run dev
```

- [ ] **Step 2: 浏览器中检查**

打开 http://localhost:5173，验证：
1. 首页出现「库存金额分布」卡片，位于采购概览左侧（第三行左列）
2. 顶部显示总库存金额 ¥12,680万 和环比 -3.2%（绿色）
3. 环形图正常渲染，5 种物料颜色正确
4. 环形图中心默认显示占比最大物料（气罐材料）和百分比
5. 鼠标悬停扇区时扇区外扩，中心文字切换为对应物料
6. 鼠标移开后中心文字恢复默认
7. 入场时有旋转展开动画（约 0.8s）
8. 点击图例项后对应扇区隐藏/显示，图例项变灰/恢复
9. 切换页面后返回，图表正常重新渲染

- [ ] **Step 3: 验证无控制台错误**

打开浏览器 DevTools Console，确认无错误或警告。
