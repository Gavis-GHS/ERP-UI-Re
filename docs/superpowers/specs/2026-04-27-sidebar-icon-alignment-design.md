# 侧边栏图标位置对齐 — 设计说明

## 问题

全宽模式（240px）和极简模式（60px）切换时，菜单图标会上下跳变。

根因：两种模式下元素高度不一致 —— el-menu-item 默认 56px，.icon-item 为 48px，且 .sidebar-icons 有 4px padding-top。

## 方案

统一两种模式下的垂直布局参数：

| 规则 | 当前 | 改为 |
|------|------|------|
| `.sidebar-icons` `padding-top` | `4px` | `0` |
| `.icon-item` `height` | `48px` | `56px` |

改后每个图标在两种模式下的 Y 坐标完全一致，切换时图标原地不动，仅文字展开/收起。

## 涉及文件

| 文件 | 改动 |
|------|------|
| `src/components/AppSidebar.vue` | 修改两行 CSS |
