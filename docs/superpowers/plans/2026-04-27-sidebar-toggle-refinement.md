# 侧边栏切换按钮优化 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将侧边栏切换按钮从底部移到顶部，用 SVG 双箭头图标替换 `«`/`»` 文本，极简模式下切换按钮作为图标列表第一项，切换时图标有弹出动画。

**Architecture:** 修改 `icons.js` 新增 `collapse`/`expand` 两个 SVG 图标；修改 `AppSidebar.vue` 在全宽模式顶部和极简模式图标列表首位分别渲染切换按钮，删除底部旧按钮，用 CSS `@keyframes` 实现图标弹出动画。

**Tech Stack:** Vue 3 + Element Plus

---

## 文件结构

| 文件 | 职责 | 操作 |
|------|------|------|
| `src/data/icons.js` | 新增 `collapse`、`expand` 图标 | 修改 |
| `src/components/AppSidebar.vue` | 移动切换按钮到顶部/首图标、使用新图标、删除底部按钮、加动画样式 | 修改 |

---

### Task 1: 新增 collapse 和 expand SVG 图标

**文件:**
- 修改: `src/data/icons.js`

- [ ] **Step 1: 在 icons.js 末尾新增两个图标**

在 `edit` 条目闭括号 `}` 之前、导出对象闭括号 `}` 之前插入：

```js
  collapse: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></svg>',
  expand: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="13 7 18 12 13 17"/><polyline points="6 7 11 12 6 17"/></svg>',
```

最终 `edit` 行和导出闭括号之间变为：

```js
  edit: '<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M17 3a2.83 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>',
  collapse: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></svg>',
  expand: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="13 7 18 12 13 17"/><polyline points="6 7 11 12 6 17"/></svg>',
}
```

- [ ] **Step 2: 提交**

```bash
git add src/data/icons.js
git commit -m "feat: add collapse and expand SVG icons for sidebar toggle"
```

---

### Task 2: 修改 AppSidebar.vue 模板和样式

**文件:**
- 修改: `src/components/AppSidebar.vue`

- [ ] **Step 1: 在全宽模式顶部新增切换按钮**

在 `<el-menu v-if="!collapsed"` 之前插入：

```html
    <div v-if="!collapsed" class="sidebar-toggle-top" @click="emit('toggle-collapse')">
      <span v-html="Icons.collapse" class="toggle-icon-svg"></span>
    </div>
```

- [ ] **Step 2: 在极简模式图标列表首位新增切换按钮**

在 `<div v-else class="sidebar-icons">` 之后、`<div v-for="item in items"` 之前插入：

```html
        <div class="icon-wrapper">
          <div class="icon-item toggle-icon-item" @click="emit('toggle-collapse')">
            <span v-html="Icons.expand" class="toggle-icon-svg"></span>
          </div>
        </div>
```

- [ ] **Step 3: 删除底部旧切换按钮**

删除以下代码：

```html
    <div class="sidebar-toggle" @click="emit('toggle-collapse')">
      <span class="toggle-icon">{{ collapsed ? '»' : '«' }}</span>
    </div>
```

- [ ] **Step 4: 更新样式 — 删除底部按钮样式，新增顶部按钮和动画样式**

在 `<style scoped>` 中，删除以下旧样式：

```css
/* Toggle button */
.sidebar-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  cursor: pointer;
  color: rgba(255,255,255,0.4);
  transition: color 0.2s;
  border-top: 1px solid rgba(255,255,255,0.06);
  flex-shrink: 0;
  user-select: none;
}

.sidebar-toggle:hover {
  color: rgba(255,255,255,0.8);
}

.toggle-icon {
  font-size: 16px;
}
```

在 `.icon-item.active` 规则之后（即 `}` 之后）插入：

```css
/* Toggle button — full-width mode (top) */
.sidebar-toggle-top {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 40px;
  padding-right: 12px;
  cursor: pointer;
  color: rgba(255,255,255,0.4);
  transition: color 0.2s;
  flex-shrink: 0;
  user-select: none;
}

.sidebar-toggle-top:hover {
  color: rgba(255,255,255,0.8);
}

/* Toggle icon animation */
.toggle-icon-svg {
  display: inline-flex;
  align-items: center;
  transition: transform 0.25s ease;
}

.toggle-icon-item:active .toggle-icon-svg {
  transform: scale(0.85);
}

.sidebar-toggle-top:active .toggle-icon-svg {
  transform: scale(0.85);
}

/* Entrance animation for toggle icon on mode switch */
.toggle-icon-svg {
  animation: toggle-pop-in 0.3s ease;
}

@keyframes toggle-pop-in {
  0% { transform: scale(0.5) rotate(-90deg); opacity: 0; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}
```

- [ ] **Step 5: 提交**

```bash
git add src/components/AppSidebar.vue
git commit -m "feat: move sidebar toggle to top, use SVG icons, add animation"
```

---

### Task 3: 构建验证

- [ ] **Step 1: 构建检查**

```bash
npm run build
```

确认构建无错误。

- [ ] **Step 2: 启动开发服务器验证**

```bash
npm run dev
```

打开 http://localhost:5173，验证：

1. 全宽模式顶部显示双左箭头图标，右对齐
2. 点击后切换到极简模式（60px）
3. 极简模式下第一个图标是双右箭头
4. 双右箭头下方依次是首页、销售管理等菜单图标
5. 点击双右箭头切回全宽模式
6. 切换时图标有弹出动画（缩放+旋转入场）
7. 旧底部 `«`/`»` 按钮已消失
8. 极简模式弹出面板功能不受影响
9. 当前激活路由在两种模式下高亮正确
