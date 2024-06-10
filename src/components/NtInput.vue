<template>
  <div
    :class="[
      'flex items-center border space-x-2 pl-3 min-h-[28px] text-s relative',
      'text-light-6 caret-theme border-light-2 hover:border-theme hover:bg-transparent transition-colors duration-75 rounded-4',
      isFocused ? 'border-theme bg-transparent shadow-theme' : '',
      isInput ? 'bg-transparent' : ''
    ]"
    @focusin="isFocused = true"
    @focusout="isFocused = false"
  >
    <div>
      <slot name="prefix"></slot>
    </div>
    <input
      ref="inputRef"
      v-model="modelValue"
      :autofocus="autoFocus"
      :autocomplete="autoComplete"
      :maxlength="maxLength"
      :placeholder="placeholder"
      :class="['flex-1 outline-none bg-transparent', inputClass]"
      :type
      @input="
        (e) => {
          emitInput(e as InputEvent)
        }
      "
    />
  </div>
</template>

<script setup lang="ts">
// import { useDebounceFn } from '@vueuse/core'
const isFocused = ref(false)
const isInput = ref(false)
const modelValue = defineModel< string | null | undefined>()
withDefaults(
  defineProps<{
    placeholder?: string
    inputClass?: string
    hightLight?: boolean
    autoComplete?: 'off' | 'on' | 'new-password'
    maxLength?: number
    autoFocus?: boolean
    type?:'text'|'password'
  }>(),
  {
    placeholder: undefined,
    inputClass: undefined,
    hightLight: false,
    autoComplete: 'on',
    maxLength: undefined,
    autoFocus: false,
    type:"text"
  }
)
watchEffect(() => {
  if (modelValue.value) {
    isInput.value = true
  } else {
    isInput.value = false
  }
})

const inputRef = ref<HTMLInputElement>()
const focus = () => {
  inputRef.value?.focus()
}
const blur = () => {
  inputRef.value?.blur()
}

const emit = defineEmits<{
  (e: 'input', val: string | undefined): void
}>()
const emitInput = (e: InputEvent) => {
  if (e.isTrusted) {
    if (e.data === null) {
      emit('input', undefined)
    } else {
      emit('input', e.data)
    }
  }
}
// const dbEmitInput = useDebounceFn(emitInput, 100)

defineExpose({
  focus,
  blur
})
</script>
