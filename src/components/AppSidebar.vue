<template>
  <div class="sidebar" :class="{ collapsed }">
    <!-- Full-width mode -->
    <div class="sidebar-full" :class="{ hidden: collapsed }">
      <div class="sidebar-toggle-top" @click="emit('toggle-collapse')">
        <span v-html="Icons.collapse" class="toggle-icon-svg"></span>
        <img :src="logoImg" class="sidebar-logo" />
      </div>
      <div class="menu-wrapper">
        <el-menu
          :default-active="activeKey"
          background-color="#1e293b"
          text-color="#ffffff"
          active-text-color="#409eff"
          @select="(index) => emit('menu-click', index)"
        >
          <template v-for="item in items" :key="item.key">
            <el-menu-item v-if="!item.children" :index="item.path || item.key">
              <span v-html="Icons[item.icon] || ''" style="margin-right:8px;display:inline-flex;align-items:center;"></span>
              <span>{{ item.label }}</span>
            </el-menu-item>
            <el-sub-menu v-else :index="item.key">
              <template #title>
                <span v-html="Icons[item.icon] || ''" style="margin-right:8px;display:inline-flex;align-items:center;"></span>
                <span>{{ item.label }}</span>
              </template>
              <template v-for="child in item.children" :key="child.key">
                <el-menu-item v-if="!child.children" :index="child.path || child.key">
                  <span>{{ child.label }}</span>
                </el-menu-item>
                <el-sub-menu v-else :index="child.key">
                  <template #title>
                    <span>{{ child.label }}</span>
                  </template>
                  <el-menu-item
                    v-for="grandchild in child.children"
                    :key="grandchild.key"
                    :index="grandchild.path || grandchild.key"
                  >
                    <span>{{ grandchild.label }}</span>
                  </el-menu-item>
                </el-sub-menu>
              </template>
            </el-sub-menu>
          </template>
        </el-menu>
      </div>
    </div>

    <!-- Minimal mode: icon list + teleported popups -->
    <div class="sidebar-minimal" :class="{ visible: collapsed }">
      <div class="sidebar-icons">
        <!-- Expand toggle -->
        <div class="icon-item toggle-icon-item" @click="emit('toggle-collapse')">
          <span v-html="Icons.expand" class="toggle-icon-svg"></span>
        </div>
        <!-- Menu icons -->
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
                  @click="onPopupItemClick(child.path || child.key)"
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
                    @click="onPopupItemClick(gc.path || gc.key)"
                  >
                    {{ gc.label }}
                  </div>
                </template>
              </template>
            </div>
          </Teleport>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Icons } from '@/data/icons'
import logoImg from '@/assets/logo.png'

const props = defineProps({
  items: { type: Array, required: true },
  activeKey: { type: String, default: '/home' },
  collapsed: { type: Boolean, default: false }
})

const emit = defineEmits(['menu-click', 'toggle-collapse'])

const hoveredKey = ref(null)
const popupStyle = ref({})
let hideTimer = null

function onIconEnter(key, event) {
  clearTimeout(hideTimer)
  const item = props.items.find(i => i.key === key)
  if (!item || !item.children) return
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

function onPopupItemClick(path) {
  clearTimeout(hideTimer)
  hoveredKey.value = null
  emit('menu-click', path)
}

function onIconClick(item) {
  clearTimeout(hideTimer)
  hoveredKey.value = null
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
</script>

<style scoped>
.sidebar {
  position: relative;
  width: 240px;
  min-width: 240px;
  height: 100vh;
  overflow: hidden;
  flex-shrink: 0;
  background-color: #1e293b;
  transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar.collapsed {
  width: 60px;
  min-width: 60px;
}

/* Full-width container */
.sidebar-full {
  position: absolute;
  left: 0;
  top: 0;
  width: 240px;
  height: 100%;
  display: flex;
  flex-direction: column;
  opacity: 1;
  transition: opacity 0.15s ease;
}

.sidebar-full.hidden {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
}

.menu-wrapper {
  flex: 1;
  width: 240px;
}

.menu-wrapper .el-menu {
  border-right: none !important;
  height: 100%;
}

/* Minimal container */
.sidebar-minimal {
  position: absolute;
  left: 0;
  top: 0;
  width: 60px;
  height: 100%;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease 0.15s;
}

.sidebar-minimal.visible {
  opacity: 1;
  pointer-events: auto;
  transition: opacity 0.15s ease 0.15s;
}

/* Icon list */
.sidebar-icons {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.icon-wrapper {
  position: relative;
}

.icon-item {
  display: flex;
  align-items: center;
  height: 56px;
  padding-left: 20px;
  cursor: pointer;
  color: rgba(255,255,255,0.7);
  transition: color 0.2s, background 0.2s;
}

.icon-item:hover,
.icon-item.active {
  color: #409eff;
  background: rgba(255,255,255,0.08);
}

/* Toggle row — full-width mode */
.sidebar-toggle-top {
  display: flex;
  align-items: center;
  height: 56px;
  padding-left: 20px;
  cursor: pointer;
  color: rgba(255,255,255,0.4);
  transition: color 0.2s;
  flex-shrink: 0;
  user-select: none;
}

.sidebar-toggle-top:hover {
  color: rgba(255,255,255,0.8);
}

.toggle-icon-svg {
  display: inline-flex;
  align-items: center;
  width: 22px;
  height: 22px;
  animation: toggle-pop-in 0.45s ease;
}

.sidebar-toggle-top:active .toggle-icon-svg {
  transform: scale(0.85);
}

.toggle-icon-item:active .toggle-icon-svg {
  transform: scale(0.85);
}

.sidebar-logo {
  margin-left: 32px;
  height: 40px;
}

@keyframes toggle-pop-in {
  0% { transform: scale(0) rotate(-180deg); opacity: 0; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}
</style>

<style>
/* Popup styles — unscoped because Teleport moves DOM to body */
.sidebar-popup {
  position: fixed;
  min-width: 180px;
  max-height: calc(100vh - 16px);
  overflow-y: auto;
  background: #1e293b;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 4px;
  box-shadow: 4px 4px 12px rgba(0,0,0,0.3);
  z-index: 1100;
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
</style>
