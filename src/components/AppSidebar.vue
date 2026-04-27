<template>
  <div class="sidebar" :class="{ collapsed }">
    <div class="sidebar-toggle-top" @click="emit('toggle-collapse')">
      <span v-html="collapsed ? Icons.expand : Icons.collapse" class="toggle-icon-svg"></span>
    </div>
    <div class="menu-wrapper">
      <el-menu
        :default-active="activeKey"
        background-color="#1e3a8a"
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
</template>

<script setup>
import { Icons } from '@/data/icons'

const props = defineProps({
  items: { type: Array, required: true },
  activeKey: { type: String, default: '/home' },
  collapsed: { type: Boolean, default: false }
})

const emit = defineEmits(['menu-click', 'toggle-collapse'])
</script>

<style scoped>
.sidebar {
  position: relative;
  width: 240px;
  min-width: 240px;
  height: 100vh;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background-color: #1e3a8a;
  transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar.collapsed {
  width: 60px;
  min-width: 60px;
}

.menu-wrapper {
  flex: 1;
  width: 240px;
}

.menu-wrapper .el-menu {
  border-right: none !important;
  height: 100%;
}

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

@keyframes toggle-pop-in {
  0% { transform: scale(0) rotate(-180deg); opacity: 0; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}
</style>

<style>
/* Collapsed mode: fade out text, keep icons visible */
.sidebar.collapsed .el-menu-item > span + span,
.sidebar.collapsed .el-sub-menu__title > span + span {
  opacity: 0;
  transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar .el-menu-item > span + span,
.sidebar .el-sub-menu__title > span + span {
  opacity: 1;
  transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
