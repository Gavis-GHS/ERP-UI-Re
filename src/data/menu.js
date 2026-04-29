export const MenuData = {
  items: [
    { key: 'home', label: '首页', icon: 'home', path: '/home' },
    {
      key: 'delivery', label: '原料送货管理', icon: 'delivery',
      children: [
        { key: 'delivery-purchase-order', label: '采购订单', icon: 'file', path: '/delivery/purchase-order' },
        { key: 'delivery-shipping-notice', label: '发货通知单', icon: 'file', path: '/delivery/shipping-notice' },
        { key: 'delivery-vendor-improvement', label: '厂商改善通知单', icon: 'file', path: '/delivery/vendor-improvement' }
      ]
    },
    {
      key: 'scheduling', label: '排程管理', icon: 'scheduling',
      children: [
        { key: 'scheduling-task-release', label: '任务单发布', icon: 'file', path: '/scheduling/task-release' },
        { key: 'scheduling-machine-schedule', label: '机台排程表', icon: 'file', path: '/scheduling/machine-schedule' },
        { key: 'scheduling-label-query', label: '标签查询', icon: 'file', path: '/scheduling/label-query' }
      ]
    },
    {
      key: 'quotation', label: '报价管理', icon: 'quotation',
      children: [
        { key: 'quotation-manage', label: '报价管理', icon: 'file', path: '/quotation/manage' }
      ]
    },
    {
      key: 'asset-delivery', label: '资产备件送货管理', icon: 'asset-delivery',
      children: [
        { key: 'asset-delivery-purchase-order', label: '采购订单(资产)', icon: 'file', path: '/asset-delivery/purchase-order' },
        { key: 'asset-delivery-shipping-notice', label: '发货通知单(资产)', icon: 'file', path: '/asset-delivery/shipping-notice' }
      ]
    }
  ]
}
