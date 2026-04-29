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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { loginApi } from '@/api/auth'
import { login } from '@/store/auth'

const router = useRouter()

const userName = ref('')
const passWord = ref('')
const loading = ref(false)
const usernameInputRef = ref(null)
const modules = [Autoplay, EffectFade, Pagination]
const carouselImages = [img1, img2, img3, img4, img5, img6, img7, img8]

onMounted(() => {
  usernameInputRef.value?.focus()
})

async function handleLogin() {
  if (!userName.value) {
    ElMessage.warning('请输入用户名')
    return
  }
  if (!passWord.value) {
    ElMessage.warning('请输入密码')
    return
  }
  loading.value = true
  try {
    const encryptedPwd = window.btoa(passWord.value)
    const data = await loginApi(userName.value, encryptedPwd)
    if (data.Code == 200) {
      login({
        userName: userName.value,
        supid: data.Data.supid,
        uid: data.Data.uid,
        supName: data.Data.supName,
        checkFlag: data.Data.checkFlag
      })
      router.push('/home')
    } else {
      ElMessage.error(data.Msg || '用户名或密码错误')
    }
  } catch (err) {
    console.error('登录请求失败:', err)
    ElMessage.error('网络请求失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}
</script>

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
  width: 380px;
  padding: 80px 44px;
  background: #fff;
  border-radius: 20px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.06),
    0 2px 8px rgba(0, 0, 0, 0.04);
}

.card-system-name {
  text-align: center;
  font-size: 14px;
  color: #409eff;
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
  margin: 0 0 8px;
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  color: #409eff;
  letter-spacing: -0.2px;
}

.card-subtitle {
  margin: 0 0 24px;
  text-align: center;
  font-size: 15px;
  color: #66b1ff;
}

.card-divider {
  height: 1px;
  background: #f0f0f0;
  margin-bottom: 24px;
}

/* ====== Form Fields ====== */
.field {
  margin-bottom: 20px;
}

.field:last-of-type {
  margin-bottom: 32px;
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
  background: #409eff;
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
  background: #66b1ff;
}

.login-btn:active:not(:disabled) {
  background: #3a8ee6;
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-loading {
  opacity: 0.8;
}
</style>
