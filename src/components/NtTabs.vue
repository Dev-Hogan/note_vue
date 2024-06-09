<template>
  <div :class="['w-full flex flex-1 p-[14px] space-x-[14px] transition-colors']">
    <div
      v-for="item in tabs"
      :key="item.id"
      :class="[
        'text-[16px] font-semibold text-light-3 cursor-pointer',
        item.id === currentTab ? activeClass : ''
      ]"
      @click="handleActiveTab(item.id)"
    >
      {{ item.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
type Tab = {
  id: number
  name: string
}
withDefaults(
  defineProps<{
    activeClass?: string
  }>(),
  {
    activeClass: 'text-light-7'
  }
)
const tabs = defineModel<Tab[]>('tabs', {
  default: [
    {
      id: 1,
      name: 'tab1'
    },
    {
      id: 2,
      name: 'tab2'
    }
  ]
})
const currentTab = defineModel<number | undefined>({
  default: 1
})

function handleActiveTab(id: number) {
  currentTab.value = id
}
</script>
