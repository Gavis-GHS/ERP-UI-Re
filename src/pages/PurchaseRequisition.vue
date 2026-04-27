<template>
  <div class="content-area pr-content">
    <!-- Toolbar + Filters -->
    <el-card shadow="never">
      <div class="pr-toolbar">
        <div class="pr-toolbar-group">
          <el-button type="primary" size="small" @click="handleAdd">
            <span v-html="Icons.plus" class="pr-btn-icon"></span>新增
          </el-button>
          <el-button size="small">
            <span v-html="Icons.check" class="pr-btn-icon"></span>审核
          </el-button>
          <el-button size="small">
            <span v-html="Icons.xMark" class="pr-btn-icon"></span>反审核
          </el-button>
          <el-button size="small">
            <span v-html="Icons.trash" class="pr-btn-icon"></span>作废
          </el-button>
          <el-button size="small">
            <span v-html="Icons.undo" class="pr-btn-icon"></span>反作废
          </el-button>
          <el-button size="small">
            <span v-html="Icons.send" class="pr-btn-icon"></span>送审
          </el-button>
          <el-button size="small">
            <span v-html="Icons.undo" class="pr-btn-icon"></span>撤销
          </el-button>
        </div>
        <div class="pr-toolbar-group">
          <el-button size="small">
            <span v-html="Icons.upload" class="pr-btn-icon"></span>导入
          </el-button>
          <el-button size="small">
            <span v-html="Icons.grid" class="pr-btn-icon"></span>合并
          </el-button>
        </div>
        <div class="pr-toolbar-group">
          <el-button size="small">
            <span v-html="Icons.download" class="pr-btn-icon"></span>导出Excel
          </el-button>
          <el-button size="small">
            <span v-html="Icons.fileText" class="pr-btn-icon"></span>导出报表单
          </el-button>
        </div>
        <div class="pr-toolbar-group">
          <el-button size="small">
            <span v-html="Icons.refresh" class="pr-btn-icon"></span>刷新
          </el-button>
          <el-button size="small">
            <span v-html="Icons.recalc" class="pr-btn-icon"></span>重算
          </el-button>
        </div>
        <div class="pr-toolbar-group">
          <el-button type="success" size="small">
            <span v-html="Icons.arrowDown" class="pr-btn-icon"></span>下载
          </el-button>
          <el-button type="success" size="small">
            <span v-html="Icons.fileText" class="pr-btn-icon"></span>模板下载
          </el-button>
        </div>
        <div class="pr-toolbar-group">
          <el-button type="warning" size="small" :disabled="pushSelectedCount === 0" @click="handlePushDown">
            <span v-html="Icons.arrowDown" class="pr-btn-icon"></span>下推 ({{ pushSelectedCount }})
          </el-button>
        </div>
      </div>

      <el-divider style="margin:8px 0;" />

      <el-form label-position="top" size="small" class="pr-filters">
        <el-row :gutter="16">
          <el-col :span="6">
            <el-form-item label="申请日期">
              <el-date-picker v-model="filters.applyDate" type="date" placeholder="选择日期" style="width:100%" value-format="YYYY-MM-DD" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="审核状态">
              <el-select v-model="filters.auditStatus" placeholder="全部" style="width:100%" clearable>
                <el-option label="已审核" value="已审核" />
                <el-option label="未审核" value="未审核" />
                <el-option label="已作废" value="已作废" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="行状态">
              <el-select v-model="filters.lineStatus" style="width:100%">
                <el-option label="全部" value="" />
                <el-option label="开启" value="开启" />
                <el-option label="关闭" value="关闭" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="申请单号">
              <el-input v-model="filters.orderNo" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="6">
            <el-form-item label="物料代码">
              <el-input v-model="filters.materialCode" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="规格型号">
              <el-input v-model="filters.spec" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="申请人">
              <el-input v-model="filters.applicant" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="业务类型">
              <el-select v-model="filters.bizType" placeholder="全部" style="width:100%" clearable>
                <el-option label="备品备件" value="备品备件" />
                <el-option label="维护保养" value="维护保养" />
                <el-option label="设备改造" value="设备改造" />
                <el-option label="加工件" value="加工件" />
                <el-option label="原材料" value="原材料" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <div v-show="showAdvanced">
          <el-row :gutter="16">
            <el-col :span="6">
              <el-form-item label="采购类型">
                <el-select v-model="filters.purchaseType" placeholder="全部" style="width:100%" clearable>
                  <el-option label="按安全库存采购" value="按安全库存采购" />
                  <el-option label="按订单采购" value="按订单采购" />
                  <el-option label="维护保养" value="维护保养" />
                  <el-option label="设备改造" value="设备改造" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="订单类型">
                <el-select v-model="filters.orderType" placeholder="全部" style="width:100%" clearable>
                  <el-option label="材料" value="材料" />
                  <el-option label="建材" value="建材" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="耗用对象">
                <el-select v-model="filters.consumeTarget" placeholder="全部" style="width:100%" clearable>
                  <el-option label="一号机" value="一号机" />
                  <el-option label="二号机" value="二号机" />
                  <el-option label="三号机" value="三号机" />
                  <el-option label="四号机" value="四号机" />
                  <el-option label="五号机" value="五号机" />
                  <el-option label="六号机" value="六号机" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <el-row>
          <el-col :span="24" style="display:flex;align-items:center;gap:6px;">
            <el-button text size="small" @click="showAdvanced = !showAdvanced">
              <span v-html="Icons.chevronDown" class="pr-btn-icon" :style="{ transition: 'transform .2s', transform: showAdvanced ? 'rotate(180deg)' : '' }"></span>
              {{ showAdvanced ? '收起' : '展开' }}高级筛选
            </el-button>
            <div style="margin-left:auto;display:flex;gap:6px;">
              <el-button type="primary" size="small" @click="handleSearch">
                <span v-html="Icons.search" class="pr-btn-icon"></span>查询
              </el-button>
              <el-button size="small" @click="handleReset">
                <span v-html="Icons.close" class="pr-btn-icon"></span>重置
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- Order Cards -->
    <div class="pr-cards">
      <div v-if="pagedData.length === 0" class="pr-empty">
        <p>暂无符合条件的数据</p>
      </div>
      <el-card v-for="order in pagedData" :key="order.orderNo" shadow="never" class="pr-order-card">
        <template #header>
          <div class="order-header">
            <div class="order-header-row">
              <el-tag :type="getStatusType(order.status)" size="small" class="order-status-tag">{{ order.status }}</el-tag>
              <span class="order-no">{{ order.orderNo }}</span>
              <div class="order-header-actions">
                <el-button text size="small" type="info" @click.stop="handleViewOrder(order)">
                  <span v-html="Icons.eye" class="pr-btn-icon"></span>查看
                </el-button>
              </div>
              <span class="order-item-count">共 {{ order.items.length }} 行，
                <span class="line-open">{{ getOpenCount(order) }}开启</span>，
                <span class="line-closed">{{ getClosedCount(order) }}关闭</span>
              </span>
            </div>
            <div class="order-header-meta">
              <span class="meta-item"><i>申请人</i>{{ order.applicant }}</span>
              <span class="meta-item"><i>业务类型</i>{{ order.bizType }}</span>
              <span class="meta-item"><i>采购类型</i>{{ order.purchaseType }}</span>
              <span class="meta-item"><i>耗用对象</i>{{ order.consumeTarget }}</span>
              <span class="meta-item"><i>用途</i>{{ order.purpose }}</span>
              <span class="meta-item"><i>单据日期</i>{{ order.docDate }}</span>
              <span class="meta-item"><i>需求日期</i>{{ order.requiredDate }}</span>
            </div>
          </div>
        </template>
        <el-table
          ref="tableRefs"
          :data="visibleItems(order)"
          border
          stripe
          size="small"
          style="width:100%"
          row-key="id"
          @selection-change="(sel) => onItemSelectionChange(order.orderNo, sel)"
        >
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column label="行状态" width="80" align="center">
            <template #default="scope">
              <el-tag :type="scope.row.lineStatus === '关闭' ? 'info' : 'success'" size="small" effect="plain" style="font-size:12px;">
                {{ scope.row.lineStatus }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#" width="40" align="center" />
          <el-table-column prop="materialCode" label="物料代码" min-width="120" />
          <el-table-column prop="materialName" label="物料名称" show-overflow-tooltip min-width="120" />
          <el-table-column prop="spec" label="规格型号" show-overflow-tooltip min-width="110" />
          <el-table-column prop="qty" label="申购数量" width="80" align="right" />
          <el-table-column prop="ordered" label="已下单" width="70" align="right" />
          <el-table-column prop="unOrdered" label="未下单" width="70" align="right" />
        </el-table>
      </el-card>
    </div>

    <!-- Pagination -->
    <div class="pr-pagination">
      <span>共 {{ filteredData.length }} 单</span>
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 20, 50]"
        :total="filteredData.length"
        layout="total, prev, pager, next, jumper, sizes"
        background
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>

    <!-- Push Down Dialog -->
    <el-dialog v-model="pushDialogVisible" title="请购单下推 — 确认" width="600px">
      <p style="margin-bottom:12px;color:#666;font-size:13px;">以下物料将从请购单下推生成采购订单：</p>
      <el-table :data="pushPreviewItems" border stripe size="small" style="width:100%" max-height="400">
        <el-table-column prop="orderNo" label="源请购单" width="170" />
        <el-table-column prop="materialCode" label="物料代码" min-width="120" />
        <el-table-column prop="materialName" label="物料名称" min-width="120" />
        <el-table-column prop="qty" label="数量" width="70" align="right" />
        <el-table-column prop="unOrdered" label="未下单" width="70" align="right" />
      </el-table>
      <template #footer>
        <el-button @click="pushDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmPushDown">确认下推</el-button>
      </template>
    </el-dialog>

  </div>

  <!-- Form Overlay -->
  <div v-if="formDialogVisible" class="form-overlay">
    <div class="form-overlay-backdrop" @click="formDialogVisible = false"></div>
    <div class="form-overlay-container">
      <div class="form-overlay-header">
        <span class="form-overlay-title">{{ formDialogTitle }}</span>
        <button class="form-overlay-close" @click="formDialogVisible = false">&times;</button>
      </div>
      <div class="form-overlay-body">
        <PurchaseForm
          ref="purchaseFormRef"
          :form-mode="formMode"
          :order="editingOrder"
        />
      </div>
      <div v-if="formMode !== 'view'" class="form-overlay-footer">
        <el-button @click="formDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleFormOverlaySave">保存</el-button>
      </div>
      <div v-else class="form-overlay-footer">
        <el-button v-if="canEditInView" type="primary" @click="handleSwitchToEdit">
          <span v-html="Icons.edit" class="pr-btn-icon"></span>编辑
        </el-button>
        <el-button @click="formDialogVisible = false">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Icons } from '@/data/icons'
import { usePurchaseStore } from '@/data/purchase'
import PurchaseForm from '@/components/PurchaseForm.vue'

const store = usePurchaseStore()

export default {
  name: 'PurchaseRequisition',
  components: { PurchaseForm },
  data() {
    return {
      Icons,
      orders: store.orders,
      pageSize: 10,
      currentPage: 1,
      showAdvanced: false,
      formDialogVisible: false,
      formMode: 'add',
      editingOrder: null,
      filters: {
        applyDate: '',
        auditStatus: '',
        lineStatus: '开启',
        materialCode: '',
        spec: '',
        orderNo: '',
        applicant: '',
        orderType: '',
        bizType: '',
        purchaseType: '',
        consumeTarget: ''
      },
      pushDialogVisible: false,
      pushPreviewItems: [],
      _selectedMap: {}
    }
  },
  computed: {
    formDialogTitle() {
      if (this.formMode === 'add') return '新增请购单'
      if (this.formMode === 'view') return '查看请购单'
      return '编辑请购单'
    },
    filteredData() {
      let data = this.orders
      const f = this.filters
      if (f.auditStatus) {
        data = data.filter(o => o.status === f.auditStatus)
      }
      if (f.orderNo) {
        data = data.filter(o => o.orderNo.includes(f.orderNo))
      }
      if (f.applicant) {
        data = data.filter(o => o.applicant.includes(f.applicant))
      }
      if (f.bizType) {
        data = data.filter(o => o.bizType === f.bizType)
      }
      if (f.purchaseType) {
        data = data.filter(o => o.purchaseType === f.purchaseType)
      }
      if (f.orderType) {
        data = data.filter(o => o.orderType === f.orderType)
      }
      if (f.consumeTarget) {
        data = data.filter(o => o.consumeTarget === f.consumeTarget)
      }
      if (f.applyDate) {
        data = data.filter(o => o.docDate === f.applyDate)
      }
      if (f.materialCode) {
        const q = f.materialCode
        data = data.filter(o => o.items.some(item => item.materialCode.includes(q)))
      }
      if (f.spec) {
        const q = f.spec
        data = data.filter(o => o.items.some(item => item.spec.includes(q)))
      }
      // lineStatus filter: filter at order level (orders that have matching items)
      if (f.lineStatus) {
        data = data.filter(o => o.items.some(item => item.lineStatus === f.lineStatus))
      }
      return data
    },
    pagedData() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.filteredData.slice(start, start + this.pageSize)
    },
    pushSelectedCount() {
      return Object.keys(this._selectedMap).length
    },
    canEditInView() {
      return this.editingOrder && this.editingOrder.status !== '已审核'
    }
  },
  methods: {
    visibleItems(order) {
      const ls = this.filters.lineStatus
      if (!ls) return order.items
      return order.items.filter(item => item.lineStatus === ls)
    },
    getOpenCount(order) {
      return order.items.filter(i => i.lineStatus === '开启').length
    },
    getClosedCount(order) {
      return order.items.filter(i => i.lineStatus === '关闭').length
    },
    onItemSelectionChange(orderNo, selection) {
      // clear old selections for this order
      for (const key of Object.keys(this._selectedMap)) {
        if (key.startsWith(orderNo + '-')) delete this._selectedMap[key]
      }
      // record current selections
      for (const item of selection) {
        this._selectedMap[orderNo + '-' + item.id] = { orderNo, item }
      }
    },
    handleSearch() {
      this.currentPage = 1
    },
    handleReset() {
      this.filters = {
        applyDate: '',
        auditStatus: '',
        lineStatus: '开启',
        materialCode: '',
        spec: '',
        orderNo: '',
        applicant: '',
        orderType: '',
        bizType: '',
        purchaseType: '',
        consumeTarget: ''
      }
      this.currentPage = 1
      this._selectedMap = {}
    },
    handleAdd() {
      this.formMode = 'add'
      this.editingOrder = null
      this.formDialogVisible = true
    },
    handleViewOrder(order) {
      this.formMode = 'view'
      this.editingOrder = order
      this.formDialogVisible = true
    },
    handleSwitchToEdit() {
      this.formMode = 'edit'
    },
    handleFormOverlaySave() {
      const formRef = this.$refs.purchaseFormRef
      if (!formRef || !formRef.getFormData) return
      this.handleFormSave(formRef.getFormData())
    },
    handleFormSave(formData) {
      if (this.formMode === 'add') {
        const now = new Date()
        const y = now.getFullYear()
        const m = String(now.getMonth() + 1).padStart(2, '0')
        const d = String(now.getDate()).padStart(2, '0')
        const docDate = formData.docDate || (y + '-' + m + '-' + d)
        const newId = this.orders.length > 0
          ? Math.max(...this.orders.map(o => parseInt(o.orderNo.slice(-4), 10))) + 1
          : 1
        const seq = String(400 + newId).slice(-4)
        const orderNo = 'SQ' + docDate.replace(/-/g, '') + seq
        this.orders.push({
          orderNo: orderNo,
          status: '未审核',
          bizType: formData.bizType || '',
          purchaseType: formData.purchaseType || '',
          requiredDate: formData.requiredDate,
          applicant: formData.applicant,
          orderType: formData.orderType,
          consumeTarget: formData.consumeTarget,
          purpose: formData.purpose,
          docDate: docDate,
          creator: formData.applicant || '',
          createDate: docDate,
          modifier: '',
          modifyDate: '',
          auditor: '',
          auditDate: '',
          items: formData.items.map((item, idx) => ({
            id: idx + 1,
            materialCode: item.materialCode,
            materialName: item.materialName,
            spec: item.spec,
            qty: item.qty || 0,
            ordered: 0,
            unOrdered: item.qty || 0,
            lineStatus: item.qty > 0 ? '开启' : '关闭',
            inventory: item.inventory || 0,
            intransit: item.intransit || 0,
            unit: item.unit || '个',
            packaging: item.packaging || '',
            envRequirement: item.envRequirement || '',
            remark: item.remark || ''
          }))
        })
      } else {
        // Edit mode - update in-place
        const order = this.orders.find(o => o.orderNo === formData.orderNo)
        if (order) {
          order.bizType = formData.bizType
          order.purchaseType = formData.purchaseType
          order.requiredDate = formData.requiredDate
          order.applicant = formData.applicant
          order.orderType = formData.orderType
          order.consumeTarget = formData.consumeTarget
          order.purpose = formData.purpose
          order.modifier = formData.modifier
          order.modifyDate = formData.modifyDate
          order.auditor = formData.auditor
          order.auditDate = formData.auditDate
          order.items.splice(0, order.items.length, ...formData.items.map((item, idx) => ({
            id: idx + 1,
            materialCode: item.materialCode,
            materialName: item.materialName,
            spec: item.spec,
            qty: item.qty || 0,
            ordered: item.ordered || 0,
            unOrdered: item.unOrdered ?? (item.qty || 0),
            lineStatus: item.lineStatus || (item.qty > 0 ? '开启' : '关闭'),
            inventory: item.inventory || 0,
            intransit: item.intransit || 0,
            unit: item.unit || '个',
            packaging: item.packaging || '',
            envRequirement: item.envRequirement || '',
            remark: item.remark || ''
          })))
        }
      }
      this.formDialogVisible = false
      this._selectedMap = {}
    },
    handlePushDown() {
      const entries = Object.values(this._selectedMap)
      if (entries.length === 0) return
      this.pushPreviewItems = entries.map(e => ({
        orderNo: e.orderNo,
        materialCode: e.item.materialCode,
        materialName: e.item.materialName,
        qty: e.item.qty,
        unOrdered: e.item.unOrdered
      }))
      this.pushDialogVisible = true
    },
    confirmPushDown() {
      for (const { orderNo, item } of Object.values(this._selectedMap)) {
        const order = this.orders.find(o => o.orderNo === orderNo)
        if (!order) continue
        const target = order.items.find(i => i.id === item.id)
        if (target) {
          target.ordered = target.qty
          target.unOrdered = 0
          target.lineStatus = '关闭'
        }
      }
      this._selectedMap = {}
      this.pushDialogVisible = false
      this.$message.success('下推成功，已生成采购订单')
    },
    handlePageChange(page) {
      this.currentPage = page
    },
    handleSizeChange(size) {
      this.pageSize = size
    },
    getStatusType(status) {
      if (status === '已审核') return 'success'
      if (status === '未审核') return 'primary'
      if (status === '已作废') return 'info'
      return 'info'
    }
  }
}
</script>

<style scoped>
.pr-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.pr-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0;
}
.pr-toolbar-group {
  display: flex;
  align-items: center;
  gap: 2px;
  padding-right: 8px;
}
.pr-toolbar-group + .pr-toolbar-group {
  padding-left: 8px;
  border-left: 1px solid #e8e8e8;
}
.pr-toolbar .el-button--small {
  border: none !important;
  background: transparent !important;
  border-radius: 6px !important;
  color: #333;
  font-weight: 450;
  transition: all 0.15s ease;
}
.pr-toolbar .el-button--small:hover {
  background: #eef2f7 !important;
  color: #409eff;
}
.pr-toolbar .el-button--primary {
  background: #409eff !important;
  color: #fff !important;
}
.pr-toolbar .el-button--primary:hover {
  background: #5aafff !important;
  color: #fff !important;
}
.pr-toolbar .el-button--success {
  background: #67c23a !important;
  color: #fff !important;
}
.pr-toolbar .el-button--success:hover {
  background: #7bcf52 !important;
  color: #fff !important;
}
.pr-toolbar .el-button--warning {
  background: #e6a23c !important;
  color: #fff !important;
}
.pr-toolbar .el-button--warning:hover {
  background: #ebb563 !important;
  color: #fff !important;
}
.pr-toolbar .el-button--warning.is-disabled {
  background: #f5d7a5 !important;
  color: #fff !important;
}
.pr-filters .el-form-item {
  margin-bottom: 6px;
}
.pr-filters .el-form-item__label {
  font-size: 13px;
  color: #606266;
  padding-bottom: 2px;
}

/* Order Cards */
.pr-cards {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  padding-bottom: 4px;
}
.pr-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: #999;
  font-size: 14px;
}
.pr-order-card {
  flex-shrink: 0;
}
.pr-order-card .el-card__header {
  padding: 10px 14px;
  border-bottom: 1px solid #e4e7ed;
  background: #fafbfc;
}
.pr-order-card .el-card__body {
  padding: 0;
}

/* Order Header */
.order-header-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.order-status-tag {
  flex-shrink: 0;
}
.order-no {
  font-size: 14px;
  font-weight: 600;
  color: #1a202c;
  letter-spacing: 0.5px;
}
.order-item-count {
  margin-left: auto;
  font-size: 12px;
  color: #999;
  font-weight: 400;
}
.line-open { color: #e6a23c; }
.line-closed { color: #909399; }
.order-header-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 20px;
  font-size: 12px;
  color: #666;
}
.meta-item i {
  font-style: normal;
  color: #999;
  margin-right: 4px;
}

/* Override inner table */
.pr-order-card .el-table__header-wrapper th.el-table__cell {
  background: #f5f7fa;
  color: #606266;
  font-weight: 600;
  font-size: 12px;
  padding: 4px 0;
}
.pr-order-card .el-table__body td.el-table__cell {
  padding: 4px 0;
  font-size: 12px;
}
.pr-order-card .el-table--border .el-table__cell {
  border-right: 1px solid #ebeef5;
}

/* Pagination */
.pr-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 4px;
  flex-shrink: 0;
}
.pr-btn-icon {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  margin-right: 3px;
}
.pr-btn-icon svg {
  display: block;
}

/* Form overlay */
.form-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.form-overlay-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 2000;
}
.form-overlay-container {
  position: relative;
  z-index: 2001;
  width: min(1300px, 95vw);
  max-height: 94vh;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.form-overlay-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid #e4e7ed;
  flex-shrink: 0;
}
.form-overlay-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a202c;
}
.form-overlay-close {
  border: none;
  background: none;
  font-size: 22px;
  color: #909399;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
}
.form-overlay-close:hover {
  color: #606266;
}
.form-overlay-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
}
.form-overlay-footer {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 12px 20px;
  border-top: 1px solid #e4e7ed;
  flex-shrink: 0;
}
.form-overlay-footer .el-button {
  min-width: 100px;
}
</style>
