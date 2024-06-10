import { supabase } from '../supbaseAPI'

type SingUp = {
  email: string
  password: string
}
export async function register(credentials: SingUp) {
  const { data, error } = await supabase.auth.signUp(credentials)
  if (error) {
    return console.debug(error, 'register failed')
  }
  return data
}
export async function registerPasswordless() {
  supabase.auth.signUp
}

export async function login(credentials?: SingUp) {
  if (!credentials) {
    console.debug('需要输入账号或密码')
    return
  }
  const { data } = await supabase.auth.signInWithPassword(credentials)
  // const { data } = await supabase.auth.signInWithOtp({ email: credentials.email })
  return data
}

export async function logout() {
  await supabase.auth.signOut()
  console.debug('登出成功')
}

export async function getUser() {
  return supabase.auth.getUser()
}

export async function loginWithGithub() {
  return await supabase.auth.signInWithOAuth({
    provider: 'google'
  })
}

export async function loginWithEmail() {
  return await supabase.auth.signInWithOtp
}
