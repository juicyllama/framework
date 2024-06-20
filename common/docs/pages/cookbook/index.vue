<script setup lang="ts">
useHead({
  title: 'Cookbook :: JuicyLlama',
  meta: [
    { name: 'description', content: 'Autmation Workflow Cookbook' }
  ],
})


const links = [{
  label: 'Home',
  icon: 'i-heroicons-home',
  to: '/'
}, {
  label: 'Cookbook',
}]
</script>

<template>
	 <UContainer>
    <UPage>

      <UBreadcrumb :links="links" class="pt-8" />

	  <div class="py-8">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl gap-4 sm:gap-y-8 flex flex-col">
        <div class="flex flex-col">
          <h2 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl lg:text-4xl text-center">
            Example Automation Workflows
          </h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 xl:grid-cols-4">
          <ContentList v-slot="{ list }" path="/cookbook">
            <div
              v-for="article in list"
              :key="article._path" class="card"
            >
              <NuxtLink :to="article._path" class="focus:outline-none" color="primary" orientation="vertical">
                <div class="gap-x-8 gap-y-4 rounded-xl flex flex-col flex-1 px-4 py-5 sm:p-6 dark:bg-gray-900/50">
                  <div class="">
                    <p class="text-gray-900 dark:text-white text-base font-bold">
                      {{ article.title }}
                    </p>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </ContentList>
        </div>
      </div>
    </div>

    </UPage>
  </UContainer>
</template>
