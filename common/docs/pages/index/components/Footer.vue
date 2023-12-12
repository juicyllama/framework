<template>
	<footer class="relative">
		<div class="border-t border-gray-200 dark:border-gray-800">
			<div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 lg:py-12">
				<div class="xl:grid xl:grid-cols-3 xl:gap-8">
					<div class="flex flex-col lg:grid grid-flow-col auto-cols-fr gap-8 xl:col-span-2">
						<div v-for="column in columns" :key="column.name">
							<h3 class="text-sm/6 font-semibold text-gray-900 dark:text-white">{{ column.name }}</h3>
							<ul role="list" class="mt-6 space-y-4" v-for="link in column.links" :key="link.label">
								<li>
									<a class="text-sm relative text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
										:href="link.link" rel="noopener noreferrer" target="_blank">{{ link.label }}</a>
								</li>
							</ul>
						</div>
					</div>
					<FooterNewsletter />
				</div>
			</div>
		</div>
		<div class="border-t border-gray-200 dark:border-gray-800">
			<div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 lg:py-4 lg:flex lg:items-center lg:justify-between !py-6">
				<div class="lg:flex-1 flex items-center justify-center lg:justify-end gap-x-1.5 lg:order-3">
					<a type="button" v-for="item in media" :key="item.icon"
						class="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-sm gap-x-1.5 p-1.5 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center"
						:href="item.link" rel="noopener noreferrer" target="_blank">
						<Icon :name="`bi:${item.icon}`" class="flex-shrink-0 h-5 w-5" aria-hidden="true" />
					</a>
				</div>
				<div class="mt-3 lg:mt-0 lg:order-2 flex items-center justify-center"></div>
				<div class="flex items-center justify-center lg:justify-start lg:flex-1 gap-x-1.5 mt-3 lg:mt-0 lg:order-1">
					<p class="text-gray-500 dark:text-gray-400 text-sm"> Copyright © 2016-2023 Nuxt - <a
							href="https://github.com/nuxt/nuxt/blob/main/LICENSE" rel="noopener noreferrer" target="_blank"
							class="hover:underline"> MIT License </a></p>
				</div>
			</div>
		</div>
	</footer>
</template>

<script setup>
import FooterNewsletter from './FooterNewsletter.vue'
const columns = [
	{
		name: 'Community',
		links: [
			{ label: 'Nuxters', link: '#' },
			{ label: 'Video Courses', link: '#' },
			{ label: 'Nuxt on GitHub', link: '#' },
			{ label: 'Design Kit', link: '#' }
		]
	},
	{
		name: 'Enterprise',
		links: [
			{ label: 'Support', link: '#' },
			{ label: 'Agencies', link: '#' },
			{ label: 'Jobs', link: '#' },
			{ label: 'Sponsors', link: '#' }
		]
	},
	{
		name: 'Solutions',
		links: [
			{ label: 'Nuxt Content', link: '#' },
			{ label: 'Nuxt DevTools', link: '#' },
			{ label: 'Nuxt Image', link: '#' },
			{ label: 'Nuxt UI', link: '#' }
		]
	},
]

const media = [
	{ icon: 'twitter-x', link: '#' },
	{ icon: 'discord', link: '#' },
	{ icon: 'github', link: '#' },
]
</script>
