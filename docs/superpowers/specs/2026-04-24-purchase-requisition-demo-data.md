---
name: 请购单演示数据重构设计
description: 将请购单页面从扁平数据重构为"主表+明细表"分组结构，使用 el-table span-method 实现合并单元格
type: spec
---

# 请购单演示数据重构设计

## 概述

将请购单（Purchase Requisition）页面的演示数据从扁平结构重构为分组结构，每个请购单（一个单号）可包含多条物料明细，表格中主表属性合并单元格显示，明细属性不合并。

## 数据模型

### 主表字段（合并单元格显示）
| 字段 | 说明 | 示例值 |
|------|------|--------|
| 审核状态 | status | 已审核、未审核、已作废 |
| 业务类型 | bizType | 备品备件、维护保养、设备改造、加工件、原材料 |
| 采购类型 | purchaseType | 按安全库存采购、按订单采购、维护保养、设备改造 |
| 需求日期 | requiredDate | 2026-04-30 |
| 申请人 | applicant | 薛宇智、张士珠、李明、王工、赵工等 |
| 订单类型 | orderType | 材料、建材 |
| 耗用对象 | consumeTarget | 一号机、二号机、三号机、四号机、五号机、六号机 |
| 用途 | purpose | 描述文字 |
| 单据日期 | docDate | 2026-04-24 |

### 明细表字段（不合并单元格）
| 字段 | 说明 | 示例值 |
|------|------|--------|
| 物料代码 | materialCode | 04.01.09.0198 |
| 物料名称 | materialName | 中黄地坪漆（桶） |
| 规格型号 | spec | 油通用 |
| 申购数量 | qty | 6.00 |
| 已下单量 | ordered | 0 |
| 未下单量 | unOrdered | 6.00 |

### 数据规模
- 约 12-15 个请购单，每个 1-10 条明细，合计 ~100 条数据
- 支持分页测试

## 界面变更

### 表格列结构（调整后）
1. 序号（index，60px）
2. 选择框（selection，50px）
3. 审核状态（status，合并，90px）
4. 业务类型（bizType，合并，100px）
5. 采购类型（purchaseType，合并，120px）
6. 需求日期（requiredDate，合并，110px）
7. 申请单号（orderNo，合并，140px）
8. 申请人（applicant，合并，90px）
9. 订单类型（orderType，合并，90px）← 新增
10. 耗用对象（consumeTarget，合并，90px）← 新增
11. 用途（purpose，合并，150px）
12. 单据日期（docDate，合并，110px）← 新增
13. 物料代码（materialCode，不合并，110px）
14. 物料名称（materialName，不合并，120px）
15. 规格型号（spec，不合并，100px）
16. 申购数量（qty，不合并，90px）
17. 已下单量（ordered，不合并，90px）
18. 未下单量（unOrdered，不合并，90px）

### 合并逻辑
- 使用 el-table 的 `span-method` 属性
- 对每个请购单的首行，主表字段 rowspan = 该单的行数
- 非首行的主表字段 rowspan = 0（隐藏）
- 明细字段始终 rowspan = 1

## 修改文件

1. `js/data/purchase.js` — 重构数据模型
2. `js/pages/purchase-requisition.js` — 调整表格列和合并逻辑

## 注意事项
- 保持筛选功能正常运作
- 保持新增请购单功能正常
- 合并逻辑需要预先计算 spanMap
- 删除不再需要的字段（productCode, artNo, unit, price, orderedAuditing）
