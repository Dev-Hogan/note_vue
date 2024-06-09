<template>
  <component
    :is="iconMap[icon]?.[0]"
    :class="[iconMap[icon]?.[1] ? '' : '_svg', iconClass]"
  ></component>
</template>

<script setup lang="ts">
import { Icon } from '@/models'
import { iconMap } from '@/utils/icon'
withDefaults(defineProps<{ icon?: Icon; iconClass?: string }>(), {
  icon: 'addTag',
  iconClass: ''
})
</script>
<style lang="scss">
</style>
