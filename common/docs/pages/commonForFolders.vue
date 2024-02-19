<script setup>
/*
Common disply component for content folders that don't have
a specific component to customize the view. Examples of customized view:
 - pages/framework/apps/index.vue
 - pages/framework/backend/index.vue
If you create .vue in pages/... it will overwrite this component
*/
defineProps({
  path: {
	type: String,
	required: true
  }
})
</script>
<template>
<div class="py-8">
    <div class="mx-auto max-w-7xl gap-4 sm:gap-y-8 flex flex-col">
      <!-- <div class="flex flex-col">
        <h2 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl lg:text-4xl text-center">
          ...
        </h2>
      </div> -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 xl:grid-cols-2">
	 <ContentList v-slot="{ list }" :path="path">
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
