<template>
  <div
    class="h-screen flex-1 flex flex-col justify-between items-center pb-[68px] pt-[110px] w-[360px] mx-auto"
  >
    <div class="space-y-[115px] text-center">
      <div v-if="step[0]">
        <div class="text-[28px] font-semibold text-theme">问禅笔记</div>
        <div class="text-light-5 text-[14px]">通过问问题的方式来记录、学习、回顾知识</div>
      </div>
      <div v-else-if="step[1]">
        <div class="text-[28px] font-semibold text-theme">输入验证码</div>
        <div class="text-light-5 text-[14px]">已向邮箱 wenchan@gmail.com发送验证</div>
      </div>
      <div v-else-if="step[2]">
        <div class="text-[28px] font-semibold text-theme">输入姓名</div>
      </div>
      <div v-if="step[0]" class="space-y-[37px]">
        <NtInput
          v-model="account"
          :class="[
            'h-[42px] mx-auto border-0 text-light-3 text-[30px] font-medium !px-[31px]',
            'transition-colors'
          ]"
          input-class="placeholder:text-center text-[30px]"
          placeholder="邮箱或手机号"
        ></NtInput>
        <NtButton
          :disabled="!isWriteAccount"
          :class="[
            'rounded-3 text-white bg-light-2 px-[150px] py-[12px] w-full text-[30px]',
            isWriteAccount ? 'bg-theme' : ''
          ]"
          @click="handleContinue(account!)"
          >继续</NtButton
        >
      </div>
      <div
        v-else-if="step[1]"
        :class="['flex items-center justify-center space-x-[25px] [&>div]:flex [&>div]:space-x-2']"
      >
        <div>
          <NtInput
            ref="inputRefs"
            :class="['_code-input', i === 4 ? '!ml-[20px]' : '']"
            v-for="i in 6"
            :key="i"
            v-model="verificationCode[i - 1]"
            :max-length="1"
            auto-complete="new-password"
            @update:model-value="(d: string) => updateCode(i - 1, d || '')"
            @keyup.delete="deleteCode(i - 1)"
          ></NtInput>
        </div>
      </div>
      <div v-else-if="step[2]">
        <NtAvatar :shape="'square'" class="w-[110px] h-[110px] mb-[17px] !rounded-12"></NtAvatar>
        <NtInput
          ref="nameInputRef"
          v-model="name"
          :class="[
            'h-[42px] mx-auto border-0 text-light-3 text-[24px] font-medium !px-[31px]',
            'transition-colors'
          ]"
          input-class="placeholder:text-center text-[24px]"
          placeholder="昵称"
        ></NtInput>
        <NtButton
          @click="goHome"
          :disabled="!isWriteName"
          :class="[
            'rounded-3 text-white bg-light-2 px-[150px] py-[12px] w-full text-[16px] mt-[48px]',
            isWriteName ? 'bg-theme' : ''
          ]"
          >开始</NtButton
        >
      </div>
    </div>
    <div class="text-light-5 text-[12px] font-medium">
      点击登录即表示你同意我们的《用户协议》和《隐私政策》
    </div>
    <NtIconButton
      v-if="!step[0]"
      icon="arrowLeft3"
      @click="back"
      class="absolute top-[30px] left-[30px]"
    ></NtIconButton>
  </div>
</template>

<script setup lang="ts">
import NtInput from '@/components/NtInput.vue'
import { useSessionStorage } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { Routes } from '@/models'
const account = ref<string>()
const name = ref<string>()
const isWriteAccount = computed(() => !!account.value)
const isWriteName = computed(() => !!name.value)
// 0、填邮箱 1、验证码 2、输入姓名
const step = useSessionStorage('register-step', [true, false, false])
const router = useRouter()

function back() {
  // const idx = step.value.findIndex((d) => d)
  // if (idx > 0) {
  //   step.value[idx] = false
  //   step.value[idx - 1] = true
  // }
  if (step.value[1]) {
    step.value[1] = false
    step.value[0] = true
  } else if (step.value[2]) {
    step.value[2] = false
    step.value[1] = false
    step.value[0] = true
  }
}

function handleContinue(val: string) {
  if (!val) return
  step.value[0] = false
  step.value[1] = true
}

const verificationCode = ref<string[]>([])
const inputRefs = ref<InstanceType<typeof NtInput>[]>([])
function updateCode(idx: number, value: string) {
  if (value && value.trim() !== '') {
    // 聚焦
    if (idx === 6) {
      inputRefs.value![0]?.focus()
    } else {
      inputRefs.value![idx + 1]?.focus()
    }
  }
}
function deleteCode(idx: number) {
  if (idx > 0) {
    inputRefs.value![idx - 1]?.focus()
  }
}
watch(
  () => step.value[1],
  (val) => {
    nextTick(() => {
      val && inputRefs.value![0]?.focus()
    })
  },
  {
    immediate: true
  }
)

const nameInputRef = ref<InstanceType<typeof NtInput>>()
watch(
  () => step.value[2],
  (val) => {
    nextTick(() => {
      val && nameInputRef.value?.focus()
    })
  },
  {
    immediate: true
  }
)

window.addEventListener('keyup', listenEnter)

function verifyCode() {
  const flag = verificationCode.value.every((d) => {
    return !!d === true
  })

  if (flag && verificationCode.value.length === 6) {
    console.log(verificationCode.value)

    step.value[1] = false
    step.value[2] = true
  }
}

function listenEnter(e: KeyboardEvent) {
  if (step.value[1] === false) return
  if (e.key === 'Enter') verifyCode()
}

function goHome() {
  router.push({
    name: Routes.all
  })
}

onUnmounted(() => {
  window.removeEventListener('keyup', listenEnter)
})
</script>
<style lang="scss" scoped>
:deep(input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill) {
  -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
  background-color: transparent !important;
  background-image: none;
  transition: background-color 50000s ease-in-out 0s; //背景色透明  生效时长  过渡效果  启用时延迟的时间
}
._code-input {
  @apply border-x-0 border-t-0 rounded-none w-[36px] text-[20px] text-center border-b-light-6 border-b-[3px];
  @apply focus-within:border-b-theme;
}
</style>
