<template>
  <div
    class="flex flex-col items-center p-[26px] relative top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[400px] h-[480px] border rounded-[48px]"
  >
    <h2 class="text-[28px]">{{ text }}</h2>
    <div class="space-y-[16px] text-center">
      <div>邮箱</div>
      <NtInput v-model="signEntity!.email" placeholder="请输入邮箱"></NtInput>
      <div>密码</div>
      <NtInput v-model="signEntity!.password" type="password" placeholder="请输入密码"></NtInput>
      <template v-if="!isSignIn">
        <div>再次输入密码</div>
        <NtInput
          v-model="signEntity!.passwordAgain"
          type="password"
          placeholder="再次输入密码"
        ></NtInput>
      </template>
    </div>

    <div class="my-[20px]">
      <NtButton class="border hover:text-theme" @click="sign">{{ text }}</NtButton>
    </div>
    <RouterLink v-if="!isSignIn" to="/login" class="text-blue-700 cursor-pointer"
      >已有账号，去登录</RouterLink
    >
    <RouterLink v-else to="/register" class="text-blue-700 cursor-pointer"
      >还没有账号，去注册</RouterLink
    >
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'
import { omit } from 'lodash'
import { useRouter } from 'vue-router'
import { Routes } from '@/models'
import { useUserInfo } from '@/stores'

type SingUp = {
  email: string
  password: string
}

const props = withDefaults(
  defineProps<{
    isSignIn?: boolean
  }>(),
  {
    isSignIn: false
  }
)

const text = computed(() => (props.isSignIn ? '登录' : '注册'))
const signEntity = ref<{
  email?: string
  password?: string
  passwordAgain?: string
}>({})

function checkInput() {
  if (!signEntity.value?.email || !signEntity.value.password) {
    message.error('请输入账号及密码')
    return false
  }

  if (!props.isSignIn) {
    if (signEntity.value.password !== signEntity.value.passwordAgain)
      message.warn('两次输入的密码不一致')
    return false
  }

  return true
}
const router = useRouter()
const user = useUserInfo()
async function sign() {
  if(!checkInput()) return
  if (props.isSignIn) {
    await user.login(omit(signEntity.value, 'passwordAgain') as SingUp)
    router.push({
      name: Routes.all
    })
  } else {
    await user.register(omit(signEntity.value, 'passwordAgain') as SingUp)
    router.push({
      name: Routes.login
    })
  }
}
</script>
