<template>
  <main class="w-full h-screen relative overflow-hidden">
    <NtConfigProvide>
      <RouterView />
    </NtConfigProvide>
    <div
      class="text-light-7 absolute bottom-12 right-12 border rounded-full w-14 h-14 flex items-center justify-center cursor-pointer"
      @click="geDevTool"
    >
      dev
    </div>
  </main>
</template>

<script setup lang="ts">
import router from '@/router'
import { Routes, ThemeMode } from '@/models'
import { THEME_KEY } from '@/const'
const theme = localStorage.getItem(THEME_KEY) || ThemeMode.light
if (theme === ThemeMode.light) {
  document.documentElement.classList.remove(ThemeMode.dark)
  document.documentElement.classList.add(ThemeMode.light)
} else {
  document.documentElement.classList.remove(ThemeMode.light)
  document.documentElement.classList.add(ThemeMode.dark)
}

function geDevTool() {
  const currentRouter = router.currentRoute.value.name
  if (currentRouter !== Routes.dev) {
    router.push({
      name: Routes.dev,
      query: {
        title: '开发工具'
      }
    })
  } else {
    console.warn('Already in dev page')
  }
}
</script>
