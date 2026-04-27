const TopNav = {
  name: 'TopNav',
  props: {
    logo: { type: String, default: '企业管理系统' },
    navItems: { type: Array, required: true },
    userName: { type: String, default: '管理员' }
  },
  methods: {
    handleDropdownCommand(command) {
      if (command === 'logout') {
        alert('退出登录')
      } else if (command === 'profile') {
        alert('个人中心')
      } else if (command === 'settings') {
        alert('系统设置')
      }
    }
  },
  template: `
    <div class="topnav">
      <div class="topnav-left">
        <span class="topnav-logo">{{ logo }}</span>
      </div>
      <div class="topnav-center">
        <div
          v-for="item in navItems"
          :key="item.key"
          class="topnav-item"
        >
          <span class="star-icon" v-html="item.starred ? Icons.star : Icons.starOutline"></span>
          <span class="nav-label">{{ item.label }}</span>
        </div>
      </div>
      <div class="topnav-right">
        <div class="search-box">
          <span class="search-icon" v-html="Icons.search"></span>
          <input class="search-input" type="text" placeholder="搜索功能..." />
        </div>
        <el-dropdown @command="handleDropdownCommand">
          <span class="user-profile el-dropdown-link">
            <el-avatar :size="28" style="background:#fff;color:#409eff;font-size:12px;flex-shrink:0;">
              {{ userName.charAt(0) }}
            </el-avatar>
            <span class="user-name">{{ userName }}</span>
            <span class="user-arrow" v-html="Icons.expandMore"></span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">个人中心</el-dropdown-item>
              <el-dropdown-item command="settings">系统设置</el-dropdown-item>
              <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  `
}
