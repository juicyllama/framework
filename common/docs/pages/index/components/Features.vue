<template>
	<div class="py-24 sm:py-32">
		<div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl gap-16 sm:gap-y-24 flex flex-col">
			<div class="text-center flex flex-col items-center">
				<h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
					<span>Compose with<br><span class="text-primary">everything you need.</span></span>
				</h2>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-8 xl:grid-cols-4">
				<div
					class="relative group isolate rounded-xl background-gradient ring-1 ring-gray-200 dark:ring-gray-900 dark:hover:ring-green-400 hover:ring-green-400 flex-1 flex flex-col shadow"
					v-for="item in features" :key="item.title">
					<div
						class="overflow-hidden flex-1 flex flex-col rounded-xl divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900 hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-[background-opacity] dark:bg-gradient-to-b from-gray-700/50 to-gray-900/50">
						<div class="gap-x-8 gap-y-4 rounded-xl flex flex-col flex-1 px-4 py-5 sm:p-6 dark:bg-gray-900/50">
							<div class="">
								<a href="#" class="focus:outline-none" color="primary" orientation="vertical" tabindex="-1"><span
										class="absolute inset-0"></span></a>
								<div class="mb-2 pointer-events-none">
									<Icon :name="`i-ph:${item.icon}`" class="w-8 h-8 flex-shrink-0 text-gray-900 dark:text-white" />
								</div>
								<p class="text-gray-900 dark:text-white text-base font-bold truncate" v-html="item.title"></p>
								<p class="text-[15px] text-gray-500 dark:text-gray-400 mt-1" v-html="item.text"></p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
const features = [
	{
		icon: 'signpost-duotone',
		title: 'Routing &amp; Layouts',
		text: 'File based routing system to build complex views and interfaces with a powerful and conventional approach.'
	},
	{
		icon: 'plugs-connected-duotone',
		title: 'Data Fetching',
		text: 'Composables that run on the server to fetch data for your components and enable you to render content in different ways.'
	},
	{
		icon: 'image-duotone',
		title: 'Assets & Style',
		text: 'Image, Font and Script optimizations with a built-in support for CSS Modules, Sass, PostCSS, CSS-in-JS and more.'
	},
	{
		icon: 'trophy-duotone',
		title: 'SEO & Meta Tags',
		text: 'Production ready and indexable by search engines while giving the feeling of an app to the end-users.'
	},
	{
		icon: 'shield-check-duotone',
		title: 'Middleware',
		text: 'Run custom code such as authentication, localization or A/B testing before rendering a page or a group of pages.'
	},
	{
		icon: 'database-duotone',
		title: 'State Management',
		text: 'Nuxt provides a simple way to share a reactive and SSR-friendly state between components.'
	},
	{
		icon: 'exclude-square-duotone',
		title: 'Transitions',
		text: 'Create smooth transitions between layouts, pages and components with a built-in support for Vue &amp; browser transitions.'
	},
	{
		icon: 'bug-beetle-duotone',
		title: 'Error Handling',
		text: 'Built-in error handling and logging to help you debug your application and provide a better user experience.'
	},
	{
		icon: 'stack-duotone',
		title: 'Layers',
		text: 'Extend your Nuxt application with another Nuxt application to reuse components, composables, layouts, pages and more.'
	},
	{
		icon: 'computer-tower-duotone',
		title: 'Server Routes',
		text: 'Create API endpoints and server routes to securely connect with third party services and consume from your frontend.'
	},
	{
		icon: 'magic-wand-duotone',
		title: 'Auto Imports',
		text: 'Nuxt auto-imports helpers, composables, and Vue APIs to use across your app without explicitly importing them.'
	},
	{
		icon: 'file-ts-duotone',
		title: 'TypeScript',
		text: 'Nuxt provides helpful shortcuts to ensure you have access to accurate type information when you are coding.'
	}
]
</script>