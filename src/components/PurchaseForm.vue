<template>
  <div class="purchase-form">
    <div class="form-body">
      <div v-if="formData.status === '已审核'" class="form-readonly-tag" style="margin-bottom:8px;">已审核，只读</div>
      <!-- Header Fields -->
      <el-card shadow="never">
        <el-form label-position="top" size="small" class="form-fields">
          <el-row :gutter="16">
            <el-col :span="6">
              <el-form-item label="申请单号">
                <el-input v-model="formData.orderNo" :disabled="true" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="需求日期">
                <el-date-picker v-model="formData.requiredDate" type="date" :disabled="isReadonly" style="width:100%" value-format="YYYY-MM-DD" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="申请人">
                <el-input v-model="formData.applicant" :disabled="isReadonly" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="订单类型">
                <el-select v-model="formData.orderType" :disabled="isReadonly" style="width:100%" placeholder="请选择">
                  <el-option label="材料" value="材料" />
                  <el-option label="建材" value="建材" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="6">
              <el-form-item label="业务类型">
                <el-select v-model="formData.bizType" :disabled="isReadonly" style="width:100%" placeholder="请选择">
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
                <el-select v-model="formData.purchaseType" :disabled="isReadonly" style="width:100%" placeholder="请选择">
                  <el-option label="按安全库存采购" value="按安全库存采购" />
                  <el-option label="按订单采购" value="按订单采购" />
                  <el-option label="维护保养" value="维护保养" />
                  <el-option label="设备改造" value="设备改造" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="耗用对象">
                <el-select v-model="formData.consumeTarget" :disabled="isReadonly" style="width:100%" placeholder="请选择">
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
        </el-form>
      </el-card>

      <!-- Item Toolbar -->
      <div class="item-toolbar">
        <el-button size="small" type="primary" :disabled="isReadonly" @click="addItem">
          <span v-html="Icons.plus" class="pr-btn-icon"></span>添加物料
        </el-button>
        <el-button size="small" :disabled="isReadonly">复制</el-button>
        <el-button size="small" :disabled="isReadonly">批量编辑</el-button>
        <span class="item-count">共 {{ formData.items.length }} 行</span>
      </div>

      <!-- Item Table -->
      <el-card shadow="never" class="item-table-card">
        <div class="item-table-wrap">
          <el-table
            :data="formData.items"
            border
            stripe
            size="small"
            style="width:100%"
            row-key="tempId"
          >
            <el-table-column label="操作" width="44" align="center">
              <template #default="scope">
                <el-button
                  text
                  type="danger"
                  size="small"
                  :disabled="isReadonly"
                  @click="removeItem(scope.$index)"
                  style="font-size:16px;padding:0;"
                >×</el-button>
              </template>
            </el-table-column>
            <el-table-column label="物料代码" min-width="110">
              <template #default="scope">
                <el-input v-model="scope.row.materialCode" :disabled="isReadonly" size="small" placeholder="自动或手动" />
              </template>
            </el-table-column>
            <el-table-column label="物料名称" min-width="110">
              <template #default="scope">
                <el-input v-model="scope.row.materialName" :disabled="isReadonly" size="small" placeholder="请输入" />
              </template>
            </el-table-column>
            <el-table-column label="规格型号" min-width="100">
              <template #default="scope">
                <el-input v-model="scope.row.spec" :disabled="isReadonly" size="small" placeholder="请输入" />
              </template>
            </el-table-column>
            <el-table-column label="申购数量" width="110" align="right">
              <template #default="scope">
                <el-input-number v-model="scope.row.qty" :disabled="isReadonly" size="small" :min="0" :max="99999" :precision="2" controls-position="right" class="pr-qty-input" />
              </template>
            </el-table-column>
            <el-table-column label="库存量" width="70" align="right">
              <template #default="scope">
                <span>{{ scope.row.inventory ?? '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="在途量" width="70" align="right">
              <template #default="scope">
                <span>{{ scope.row.intransit ?? '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="单位" width="75" align="center">
              <template #default="scope">
                <el-select v-model="scope.row.unit" :disabled="isReadonly" size="small" placeholder="个">
                  <el-option label="个" value="个" />
                  <el-option label="只" value="只" />
                  <el-option label="根" value="根" />
                  <el-option label="卷" value="卷" />
                  <el-option label="台" value="台" />
                  <el-option label="套" value="套" />
                  <el-option label="kg" value="kg" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="包装方式" width="110">
              <template #default="scope">
                <el-select v-model="scope.row.packaging" :disabled="isReadonly" size="small" placeholder="无" clearable>
                  <el-option label="纸箱" value="纸箱" />
                  <el-option label="木箱" value="木箱" />
                  <el-option label="编织袋" value="编织袋" />
                  <el-option label="桶装" value="桶装" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="环保要求" width="105">
              <template #default="scope">
                <el-select v-model="scope.row.envRequirement" :disabled="isReadonly" size="small" placeholder="无" clearable>
                  <el-option label="RoHS" value="RoHS" />
                  <el-option label="Reach" value="Reach" />
                  <el-option label="无铅" value="无铅" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="备注" min-width="100">
              <template #default="scope">
                <el-input v-model="scope.row.remark" :disabled="isReadonly" size="small" placeholder="请输入" />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>

      <!-- 用途 -->
      <el-card shadow="never" class="purpose-card">
        <el-form label-position="top" size="small">
          <el-form-item label="用途">
            <el-input v-model="formData.purpose" type="textarea" :disabled="isReadonly" :rows="2" placeholder="请输入请购用途说明" />
          </el-form-item>
        </el-form>
      </el-card>

      <!-- Footer: audit trail -->
      <el-card shadow="never" class="footer-card">
        <el-row :gutter="16" class="audit-row">
          <el-col :span="4"><span class="audit-label">创建人</span><span class="audit-value">{{ formData.creator || formData.applicant }}</span></el-col>
          <el-col :span="4"><span class="audit-label">创建日期</span><span class="audit-value">{{ formData.createDate || formData.docDate }}</span></el-col>
          <el-col :span="4">
            <el-form-item label="修改人" class="audit-form-item">
              <el-input v-model="formData.modifier" :disabled="isReadonly" size="small" placeholder="-" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="修改日期" class="audit-form-item">
              <el-date-picker v-model="formData.modifyDate" type="date" :disabled="isReadonly" style="width:100%" value-format="YYYY-MM-DD" placeholder="-" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="审核人" class="audit-form-item">
              <el-input v-model="formData.auditor" :disabled="isReadonly" size="small" placeholder="-" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="审核日期" class="audit-form-item">
              <el-date-picker v-model="formData.auditDate" type="date" :disabled="isReadonly" style="width:100%" value-format="YYYY-MM-DD" placeholder="-" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue'
import { Icons } from '@/data/icons'

const props = defineProps({
  formMode: { type: String, default: 'add' },
  order: { type: Object, default: null }
})

const isReadonly = computed(() => props.formMode === 'view' || props.formData?.status === '已审核')

const emptyItem = () => ({
  tempId: Date.now() + Math.random(),
  materialCode: '',
  materialName: '',
  spec: '',
  qty: 0,
  inventory: 0,
  intransit: 0,
  unit: '个',
  packaging: '',
  envRequirement: '',
  remark: '',
  ordered: 0,
  unOrdered: 0,
  lineStatus: '开启'
})

const makeFormData = (order) => {
  if (!order) {
    const now = new Date()
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, '0')
    const d = String(now.getDate()).padStart(2, '0')
    return {
      orderNo: '（自动生成）',
      status: '未审核',
      bizType: '',
      purchaseType: '',
      requiredDate: '',
      applicant: '',
      orderType: '',
      consumeTarget: '',
      purpose: '',
      docDate: y + '-' + m + '-' + d,
      creator: '',
      createDate: y + '-' + m + '-' + d,
      modifier: '',
      modifyDate: '',
      auditor: '',
      auditDate: '',
      items: [emptyItem()]
    }
  }
  // Deep clone items with tempId
  return {
    ...order,
    items: order.items.map(item => ({ ...item, tempId: Date.now() + Math.random() }))
  }
}

const formData = ref(makeFormData(props.order))

watch(() => props.order, (val) => {
  formData.value = makeFormData(val)
}, { immediate: true })


function addItem() {
  formData.value.items.push(emptyItem())
}

function removeItem(index) {
  if (formData.value.items.length <= 1) return
  formData.value.items.splice(index, 1)
}

function getFormData() {
  return formData.value
}
defineExpose({ getFormData })
</script>

<style scoped>
.purchase-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.form-readonly-tag {
  font-size: 12px;
  color: #909399;
  background: #f5f7fa;
  padding: 2px 8px;
  border-radius: 4px;
}
.form-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.form-fields .el-form-item { margin-bottom: 0; }
.form-fields .el-form-item__label { font-size: 12px; color: #999; padding-bottom: 2px; }

.item-toolbar {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}
.item-count {
  margin-left: auto;
  font-size: 12px;
  color: #999;
}
.item-table-card .el-card__body { padding: 0; }
.item-table-wrap {
  overflow-x: auto;
}
/* Compact table cells */
.item-table-wrap .el-table__header-wrapper th.el-table__cell {
  background: #f5f7fa;
  color: #606266;
  font-weight: 600;
  font-size: 12px;
  padding: 4px 2px;
  white-space: nowrap;
}
.item-table-wrap .el-table__body td.el-table__cell {
  padding: 2px 2px;
}
.item-table-wrap .el-input--small,
.item-table-wrap .el-select--small {
  width: 100%;
}
.item-table-wrap .el-input-number--small {
  width: 100%;
}
.item-table-wrap .el-input-number--small .el-input-number__increase,
.item-table-wrap .el-input-number--small .el-input-number__decrease {
  width: 20px;
}
/* qty input — narrower to keep column compact */
.pr-qty-input {
  width: 90px;
}

.purpose-card .el-card__body { padding-bottom: 8px; }
.purpose-card .el-form-item { margin-bottom: 0; }

.footer-card .el-card__body { padding: 10px 14px; }
.audit-row {
  display: flex;
  align-items: center;
}
.audit-label {
  display: block;
  font-size: 11px;
  color: #999;
  margin-bottom: 2px;
}
.audit-value {
  display: block;
  font-size: 13px;
  color: #333;
}
.audit-form-item { margin-bottom: 0; }
.audit-form-item .el-form-item__label { font-size: 11px; color: #999; padding-bottom: 2px; }

.pr-btn-icon {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  margin-right: 3px;
}
.pr-btn-icon svg { display: block; }
</style>
