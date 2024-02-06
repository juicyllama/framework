<script setup lang="ts">
useHead({
  title: 'Backend :: Docs :: JuicyLlama Rapid Development Framework',
  meta: [
    { name: 'description', content: 'JuicyLlama backend modules available' }
  ],
})
defineOgImage({
  component: 'Docs',
  title: 'Backend',
  description: 'JuicyLlama backend modules available'
})
</script>

<template>
  <div class="py-8">
    <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl gap-4 sm:gap-y-8 flex flex-col">
      <div class="flex flex-col">
        <h2 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl lg:text-4xl">
          JuicyLlama backend modules available
        </h2>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 xl:grid-cols-4">
        <ContentList v-slot="{ list }" path="/framework/backend">
          <div
            v-for="article in list"
            :key="article._path" class="card"
          >
            <NuxtLink :to="article._path" class="focus:outline-none" color="primary" orientation="vertical">
              <div class="gap-x-8 gap-y-4 rounded-xl flex flex-col flex-1 px-4 py-5 sm:p-6 dark:bg-gray-900/50">
                <div class="">
                  <p class="text-gray-900 dark:text-white text-base font-bold truncate">
                    {{ article.title }}
                  </p>
                  <p class="text-[15px] text-gray-500 dark:text-gray-400 mt-1">
                    {{ article.description }}
                  </p>
                </div>
              </div>
            </NuxtLink>
          </div>
        </ContentList>
      </div>
    </div>
  </div>
</template>
