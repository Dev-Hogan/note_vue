import { createGlobalState } from '@vueuse/core'
import { login as loginAPI, register as registerAPI } from '@/api'
import { AuthResponse } from '@supabase/supabase-js'
type SingUp = {
  email: string
  password: string
}
const AuthKey = 'sb-sqcizgdytqqjsyytccdk-auth-token'

export const useUserInfo = createGlobalState(() => {
  const initUserInfo = JSON.parse(
    localStorage.getItem(AuthKey) || '{}'
  ) as AuthResponse['data']['user']
  const userInfo = ref<AuthResponse['data']['user'] | undefined>(initUserInfo)

  const beforeToken = JSON.parse(
    localStorage.getItem(AuthKey) || '{}'
  ) as AuthResponse['data']['session']
  // console.log(beforeToken?.access_token)

  const token = ref<string | undefined>(beforeToken?.access_token)
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
