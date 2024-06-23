<script setup lang="ts">
import automations from '../../../assets/json/automations';
import { Automation } from '../../../assets/types/automation';

definePageMeta({
  layout: 'cookbook',
  colorMode: 'dark',
})

const route = useRoute()
const router = useRouter()
const { seo } = useAppConfig()

const handle = route.path.split('/').pop()

const filtered_automations: Automation[] = automations.filter((automation) => automation.stack.includes(handle))

console.log(filtered_automations.length)

if(!filtered_automations.length){
   router.push('/404')
}

useSeoMeta({
  titleTemplate: `%s - ${seo?.siteName}`,
  title:`%s - ${seo?.siteName}`,
})


console.log(handle)


useHead({
  title: `${handle} :: Cookbook :: JuicyLlama`,
  meta: [
    { name: 'description', content: `Autmation Workflow Cookbook for ${handle}` }
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
             Cookbooks using {{ handle }}
          </h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 xl:grid-cols-4">
    
            <div
              v-for="automation in filtered_automations"
              :key="automation.handle" class="card"
            >
              <NuxtLink :to="`/cookbook/automation/${automation.handle}`" class="focus:outline-none" color="primary" orientation="vertical">
                <div class="gap-x-8 gap-y-4 rounded-xl flex flex-col flex-1 px-4 py-5 sm:p-6 dark:bg-gray-900/50">
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
    </div>

    </UPage>
  </UContainer>
</template>
