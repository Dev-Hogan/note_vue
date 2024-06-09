<template>
  <NtHeader title="全部" @add="() => (hasNewNote = true)" @toggle="(d) => (isFold = d)">
    <NtTagGroup v-model="tagId"></NtTagGroup>
  </NtHeader>

  <NtContent class="!mt-[130px]" content-class="space-y-5">
    <NtEditorCard
      v-if="hasNewNote"
      v-model:content="NoteEntity.content"
      can-edit
      :model-value="NoteEntity"
      @publish="
        (d, count) =>
          handleSaveNote({
            isEmpty: d,
            content: NoteEntity.content,
            count
          })
      "
    ></NtEditorCard>
    <NtEditorCard
      v-for="item in Notes"
      :key="item.id"
      v-model:content="item.content"
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
import { useAsyncState, useSessionStorage } from '@vueuse/core'
import { searchNote, saveNote, deleteNote } from '@/api'
import { Note } from '@/models'

const tagId = useSessionStorage<number | undefined>('all-tagid', undefined, {
  serializer: {
    read: (raw) => {
      return raw ? +raw : undefined
    },
    write: (raw) => (raw ? raw + '' : '')
  }
})

const { state: Notes, execute: refreshNotes } = useAsyncState(
  async () => await searchNote({ tagId: tagId.value }),
  [],
  {
    immediate: false
  }
)
watch(
  tagId,
  () => {
    refreshNotes()
  },
  {
    immediate: true
  }
)
const NoteEntity = ref<Note>({
  content: ''
})
const hasNewNote = ref(false)

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
    hasNewNote.value = false
    NoteEntity.value.content = ''
    refreshNotes()
  }
}

async function handleDeleteNote(ids: number[]) {
  await deleteNote(ids)
  refreshNotes()
}

const isFold = ref(false)
</script>
