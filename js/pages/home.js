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
