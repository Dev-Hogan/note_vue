<template>
  <Dropdown
    :trigger="[trigger]"
    @open-change="
      (d) => {
        isOpen = d
      }
    "
  >
    <template #default>
      <div v-if="$slots.default">
        <slot name="default" v-bind="{ isOpen }"></slot>
      </div>
    </template>
    <template #overlay>
      <div
        :class="[
          'w-[158px] min-h-[170px] rounded-5 border-[0.5px] bg-default py-3 space-y-2 text-light-7',
          overlayClass
        ]"
      >
        <slot name="overlay">
          <div
            v-for="(item, i) in options"
            :key="i"
            :class="['flex  flex-col space-y-2 text-light-7 font-medium text-[14px] min-h-[36px]']"
          >
            <div
              :class="[
                'relative mx-3 flex flex-1 items-center transition-colors px-2 space-x-2 min-h-[32px] hover:bg-light-2 rounded-3 hover:cursor-pointer',
                item.class ? item.class : ''
              ]"
              @click="exitAction(item)"
            >
              <NtIcon v-if="item.icon" :icon="item.icon" :icon-class="item.iconClass"> </NtIcon>
              <slot name="item">
                <div>
                  {{ item.name }}
                </div>
              </slot>
              <NtIcon
                v-if="item.appendIcon"
                class="absolute right-7 top-[50%] translate-y-[-50%]"
                :icon="item.appendIcon"
                :icon-class="item.iconClass"
              >
              </NtIcon>
            </div>
            <div
              :class="[
                'w-full h-[1px]  overflow-hidden',
                item.split ? 'bg-light-2' : 'bg-transparent'
              ]"
            ></div>
          </div>
        </slot>
        <slot v-if="showCount" name="overlayAppend">
          <div class="p-3 text-light-4 text-[12px] space-x-2 px-6" @click.stop>
            <span>卡片</span><span>:</span><span>{{ chars }}</span>
          </div>
        </slot>
      </div>
    </template>
  </Dropdown>
</template>

<script setup lang="ts">
import { Dropdown } from 'ant-design-vue'
import { Icon } from '@/models'
type Option = {
  name?: string
  icon?: Icon
  appendIcon?: Icon
  class?: string
  iconClass?: string
  split?: boolean
  action?: (item?: Option) => any
}
type Trigger = 'click' | 'hover' | 'contextmenu'
withDefaults(
  defineProps<{
    options?: Option[]
    radius?: number
    overlayClass?: string
    trigger?: Trigger
    showCount?: boolean
    chars?: number
  }>(),
  {
    options: () => [],
    radius: 10,
    overlayClass: '',
    trigger: 'hover',
    showCount: true,
    chars: 0
  }
)
const isOpen = ref(false)

function exitAction(item: Option) {
  if (item.action) {
    item.action(item)
  }
  isOpen.value = false
}
</script>
