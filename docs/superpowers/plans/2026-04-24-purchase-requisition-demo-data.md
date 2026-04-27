# 请购单演示数据重构 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将请购单页面从扁平数据结构重构为"主表+明细表"分组结构，使用 el-table 的 span-method 实现主表属性合并单元格，明细表不合并，并调整列宽。

**Architecture:** 数据层面按请购单单号分组，每个单号下 1-10 条物料明细，展平为数组传入表格。表格使用 pre-computed spanMap 控制合并行为。筛选功能基于展平数据仍然工作。

**Tech Stack:** Vue 3 (CDN), Element Plus, Vanilla JS

---

### Task 1: 重构 purchase.js 演示数据

**Files:**
- Modify: `/Users/gavis/vue-project/js/data/purchase.js` (full rewrite)

- [ ] **Step 1: 替换 purchase.js 全部内容为新数据模型**

数据结构变更：从纯扁平列表改为按请购单分组的展平列表。定义 18 个请购单，每个带 1-10 条明细，合计 ~100 条。

写入以下内容：

```js
var PurchaseData = {
  total: 0,
  list: []
};

// 物料字典
var MATERIALS = [
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
];

// 请购单主表定义
var ORDER_HEADERS = [
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
];

// 生成展平数据
(function generateData() {
  var id = 0;
  var list = [];
  ORDER_HEADERS.forEach(function(order, idx) {
    var orderSeq = String(400 + idx + 1).slice(-4);
    var orderNo = 'SQ' + order.docDate.replace(/-/g, '') + orderSeq;
    var lineCount = order.lineCount;
    // 确保不超出物料字典范围
    var usedMaterials = [];
    for (var i = 0; i < lineCount; i++) {
      id++;
      // 循环取物料，避免重复取同一个
      var matIdx = (idx + i * 3) % MATERIALS.length;
      // 如果物料已经用过，换个位置
      while (usedMaterials.indexOf(matIdx) !== -1) {
        matIdx = (matIdx + 1) % MATERIALS.length;
      }
      usedMaterials.push(matIdx);
      var mat = MATERIALS[matIdx];
      var qty = Math.round((Math.random() * 100 + 0.5) * 100) / 100;
      var ordered = Math.random() > 0.6 ? Math.round(Math.random() * qty * 100) / 100 : 0;
      var unOrdered = Math.round((qty - ordered) * 100) / 100;
      list.push({
        id: id,
        status: order.status,
        bizType: order.bizType,
        purchaseType: order.purchaseType,
        requiredDate: order.requiredDate,
        applicant: order.applicant,
        orderType: order.orderType,
        consumeTarget: order.consumeTarget,
        purpose: order.purpose,
        docDate: order.docDate,
        orderNo: orderNo,
        materialCode: mat.code,
        materialName: mat.name,
        spec: mat.spec,
        qty: qty,
        ordered: ordered,
        unOrdered: unOrdered
      });
    }
  });
  PurchaseData.list = list;
  PurchaseData.total = list.length;
})();
```

- [ ] **Step 2: 验证数据生成正确**

Run: `node -e "var fs=require('fs');eval(fs.readFileSync('/Users/gavis/vue-project/js/data/purchase.js','utf8'));console.log('Total:',PurchaseData.total);console.log('Orders:',new Set(PurchaseData.list.map(r=>r.orderNo)).size);console.log('First item:',JSON.stringify(PurchaseData.list[0]));"`
Expected: Total ~100, Orders ~18, First item has all new fields

---

### Task 2: 更新 purchase-requisition.js 表格组件

**Files:**
- Modify: `/Users/gavis/vue-project/js/pages/purchase-requisition.js`

变更内容：
1. 添加 span-method 逻辑和 spanMap 计算
2. 调整表格列：添加新列，移除旧列，重新排序列顺序，调整列宽
3. 保持筛选功能正常运行（在 filteredData 基础上计算 spanMap）
4. 更新新增请购单表单（移除不再使用字段）

- [ ] **Step 1: 在 data() 中添加 spanMap 计算函数**

在 `data()` 的 `return` 对象中添加 `spanMap: {}`，添加 `computed` 中的 `spanMap` 计算：

找到 `computed` 中的 `pagedData`，在其后添加 `filteredSpanMap`：

```js
computed: {
  filteredData() {
    // ...现有逻辑不变
  },
  filteredSpanMap() {
    var data = this.filteredData
    var map = {}
    var pos = 0
    while (pos < data.length) {
      var currentNo = data[pos].orderNo
      var count = 1
      while (pos + count < data.length && data[pos + count].orderNo === currentNo) {
        count++
      }
      for (var i = 0; i < count; i++) {
        map[pos + i] = i === 0 ? count : 0
      }
      pos += count
    }
    return map
  },
  pagedData() {
    var start = (this.currentPage - 1) * this.pageSize
    return this.filteredData.slice(start, start + this.pageSize)
  }
}
```

- [ ] **Step 2: 添加 spanMethod 方法**

在 `methods` 中添加：

```js
spanMethod(column) {
  // 主表字段列表（需合并列）
  var mainCols = ['status', 'bizType', 'purchaseType', 'requiredDate', 'applicant', 'orderType', 'consumeTarget', 'purpose', 'docDate', 'orderNo']
  if (mainCols.indexOf(column.property) !== -1) {
    // 先根据 columnIndex 判断是否在列范围之内 (1=selection列, 0=index列)
    // 注意：表格中 index 列和 selection 列也可能被传入
    // 对于这些特殊列，不做合并
    if (column.property === undefined) return { rowspan: 1, colspan: 1 }
    var absoluteIndex = this.pagedData.length > 0 ? this.pagedData.indexOf(this.pagedData.filter(function(r) { return true; }).slice(0, column.columnIndex)[0]) : 0
    // 使用 filteredSpanMap 通过 row 的 id 定位
    // 实际传入的是 { row, column, rowIndex, columnIndex }
    return { rowspan: 1, colspan: 1 }
  }
  return { rowspan: 1, colspan: 1 }
}
```

Wait — Element Plus 的 span-method 回调签名是 `({ row, column, rowIndex, columnIndex })`，不是传入 column 参数。让我重新写这个：

```js
spanMethod(_ref) {
  var row = _ref.row, column = _ref.column, rowIndex = _ref.rowIndex, columnIndex = _ref.columnIndex;
  // 主表字段列表（需合并列）
  var mainCols = ['status', 'bizType', 'purchaseType', 'requiredDate', 'applicant', 'orderType', 'consumeTarget', 'purpose', 'docDate', 'orderNo'];
  var prop = column.property;
  if (mainCols.indexOf(prop) !== -1) {
    var rowspan = this.filteredSpanMap[rowIndex] || 1;
    return { rowspan: rowspan, colspan: 1 };
  }
  return { rowspan: 1, colspan: 1 };
}
```

- [ ] **Step 3: 替换表格列定义**

将模板中 `<el-table>` 内的所有 `<el-table-column>` 替换为新的列定义：

```html
<el-table ref="prTable" :data="pagedData" border stripe style="width:100%" :span-method="spanMethod" @selection-change="selectedRows = $event">
  <el-table-column type="index" label="序号" width="60" align="center" />
  <el-table-column type="selection" width="50" align="center" />
  <el-table-column label="审核状态" width="90">
    <template #default="scope">
      <el-tag :type="getStatusType(scope.row.status)" size="small">{{ scope.row.status }}</el-tag>
    </template>
  </el-table-column>
  <el-table-column prop="bizType" label="业务类型" min-width="100" />
  <el-table-column prop="purchaseType" label="采购类型" min-width="130" />
  <el-table-column prop="requiredDate" label="需求日期" width="110" align="center" />
  <el-table-column prop="applicant" label="申请人" width="90" />
  <el-table-column prop="orderType" label="订单类型" width="80" />
  <el-table-column prop="consumeTarget" label="耗用对象" width="90" />
  <el-table-column prop="purpose" label="用途" show-overflow-tooltip min-width="140" />
  <el-table-column prop="docDate" label="单据日期" width="110" align="center" />
  <el-table-column prop="orderNo" label="申请单号" min-width="150" />
  <el-table-column prop="materialCode" label="物料代码" min-width="120" />
  <el-table-column prop="materialName" label="物料名称" show-overflow-tooltip min-width="130" />
  <el-table-column prop="spec" label="规格型号" min-width="120" />
  <el-table-column prop="qty" label="申购数量" width="90" align="right" />
  <el-table-column prop="ordered" label="已下单量" width="90" align="right" />
  <el-table-column prop="unOrdered" label="未下单量" width="90" align="right" />
</el-table>
```

- [ ] **Step 4: 更新新增请购单表单（移除多余字段并添加新字段）**

将模板中 `<el-dialog>` 内的表单替换为：

```html
<el-dialog v-model="dialogVisible" title="新增请购单" width="500px">
  <el-form label-width="80px">
    <el-form-item label="订单类型">
      <el-select v-model="formData.orderType" style="width:100%">
        <el-option label="材料" value="材料" />
        <el-option label="建材" value="建材" />
      </el-select>
    </el-form-item>
    <el-form-item label="耗用对象">
      <el-select v-model="formData.consumeTarget" style="width:100%">
        <el-option label="一号机" value="一号机" />
        <el-option label="二号机" value="二号机" />
        <el-option label="三号机" value="三号机" />
        <el-option label="四号机" value="四号机" />
        <el-option label="五号机" value="五号机" />
        <el-option label="六号机" value="六号机" />
      </el-select>
    </el-form-item>
    <el-form-item label="物料代码">
      <el-input v-model="formData.materialCode" />
    </el-form-item>
    <el-form-item label="物料名称">
      <el-input v-model="formData.materialName" />
    </el-form-item>
    <el-form-item label="规格型号">
      <el-input v-model="formData.spec" />
    </el-form-item>
    <el-form-item label="申购数量">
      <el-input-number v-model="formData.qty" :min="1" />
    </el-form-item>
    <el-form-item label="申请人">
      <el-input v-model="formData.applicant" />
    </el-form-item>
    <el-form-item label="单据日期">
      <el-date-picker v-model="formData.docDate" type="date" placeholder="选择日期" style="width:100%" value-format="YYYY-MM-DD" />
    </el-form-item>
    <el-form-item label="需求日期">
      <el-date-picker v-model="formData.requiredDate" type="date" placeholder="选择日期" style="width:100%" value-format="YYYY-MM-DD" />
    </el-form-item>
    <el-form-item label="用途">
      <el-input v-model="formData.purpose" type="textarea" />
    </el-form-item>
  </el-form>
  <template #footer>
    <el-button @click="dialogVisible = false">取消</el-button>
    <el-button type="primary" @click="handleSubmitAdd">确认</el-button>
  </template>
</el-dialog>
```

- [ ] **Step 5: 更新 handleSubmitAdd 方法**

```js
handleSubmitAdd() {
  var newId = PurchaseData.list.length > 0
    ? Math.max.apply(Math, PurchaseData.list.map(function(item) { return item.id })) + 1
    : 1
  var newItem = {
    id: newId,
    status: '未审核',
    bizType: this.formData.bizType || '',
    purchaseType: this.formData.purchaseType || '',
    requiredDate: this.formData.requiredDate,
    applicant: this.formData.applicant,
    orderType: this.formData.orderType,
    consumeTarget: this.formData.consumeTarget,
    purpose: this.formData.purpose,
    docDate: this.formData.docDate,
    orderNo: '',
    materialCode: this.formData.materialCode,
    materialName: this.formData.materialName,
    spec: this.formData.spec,
    qty: this.formData.qty || 0,
    ordered: 0,
    unOrdered: this.formData.qty || 0
  }
  PurchaseData.list.push(newItem)
  this.total = PurchaseData.list.length
  this.dialogVisible = false
}
```

- [ ] **Step 6: 更新 handleReset 方法中的 filters 默认值**

```js
handleReset() {
  this.filters = {
    applyDate: '',
    voidStatus: '正常',
    lineStatus: '开启',
    auditStatus: '',
    materialCode: '',
    spec: '',
    orderNo: '',
    applicant: '',
    orderType: '',
    bizType: '',
    purchaseType: '',
    materialCategory: ''
  }
  this.currentPage = 1
}
```

- [ ] **Step 7: 验证页面加载正常**

Run: `python3 -m http.server 8080 --directory /Users/gavis/vue-project` 然后打开浏览器访问。

手动检查：
- 表格列显示正确（主表字段合并、明细字段不合并）
- 分页功能正常
- 筛选功能正常
- 新增请购单功能正常
