<template>
  <div class="relative">
    <input
      v-model="inputText"
      placeholder="输入文字"
      class="bg-transparent z-10"
      @input="updateHighlight"
    />
    <div class="absolute left-2 top-0 bg-red-300">
      <span v-for="(text, index) in highlightedText" :key="index" :style="{ color: text.color }">{{
        text.text
      }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'

interface HighlightRule {
  length: number
  color: string
}

export default defineComponent({
  name: 'HighlightInput',
  setup() {
    const inputText = ref('')
    const highlightRules: HighlightRule[] = [
      { length: 5, color: 'red' }, // 当输入长度达到5时，将文字标记为红色
      { length: 10, color: 'blue' } // 当输入长度达到10时，将文字标记为蓝色
      // 添加更多的规则以适应你的需求
    ]

    const highlightedText = computed(() => {
      let highlighted: { text: string; color: string }[] = []
      let remainingText = inputText.value
      for (let rule of highlightRules) {
        if (remainingText.length >= rule.length) {
          highlighted.push({
            text: remainingText.slice(0, rule.length),
            color: rule.color
          })
          remainingText = remainingText.slice(rule.length)
        } else {
          highlighted.push({
            text: remainingText,
            color: 'black'
          })
          break
        }
      }
      return highlighted
    })

    const updateHighlight = () => {
      // 可以在这里根据需要更新高亮规则
    }

    return {
      inputText,
      highlightedText,
      updateHighlight
    }
  }
})
</script>

<style scoped>
/* 在这里添加样式以自定义高亮颜色和其他样式 */
</style>
