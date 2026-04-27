<template>
  <div class="tabbar-wrapper">
    <el-tabs
      :model-value="currentPath"
      type="card"
      closable
      @tab-click="handleTabClick"
      @tab-remove="(name) => emit('tab-close', name)"
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
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

defineProps({
  openedTabs: { type: Array, required: true }
})

const emit = defineEmits(['tab-close'])

const route = useRoute()
const router = useRouter()

const currentPath = computed(() => route.path)

function handleTabClick(tab) {
  router.push(tab.props.name)
}
</script>

<style scoped>
.tabbar-wrapper {
  flex-shrink: 0;
  background: #fff;
}
.tabbar-wrapper .el-tabs {
  padding: 0 8px;
}
.tabbar-wrapper .el-tabs__header {
  margin: 0;
}
.tabbar-wrapper .el-tabs__nav-wrap::after {
  height: 0;
}
.tabbar-wrapper .el-tabs__item {
  height: 36px;
  line-height: 36px;
}
</style>
