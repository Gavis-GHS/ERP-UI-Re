<template>
  <div class="login-page">
    <!-- Blob animation layer -->
    <div class="blob-layer">
      <div class="blob blob-blue"></div>
      <div class="blob blob-green"></div>
      <div class="blob blob-purple"></div>
      <div class="blob blob-orange"></div>
    </div>

    <!-- Glass overlay -->
    <div class="glass-overlay"></div>

    <!-- Content -->
    <div class="content">
      <div class="brand-area">
        <img src="@/assets/logo.png" alt="SIJIA TEX" class="logo" />
      </div>
      <div class="card-area">
        <div class="glass-card">
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

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { loginApi } from '@/api/auth'
import { login } from '@/store/auth'

const router = useRouter()

const userName = ref('')
const passWord = ref('')
const loading = ref(false)
const usernameInputRef = ref(null)

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
  overflow: hidden;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  animation: blobMorph 16s ease-in-out infinite alternate;
}

.blob-blue {
  width: 320px;
  height: 320px;
  top: -8%;
  left: -4%;
  background: radial-gradient(circle at 50% 50%, rgba(64,158,255,0.25) 0%, transparent 70%);
  animation-duration: 18s;
}

.blob-green {
  width: 240px;
  height: 240px;
  bottom: -5%;
  left: 22%;
  background: radial-gradient(circle at 50% 50%, rgba(0,153,102,0.2) 0%, transparent 70%);
  animation-duration: 14s;
  animation-delay: -4s;
}

.blob-purple {
  width: 200px;
  height: 200px;
  top: 45%;
  right: -2%;
  background: radial-gradient(circle at 50% 50%, rgba(124,58,237,0.15) 0%, transparent 70%);
  animation-duration: 20s;
  animation-delay: -8s;
}

.blob-orange {
  width: 160px;
  height: 160px;
  top: 15%;
  right: 28%;
  background: radial-gradient(circle at 50% 50%, rgba(255,149,0,0.12) 0%, transparent 70%);
  animation-duration: 12s;
  animation-delay: -2s;
}

@keyframes blobMorph {
  0% {
    border-radius: 60% 40% 50% 45% / 55% 45% 55% 45%;
    transform: translate(0, 0) scale(1);
  }
  25% {
    border-radius: 40% 60% 45% 55% / 45% 55% 45% 55%;
    transform: translate(30px, -20px) scale(1.08);
  }
  50% {
    border-radius: 55% 45% 60% 40% / 50% 50% 50% 50%;
    transform: translate(-15px, 25px) scale(0.95);
  }
  75% {
    border-radius: 45% 55% 40% 60% / 60% 40% 60% 40%;
    transform: translate(20px, 10px) scale(1.05);
  }
  100% {
    border-radius: 50% 50% 45% 55% / 45% 55% 50% 50%;
    transform: translate(-25px, -15px) scale(1.02);
  }
}

/* ====== Glass Overlay ====== */
.glass-overlay {
  position: absolute;
  inset: 0;
  backdrop-filter: blur(100px);
  -webkit-backdrop-filter: blur(100px);
  background: rgba(245, 245, 247, 0.3);
}

/* ====== Content Layout ====== */
.content {
  position: relative;
  z-index: 1;
  display: flex;
  height: 100%;
  align-items: center;
}

.brand-area {
  flex: 55;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  width: 160px;
  height: auto;
  object-fit: contain;
}

.card-area {
  flex: 45;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 48px;
}

/* ====== Glass Card ====== */
.glass-card {
  width: 340px;
  padding: 40px 36px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.06),
    0 2px 8px rgba(0, 0, 0, 0.04);
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
  background: rgba(0, 0, 0, 0.04);
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
