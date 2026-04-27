const PurchaseRequisition = {
  name: 'PurchaseRequisition',
  data() {
    return {
      tableData: PurchaseData.list,
      total: PurchaseData.list.length,
      pageSize: 50,
      currentPage: 1,
      showAdvanced: false,
      filters: {
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
      },
      selectedRows: [],
      dialogVisible: false,
      formData: {
        orderType: '',
        consumeTarget: '',
        materialCode: '',
        materialName: '',
        spec: '',
        qty: 1,
        applicant: '',
        docDate: '',
        requiredDate: '',
        purpose: ''
      }
    }
  },
  computed: {
    filteredData() {
      let data = PurchaseData.list
      const f = this.filters
      if (f.auditStatus) {
        data = data.filter(row => row.status === f.auditStatus)
      }
      if (f.materialCode) {
        data = data.filter(row => row.materialCode.includes(f.materialCode))
      }
      if (f.spec) {
        data = data.filter(row => row.spec.includes(f.spec))
      }
      if (f.orderNo) {
        data = data.filter(row => row.orderNo.includes(f.orderNo))
      }
      if (f.applicant) {
        data = data.filter(row => row.applicant.includes(f.applicant))
      }
      if (f.bizType) {
        data = data.filter(row => row.bizType === f.bizType)
      }
      if (f.purchaseType) {
        data = data.filter(row => row.purchaseType === f.purchaseType)
      }
      if (f.orderType) {
        data = data.filter(row => row.orderType === f.orderType)
      }
      return data
    },
    pagedData() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.filteredData.slice(start, start + this.pageSize)
    },
    pagedSpanMap() {
      var data = this.pagedData
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
    }
  },
  methods: {
    handleSearch() {
      this.currentPage = 1
    },
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
    },
    handleAdd() {
      this.formData = {
        orderType: '',
        consumeTarget: '',
        materialCode: '',
        materialName: '',
        spec: '',
        qty: 1,
        applicant: '',
        docDate: '',
        requiredDate: '',
        purpose: ''
      }
      this.dialogVisible = true
    },
    handleSubmitAdd() {
      const now = new Date()
      const y = now.getFullYear()
      const m = String(now.getMonth() + 1).padStart(2, '0')
      const d = String(now.getDate()).padStart(2, '0')
      const newId = PurchaseData.list.length > 0
        ? Math.max(...PurchaseData.list.map(item => item.id)) + 1
        : 1
      const docDate = this.formData.docDate || (y + '-' + m + '-' + d)
      const seq = String(400 + newId).slice(-4)
      const newItem = {
        id: newId,
        status: '未审核',
        bizType: this.formData.bizType || '',
        purchaseType: this.formData.purchaseType || '',
        requiredDate: this.formData.requiredDate,
        applicant: this.formData.applicant,
        orderType: this.formData.orderType,
        consumeTarget: this.formData.consumeTarget,
        purpose: this.formData.purpose,
        docDate: docDate,
        orderNo: 'SQ' + docDate.replace(/-/g, '') + seq,
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
    },
    handlePageChange(page) {
      this.currentPage = page
    },
    handleSizeChange(size) {
      this.pageSize = size
    },
    spanMethod(_ref) {
      var column = _ref.column, rowIndex = _ref.rowIndex
      var mainCols = ['status', 'bizType', 'purchaseType', 'requiredDate', 'applicant', 'orderType', 'consumeTarget', 'purpose', 'docDate', 'orderNo']
      if (mainCols.indexOf(column.property) !== -1) {
        var rowspan = this.pagedSpanMap[rowIndex] || 1
        return { rowspan: rowspan, colspan: 1 }
      }
      return { rowspan: 1, colspan: 1 }
    },
    getStatusType(status) {
      if (status === '已审核') return 'success'
      if (status === '未审核') return 'primary'
      if (status === '已作废') return 'info'
      return 'info'
    }
  },
  template: `
    <div class="content-area pr-content">
      <!-- Card 1: Toolbar + Filters -->
      <el-card shadow="never">
        <!-- Toolbar buttons - modern borderless design -->
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
        </div>

        <el-divider style="margin:8px 0;" />

        <!-- Filters -->
        <el-form label-position="top" size="small" class="pr-filters">
          <el-row :gutter="16">
            <el-col :span="6">
              <el-form-item label="申请日期">
                <el-date-picker v-model="filters.applyDate" type="date" placeholder="选择日期" style="width:100%" value-format="YYYY-MM-DD" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="作废状态">
                <el-select v-model="filters.voidStatus" placeholder="请选择" style="width:100%">
                  <el-option label="正常" value="正常" />
                  <el-option label="作废" value="作废" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="行状态">
                <el-select v-model="filters.lineStatus" placeholder="请选择" style="width:100%">
                  <el-option label="开启" value="开启" />
                  <el-option label="关闭" value="关闭" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="审核状态">
                <el-select v-model="filters.auditStatus" placeholder="请选择" style="width:100%">
                  <el-option label="全部" value="" />
                  <el-option label="已审核" value="已审核" />
                  <el-option label="未审核" value="未审核" />
                </el-select>
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
              <el-form-item label="申请单号">
                <el-input v-model="filters.orderNo" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="申请人">
                <el-input v-model="filters.applicant" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- Advanced Filters -->
          <div v-show="showAdvanced">
            <el-row :gutter="16">
              <el-col :span="6">
                <el-form-item label="订单类型">
                  <el-select v-model="filters.orderType" placeholder="请选择" style="width:100%">
                    <el-option label="全部" value="" />
                    <el-option label="材料" value="材料" />
                    <el-option label="建材" value="建材" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="业务类型">
                  <el-select v-model="filters.bizType" placeholder="请选择" style="width:100%">
                    <el-option label="全部" value="" />
                    <el-option label="备品备件" value="备品备件" />
                    <el-option label="维护保养" value="维护保养" />
                    <el-option label="设备改造" value="设备改造" />
                    <el-option label="加工件" value="加工件" />
                    <el-option label="原材料" value="原材料" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="采购类型">
                  <el-select v-model="filters.purchaseType" placeholder="请选择" style="width:100%">
                    <el-option label="全部" value="" />
                    <el-option label="按安全库存采购" value="按安全库存采购" />
                    <el-option label="按订单采购" value="按订单采购" />
                    <el-option label="维护保养" value="维护保养" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="物料分类">
                  <el-select v-model="filters.materialCategory" placeholder="请选择" style="width:100%">
                    <el-option label="全部" value="" />
                    <el-option label="备品备件" value="备品备件" />
                    <el-option label="原材料" value="原材料" />
                    <el-option label="加工件" value="加工件" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- Actions row: advanced toggle on left, search/reset on right -->
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

      <!-- Card 2: Table (fills remaining space) -->
      <el-card shadow="never" class="pr-table-card">
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
        <div class="pr-pagination">
          <span>共 {{ filteredData.length }} 条</span>
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="filteredData.length"
            layout="total, prev, pager, next, jumper, sizes"
            background
            @current-change="handlePageChange"
            @size-change="handleSizeChange"
          />
        </div>
      </el-card>

      <!-- Dialog -->
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
    </div>
  `
}
