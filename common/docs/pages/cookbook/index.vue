<script setup lang="ts">
import automations from '~/assets/json/automations';
import { Integrations } from '~/assets/types/integrations';

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

	 
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl gap-4 sm:gap-y-8 flex flex-col">
        <div class="flex flex-col">
          <h2 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl lg:text-4xl text-center">
            Cookbooks
          </h2>

          
        </div>


        <div class="flex flex-col">
            <p>
              Filter by inegration:
            </p>

            <div class="flex pt-2 gap-4">
      <div v-for="integration in Integrations" :key="integration" >
        <div class="block hover:scale-110 transition pt-2 ">
         
          <RouterLink :to="`/cookbook/integration/${integration.replace(' ', '-').toLowerCase()}`">
            <UTooltip :text="integration">
            <img :src="`/assets/images/apps/${integration.replace(' ', '-').toLowerCase()}.png`" width="40px" height="40px" :alt="integration" loading="lazy" class="rounded-xl">
          </UTooltip> 
          </RouterLink>
         
        </div>
      </div>
      </div>

        

          </div>


          <div class="flex flex-col">
            <p>
            All cookbooks: 
            </p>
          </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 xl:grid-cols-4">
    
        

            <div
              v-for="automation in automations"
              :key="automation.handle" class="card"
            >
              <NuxtLink :to="`/cookbook/automation/${automation.handle}`" class="focus:outline-none" color="primary" orientation="vertical">
                <div class="gap-x-8 gap-y-4 rounded-xl flex flex-col flex-1 px-4 py-5 sm:p-6">
                  <div class="">
                    <p class="text-gray-900 dark:text-white text-base font-bold">
                      {{ automation.title }}
                    </p>
                  </div>
                </div>
              </NuxtLink>
            </div>
         
        </div>
      </div>

    </UPage>
  </UContainer>
</template>
