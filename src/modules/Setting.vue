<template>
  <NtHeader title="设置"></NtHeader>
  <NtContent content-class="flex flex-1 justify-between">
    <div class="space-y-[40px]">
      <div class="flex items-center space-x-12">
        <NtAvatar class="w-[80px] h-[80px]">
          <img :src="avatar" />
        </NtAvatar>
        <div>
          <div class="font-extrabold text-[22px]">Haaozhang</div>
          <div class="texts-[13px] text-light-5">加入问禅234天</div>
        </div>
        <NtButton class="border border-light-2 rounded-[34px]">编辑</NtButton>
      </div>
      <div class="flex justify-between gap-[60px]">
        <div class="flex flex-col w-[480px]">
          <div class="flex [&>div]:flex items-center justify-between">
            <div>存储空间</div>
            <div class="space-x-2">
              <div>15%</div>
              <div>75/500M</div>
            </div>
          </div>
          <NtProgress></NtProgress>
          <div class="font-medium text-[12px] text-light-5">
            *开通会员即可获得10G每年的存储空间+原图上传，会员到期30天后超出500M的图片资源将可能被冻结<span
              class="shrink-0 text-tag ont-medium text-[12px] underline ml-2 cursor-pointer"
              >查看详情</span
            >
          </div>
        </div>
        <NtButton
          class="leading-4 items-center min-h-0 border border-theme text-theme font-bold text-[14px] bg-theme-15 rounded-5 !px-8 py-5 h-[37px]"
        >
          加入会员</NtButton
        >
      </div>
      <div>
        <div class="font-medium">邮箱</div>
        <NtInput
          v-model="email"
          class="mt-[5px] mb-[11px] h-[46px] text-light-7 text-[14px]"
        ></NtInput>
        <NtButton class="_button">修改邮箱</NtButton>
      </div>
      <div>
        <div class="font-medium">外观</div>
        <div class="flex space-x-5 text-center mt-8">
          <div v-for="item in themes" :key="item.id" class="space-y-5 cursor-pointer">
            <img :src="item.img" />
            <div class="text-[13px] text-light-5">{{ item.name }}</div>
          </div>
        </div>
      </div>
      <div class="space-y-8">
        <div class="flex space-x-2">
          <div class="font-medium">自动同步</div>
          <div class="inline-block bg-theme rounded-[3px] px-2 py-[1px] text-default">PRO</div>
        </div>
        <div class="space-x-7">
          <NtButton class="_button">备份数据</NtButton>
          <NtButton class="_button">导入备份</NtButton>
        </div>
      </div>
      <div class="space-y-8">
        <div class="font-medium">危险操作</div>
        <NtButton class="_button !text-delete" @click="logout">退出登录</NtButton>
      </div>
    </div>

    <div class="space-x-10 text-light-4 mb-[24px] text-center mt-[100px]">
      <span class="cursor-pointer">用户协议</span>
      <span class="text-light-2">|</span><span class="cursor-pointer">隐私政策</span>
    </div>
  </NtContent>
</template>

<script setup lang="ts">
import avatar from '@/assets/avatar.png'
import themeLight from '@/assets/theme-light.png'
import themeDark from '@/assets/theme-dark.png'
import themeSunny from '@/assets/theme-sunny.png'
import themeSea from '@/assets/theme-sea.png'
import { useRouter } from 'vue-router'
import { Routes } from '@/models'
const email = ref<string>('Wenchan@gmail.com')
const themes = [
  {
    id: 1,
    name: '浅色',
    img: themeLight
  },
  {
    id: 2,
    name: '暗色',
    img: themeDark
  },
  {
    id: 3,
    name: 'Sunny',
    img: themeSunny
  },
  {
    id: 4,
    name: 'Sea',
    img: themeSea
  }
]
const router = useRouter()
function logout() {
  router.push({
    name: Routes.login,
    query: {
      init: 1
    }
  })
}
</script>
<style scoped>
._button {
  @apply border border-light-2 rounded-4 px-8 py-5 text-light-7 font-medium;
}
</style>
