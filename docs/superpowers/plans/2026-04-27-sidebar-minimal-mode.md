# 侧边栏极简模式 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 侧边导航栏支持全宽（240px）和极简（60px，仅图标）两种模式，极简模式下鼠标悬停有子菜单的模块时弹出浮动面板展示子菜单。

**Architecture:** `App.vue` 持有 `isSidebarCollapsed` ref 并通过 prop 传入 AppSidebar；AppSidebar 根据 `collapsed` prop 渲染两套模板（全宽用现有 el-menu，极简用纯 div 图标列表 + Teleport 弹出面板）；切换按钮在侧边栏底部 emit 事件给父组件。不引入新依赖。

**Tech Stack:** Vue 3 + Element Plus + Chart.js（已有）

---

## 文件结构

| 文件 | 职责 | 操作 |
|------|------|------|
| `src/App.vue` | 持有 `isSidebarCollapsed` 状态，传给 AppSidebar，接收 toggle 事件 | 修改 |
| `src/components/AppSidebar.vue` | 双模板渲染（全宽/极简）、弹出面板逻辑、切换按钮、所有新样式 | 修改 |

---

### Task 1: App.vue — 添加折叠状态

**文件:**
- 修改: `src/App.vue`

- [ ] **Step 1: 在 script 中新增 isSidebarCollapsed ref**

当前 import：
```js
import { ref, watch } from 'vue'
```

`ref` 已存在，无需修改 import。在 `const userName = ref(TopNavData.userName)` 之后插入：

```js
const isSidebarCollapsed = ref(false)
```

- [ ] **Step 2: 修改 AppSidebar 调用，传递 collapsed prop 并监听事件**

当前 AppSidebar 调用：
```html
    <app-sidebar
      :items="menuItems"
      :active-key="activeMenu"
      @menu-click="handleMenuClick"
    />
```

替换为：
```html
    <app-sidebar
      :items="menuItems"
      :active-key="activeMenu"
      :collapsed="isSidebarCollapsed"
      @menu-click="handleMenuClick"
      @toggle-collapse="isSidebarCollapsed = !isSidebarCollapsed"
    />
```

- [ ] **Step 3: 提交**

```bash
git add src/App.vue
git commit -m "feat: add sidebar collapse state and wiring to App.vue"
```

---

### Task 2: AppSidebar.vue — 添加极简模式 script 逻辑

**文件:**
- 修改: `src/components/AppSidebar.vue`

- [ ] **Step 1: 更新 defineProps 和 defineEmits，新增状态变量**

当前：
```js
defineProps({
  items: { type: Array, required: true },
  activeKey: { type: String, default: '/home' }
})

const emit = defineEmits(['menu-click'])
```

替换为：
```js
const props = defineProps({
  items: { type: Array, required: true },
  activeKey: { type: String, default: '/home' },
  collapsed: { type: Boolean, default: false }
})

const emit = defineEmits(['menu-click', 'toggle-collapse'])

const hoveredKey = ref(null)
const popupStyle = ref({})
let hideTimer = null
```

在 `import` 区域，将：
```js
import { Icons } from '@/data/icons'
```

替换为：
```js
import { ref } from 'vue'
import { Icons } from '@/data/icons'
```

（如 `ref` 已在 import 中则无需重复）

- [ ] **Step 2: 新增悬停和弹出面板控制函数**

在 emit 声明之后插入：

```js
function onIconEnter(key, event) {
  clearTimeout(hideTimer)
  const rect = event.currentTarget.getBoundingClientRect()
  popupStyle.value = {
    top: rect.top + 'px',
    left: rect.right + 'px'
  }
  hoveredKey.value = key
}

function onIconLeave() {
  hideTimer = setTimeout(() => {
    hoveredKey.value = null
  }, 150)
}

function onPopupEnter() {
  clearTimeout(hideTimer)
}

function onPopupLeave() {
  hideTimer = setTimeout(() => {
    hoveredKey.value = null
  }, 150)
}

function onIconClick(item) {
  if (!item.children) {
    emit('menu-click', item.path || item.key)
  }
}

function isItemActive(item) {
  if (props.activeKey === (item.path || item.key)) return true
  if (item.children) {
    return item.children.some(child => {
      if (props.activeKey === (child.path || child.key)) return true
      if (child.children) {
        return child.children.some(gc => props.activeKey === (gc.path || gc.key))
      }
      return false
    })
  }
  return false
}
```

- [ ] **Step 3: 提交**

```bash
git add src/components/AppSidebar.vue
git commit -m "feat: add sidebar collapsed mode script — hover, popup, toggle logic"
```

---

### Task 3: AppSidebar.vue — 添加极简模式模板

**文件:**
- 修改: `src/components/AppSidebar.vue`

- [ ] **Step 1: 将现有 el-menu 包裹在 v-if 条件中**

在现有 `<el-menu>` 标签上添加 `v-if="!collapsed"`：

```html
    <el-menu
      v-if="!collapsed"
      :default-active="activeKey"
```

同时将 `</el-menu>` 之后的模板结束位置加好 v-else 占位（见下一步）。

- [ ] **Step 2: 在 el-menu 闭合标签之后、sidebar 根 div 闭合之前插入极简模式模板**

在 `</el-menu>` 之后、切换按钮（见 Step 3）之前插入：

```html
    <!-- Minimal mode: icon list + teleported popups -->
    <div v-else class="sidebar-icons">
      <div
        v-for="item in items"
        :key="item.key"
        class="icon-wrapper"
      >
        <div
          class="icon-item"
          :class="{ active: isItemActive(item) }"
          @click="onIconClick(item)"
          @mouseenter="onIconEnter(item.key, $event)"
          @mouseleave="onIconLeave"
        >
          <span v-html="Icons[item.icon] || ''"></span>
        </div>

        <Teleport to="body">
          <div
            v-if="item.children && hoveredKey === item.key"
            class="sidebar-popup"
            :style="popupStyle"
            @mouseenter="onPopupEnter"
            @mouseleave="onPopupLeave"
          >
            <div class="popup-header">{{ item.label }}</div>
            <template v-for="child in item.children" :key="child.key">
              <div
                v-if="!child.children"
                class="popup-item"
                :class="{ active: activeKey === (child.path || child.key) }"
                @click="emit('menu-click', child.path || child.key)"
              >
                {{ child.label }}
              </div>
              <template v-else>
                <div class="popup-sub-label">{{ child.label }}</div>
                <div
                  v-for="gc in child.children"
                  :key="gc.key"
                  class="popup-item popup-sub-item"
                  :class="{ active: activeKey === (gc.path || gc.key) }"
                  @click="emit('menu-click', gc.path || gc.key)"
                >
                  {{ gc.label }}
                </div>
              </template>
            </template>
          </div>
        </Teleport>
      </div>
    </div>
```

- [ ] **Step 3: 在 sidebar 根 div 闭合前插入切换按钮**

在 sidebar 根 `</div>` 之前（el-menu 和 sidebar-icons 之后）插入：

```html
    <div class="sidebar-toggle" @click="emit('toggle-collapse')">
      <span class="toggle-icon">{{ collapsed ? '»' : '«' }}</span>
    </div>
```

- [ ] **Step 4: 提交**

```bash
git add src/components/AppSidebar.vue
git commit -m "feat: add sidebar collapsed mode template with teleported popups and toggle"
```

---

### Task 4: AppSidebar.vue — 添加极简模式样式

**文件:**
- 修改: `src/components/AppSidebar.vue`

- [ ] **Step 1: 在 `<style scoped>` 末尾添加极简模式样式**

在 `</style>` 之前插入：

```css
/* Collapsed mode sidebar */
.sidebar.collapsed {
  width: 60px;
  min-width: 60px;
  overflow: visible;
}

/* Icon list */
.sidebar-icons {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 4px;
}

.icon-wrapper {
  position: relative;
}

.icon-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  cursor: pointer;
  color: rgba(255,255,255,0.7);
  transition: color 0.2s, background 0.2s;
}

.icon-item:hover,
.icon-item.active {
  color: #409eff;
  background: rgba(255,255,255,0.08);
}

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
}

.sidebar-toggle:hover {
  color: rgba(255,255,255,0.8);
}

.toggle-icon {
  font-size: 16px;
}

/* Popup panel (rendered in body via Teleport, unscoped) */
</style>

<style>
/* Popup styles — unscoped because Teleport moves DOM to body, outside scoped boundary */
.sidebar-popup {
  position: fixed;
  min-width: 180px;
  background: #1e3a8a;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 4px;
  box-shadow: 4px 4px 12px rgba(0,0,0,0.3);
  z-index: 2000;
  padding: 4px 0;
}

.popup-header {
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255,255,255,0.5);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  margin-bottom: 4px;
}

.popup-item {
  padding: 8px 16px;
  font-size: 13px;
  color: rgba(255,255,255,0.85);
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;
}

.popup-item:hover,
.popup-item.active {
  background: rgba(64,158,255,0.2);
  color: #409eff;
}

.popup-sub-label {
  padding: 6px 16px 2px;
  font-size: 11px;
  color: rgba(255,255,255,0.4);
}

.popup-sub-item {
  padding-left: 28px;
}
```

> 注：弹窗样式需要放在非 scoped 的 `<style>` 块中，因为 Teleport 将 DOM 移到了 `<body>`，scoped 样式无法穿透。

- [ ] **Step 2: 提交**

```bash
git add src/components/AppSidebar.vue
git commit -m "style: add sidebar collapsed mode, popup, and toggle styles"
```

---

### Task 5: 验证

- [ ] **Step 1: 构建验证**

```bash
npm run build
```

确认构建无错误。

- [ ] **Step 2: 启动开发服务器验证**

```bash
npm run dev
```

打开 http://localhost:5173，验证：
1. 侧边栏默认全宽模式（240px），显示图标 + 文本，与之前一致
2. 底部出现 `«` 折叠按钮
3. 点击 `«` 切换到极简模式（60px），只显示图标
4. 极简模式下鼠标悬停"销售管理"图标，右侧弹出面板显示销售订单/销售合同/销售退货
5. 鼠标移到弹出面板内可正常交互，移出后面板消失
6. 极简模式下点击"首页"图标直接导航
7. 极简模式下弹出面板中点击子项导航
8. 弹出面板中多级菜单（采购管理 > 采购流程 > 请购单）正确渲染
9. 点击 `»` 按钮切回全宽模式
10. 当前激活路由在两种模式下都正确高亮
