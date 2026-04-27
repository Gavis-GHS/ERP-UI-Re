import { reactive } from 'vue'

// 物料字典
const MATERIALS = [
  { code: '04.01.09.0198', name: '中黄地坪漆（桶）', spec: '油通用' },
  { code: '03.02.05.0102', name: '分切圆刀片', spec: '100*40*2（合金）' },
  { code: '05.01.03.0021', name: 'PLC控制器', spec: 'S7-1200' },
  { code: '06.02.01.0005', name: '不锈钢法兰盘', spec: 'DN100 PN16' },
  { code: '01.01.01.0001', name: 'Q235钢板', spec: '10mm*1500*3000' },
  { code: '02.01.01.0010', name: '深沟球轴承', spec: '6205-2RS' },
  { code: '04.03.02.0008', name: '三角皮带', spec: 'B1880' },
  { code: '03.01.04.0015', name: '液压油', spec: '46# 208L' },
  { code: '05.02.01.0003', name: '温度传感器', spec: 'PT100' },
  { code: '01.02.03.0002', name: '角钢', spec: '50*50*5' },
  { code: '04.05.01.0006', name: '密封圈', spec: 'O型 Φ50' },
  { code: '06.03.01.0004', name: '不锈钢弯头', spec: 'DN25' },
  { code: '02.02.01.0009', name: '齿轮', spec: 'M3 Z20' },
  { code: '08.01.01.0002', name: '电缆', spec: 'RVV 3*2.5' },
  { code: '04.01.02.0011', name: '螺丝', spec: 'M8*30' },
  { code: '05.03.01.0005', name: '变频器', spec: '0.75kW' },
  { code: '01.03.01.0007', name: '铝板', spec: '2mm*1200*2400' },
  { code: '07.02.01.0003', name: '球阀', spec: 'DN50' },
  { code: '03.03.02.0012', name: '砂轮片', spec: 'Φ150' },
  { code: '04.02.01.0016', name: '焊条', spec: 'J422 Φ3.2' }
]

// 伪随机数生成器（确定性）
function seededRandom(seed) {
  let s = seed
  return function () {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

// 请购单主表定义
const ORDER_HEADERS = [
  { status: '已审核', bizType: '备品备件', purchaseType: '按安全库存采购', applicant: '薛宇智', orderType: '材料', consumeTarget: '一号机', purpose: '生活区停车位划线用', docDate: '2026-04-24', requiredDate: '2026-04-30', lineCount: 3 },
  { status: '未审核', bizType: '维护保养', purchaseType: '维护保养', applicant: '张士珠', orderType: '材料', consumeTarget: '二号机', purpose: '设备定期维护保养用', docDate: '2026-04-24', requiredDate: '2026-05-05', lineCount: 2 },
  { status: '已审核', bizType: '设备改造', purchaseType: '设备改造', applicant: '李明', orderType: '建材', consumeTarget: '三号机', purpose: '生产线自动化改造项目', docDate: '2026-04-23', requiredDate: '2026-05-15', lineCount: 5 },
  { status: '未审核', bizType: '加工件', purchaseType: '按订单采购', applicant: '王工', orderType: '材料', consumeTarget: '四号机', purpose: '管道安装工程用', docDate: '2026-04-23', requiredDate: '2026-05-10', lineCount: 8 },
  { status: '已作废', bizType: '原材料', purchaseType: '按安全库存采购', applicant: '赵工', orderType: '材料', consumeTarget: '五号机', purpose: '结构件生产备料', docDate: '2026-04-22', requiredDate: '2026-05-05', lineCount: 1 },
  { status: '已审核', bizType: '备品备件', purchaseType: '按安全库存采购', applicant: '陈工', orderType: '材料', consumeTarget: '六号机', purpose: '月度备件采购计划', docDate: '2026-04-22', requiredDate: '2026-05-08', lineCount: 10 },
  { status: '未审核', bizType: '维护保养', purchaseType: '维护保养', applicant: '刘主管', orderType: '建材', consumeTarget: '一号机', purpose: '一号机季度维护用', docDate: '2026-04-21', requiredDate: '2026-05-12', lineCount: 4 },
  { status: '已审核', bizType: '设备改造', purchaseType: '设备改造', applicant: '薛宇智', orderType: '材料', consumeTarget: '二号机', purpose: '二号机节能改造项目', docDate: '2026-04-21', requiredDate: '2026-05-20', lineCount: 6 },
  { status: '未审核', bizType: '加工件', purchaseType: '按订单采购', applicant: '李明', orderType: '材料', consumeTarget: '三号机', purpose: '三号机定制工装夹具', docDate: '2026-04-20', requiredDate: '2026-05-18', lineCount: 7 },
  { status: '已审核', bizType: '原材料', purchaseType: '按安全库存采购', applicant: '张士珠', orderType: '材料', consumeTarget: '四号机', purpose: '月度原材料补充', docDate: '2026-04-20', requiredDate: '2026-05-06', lineCount: 3 },
  { status: '未审核', bizType: '备品备件', purchaseType: '按安全库存采购', applicant: '王工', orderType: '建材', consumeTarget: '五号机', purpose: '五号机备件补充', docDate: '2026-04-19', requiredDate: '2026-05-09', lineCount: 9 },
  { status: '已审核', bizType: '维护保养', purchaseType: '维护保养', applicant: '赵工', orderType: '材料', consumeTarget: '六号机', purpose: '六号机润滑油更换', docDate: '2026-04-19', requiredDate: '2026-05-03', lineCount: 2 },
  { status: '未审核', bizType: '加工件', purchaseType: '按订单采购', applicant: '陈工', orderType: '材料', consumeTarget: '一号机', purpose: '一号机非标零件加工', docDate: '2026-04-18', requiredDate: '2026-05-22', lineCount: 10 },
  { status: '已审核', bizType: '设备改造', purchaseType: '设备改造', applicant: '刘主管', orderType: '建材', consumeTarget: '二号机', purpose: '二号机输送系统改造', docDate: '2026-04-18', requiredDate: '2026-05-25', lineCount: 4 },
  { status: '未审核', bizType: '原材料', purchaseType: '按安全库存采购', applicant: '薛宇智', orderType: '材料', consumeTarget: '三号机', purpose: '三号机原料补充', docDate: '2026-04-17', requiredDate: '2026-05-02', lineCount: 6 },
  { status: '已审核', bizType: '备品备件', purchaseType: '按安全库存采购', applicant: '张士珠', orderType: '材料', consumeTarget: '四号机', purpose: '通用备件采购', docDate: '2026-04-17', requiredDate: '2026-05-11', lineCount: 5 },
  { status: '未审核', bizType: '维护保养', purchaseType: '维护保养', applicant: '王工', orderType: '建材', consumeTarget: '五号机', purpose: '五号机防腐处理', docDate: '2026-04-16', requiredDate: '2026-05-14', lineCount: 7 },
  { status: '已审核', bizType: '加工件', purchaseType: '按订单采购', applicant: '李明', orderType: '材料', consumeTarget: '六号机', purpose: '六号机专用配件采购', docDate: '2026-04-16', requiredDate: '2026-05-16', lineCount: 8 }
]

function buildOrders() {
  var rand = seededRandom(42)
  var orders = []
  ORDER_HEADERS.forEach(function(order, idx) {
    var orderSeq = String(400 + idx + 1).slice(-4)
    var orderNo = 'SQ' + order.docDate.replace(/-/g, '') + orderSeq
    var lineCount = order.lineCount
    var usedMaterials = []
    var items = []
    for (var i = 0; i < lineCount; i++) {
      var matIdx = (idx + i * 3) % MATERIALS.length
      while (usedMaterials.indexOf(matIdx) !== -1) {
        matIdx = (matIdx + 1) % MATERIALS.length
      }
      usedMaterials.push(matIdx)
      var mat = MATERIALS[matIdx]
      var qty = Math.round((rand() * 100 + 0.5) * 100) / 100
      // 第i=1条（第2行）和第i=3条（第4行）设为已关闭（全部已下单）
      var closed = (i === 1 || i === 3)
      var ordered = closed ? qty : (rand() > 0.6 ? Math.round(rand() * qty * 100) / 100 : 0)
      var unOrdered = closed ? 0 : Math.round((qty - ordered) * 100) / 100
      items.push({
        id: i + 1,
        materialCode: mat.code,
        materialName: mat.name,
        spec: mat.spec,
        qty: qty,
        ordered: ordered,
        unOrdered: unOrdered,
        lineStatus: unOrdered > 0 ? '开启' : '关闭',
        inventory: Math.round(rand() * 300 * 100) / 100,
        intransit: Math.round(rand() * 50 * 100) / 100,
        unit: ['个', '只', '根', '卷', '台', '套'][i % 6],
        packaging: ['纸箱', '木箱', 'None', '编织袋'][i % 4] === 'None' ? '' : ['纸箱', '木箱', '', '编织袋'][i % 4],
        envRequirement: ['RoHS', 'Reach', '无铅', ''][i % 4],
        remark: i % 3 === 0 ? '' : ('备用物料' + (i + 1))
      })
    }
    orders.push({
      orderNo: orderNo,
      status: order.status,
      bizType: order.bizType,
      purchaseType: order.purchaseType,
      requiredDate: order.requiredDate,
      applicant: order.applicant,
      orderType: order.orderType,
      consumeTarget: order.consumeTarget,
      purpose: order.purpose,
      docDate: order.docDate,
      creator: order.applicant,
      createDate: order.docDate,
      modifier: '',
      modifyDate: '',
      auditor: order.status === '已审核' ? order.applicant : '',
      auditDate: order.status === '已审核' ? order.docDate : '',
      items: items
    })
  })
  return orders
}

const orders = reactive(buildOrders())

export function usePurchaseStore() {
  return { orders }
}

export { MATERIALS }
