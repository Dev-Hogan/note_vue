<template>
  <NtHeader title="标签">
    <template #edit>
      <div class="flex items-center space-x-3">
        <NtButton class="_button" @click="handleAddTag">测试新增</NtButton>
        <NtButton class="_button" @click="handelGo2tag">前往</NtButton>
        <NtButton class="_button" @click="handleMerge">合并</NtButton>
        <NtButton class="_button" @click="handleRename">重命名</NtButton>
        <NtButton class="_button" @click="handleDeleteTag(selectKeys)">删除</NtButton>
        <NtDropdown overlay-class="min-h-[140px]" :show-count="false">
          <NtIconButton
            icon="sort2"
            class="_button flex-1 items-center justify-center"
          ></NtIconButton>
          <template #overlay>
            <div
              v-for="item in [
                {
                  id: 1,
                  name: '标签名称',
                  split: true,
                  action: sortOrderByName
                },
                {
                  id: 2,
                  name: '笔记数量',
                  split: true,
                  action: sortOrderByCount
                },
                {
                  id: 3,
                  name: '创建日期',
                  action: sortOrderByTime
                }
              ]"
              :key="item.name"
              class="text-[14px] font-medium"
            >
              <div
                :class="[
                  'flex py-5 cursor-pointer space-x-2 px-5',
                  isSortKeySelected(item.id) ? 'text-theme' : ''
                ]"
                @click="handleSortSelected(item.id, item.action)"
              >
                <NtIcon :icon="isSortKeySelected(item.id) ? 'checkedTheme' : 'checked'"></NtIcon>
                <div>{{ item.name }}</div>
              </div>
              <div v-if="item.split" class="w-full h-[1px] bg-light-2"></div>
            </div>
          </template>
        </NtDropdown>
      </div>
    </template>
  </NtHeader>
  <NtContent>
    <div class="flex flex-wrap gap-5 mt-[33px]">
      <NtButton
        v-for="item in tags"
        :key="item.id"
        :class="[
          'border rounded-3 bg-light space-x-2',
          selectKeys.includes(item.id || 0) ? '[&>span]:text-white bg-theme' : ''
        ]"
        @click="select(item)"
      >
        <span class="text-light-6">{{ item.name }}</span
        ><span class="text-light-5 text-[12px]">{{ item.charsCount || 0 }}</span>
      </NtButton>
    </div>
  </NtContent>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'
import { deleteTag, getAllTags, saveTag } from '@/api'
import { useAsyncState } from '@vueuse/core'
import { Tag } from '@/models'
const categoryOpen = ref(false)
const categoryId = ref<number>()

const selectKeys = ref<number[]>([])
const tags = ref<Tag[]>([])
const { execute: refreshTags } = useAsyncState(async () => (tags.value = await getAllTags()), [], {
  immediate: false
})
refreshTags()

function select(item: Tag) {
  if (!item.id) {
    return
  }
  const hasKeyIdx = selectKeys.value.findIndex((d) => item.id === d)
  if (hasKeyIdx > -1) {
    selectKeys.value.splice(hasKeyIdx, 1)
  } else {
    selectKeys.value.push(item.id)
  }
}

function cannotMerge() {
  if (selectKeys.value.length < 2) {
    message.warn('数量小于2个，无法合并')
  }
}

function handleMerge() {
  cannotMerge()
}
function handleRename() {
  if (selectKeys.value.length >= 2 || selectKeys.value.length === 0) {
    message.warn('无法重命名')
    return
  }
  categoryOpen.value = true
  categoryId.value = selectKeys.value[0]
}

function handelGo2tag() {
  if (selectKeys.value.length >= 2 || selectKeys.value.length === 0) {
    message.warn('无法前往标签')
    return
  }
}
const sortKey = ref<number>()
function isSortKeySelected(id: number) {
  return id === sortKey.value
}
function handleSortSelected(id: number, cb?: () => any) {
  sortKey.value = id
  cb?.()
}
function sortOrderByCount() {
  tags.value.sort((a, b) => (b?.charsCount || 0) - (a?.charsCount || 0))
}
function sortOrderByName() {
  tags.value.sort((a, b) =>
    (a.name || '')?.toLocaleLowerCase().localeCompare((b.name || '')?.toLocaleLowerCase())
  )
}
function sortOrderByTime() {
  tags.value.sort((a, b) => {
    const dateA = a.createTime ? new Date(a.createTime) : new Date(0)
    const dateB = b.createTime ? new Date(b.createTime) : new Date(0)
    return dateA.getTime() - dateB.getTime()
  })
}

async function handleAddTag() {
  await saveTag({ name: '测试新增标签', charsCount: Math.round(Math.random() * 20) })
  refreshTags()
}
async function handleDeleteTag(ids: number[]) {
  await deleteTag(ids)
  refreshTags()
}
</script>
<style lang="scss" scoped>
._button {
  @apply border border-light-2 rounded-4 w-[64px] h-[34px] text-[13px] px-0;
}
</style>
