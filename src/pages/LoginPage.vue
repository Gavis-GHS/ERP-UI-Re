<template>
  <div class="login-wrapper">
    <el-card class="login-card">
      <template #header>
        <h2 class="login-title">用户登录</h2>
      </template>
      <el-form @submit.prevent="handleLogin">
        <el-form-item>
          <el-input
            ref="usernameInputRef"
            v-model="userName"
            placeholder="用户名"
            size="large"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="passWord"
            type="password"
            placeholder="密码"
            size="large"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            :disabled="loading"
            style="width:100%"
            @click="handleLogin"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { loginApi } from '@/api/auth'
import { login } from '@/store/auth'

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
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f0f4f8;
}

.login-card {
  width: 400px;
}

.login-title {
  margin: 0;
  text-align: center;
  font-size: 20px;
  color: #1a202c;
}
</style>
