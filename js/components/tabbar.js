const TabBar = {
  name: 'TabBar',
  props: {
    openedTabs: { type: Array, required: true }
  },
  emits: ['tab-close'],
  computed: {
    currentPath() {
      return this.$route.path
    }
  },
  methods: {
    handleTabClick(tab) {
      this.$router.push(tab.props.name)
    }
  },
  template: `
    <div class="tabbar-wrapper">
      <el-tabs
        :model-value="currentPath"
        type="card"
        closable
        @tab-click="handleTabClick"
        @tab-remove="(name) => $emit('tab-close', name)"
      >
        <el-tab-pane
          v-for="tab in openedTabs"
          :key="tab.path"
          :name="tab.path"
          :label="tab.label"
          :closable="tab.closable"
        />
      </el-tabs>
    </div>
  `
}
