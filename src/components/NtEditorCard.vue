<template>
  <div
    ref="el"
    :class="[
      '_editor-card relative overflow-hidden transition-[height] duration-[2s] ease-linear',
      isEdit ? 'is-active max-h-[246px]' : 'max-h-[53px]'
    ]"
  >
    <div class="space-y-[9px]">
      <NtScrollbar class="max-h-[120px]">
        <NtEditor2 ref="editorRef" v-model:model-value="content" class="cursor-default"></NtEditor2>
      </NtScrollbar>
      <div class="flex space-x-2 absolute top-[4px] right-[20px]">
        <NtIconButton icon="link3" class="!text-light-3 text-[12px] font-medium">5</NtIconButton>
        <NtDropdown
          :chars="editorRef?.editor?.getText()?.length"
          :options="[
            {
              name: '沉浸模式',
              icon: 'fullscreen1Theme',
              action: () => toggle()
            },
            {
              name: modelValue.isFocused ? '取消聚焦' : '聚焦',
              icon: 'focusTheme',
              split: true,
              action: () => toggleFocus(modelValue.id!, modelValue.isFocused)
            },
            {
              name: '编辑',
              icon: 'editTheme',
              action: () => edit()
            },
            {
              name: '标签',
              icon: 'linkTheme',
              split: true,
              action: () => openLink()
            },

            {
              name: '分享',
              icon: 'shareTheme',
              action: () => emit('share', modelValue.id)
            },
            {
              name: '删除',
              icon: 'trashTheme',
              action: () => emit('delete', modelValue.id)
            }
          ]"
        >
          <NtIconButton icon="more"></NtIconButton>
        </NtDropdown>
      </div>
      <div class="space-x-2 flex">
        <div
          v-for="item in tags"
          :key="item.id"
          class="flex items-center space-x-1 text-tag text-[12px] font-medium bg-light rounded-3 p-3"
        >
          <NtIcon icon="link"></NtIcon> {{ item.name }}
        </div>
      </div>
      <div class="flex justify-between">
        <div class="flex">
          <TagDropdownCard :category-id="modelValue.categoryId" :when-save="refresh" :open>
            <NtIconButton icon="tag"></NtIconButton>
          </TagDropdownCard>
          <NtIconButton icon="picture"></NtIconButton>
          <NtIconButton
            icon="bold"
            :disabled="!editor?.can().chain().focus().toggleBold().run()"
            :class="{ 'is-active': editor?.isActive('bold') }"
            @click="editor?.chain().focus().toggleBold().run()"
          ></NtIconButton>
          <NtIconButton
            icon="numbering"
            :class="{ 'is-active': editor?.isActive('orderedList') }"
            @click="editor?.chain().focus().toggleOrderedList().run()"
          ></NtIconButton>
          <NtIconButton
            icon="li"
            :class="{ 'is-active': editor?.isActive('bulletList') }"
            @click="editor?.chain().focus().toggleBulletList().run()"
          ></NtIconButton>
          <!-- <NtIconButton icon="fullScreen2"></NtIconButton> -->
        </div>
        <NtButton type="primary" class="rounded-[28px]" @click="publish">发布</NtButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NtEditor2 from './NtEditor2.vue'
import { NoteMock } from '@/models'
import { useAsyncState, useFullscreen } from '@vueuse/core'
import { searchTag, saveNote } from '@/api'
const editorRef = ref<InstanceType<typeof NtEditor2>>()
const content = defineModel<string>('content', { default: '<h1>这是标题</h1>' })
const modelValue = defineModel<NoteMock>({
  default: {
    id: undefined,
    content: undefined,
    categoryId: undefined,
    tagId: undefined,
    isFocused: false
  }
})

const editor = computed(() => editorRef.value?.editor)
const props = withDefaults(
  defineProps<{
    canEdit?: boolean
  }>(),
  {
    canEdit: false
  }
)
nextTick(() => {
  editor.value?.setEditable(false)
  props.canEdit && edit()
})
const isEdit = ref(false)

function edit() {
  editor.value?.setEditable(true)
  isEdit.value = true
  editor.value?.commands?.focus()
}
function noEdit() {
  editor.value?.setEditable(false)
  isEdit.value = false
  editor.value?.commands?.blur()
}

function publish() {
  noEdit()
  emit(
    'publish',
    editorRef?.value?.editor?.isEmpty,
    editorRef?.value?.editor?.getText()?.length || 0
  )
}

const emit = defineEmits<{
  publish: [isEmpty?: boolean, val?: number]
  delete: [val?: number]
  share: [val?: number]
}>()

watch(
  () => props.canEdit,
  (val) => {
    val ? edit() : noEdit()
  }
)

const { state: tags, execute: refresh } = useAsyncState(
  async () =>
    await searchTag({
      entity: {
        categoryId: modelValue.value?.categoryId,
        id: modelValue.value?.tagId
      },
      pageSize: 999999
    }),
  [],
  {
    immediate: false
  }
)
watch(isEdit, (val) => {
  val === true && refresh()
})

const open = ref(false)
function openLink() {
  open.value = true
}

const el = ref<HTMLElement | null>(null)
const { toggle } = useFullscreen(el)

async function toggleFocus(id: number, isFocused = false) {
  await saveNote({
    id,
    isFocused: !isFocused
  })
}
</script>
<style lang="scss" scoped>
._editor-card {
  @apply border border-transparent py-[12px] px-[20px]  rounded-4;
  @apply transition-all;
  &:hover {
    @apply cursor-pointer shadow-[0_4px_12px_0_rgba(0,0,0,0.03)];
  }
  &.is-active {
    @apply shadow-[0_4px_12px_0_rgba(0,0,0,0.03)] border-theme bg-['#fffefc'];
  }
}
</style>
