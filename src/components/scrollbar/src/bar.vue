<template>
  <thumb :move="moveX" :ratio="ratioX" :size="width" :always="always" />
  <thumb :move="moveY" :ratio="ratioY" :size="height" vertical :always="always" />
</template>
<script lang="ts" setup>
import { barProps } from './bar'
import Thumb from './thumb.vue'
import { GAP } from './util'
import { ref } from 'vue'

const props = defineProps(barProps)

const moveX = ref(0)
const moveY = ref(0)

const handleScroll = (wrap: HTMLDivElement) => {
  if (wrap) {
    const offsetHeight = wrap.offsetHeight - GAP
    const offsetWidth = wrap.offsetWidth - GAP

    moveY.value = ((wrap.scrollTop * 100) / offsetHeight) * props.ratioY
    moveX.value = ((wrap.scrollLeft * 100) / offsetWidth) * props.ratioX
  }
}

defineExpose({
  handleScroll
})
</script>
