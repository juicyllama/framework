<script setup>
import apps from '../../../assets/json/apps.json'
</script>

<template>
  <div class="py-24 sm:py-32 bg-gray-900">
    <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl gap-16 sm:gap-y-24 grid lg:grid-cols-2 lg:items-center">
      <div class="">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
          <span>Ship
            faster with<br><span class="text-primary">Prebuilt Apps</span></span>
        </h2>
        <p class="mt-6 text-lg/8 text-gray-600 dark:text-gray-300">
          <span>Our prebuilt apps can be added to your project with just a few simple steps. These building blocks allow you to achieve almost anything quickly and easily.</span>
        </p>
        <div class="mt-8 flex flex-wrap gap-x-3 gap-y-1.5">
          <a
            type="button"
            class="button-primary"
            href="/framework/apps"
          >
            <Icon name="ph:puzzle-piece-duotone" class="flex-shrink-0 h-5 w-5" />
            See All Apps
          </a>
        </div>
      </div>
      <div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 lg:grid-cols-5 gap-4 sm:gap-5 lg:gap-8">
        <template v-for="link in apps" :key="link">
          <NuxtLink v-if="!link.pageNotAvailable" :href="`/framework/apps/${link.key}`" class="block lg:hover:scale-110 transition">
            <img :src="`/images/apps/${link.key}.png`" :alt="link.key" loading="lazy" class="rounded-xl">
          </NuxtLink>
          <div v-else class="block lg:hover:scale-110 transition">
            <img :src="`/images/apps/${link.key}.png`" :alt="link.key" loading="lazy" class="rounded-xl">
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

