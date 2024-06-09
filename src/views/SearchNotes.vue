<template>
  <NtContent class="!mt-[130px] px-2 items-center" content-class="space-y-5">
    <NtEditorCard
    v-for="item in modelValue"
      :key="item.id"
      v-model:content="item.content"
      class="w-[750px]"
      :can-edit="isFold"
      :model-value="item"
      @publish="
        (d, count) =>
          handleSaveNote({
            isEmpty: d,
            content: item.content,
            id: item.id,
            count
          })
      "
      @delete="(d) => d && handleDeleteNote([d])"
    ></NtEditorCard>
  </NtContent>
</template>

<script setup lang="ts">
import { Note } from '@/models'
import { saveNote, deleteNote } from '@/api'
import { useSessionStorage } from '@vueuse/core'

withDefaults(
  defineProps<{
    modelValue?: Note[]
  }>(),
  { modelValue: () => [] }
)

const tagId = useSessionStorage<number | undefined>('all-tagid', undefined, {
  serializer: {
    read: (raw) => {
      return raw ? +raw : undefined
    },
    write: (raw) => (raw ? raw + '' : '')
  }
})

// const { state: Notes, execute: refreshNotes } = useAsyncState(
//   async () => await searchNote({ tagId: tagId.value }),
//   [],
//   {
//     immediate: false
//   }
// )
// watch(
//   tagId,
//   () => {
//     refreshNotes()
//   },
//   {
//     immediate: true
//   }
// )
const NoteEntity = ref<Note>({
  content: ''
})
async function handleSaveNote({
  isEmpty = false,
  content = '',
  id,
  count
}: {
  isEmpty?: boolean
  content?: string
  id?: number
  count?: number
}) {
  const defaultContent = '未命名笔记'
  await saveNote({ content: isEmpty ? defaultContent : content, id, tagId: tagId.value, count })
  if (!id) {
    NoteEntity.value.content = ''
    // refreshNotes()
  }
}

async function handleDeleteNote(ids: number[]) {
  await deleteNote(ids)
  // refreshNotes()
}
const isFold = ref(false)
</script>
