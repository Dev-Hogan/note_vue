<template>
  <NtHeader title="随机看"></NtHeader>
  <NtContent class="relative flex">
    <div class="absolute top-0 left-[50%] translate-x-[-50%] text-light-4">1/3</div>
    <div class="flex flex-col flex-1">
      <div class="mt-[73px] font-medium text-[24px]">
        系统过渡效果如何组合在一起？以及如何做出出现和消失不同的动画？
      </div>
      <div v-show="isShow" :class="['flex-1']">内容</div>
      <div
        v-if="!isShow"
        class="hover:cursor-pointer text-light-3 font-medium text-[13px] absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%]"
        @click="isShow = true"
      >
        点击「显示内容」查看
      </div>
    </div>
    <div
      :class="[
        'absolute bottom-[50px] left-0 right-0 flex items-center justify-center space-x-8',
        '[&>button]:bg-light [&>button]:rounded-[48px] [&>button]:border font-medium'
      ]"
    >
      <NtButton class="text-light-3">上一个</NtButton>
      <NtButton class="border-theme text-theme !bg-default">显示内容</NtButton>
      <NtButton>添加至聚焦</NtButton>
      <NtButton>下一个</NtButton>
    </div>
  </NtContent>
</template>

<script setup lang="ts">
const isShow = ref(false)
</script>
