# Purchase Requisition Form — Dialog Overlay & Button Redesign

## Problem

1. **查看 button lacks visibility** — both 编辑/查看 buttons use `text` type; only 编辑 gets `type="primary"`. The subtle styling makes 查看 hard to distinguish and users may miss it.

2. **Full-page form navigation is jarring** — switching add/edit/view toggles the entire list view away, losing context. User cannot reference the order list while filling the form.

## Solution

### 1. 查看 Button Enhancement

- Change查看 button from `text` default to `text` with explicit SVG eye icon (already in `Icons`)
- Keep `type="primary"` for 编辑, use neutral style with distinct icon (pencil) for edit
- Add tooltip or visual separation between the two action buttons

### 2. Dialog Overlay (all three modes)

Replace the `v-if="viewMode === 'form'"` full-page switch with an `<el-dialog>` that overlays the list view.

**Dialog properties:**
- `width: "90vw"` or `"min(1200px, 95vw)"` — enough to hold the item table without horizontal scroll
- `top: "5vh"` — leave breathing room at top/bottom
- `modal: true` — default backdrop blocks interaction with list
- `close-on-click-modal: false` — prevent accidental dismiss
- `destroy-on-close: true` — clean up form state
- `append-to-body: true` — ensure proper z-index stacking

**Component changes:**

**PurchaseRequisition.vue:**
- Remove the `<div v-if="viewMode === 'form'">` branch (lines 2-10)
- Add `<el-dialog>` wrapping `<PurchaseForm>` inside the list view
- Dialog title computed from `formMode` ("新增请购单"|"编辑请购单"|"查看请购单")
- Move form action buttons (保存/取消) into `el-dialog` footer slot
- `@close` handler resets `viewMode = 'list'` and clears `editingOrder`

**PurchaseForm.vue:**
- Remove top navigation bar (返回列表 button + form title) — replaced by dialog header
- Remove bottom action buttons (保存/取消) — moved to dialog footer
- Keep all form fields, item table, audit trail footer
- Emit `save` as before; cancel is now dialog close

**Data flow unchanged:**
- `handleFormSave` and `handleFormCancel` remain the same
- `handleAdd` sets `formMode = 'add'` and opens dialog
- `handleEditOrder` / `handleViewOrder` set `formMode` and `editingOrder`
- Dialog visibility driven by `formDialogVisible` boolean

## Files Affected

| File | Changes |
|------|---------|
| `src/pages/PurchaseRequisition.vue` | Replace form view branch with dialog; update view/edit button styling; add dialog state |
| `src/components/PurchaseForm.vue` | Remove nav bar and action buttons (function moved to dialog) |

## Verification

1. Click 新增 → dialog opens in add mode with empty form
2. Click card 编辑 → dialog opens with form data (editable unless 已审核)
3. Click card 查看 → dialog opens with form data (read-only)
4. ESC or clicking X closes dialog, list view behind remains unchanged
5. 查看 button is visually distinct from 编辑 button
