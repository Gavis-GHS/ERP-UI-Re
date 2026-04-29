# 登录页重设计 v2 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将登录页改为 7:3 左右分栏，左侧 Swiper fade 轮播，右侧白色卡片登录表单，保留现有 blob 动态背景和毛玻璃。

**Architecture:** 单文件修改 `src/pages/LoginPage.vue`，template 和 style 全面替换，script 逻辑不变。新增 Swiper 依赖实现 fade 轮播效果。

**Tech Stack:** Vue 3 (Composition API), Swiper 11, CSS backdrop-filter

---

### Task 1: 安装 Swiper 依赖

- [ ] **Step 1: 安装 swiper**

```bash
npm install swiper
```

- [ ] **Step 2: 验证安装**

```bash
node -e "require('swiper/package.json').version"
```

Expected: 输出版本号（如 11.x.x）

- [ ] **Step 3: 提交**

```bash
git add package.json package-lock.json
git commit -m "chore: 安装 swiper 轮播依赖"
```

---

### Task 2: 重写 LoginPage.vue 模板和样式

**Files:**
- Modify: `src/pages/LoginPage.vue`（替换 template 和 `<style scoped>` 块，script 不变）

- [ ] **Step 1: 重写 template**

完整替换现有 `<template>` 块：

```html
<template>
  <div class="login-page">
    <!-- Blob animation layer -->
    <div class="blob-layer">
      <div class="blob blob-blue"></div>
      <div class="blob blob-green"></div>
      <div class="blob blob-purple"></div>
      <div class="blob blob-amber"></div>
    </div>

    <!-- Frosted glass overlay -->
    <div class="frost-overlay"></div>

    <!-- Content -->
    <div class="content">
      <!-- Left: Carousel -->
      <div class="carousel-area">
        <swiper
          :modules="modules"
          effect="fade"
          :autoplay="{ delay: 4000, disableOnInteraction: false }"
          :speed="1000"
          :loop="true"
          :pagination="{ clickable: true }"
          class="login-carousel"
        >
          <swiper-slide v-for="(img, i) in carouselImages" :key="i">
            <img :src="img" class="carousel-img" />
          </swiper-slide>
        </swiper>
      </div>

      <!-- Right: Login Card -->
      <div class="login-area">
        <div class="login-card">
          <img src="@/assets/logo.png" alt="SIJIA TEX" class="card-logo" />
          <h2 class="card-title">登录</h2>

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
    </div>
  </div>
</template>
```

- [ ] **Step 2: 更新 script 添加 Swiper 导入和图片列表**

在现有 `<script setup>` 顶部插入 Swiper 相关导入。找到 `import { ref, onMounted } from 'vue'` 行，在下面添加：

```js
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'

// 轮播图列表
import img1 from '@/assets/loginCarousel/wallhaven-9d17m1_2560x1440.png'
import img2 from '@/assets/loginCarousel/wallhaven-d6o77l_3840x2160.png'
import img3 from '@/assets/loginCarousel/wallhaven-jxp7x5_2560x1440.png'
import img4 from '@/assets/loginCarousel/wallhaven-l8qw7y_2560x1440.png'
import img5 from '@/assets/loginCarousel/wallhaven-o5j7v7_1920x1080.png'
import img6 from '@/assets/loginCarousel/wallhaven-o5qwl7_2560x1440.png'
import img7 from '@/assets/loginCarousel/wallhaven-rdvxxj_2560x1440.png'
import img8 from '@/assets/loginCarousel/wallhaven-rr85dm_2560x1440.png'
```

在 `const usernameInputRef = ref(null)` 之下添加：

```js
const modules = [Autoplay, EffectFade, Pagination]
const carouselImages = [img1, img2, img3, img4, img5, img6, img7, img8]
```

- [ ] **Step 3: 替换 `<style scoped>` 块**

完整替换现有样式：

```css
<style scoped>
/* ====== Base ====== */
.login-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #f5f5f7;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
}

/* ====== Blob Layer ====== */
.blob-layer {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.blob {
  position: absolute;
  border-radius: 50%;
  animation: blobFloat 10s ease-in-out infinite alternate;
}

.blob-blue {
  width: 380px;
  height: 380px;
  top: -10%;
  left: -6%;
  background: radial-gradient(circle at 50% 50%, rgba(64, 158, 255, 0.45) 0%, rgba(64, 158, 255, 0.1) 40%, transparent 70%);
  animation-duration: 11s;
}

.blob-green {
  width: 280px;
  height: 280px;
  bottom: -8%;
  left: 18%;
  background: radial-gradient(circle at 50% 50%, rgba(0, 153, 102, 0.35) 0%, rgba(0, 153, 102, 0.08) 40%, transparent 70%);
  animation-duration: 8s;
  animation-delay: -3s;
}

.blob-purple {
  width: 240px;
  height: 240px;
  top: 40%;
  right: -4%;
  background: radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.3) 0%, rgba(124, 58, 237, 0.06) 40%, transparent 70%);
  animation-duration: 12s;
  animation-delay: -6s;
}

.blob-amber {
  width: 180px;
  height: 180px;
  top: 12%;
  right: 32%;
  background: radial-gradient(circle at 50% 50%, rgba(255, 149, 0, 0.25) 0%, rgba(255, 149, 0, 0.05) 40%, transparent 70%);
  animation-duration: 7s;
  animation-delay: -1s;
}

@keyframes blobFloat {
  0% {
    border-radius: 58% 42% 48% 52% / 52% 48% 52% 48%;
    transform: translate(0, 0) scale(1) rotate(0deg);
  }
  25% {
    border-radius: 42% 58% 52% 48% / 48% 52% 48% 52%;
    transform: translate(120px, 80px) scale(1.15) rotate(5deg);
  }
  50% {
    border-radius: 52% 48% 58% 42% / 50% 50% 50% 50%;
    transform: translate(-80px, -60px) scale(0.88) rotate(-4deg);
  }
  75% {
    border-radius: 48% 52% 42% 58% / 58% 42% 58% 42%;
    transform: translate(-100px, 90px) scale(1.08) rotate(3deg);
  }
  100% {
    border-radius: 50% 50% 48% 52% / 48% 52% 50% 50%;
    transform: translate(60px, -100px) scale(1.04) rotate(-2deg);
  }
}

/* ====== Frosted Glass Overlay ====== */
.frost-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  backdrop-filter: blur(60px) saturate(1.2);
  -webkit-backdrop-filter: blur(60px) saturate(1.2);
  background: rgba(250, 250, 252, 0.25);
}

/* ====== Content ====== */
.content {
  position: relative;
  z-index: 2;
  display: flex;
  height: 100%;
}

/* ====== Left: Carousel Area ====== */
.carousel-area {
  flex: 7;
  position: relative;
  overflow: hidden;
}

.login-carousel {
  width: 100%;
  height: 100%;
}

.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Swiper pagination overrides */
.login-carousel :deep(.swiper-pagination) {
  bottom: 24px !important;
}

.login-carousel :deep(.swiper-pagination-bullet) {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 1;
  transition: all 0.3s;
}

.login-carousel :deep(.swiper-pagination-bullet-active) {
  background: #fff;
  width: 24px;
  border-radius: 4px;
}

/* ====== Right: Login Area ====== */
.login-area {
  flex: 3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  width: 340px;
  padding: 40px 36px;
  background: #fff;
  border-radius: 20px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.06),
    0 2px 8px rgba(0, 0, 0, 0.04);
}

.card-logo {
  display: block;
  width: 120px;
  height: auto;
  margin: 0 auto 24px;
  object-fit: contain;
}

.card-title {
  margin: 0 0 28px;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  color: #1d1d1f;
  letter-spacing: -0.2px;
}

/* ====== Form Fields ====== */
.field {
  margin-bottom: 16px;
}

.field:last-of-type {
  margin-bottom: 24px;
}

.field-label {
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: 400;
  color: #86868b;
}

.field-input {
  display: block;
  width: 100%;
  padding: 12px 14px;
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  font-size: 15px;
  color: #1d1d1f;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  font-family: inherit;
  box-sizing: border-box;
}

.field-input::placeholder {
  color: #aeaeb2;
}

.field-input:focus {
  border-color: rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.04);
}

/* ====== Button ====== */
.login-btn {
  display: block;
  width: 100%;
  padding: 13px;
  background: #1d1d1f;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, opacity 0.2s;
  font-family: inherit;
  letter-spacing: -0.2px;
}

.login-btn:hover:not(:disabled) {
  background: #3a3a3c;
}

.login-btn:active:not(:disabled) {
  background: #000;
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-loading {
  opacity: 0.8;
}
</style>
```

- [ ] **Step 4: 构建验证**

```bash
npx vite build 2>&1 | tail -10
```

Expected: `✓ built in x.xxs`，无编译错误。

- [ ] **Step 5: 提交**

```bash
git add src/pages/LoginPage.vue
git commit -m "feat: 登录页改为7:3左右分栏，左侧Swiper轮播，右侧白色卡片"
```
