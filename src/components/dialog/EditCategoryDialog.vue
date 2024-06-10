<template>
  <NtDialog v-model:open="open" :title="isEdit ? '重命名' : ''">
    <NtInput
      v-model="entity!.title"
      class="pl-3 py-[9px] select-all"
      input-class="select-all"
      auto-focus
    ></NtInput>
    <template #footer>
      <NtButton @click="resetDialog">取消</NtButton>
      <NtButton type="primary" @click="handleSave(entity!.title)">确认</NtButton>
    </template>
  </NtDialog>
</template>

<script setup lang="ts">
import { saveMuCategory, getMuCategory } from '@/api'
import { message } from 'ant-design-vue'
import { useAsyncState } from '@vueuse/core'
const open = defineModel<boolean>('open')
const dialogId = defineModel<number>('id', undefined)
const props = withDefaults(
  defineProps<{
    id?: number
    whenSave?: () => any
  }>(),
  {
    id: undefined,
    whenSave: undefined
  }
)
function resetDialog() {
  open.value = false
  dialogId.value = undefined
}
const isEdit = computed(() => !!props.id)
const { state: entity, execute: refresh } = useAsyncState(
  async () => await getMuCategory(props.id!),
  {
    title: '新增分类名称'
  },
  {
    immediate: false
  }
)

watch(
  () => props.id,
  () => {
    refresh()
  },
  {
    immediate: true
  }
)

async function handleSave(val = '未命名分类') {
  await saveMuCategory({ val, id: props.id })
  message.success('保存成功')
  resetDialog()
  props.whenSave?.()
}
</script>
