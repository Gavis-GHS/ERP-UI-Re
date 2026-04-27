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
