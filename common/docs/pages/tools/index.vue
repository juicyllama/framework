<script setup lang="ts">
import tools from '~/assets/json/tools';

useHead({
  title: 'Free Automation Tools :: JuicyLlama',
  meta: [
    { name: 'description', content: 'Free Automation and Workflow Tooling' }
  ],
})

const links = [{
  label: 'Home',
  icon: 'i-heroicons-home',
  to: '/'
}, {
  label: 'Tools',
}]
</script>

<template>
	 <UContainer>
    <UPage>

      <UBreadcrumb :links="links" class="pt-8" />

	 
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl gap-4 sm:gap-y-8 flex flex-col">
        <div class="flex flex-col">
          <h2 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl lg:text-4xl text-center">
            Tools
          </h2>
        </div>


        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 xl:grid-cols-4">
          <div
            class="card"
            v-for="tool in tools" :key="tool.title">
            <a :href="`${tool.link}`" class="focus:outline-none" color="primary" orientation="vertical" tabindex="-1" target="_blank">
              <div class="gap-x-8 gap-y-4 rounded-xl flex flex-col flex-1 px-4 py-5 sm:p-6">
                <div>
                  <div class="mb-2 pointer-events-none">
                    <Icon :name="tool.icon" class="w-8 h-8 flex-shrink-0 text-gray-900 dark:text-white" />
                    </div>
                    <p class="text-gray-900 dark:text-white text-base font-bold truncate" v-html="tool.title"></p>
                    <p class="text-[15px] text-gray-500 dark:text-gray-400 mt-1" v-html="tool.text"></p>
                    
                    <div class="grid grid-cols-4 gap-4 pt-2">
                      <div v-for="stack in tool.stack" :key="stack">
                        <div class="block lg:hover:scale-110 transition">
                          <RouterLink :to="`/cookbook/stack/${stack}`"><img :src="`/assets/images/apps/${stack.replace(' ', '-').toLowerCase()}.png`" :alt="stack" loading="lazy" class="rounded-xl"></RouterLink>
                        </div>
                      </div>
                  </div>
              
                </div>
                
              </div>
            </a>
          </div>
			  </div>
        
      </div>

    </UPage>
  </UContainer>
</template>
