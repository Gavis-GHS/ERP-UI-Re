# 登录页优化 v3 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 优化登录页：卡片增大至 380px，右侧增加系统名称/欢迎标题/副标题/分隔线，Blob 限定右半区域游动且颜色更浓。

**Architecture:** 单文件修改 `src/pages/LoginPage.vue`，仅改 template（右侧卡片内容）和 style（卡片尺寸、blob 位置/颜色），script 不变。

**Tech Stack:** Vue 3, Swiper 12

---

### Task 1: 优化登录页卡片内容、增大卡片、调整 Blob 位置和颜色

**Files:**
- Modify: `src/pages/LoginPage.vue`（template 右侧卡片 + style blob/卡片样式）

- [ ] **Step 1: 替换 template 中右侧卡片内容**

读取文件 `src/pages/LoginPage.vue`，找到 `<!-- Right: Login Card -->` 部分，将 `.login-card` 内部替换为：

```html
      <!-- Right: Login Card -->
      <div class="login-area">
        <div class="login-card">
          <div class="card-system-name">思嘉供应商平台</div>
          <img src="@/assets/logo.png" alt="SIJIA TEX" class="card-logo" />
          <h2 class="card-title">欢迎回来</h2>
          <p class="card-subtitle">登录您的账户</p>
          <div class="card-divider"></div>

          <div class="field">
            <label class="field-label">用户名</label>
            <input
              ref="usernameInputRef"
              v-model="userName"
              class="field-input"
              placeholder="输入用户名"
              @keyup.enter="handleLogin"
            />
          </div>

          <div class="field">
            <label class="field-label">密码</label>
            <input
              v-model="passWord"
              type="password"
              class="field-input"
              placeholder="输入密码"
              @keyup.enter="handleLogin"
            />
          </div>

          <button
            class="login-btn"
            :disabled="loading"
            @click="handleLogin"
          >
            <span v-if="loading" class="btn-loading">登录中...</span>
            <span v-else>登 录</span>
          </button>
        </div>
      </div>
```

- [ ] **Step 2: 修改卡片 CSS 尺寸**

找到 `.login-card` 样式块，修改 `width` 和 `padding`：

```css
.login-card {
  width: 380px;
  padding: 48px 40px;
  background: #fff;
  border-radius: 20px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.06),
    0 2px 8px rgba(0, 0, 0, 0.04);
}
```

- [ ] **Step 3: 新增卡片内容 CSS**

在 `.card-logo` 之前添加系统名称、副标题、分隔线样式：

```css
.card-system-name {
  text-align: center;
  font-size: 12px;
  color: #86868b;
  margin-bottom: 8px;
}

.card-logo {
  display: block;
  width: 120px;
  height: auto;
  margin: 0 auto 16px;
  object-fit: contain;
}

.card-title {
  margin: 0 0 6px;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: #1d1d1f;
  letter-spacing: -0.2px;
}

.card-subtitle {
  margin: 0 0 20px;
  text-align: center;
  font-size: 13px;
  color: #86868b;
}

.card-divider {
  height: 1px;
  background: #f0f0f0;
  margin-bottom: 20px;
}
```

- [ ] **Step 4: 替换 Blob CSS — 位置移至右半区域，颜色更浓**

找到 4 个 blob 样式块（`.blob-blue` ~ `.blob-amber`），全部替换：

```css
.blob-blue {
  width: 350px;
  height: 350px;
  top: 5%;
  right: 10%;
  background: radial-gradient(circle at 50% 50%, rgba(64, 158, 255, 0.65) 0%, rgba(64, 158, 255, 0.20) 40%, transparent 70%);
  animation-duration: 11s;
}

.blob-green {
  width: 260px;
  height: 260px;
  top: 55%;
  right: 20%;
  background: radial-gradient(circle at 50% 50%, rgba(0, 153, 102, 0.55) 0%, rgba(0, 153, 102, 0.15) 40%, transparent 70%);
  animation-duration: 8s;
  animation-delay: -3s;
}

.blob-purple {
  width: 220px;
  height: 220px;
  top: 25%;
  right: 5%;
  background: radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.50) 0%, rgba(124, 58, 237, 0.12) 40%, transparent 70%);
  animation-duration: 12s;
  animation-delay: -6s;
}

.blob-amber {
  width: 180px;
  height: 180px;
  bottom: 5%;
  right: 35%;
  background: radial-gradient(circle at 50% 50%, rgba(255, 149, 0, 0.45) 0%, rgba(255, 149, 0, 0.10) 40%, transparent 70%);
  animation-duration: 7s;
  animation-delay: -1s;
}
```

注意：blob 使用 `right` 定位（从右侧计算），不再使用 `left`，确保 blob 只在右半区域。

- [ ] **Step 5: 构建验证**

```bash
npx vite build 2>&1 | tail -5
```

Expected: `✓ built in x.xxs`，无编译错误。

- [ ] **Step 6: 提交**

```bash
git add src/pages/LoginPage.vue
git commit -m "feat: 优化登录页 — 增大卡片、丰富右侧内容、Blob限定右半区域更浓"
```
