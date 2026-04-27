const Sidebar = {
  name: 'Sidebar',
  props: {
    items: { type: Array, required: true },
    activeKey: { type: String, default: '/home' }
  },
  emits: ['menu-click'],
  template: `
    <div class="sidebar">
      <el-menu
        :default-active="activeKey"
        background-color="#1e3a8a"
        text-color="#ffffff"
        active-text-color="#409eff"
        @select="(index) => $emit('menu-click', index)"
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
            <el-menu-item v-for="child in item.children" :key="child.key" :index="child.path">
              <span>{{ child.label }}</span>
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
    </div>
  `
}
