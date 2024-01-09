<script setup lang="ts">
import apps from '../../../assets/json/apps.json'

useHead({
  title: 'Apps :: Docs :: JuicyLlama Rapid Development Framework',
  meta: [
    { name: 'description', content: 'Prebuild app integrations you can drop into your applications effortlessly' }
  ],
})
</script>

<template>
	<div class="py-8">
		<div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl gap-4 sm:gap-y-8 flex flex-col">
			<div class="text-center flex flex-col items-center">
				<h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
					<span>Prebuild App<br><span class="text-primary">Integrations</span></span>
				</h2>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-8 xl:grid-cols-4">
				<div
					class="card"
					v-for="(app, index) in apps" :key="index">
					<NuxtLink v-if="!app.pageNotAvailable" :to="`/framework/apps/${app.key}`" class="focus:outline-none" color="primary" orientation="vertical">
						<div class="gap-x-8 gap-y-4 rounded-xl flex flex-col flex-1 px-4 py-5 sm:p-6 dark:bg-gray-900/50">
							<div class="">
								<div class="mb-2">
									<img :src="`/images/apps/${app.key}.png`" :alt="app.key" loading="lazy" class="rounded-xl app-image">
								</div>
								<p class="text-gray-900 dark:text-white text-base font-bold truncate">{{ app.name }}</p>
								<p class="text-[15px] text-gray-500 dark:text-gray-400 mt-1">{{app.description}}</p>
							</div>
						</div>
					</NuxtLink>
					<div v-else class="focus:outline-none" color="primary" orientation="vertical">
						<div class="gap-x-8 gap-y-4 rounded-xl flex flex-col flex-1 px-4 py-5 sm:p-6 dark:bg-gray-900/50">
							<div class="">
								<div class="mb-2">
									<img :src="`/images/apps/${app.key}.png`" :alt="app.key" loading="lazy" class="rounded-xl app-image">
								</div>
								<p class="text-gray-900 dark:text-white text-base font-bold truncate">{{ app.name }}</p>
								<p class="text-[15px] text-gray-500 dark:text-gray-400 mt-1">{{app.description}}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
    .app-image {
        width: 100px;
        height: 100px;
    }
</style>
