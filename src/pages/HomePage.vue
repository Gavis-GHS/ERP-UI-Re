<template>
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
        <template #header><span class="widget-title">新增客户情况统计</span></template>
        <div class="kpi-grid">
          <div class="kpi-item">
            <div class="kpi-num">{{ DashboardData.customerStats.total }}</div>
            <div class="kpi-label">累计客户数</div>
          </div>
          <div class="kpi-item">
            <div class="kpi-num accent">{{ DashboardData.customerStats.newThisMonth }}</div>
            <div class="kpi-label">本月新增</div>
          </div>
          <div class="kpi-item">
            <div class="kpi-num green">{{ DashboardData.customerStats.growth }}</div>
            <div class="kpi-label">环比增长</div>
          </div>
          <div class="kpi-item">
            <div class="kpi-num">{{ DashboardData.customerStats.totalSales }}</div>
            <div class="kpi-label">成交总额</div>
          </div>
        </div>
      </el-card>

      <el-card>
        <template #header><span class="widget-title">采购概览</span></template>
        <div class="kpi-grid">
          <div class="kpi-item">
            <div class="kpi-num">{{ DashboardData.purchaseStats.monthlyAmount }}</div>
            <div class="kpi-label">本月采购金额</div>
          </div>
          <div class="kpi-item">
            <div class="kpi-num green">{{ DashboardData.purchaseStats.costChange }}</div>
            <div class="kpi-label">采购成本环比</div>
          </div>
          <div class="kpi-item">
            <div class="kpi-num">{{ DashboardData.purchaseStats.inTransitOrders }}</div>
            <div class="kpi-label">在途订单数</div>
          </div>
          <div class="kpi-item">
            <div class="kpi-num">{{ DashboardData.purchaseStats.inventoryDays }}</div>
            <div class="kpi-label">库存周转天数</div>
          </div>
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

<script setup>
import { onMounted, onBeforeUnmount, nextTick } from 'vue'
import { Chart } from 'chart.js/auto'
import { DashboardData } from '@/data/dashboard'

let chartInstances = []

onMounted(() => {
  nextTick(() => initCharts())
})

onBeforeUnmount(() => {
  chartInstances.forEach(c => c.destroy())
  chartInstances = []
})

function initCharts() {
  chartInstances.forEach(c => c.destroy())
  chartInstances = []
  const d = DashboardData

  // Line chart
  const lineCtx = document.getElementById('salesLineChart')
  if (lineCtx) {
    chartInstances.push(new Chart(lineCtx, {
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

  // Bar chart
  const barCtx = document.getElementById('productionBarChart')
  if (barCtx) {
    chartInstances.push(new Chart(barCtx, {
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
    chartInstances.push(new Chart(rankCtx, {
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
</script>

<style scoped>
.widget-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.widget-full { grid-column: 1 / -1; }
.chart-body {
  height: 280px;
  position: relative;
}
.chart-body canvas {
  width: 100% !important;
  height: 100% !important;
}
.kpi-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 8px 0;
}
.kpi-item { text-align: center; }
.kpi-num {
  font-size: 28px;
  font-weight: 700;
  color: #1a365d;
  line-height: 1.2;
}
.kpi-num.accent { color: #e53e3e; }
.kpi-num.green { color: #38a169; }
.kpi-label {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}
</style>
