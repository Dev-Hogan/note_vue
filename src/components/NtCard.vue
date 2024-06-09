<template>
  <div ref="cardRef" :class="['_common-card', isWrite ? '!py-0 !px-0' : '']">
    <div
      v-show="!isWrite"
      class="group flex justify-between items-center text-[18px] font-medium text-light-7"
      @click="click"
    >
      <div>如何安装自定义字体到APP里？如何使用已安装的自定义字体额？</div>
      <div class="flex opacity-0 group-hover:opacity-100 transition-opacity space-x-1">
        <NtIconButton icon="link"><span class="text-light-4">5</span></NtIconButton>
        <NtDropdown
          :options="[
            {
              name: '取消聚焦',
              icon: 'focus',
              iconClass: 'stroke-theme',
              split: true
            },
            {
              name: '编辑',
              icon: 'edit',
              iconClass: 'stroke-theme',
              action: () => {
                isWrite = true
              }
            },
            {
              name: '标签',
              iconClass: 'stroke-theme',
              icon: 'link',
              split: true
            },
            {
              name: '沉浸模式',
              icon: 'fullscreen1',
              iconClass: 'stroke-theme',
              action: () => {
                editor?.fullscreen()
              }
            },
            {
              name: '分享',
              icon: 'share',
              iconClass: 'stroke-theme'
            },
            {
              name: '删除',
              icon: 'trash',
              iconClass: 'stroke-theme'
            }
          ]"
        >
          <NtIconButton icon="more"></NtIconButton>
        </NtDropdown>
      </div>
    </div>
    <NtEditorContent v-show="isWrite" ref="editor" v-model="text" @push="push">
      <template #linkTags>
        <NtIconButton
          icon="link"
          class="px-3 py-2 bg-light rounded-2 text-[12px] text-tag font-medium"
        >
          基础知识
        </NtIconButton>
        <NtIconButton
          icon="link"
          class="px-3 py-2 bg-light rounded-2 text-[12px] text-tag font-medium"
        >
          UI相关
        </NtIconButton>
      </template>
    </NtEditorContent>
  </div>
</template>

<script setup lang="ts">
import NtEditorContent from '@/components/NtEditorContent.vue'
const text = defineModel<string>()
const isWrite = ref(false)
text.value = '如何安装自定义字体到APP里？如何使用已安装的自定义字体额？'
const cardRef = ref()
const editor = ref<InstanceType<typeof NtEditorContent>>()

const clickCount = ref(0)
const timer = ref<number>()
function click() {
  clickCount.value++
  if (clickCount.value === 1) {
    // 设置定时器，1秒后重置点击次数
    timer.value = window.setTimeout(() => {
      clickCount.value = 0
    }, 1000)
  } else if (clickCount.value === 2) {
    // 清除定时器
    clearTimeout(timer.value)
    // 执行你想要的操作
    if (isWrite.value) {
      isWrite.value = false
    } else {
      isWrite.value = true
    }

    // 重置点击次数
    clickCount.value = 0
  }
}
function push(txt: string) {
  if (isWrite.value) {
    isWrite.value = false
  }
  console.log(txt)
}

onBeforeUnmount(() => {
  // 组件卸载前清除定时器
  clearTimeout(timer.value)
})
</script>
<style scoped>
._common-card {
  @apply border border-transparent hover:border-light-2 hover:shadow-[0_4px_2px_0_rgba(0,0,0,0.07)] py-[12px] pl-12 pr-6 rounded-4;
  @apply relative focus-within:border-theme focus:bg-theme-10 focus-within:bg-theme-10 transition-colors;
}
</style>
