<template>
  <NtHeader title="header">
    <template #right>
      <div>👉</div>
      <div>👉</div>
    </template>
  </NtHeader>
  <NtContent>
    <h1>开发工具</h1>
    <button class="border" @click="toggleTheme">点击切换主题{{ themeMode }}</button>
    <br />
    <h1>编辑器</h1>
    <editor-content :editor="editor" />
    <br />
    <h1>图标库</h1>
    <section class="flex gap-4 flex-wrap max-w-[1000px]">
      <div
        v-for="icon in icons"
        :key="icon"
        class="px-2 py-2 cursor-pointer"
        @click="copyIcon(icon)"
      >
        <div>{{ icon }}</div>
        <NtIcon :icon="icon"></NtIcon>
      </div>
    </section>
    <h1>组件</h1>
    <br />
    <NtInput v-model="inputValue">
      <template #prefix>
        <NtIcon icon="search"></NtIcon>
      </template>
    </NtInput>
    <div>{{ inputValue }}</div>
    <br />
    <Dialog> </Dialog>
    <NtButton type="primary" @click="dialogOpen = true">点击弹窗</NtButton>
    <NtDialog v-model:open="dialogOpen" title="false"> 123</NtDialog>

    <HighLight></HighLight>
    <NtInput hight-light></NtInput>
    <div>流水线测试12</div>
    <ul>
      <li v-for="(name, i) in userName" :key="i">{{ name }}</li>
    </ul>
    <div class="flex space-x-4">
      <NtInput v-model="formString" placeholder="from 必填"></NtInput>
      <NtInput v-model="select" placeholder="select"></NtInput>
    </div>
    <div>返回结果</div>
    <pre>{{ severData }}</pre>
    <br />
    <div ref="container" class="container">
      <div class="sidebar" :style="{ width: sidebarWidth + 'px' }">
        <!-- 侧边栏内容 -->
        <div class="resizer" @mousedown="startResize"></div>
      </div>
      <div class="main-content">
        <!-- 主内容区域 -->
      </div>
    </div>
    <br />
    <div class="editor">test style</div>
    <br />
    <Tooltip
      @open-change="
        (d) => {
          console.log('触发tooltip', d)
        }
      "
    >
      asdf
    </Tooltip>
    12
    <NtTest></NtTest>

    <NtChart></NtChart>
    <button @click="getTag">点击获取所有分类</button>
    {{tags}}
  </NtContent>
</template>

<script setup lang="ts">
import { useThemMode } from '@/stores'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Icon, ThemeMode } from '@/models'
import { iconMap } from '@/utils'
import { message } from 'ant-design-vue'
import { Dialog } from '@/components/NtDialog2'
import { Tooltip } from 'ant-design-vue'
import { useTest } from '@/components/test'
import { useEcharts } from '@/components/NtChart'
import { getAllTag } from '@/api'
const tags = ref<any[]>([])

async function getTag() {
  const ret = await getAllTag()
  tags.value = ret.data||[]
}
const { NtTest } = useTest({ count: 12 })
const { NtChart } = useEcharts({
  height: '400px',
  option: {
    title: {
      text: '测试'
    },
    xAxis: {
      data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
    },
    yAxis: {},
    series: [
      {
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }
    ]
  }
})

const themeModeStore = useThemMode()
const themeMode = computed(() => themeModeStore.themeMode.value)
function toggleTheme() {
  if (themeMode.value === ThemeMode.light) {
    document.documentElement.classList.remove(ThemeMode.light)
    document.documentElement.classList.add(ThemeMode.dark)
    themeModeStore.setThemeMode(ThemeMode.dark)
  } else {
    document.documentElement.classList.remove(ThemeMode.dark)
    document.documentElement.classList.add(ThemeMode.light)
    themeModeStore.setThemeMode(ThemeMode.light)
  }
}

const editor = useEditor({
  content: '<p>I’m running Tiptap with Vue.js. 🎉</p>',
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2]
      }
    })
  ]
})

const icons = Object.keys(iconMap).sort() as Icon[]
function copyIcon(icon: Icon) {
  try {
    navigator.clipboard.writeText(`<NtIcon icon="${icon}"></NtIcon>`).then(() => {
      message.success('复制icon成功')
    })
  } catch (e) {
    // console.log(navigator);
    console.log(e, 'http没有复制api')
    console.log(`<NtIcon icon="${icon}"></NtIcon>`)
  }
}

const inputValue = ref<string>('123')

const dialogOpen = ref<boolean>(false)

const userName = ref<string[]>(['username'])

const severData = ref()
const formString = ref<string>('user')
const select = ref<string>()

const container = ref<HTMLElement | null>(null)
const sidebarWidth = ref(200)
let isResizing = false
let startX = 0
let startWidth = 0

function startResize(event: MouseEvent) {
  isResizing = true
  startX = event.clientX
  startWidth = sidebarWidth.value
  document.addEventListener('mousemove', resize)
  document.addEventListener('mouseup', stopResize)
}

function resize(event: MouseEvent) {
  if (!isResizing) return
  const diffX = event.clientX - startX
  const newWidth = startWidth + diffX
  sidebarWidth.value = Math.max(50, newWidth) // 设置最小宽度为50px
}

function stopResize() {
  isResizing = false
  document.removeEventListener('mousemove', resize)
  document.removeEventListener('mouseup', stopResize)
}

onMounted(() => {
  if (container.value) {
    container.value.addEventListener('mouseleave', stopResize)
  }
})

onUnmounted(() => {
  if (container.value) {
    container.value.removeEventListener('mouseleave', stopResize)
  }
})
</script>
<style scoped>
.container {
  display: flex;
}

.sidebar {
  background-color: #f0f0f0;
  position: relative;
  overflow: auto;
}

.resizer {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 10px;
  cursor: col-resize;
  background-color: #ccc;
}

.main-content {
  flex: 1;
  padding: 20px;
  background-color: red;
}
</style>
<style lang="postcss" scoped>
.editor {
  @apply min-h-[200px] border font-medium focus:outline-none hover:bg-theme;
}
</style>
