import { createGlobalState } from '@vueuse/core'
import { login as loginAPI, register as registerAPI } from '@/api'
import { AuthResponse } from '@supabase/supabase-js'
type SingUp = {
  email: string
  password: string
}
export const useUserInfo = createGlobalState(() => {
  const userInfo = ref<AuthResponse['data']['user']>()
  const token = ref<string>()
  const login = async (sign: SingUp) => {
    const data = await loginAPI(sign)
    userInfo.value = data?.user
    token.value = data?.session?.access_token
  }
  const register = async (sign: SingUp) => {
    const data = await registerAPI(sign)
    userInfo.value = data?.user
    token.value = data?.session?.access_token
  }

  const isLogin = () => {
    if (!token.value) return false
    return true
  }
  return { login, userInfo, token, isLogin, register }
})
