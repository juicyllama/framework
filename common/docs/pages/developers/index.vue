<script setup lang="ts">
useHead({
  title: 'Developers :: Docs :: JuicyLlama Rapid Development Framework',
  meta: [
    { name: 'description', content: 'Contribute to the open source framework' }
  ],
})

const links = [
	{
		link: 'code-style-guide',
		icon: 'nonicons:prettier-16',
		title: 'Code Style Guide',
		description: 'Learn our coding standards and development principles when contributting to our framework code.'
	},
	{
		link: 'contributing',
		icon: 'ri:git-merge-line',
		title: 'Contributing',
		description: 'The basics on contributing to our framework through our best practises and proven processors.'
	}
]
</script>

<template>
	<div class="py-8">
		<div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl gap-4 sm:gap-y-8 flex flex-col">
			<div class="flex flex-col">
				<h2 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl lg:text-4xl">
					<span>Developer <span class="text-primary">Quicklinks</span></span>
				</h2>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-8 xl:grid-cols-4">
				<div
					class="card"
					v-for="(link, index) in links" :key="index">
					<NuxtLink  :to="`/development/${link.link}`" class="focus:outline-none" color="primary" orientation="vertical">
						<div class="gap-x-8 gap-y-4 rounded-xl flex flex-col flex-1 px-4 py-5 sm:p-6 dark:bg-gray-900/50">
							<div class="">
								<div class="mb-2">
									<Icon :name="link.icon" class="text-primary" size="4rem" />
								</div>
								<p class="text-gray-900 dark:text-white text-base font-bold truncate">{{ link.title }}</p>
								<p class="text-[15px] text-gray-500 dark:text-gray-400 mt-1">{{link.description}}</p>
							</div>
						</div>
					</NuxtLink>
				</div>
			</div>
		</div>
	</div>
</template>
