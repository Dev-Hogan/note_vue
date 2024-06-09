<template>
  <div class="flex w-full h-full">
    <aside
      :style="{ width: sidebarWidth + 'px' }"
      class="relative w-[--aside-width] pt-[48px] pb-[54px] bg-light flex flex-col border-r-[1px]"
    >
      <NtInput v-model="searchName" class="mx-6 bg-light-2" placeholder="搜索">
        <template #prefix>
          <NtIcon icon="search"></NtIcon>
        </template>
      </NtInput>
      <NtMenusTitle title="概览"></NtMenusTitle>
      <NtMenus :menus="menus"></NtMenus>

      <NtMenusTitle title="分类">
        <template #append>
          <NtTooltip title="新分类">
            <NtIconButton icon="addTag" @click="categoryOpen = true"></NtIconButton>
          </NtTooltip>
        </template>
      </NtMenusTitle>

      <NtScrollbar>
        <NtMenus class="overflow-auto scroll-bar" :menus="categorys" type="category">
          <template #append="{ menu }">
            <NtDropdown
              :options="[
                {
                  name: '重命名',
                  icon: 'editTheme',
                  split: true,
                  action: () => {
                    categoryId = menu.id
                    categoryOpen = true
                  }
                },
                {
                  name: '导出PDF',
                  icon: 'pdf3'
                },
                {
                  name: '删除分类',
                  icon: 'trashTheme',
                  split: true,
                  action: () => menu.id && handleDeleteMuCategory([menu.id])
                }
              ]"
            >
              <template #default="{ isOpen }">
                <NtIconButton
                  icon="more"
                  :class="[
                    'group-hover:opacity-100 opacity-0',
                    isOpen ? 'opacity-100' : 'opacity-0'
                  ]"
                >
                </NtIconButton>
              </template>
            </NtDropdown>
          </template>
        </NtMenus>
      </NtScrollbar>

      <div class="h-[54px] pl-[18px] pt-[10px] pb-[14px] fixed bottom-0">
        <NtDropdown :show-count="false" overlay-class="p-11 flex flex-1 flex-col">
          <template #overlay>
            <div class="!space-y-5 !py-7">
              <TodayCharts></TodayCharts>
              <div>
                <div class="text-[10px] text-light-6">今天 2024/1/4</div>
                <div class="text-[16px] text-theme font-semibold">1234字符</div>
              </div>
              <div class="space-y-3 font-medium">
                <div
                  v-for="(item, i) in [
                    {
                      name: '数据统计',
                      icon: 'arrowRight',
                      action: () => {
                        $router.push({ name: Routes.statistic })
                      }
                    },
                    {
                      name: '设置',
                      icon: 'arrowRight',
                      action: () => {
                        $router.push({ name: Routes.settings })
                      }
                    }
                  ]"
                  :key="i"
                  class="flex items-center justify-between cursor-pointer min-h-[36px]"
                  @click="item?.action?.()"
                >
                  <div>{{ item.name }}</div>
                  <NtIcon v-if="item.icon" :icon="item.icon as Icon"></NtIcon>
                </div>
              </div>
            </div>
          </template>
          <div class="flex items-center space-x-3">
            <NtAvatar class="w-[30px] h-[30px]">
              <img :src="avatar" />
            </NtAvatar>
            <div class="text-[13px] font-medium">Haaozhang</div>
          </div>
        </NtDropdown>
      </div>
      <div
        class="h-full w-2 cursor-col-resize bg-transparent absolute top-0 bottom-0 right-0 mousedown:bg-theme-40"
        @mousedown="startResize"
        @mouseup="stopResize"
      ></div>
    </aside>
    <main class="relative flex flex-1 overflow-auto bg-default text-light-7">
      <NtScrollbar
        v-if="!searchName"
        class="flex-1"
        :wrap-class="'flex flex-1 flex-col'"
        :view-class="['flex flex-1 flex-col']"
      >
        <RouterView></RouterView>
      </NtScrollbar>
      <SearchNotes v-else :model-value="searchNotes"></SearchNotes>
    </main>
    <!-- 新增分类弹窗 -->
    <EditCategoryDialog
      v-model:open="categoryOpen"
      v-model:id="categoryId"
      :when-save="categoryRefresh"
    ></EditCategoryDialog>
  </div>
</template>

<script setup lang="ts">
import { getAllMuCategory, deleteMuCategory, searchAllNotesByName } from '@/api'
import { menus } from '@/mock'
import { sidebarWidth, useEcharts } from '@/utils'
import { Icon, Routes } from '@/models'
import { message } from 'ant-design-vue'
import router from '@/router'
import avatar from '@/assets/avatar.png'
import { useAsyncState, debouncedWatch } from '@vueuse/core'
import SearchNotes from './SearchNotes.vue'

const searchName = ref<string | undefined>('')

const categoryOpen = ref<boolean>(false)
const categoryId = ref<number>()

const { state: searchNotes, execute: refreshSearch } = useAsyncState(
  async () => await searchAllNotesByName(searchName.value),
  []
)
debouncedWatch(searchName, () => {
  refreshSearch()
})

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
  sidebarWidth.value = Math.max(170, newWidth) // 设置最小宽度为50px
  if (newWidth >= 350) {
    sidebarWidth.value = 350
  }
}

function stopResize() {
  isResizing = false
  document.removeEventListener('mousemove', resize)
  document.removeEventListener('mouseup', stopResize)
}
window.addEventListener('mouseup', stopResize)

const { state: categorys, execute: categoryRefresh } = useAsyncState(
  async () => await await getAllMuCategory(),
  []
)

async function handleDeleteMuCategory(ids: number[]) {
  await deleteMuCategory(ids)
  resetMenu(ids?.[0])
  message.success('删除成功')
  categoryRefresh()
}

function resetMenu(id?: number) {
  const currentRouter = router.currentRoute
  const currentCategoryId = +currentRouter.value.params.categoryId

  if (currentCategoryId === id) {
    // router.push({
    //   name: Routes.category
    // })
    router.back()
  } else {
    return
  }
}

const { NtChart: TodayCharts } = useEcharts({
  height: '60px',
  option: {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'none'
      },
      formatter: (val: any) => {
        const data = val?.[0]
        return (
          `<span class="text-[14px] text-light-6">${data?.name}<span>` +
          '<br>' +
          `<div class="text-theme text-[15px] font-semibold">${data?.value}字符</div>`
        )
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: 0,
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        show: false,
        data: ['2024/1/1', '2024/1/2', '2024/1/3', '2024/1/4', '2024/1/4', '2024/1/5', '2024/1/6'],
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          show: false
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        },
        axisLabel: {
          show: false
        }
      }
    ],
    series: [
      {
        name: '字符',
        type: 'bar',
        barWidth: '60%',
        data: [
          10,
          52,
          200,
          {
            value: -10,
            itemStyle: {
              color: '#EAEAEA'
            }
          },
          390,
          330,
          220
        ],

        emphasis: {
          label: {},
          itemStyle: {
            color: '#FF800A'
          }
        },
        itemStyle: {
          borderRadius: 5
        }
      }
    ]
  }
})
</script>
