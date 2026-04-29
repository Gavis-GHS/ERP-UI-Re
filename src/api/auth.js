import { apiBaseUrl } from '@/config'

export function loginApi(userName, passWord) {
  const params = new URLSearchParams({ userName, passWord })
  return fetch(`${apiBaseUrl}/erp/User/LoginAccount?${params}`)
    .then(res => res.json())
}
