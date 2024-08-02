<script setup lang="ts">
import type { Tool } from '~/assets/types/tool';
import automations from '../../../assets/json/automations';
import tools from '../../../assets/json/tools';
import type { Automation } from '../../../assets/types/automation';

definePageMeta({
  layout: 'cookbook',
  colorMode: 'dark',
})

const route = useRoute()
const router = useRouter()
const { seo } = useAppConfig()

const handle = route.path.split('/').pop()
const friendly_handle = titleCase(handle.replace(/-/g, ' '))

const filtered_automations: Automation[] = automations.filter((automation) => automation.stack.includes(friendly_handle))
const filtered_tools: Tool[] = tools.filter((tool) => tool.stack.includes(friendly_handle))

if(!filtered_automations.length){
   router.push('/404')
}

useSeoMeta({
  titleTemplate: `%s - ${seo?.siteName}`,
  title:`%s - ${seo?.siteName}`,
})

useHead({
  title: `${friendly_handle} :: Cookbook :: JuicyLlama`,
  meta: [
    { name: 'description', content: `Autmation Workflow Cookbook for ${friendly_handle}` }
  ],
})

const links = [{
  label: 'Home',
  icon: 'i-heroicons-home',
  to: '/'
},  
{
  label: 'Cookbook',
  to: '/cookbook'
},
{
  label: friendly_handle,
}]

function titleCase(str) {
   var splitStr = str.toLowerCase().split(' ');
   for (var i = 0; i < splitStr.length; i++) {
       // You do not need to check if i is larger than splitStr length, as your for does that for you
       // Assign it back to the array
       splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
   }
   // Directly return the joined string
   return splitStr.join(' '); 
}
</script>

<template>
	 <UContainer>
    <UPage>

      <UBreadcrumb :links="links" class="pt-8" />


      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl gap-4 sm:gap-y-8 flex flex-col">
        <div class="flex flex-col">
          <h2 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl lg:text-4xl text-center">
             Tools using {{ friendly_handle }}
          </h2>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 xl:grid-cols-4">
          <div
            class="card"
            v-for="tool in filtered_tools" :key="tool.title">
            <a :href="`${tool.link}`" class="focus:outline-none" color="primary" orientation="vertical" tabindex="-1" target="_blank">
              <div class="gap-x-8 gap-y-4 rounded-xl flex flex-col flex-1 px-4 py-5 sm:p-6">
                <div>
                  <div class="mb-2 pointer-events-none">
                    <Icon :name="tool.icon" class="w-8 h-8 flex-shrink-0 text-gray-900 dark:text-white" />
                    </div>
                    <p class="text-gray-900 dark:text-white text-base font-bold truncate" v-html="tool.title"></p>
                    <p class="text-[15px] text-gray-500 dark:text-gray-400 mt-1" v-html="tool.text"></p>
                    
                </div>
                
              </div>
            </a>
          </div>
			  </div> 

        
      </div>
	  
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl gap-4 sm:gap-y-8 flex flex-col">
        <div class="flex flex-col">
          <h2 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl lg:text-4xl text-center">
             Cookbooks using {{ friendly_handle }}
          </h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 xl:grid-cols-4">
    
            <div
              v-for="automation in filtered_automations"
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
