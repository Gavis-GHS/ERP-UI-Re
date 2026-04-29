import { reactive, computed } from 'vue'
import router from '@/router'

const STORAGE_KEY = 'user_info'

function loadUserInfo() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const state = reactive({
  userInfo: loadUserInfo()
})

export const isLoggedIn = computed(() => state.userInfo != null)

export const userInfo = computed(() => state.userInfo)

export function login(user) {
  const info = {
    userName: user.userName,
    supid: user.supid,
    uid: user.uid,
    supName: user.supName,
    checkFlag: user.checkFlag
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(info))
  state.userInfo = info
  router.push('/home')
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY)
  state.userInfo = null
  router.push('/login')
}
