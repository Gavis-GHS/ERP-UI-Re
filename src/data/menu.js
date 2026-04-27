export const MenuData = {
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
        {
          key: 'purchase-process', label: '采购流程',
          children: [
            { key: 'purchase-requisition', label: '请购单', icon: 'file', path: '/purchase/requisition' },
            { key: 'purchase-inquiry', label: '询价单', icon: 'file', path: '/purchase/inquiry' },
            { key: 'purchase-inquiry-supplier', label: '询价单(供应商)', icon: 'file', path: '/purchase/inquiry-supplier' },
            { key: 'purchase-order', label: '采购单', icon: 'file', path: '/purchase/order' }
          ]
        },
        {
          key: 'purchase-common', label: '共用',
          children: [
            { key: 'purchase-supplier', label: '供应商管理', icon: 'file', path: '/purchase/supplier' },
            { key: 'purchase-safety-stock', label: '安全库存', icon: 'file', path: '/purchase/safety-stock' },
            { key: 'purchase-contract', label: '合同管理', icon: 'file', path: '/purchase/contract' },
            { key: 'purchase-material', label: '采购物料维护', icon: 'file', path: '/purchase/material' },
            { key: 'purchase-order-ledger', label: '采购订单台账', icon: 'file', path: '/purchase/order-ledger' },
            { key: 'purchase-daily-calculation', label: '采购日核算表', icon: 'file', path: '/purchase/daily-calculation' },
            { key: 'purchase-revoked-supplier', label: '撤销供应商名录台账', icon: 'file', path: '/purchase/revoked-supplier' },
            { key: 'purchase-qualified-supplier', label: '原材料合格供应商台账', icon: 'file', path: '/purchase/qualified-supplier' },
            { key: 'purchase-vendor-improvement', label: '厂商改善通知单台账', icon: 'file', path: '/purchase/vendor-improvement' },
            { key: 'purchase-unit-price', label: '标准单价管理', icon: 'file', path: '/purchase/unit-price' },
            { key: 'purchase-payment', label: '付款申请(采购)', icon: 'file', path: '/purchase/payment' },
            { key: 'purchase-entrusted-processing', label: '受托加工结算表', icon: 'file', path: '/purchase/entrusted-processing' }
          ]
        },
        {
          key: 'purchase-notice', label: '通知单',
          children: [
            { key: 'purchase-receiving-notice', label: '收料通知单', icon: 'file', path: '/purchase/receiving-notice' },
            { key: 'purchase-other-inbound', label: '其它通知单(入库)', icon: 'file', path: '/purchase/other-inbound' },
            { key: 'purchase-return-notice', label: '退货通知单', icon: 'file', path: '/purchase/return-notice' },
            { key: 'purchase-other-outbound', label: '其它通知单(出库)', icon: 'file', path: '/purchase/other-outbound' },
            { key: 'purchase-payment-plan', label: '采购付款计划', icon: 'file', path: '/purchase/payment-plan' }
          ]
        }
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
