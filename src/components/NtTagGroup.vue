<template>
  <NtScrollbar view-class="flex py-3 space-x-2">
    <NtTag
      v-for="tag in [{ name: '无标签', id: undefined }, ...(tags || [])]"
      :key="tag.id"
      :value="tag.id"
      :class="[tagId === tag.id ? 'text-theme' : '']"
      @activated="(d) => (tagId = d)"
    >
      <NtDropdown
        :trigger="'contextmenu'"
        :options="[
          {
            name: '前往该标签',
            icon: 'tagTheme',
            split: true
          },
          {
            name: '重命名',
            icon: 'editTheme'
          },
          {
            name: '删除标签',
            icon: 'trashTheme',
            split: true
          }
        ]"
      >
        {{ tag.name }}
      </NtDropdown>
    </NtTag>
  </NtScrollbar>
</template>

<script setup lang="ts">
import { searchTag } from '@/api'
import { useAsyncState } from '@vueuse/core'
const props = withDefaults(
  defineProps<{
    categoryId?: number
  }>(),
  {
    categoryId: undefined
  }
)
const tagId = defineModel<number>()
const { state: tags } = useAsyncState(
  async () =>
    await searchTag(
      {
        entity: {
          categoryId: props?.categoryId
        }
      },
      true
    ),
  [
    // {
    //   name: '无标签',
    //   id: undefined
    // }
  ],
  {
    immediate: true
  }
)
</script>
