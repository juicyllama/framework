<script setup lang="ts">
import automations from '~/assets/json/automations';

definePageMeta({
  layout: 'cookbook',
  colorMode: 'dark',
})

const route = useRoute()
const router = useRouter()
const { seo } = useAppConfig()

const handle = route.path.split('/').pop()

const page = automations.find((automation) => automation.handle === handle)

if(!page){
   router.push('/404')
}

useSeoMeta({
  titleTemplate: `%s - ${seo?.siteName}`,
  title: page.title,
  ogTitle: `${page.title} - ${seo?.siteName}`,
  description: page.what,
  ogDescription: page.what
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
  label: page.title,
}]

</script>

<template>
 <UContainer>
  <UPage>
    <UBreadcrumb :links="links" class="pt-8" />

      
      <h1 class="pt-8 text-2xl font-bold">{{ page.title }}</h1>
      <p class="text-sm">{{page.id}}</p>

      <h2 class="pt-8 text-xl font-bold text-primary">What is the automation?</h2>
      <p class="text-md">{{page.what}}</p>

      <h2 class="pt-8 text-xl font-bold text-primary">Why is it important?</h2>
      <p class="text-md">{{page.why}}</p>
      
      <h2 class="pt-8 text-xl font-bold text-primary">What is the cost benefit?</h2>
      <p class="text-md">{{page.cost_benefit}}</p>

      <h2 class="pt-8 text-xl font-bold text-primary">What solution did we implement?</h2>
      <p class="text-md">{{page.solution}}</p>

      <h2 class="pt-8 text-xl font-bold text-primary">Teck Stack</h2>
    
      <div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-4 sm:gap-5 lg:gap-8 pt-2">
      <div v-for="stack in page.stack" :key="stack">
        <div class="block lg:hover:scale-110 transition">
          <RouterLink :to="`/cookbook/stack/${stack}`"><img :src="`/assets/images/apps/${stack.replace(' ', '-').toLowerCase()}.png`" :alt="stack" loading="lazy" class="rounded-xl"></RouterLink>
        </div>
      </div>
      </div>


      <h2 class="pt-8 text-xl font-bold text-primary">Integrations</h2>
    
      <div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-4 sm:gap-5 lg:gap-8 pt-2">
      <div v-for="integration in page.integrations" :key="integration">
        <div class="block lg:hover:scale-110 transition">
          <RouterLink :to="`/cookbook/integration/${integration.replace(' ', '-').toLowerCase()}`"><img :src="`/assets/images/apps/${integration.replace(' ', '-').toLowerCase()}.png`" :alt="integration" loading="lazy" class="rounded-xl"></RouterLink>
        </div>
      </div>
      </div>

  </UPage>
  </UContainer>
</template>
