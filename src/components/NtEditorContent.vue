<template>
  <div ref="el" :class="['editor overflow-hidden', isFullscreen ? 'bg-theme-10' : '']">
    <editor-content :editor="editor" :class="[isFullscreen ? 'mt-[46px] content' : '']">
    </editor-content>
    <NtIconButton class="absolute top-[10px] right-[24px]" icon="more"></NtIconButton>
    <div
      v-if="$slots.linkTags"
      :class="[
        'flex h-[37px] space-x-5 max-w-[750px]',
        isFullscreen ? 'absolute mx-auto bottom-[97px] link ' : ''
      ]"
    >
      <slot name="linkTags"></slot>
    </div>
    <menu
      :class="[
        'flex flex-1 h-[54px] w-full absolute bottom-0 left-0  px-[18px] justify-between items-center',
        isFullscreen
          ? 'max-w-[750px] left-[50%] border mb-[25px] translate-x-[-50%] shadow2 rounded-[11px]'
          : ''
      ]"
    >
      <div class="flex">
        <NtIconButton icon="linkTag"></NtIconButton>
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
        <NtIconButton icon="fullScreen2" @click="toggle"></NtIconButton>
      </div>
      <NtIconButton icon="publish" @click="emit('push', modelValue)"></NtIconButton>
    </menu>
  </div>
</template>

<script setup lang="ts">
import { EditorContent, Editor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Placeholder } from '@tiptap/extension-placeholder'
import { useFullscreen } from '@vueuse/core'
const modelValue = defineModel<string>()
modelValue.value = '<h1>输入问题内容</h1><p>写自己的答案</p>'

withDefaults(defineProps<{ isFocus?: boolean }>(), { isFocus: false })

const editor = shallowRef<Editor>()

const el = ref<HTMLElement | null>(null)

const { isFullscreen, toggle } = useFullscreen(el)

const emit = defineEmits(['push', 'fullscreen'])
const fullscreen = () => {
  toggle()
  emit('fullscreen', isFullscreen.value)
}

defineExpose({
  fullscreen
})

onMounted(() => {
  editor.value = new Editor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1]
        }
      }),
      Placeholder.configure({
        placeholder: '123'
      })
    ],
    editorProps: {
      attributes: {
        // eslint-disable-next-line max-len
        class:
        // eslint-disable-next-line max-len
          'content mx-auto max-w-[750px] h-full mb-[20px] focus:outline-none [&>h1]:font-medium [&>h1]:mb-[12.5px] [&>h1]:text-[18px] [&>p]:text-[14px] [&>ul]:list-disc [&>ol]:list-decimal [&>ul]:ml-[18px] [&>ol]:ml-[14px]'
      }
    },
    autofocus: 'start',

    content: modelValue.value,
    onUpdate: () => {
      // HTML
      modelValue.value = editor.value?.getHTML()

      // JSON
      // this.$emit('update:modelValue', this.editor.getJSON())
    }
  })
})
onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>
<style scoped>
.link {
  left: calc(50% - 350px);
}

.content {
  max-height: calc(100vh - 97px);
}
</style>
