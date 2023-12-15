<script setup lang="ts">
const features = [
	{
		icon: 'robot-duotone',
		title: 'Artificial Intelligence',
		text: 'Our abstracted AI layer allows you to easily integrate with different AI providers.',
		link: '/framework/backend/ai'
	},
	{
		icon: 'plugs-connected-duotone',
		title: 'App Store',
		text: 'A prebuild app store allowing your users to easily install and manage apps.',
		link: '/framework/backend/app-store'
	},
	{
		icon: 'credit-card-duotone',
		title: 'Billing',
		text: 'Handle billing, balances, invoicing and subscriptions with ease using our prebuild bulling module.',
		link: '/framework/backend/billing'
	},
	{
		icon: 'exclude-square-duotone',
		title: 'Core',
		text: 'The core of our framework, handling accounts, users, permissions, roles and more.',
		link: '/framework/backend/core'
	},
	{
		icon: 'users-duotone',
		title: 'CRM',
		text: 'Our abstracted CRM layer allows you to easily integrate with different CRM providers.',
		link: '/framework/backend/crm'
	},
	{
		icon: 'database-duotone',
		title: 'Data Cache',
		text: 'Available to paying clients, hosted data lake for common data like FX, phone verification and more.',
		link: '/framework/backend/data-cache'
	},
	{
		icon: 'gift-duotone',
		title: 'Ecommerce',
		text: 'Our abstracted Ecommerce layer allows you to easily integrate with different Ecommerce providers.',
		link: '/framework/backend/ecommerce'
	},
	{
		icon: 'monitor-duotone',
		title: 'Websites',
		text: 'The websites module allows you to easily create and manage websites properties.',
		link: '/framework/backend/websites'
	},
	
]
</script>

<template>
	<div class="py-8">
		<div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl gap-4 sm:gap-y-8 flex flex-col">
			<div class="text-center flex flex-col items-center">
				<h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
					<span>Plug 'n' Play<br><span class="text-primary">Backend Modules</span></span>
				</h2>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-8 xl:grid-cols-4">
				<div
					class="card"
					v-for="item in features" :key="item.title">
					<a :href="`${item.link}`" class="focus:outline-none" color="primary" orientation="vertical" tabindex="-1">
						<div class="gap-x-8 gap-y-4 rounded-xl flex flex-col flex-1 px-4 py-5 sm:p-6 dark:bg-gray-900/50">
							<div class="">
								<span class="absolute inset-0"></span>
								<div class="mb-2 pointer-events-none">
									<Icon :name="`ph:${item.icon}`" class="w-8 h-8 flex-shrink-0 text-gray-900 dark:text-white" />
								</div>
								<p class="text-gray-900 dark:text-white text-base font-bold truncate" v-html="item.title"></p>
								<p class="text-[15px] text-gray-500 dark:text-gray-400 mt-1" v-html="item.text"></p>
							</div>
						</div>
					</a>
				</div>
			</div>
		</div>
	</div>
</template>

