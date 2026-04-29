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
  z-index: 0;
}

.blob {
  position: absolute;
  border-radius: 50%;
  animation: blobFloat 16s ease-in-out infinite alternate;
}

.blob-blue {
  width: 380px;
  height: 380px;
  top: -10%;
  left: -6%;
  background: radial-gradient(circle at 50% 50%, rgba(64, 158, 255, 0.45) 0%, rgba(64, 158, 255, 0.1) 40%, transparent 70%);
  animation-duration: 18s;
}

.blob-green {
  width: 280px;
  height: 280px;
  bottom: -8%;
  left: 18%;
  background: radial-gradient(circle at 50% 50%, rgba(0, 153, 102, 0.35) 0%, rgba(0, 153, 102, 0.08) 40%, transparent 70%);
  animation-duration: 14s;
  animation-delay: -4s;
}

.blob-purple {
  width: 240px;
  height: 240px;
  top: 40%;
  right: -4%;
  background: radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.3) 0%, rgba(124, 58, 237, 0.06) 40%, transparent 70%);
  animation-duration: 20s;
  animation-delay: -8s;
}

.blob-amber {
  width: 180px;
  height: 180px;
  top: 12%;
  right: 32%;
  background: radial-gradient(circle at 50% 50%, rgba(255, 149, 0, 0.25) 0%, rgba(255, 149, 0, 0.05) 40%, transparent 70%);
  animation-duration: 12s;
  animation-delay: -2s;
}

@keyframes blobFloat {
  0% {
    border-radius: 58% 42% 48% 52% / 52% 48% 52% 48%;
    transform: translate(0, 0) scale(1) rotate(0deg);
  }
  25% {
    border-radius: 42% 58% 52% 48% / 48% 52% 48% 52%;
    transform: translate(40px, -30px) scale(1.1) rotate(3deg);
  }
  50% {
    border-radius: 52% 48% 58% 42% / 50% 50% 50% 50%;
    transform: translate(-20px, 35px) scale(0.92) rotate(-2deg);
  }
  75% {
    border-radius: 48% 52% 42% 58% / 58% 42% 58% 42%;
    transform: translate(25px, 15px) scale(1.06) rotate(2deg);
  }
  100% {
    border-radius: 50% 50% 48% 52% / 48% 52% 50% 50%;
    transform: translate(-30px, -20px) scale(1.03) rotate(-1deg);
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
  align-items: center;
}

.brand-area {
  flex: 55;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  width: 180px;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.08));
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
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(24px) saturate(1.4);
  -webkit-backdrop-filter: blur(24px) saturate(1.4);
  border: 1px solid rgba(255, 255, 255, 0.7);
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
