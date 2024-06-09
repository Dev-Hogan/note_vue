<template>
  <Tooltip overlay-class-name="tooltip" :title>
    <template #default>
      <slot name="default"></slot>
    </template>
  </Tooltip>
</template>

<script setup lang="ts">
import { Tooltip } from 'ant-design-vue'
withDefaults(
  defineProps<{
    title?: string
  }>(),
  {
    title: ''
  }
)
</script>
<style>
.tooltip .ant-tooltip-inner {
  @apply bg-default text-[13px] text-light-6 font-medium rounded-4 border-[0.5px];
}
.tooltip .ant-tooltip-arrow {
  @apply opacity-0;
}
</style>
