<template>
  <div class="sidebar">
    <el-menu
      :default-active="activeKey"
      background-color="#1e3a8a"
      text-color="#ffffff"
      active-text-color="#409eff"
      @select="(index) => emit('menu-click', index)"
    >
      <template v-for="item in items" :key="item.key">
        <!-- Level 1: leaf -->
        <el-menu-item v-if="!item.children" :index="item.path || item.key">
          <span v-html="Icons[item.icon] || ''" style="margin-right:8px;display:inline-flex;align-items:center;"></span>
          <span>{{ item.label }}</span>
        </el-menu-item>
        <!-- Level 1: expandable -->
        <el-sub-menu v-else :index="item.key">
          <template #title>
            <span v-html="Icons[item.icon] || ''" style="margin-right:8px;display:inline-flex;align-items:center;"></span>
            <span>{{ item.label }}</span>
          </template>
          <template v-for="child in item.children" :key="child.key">
            <!-- Level 2: leaf -->
            <el-menu-item v-if="!child.children" :index="child.path || child.key">
              <span>{{ child.label }}</span>
            </el-menu-item>
            <!-- Level 2: expandable → Level 3 -->
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
</template>

<script setup>
import { ref } from 'vue'
import { Icons } from '@/data/icons'

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
</script>

<style scoped>
.sidebar {
  width: 240px;
  min-width: 240px;
  height: 100vh;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}
.sidebar .el-menu {
  border-right: none !important;
  height: 100%;
}
</style>
