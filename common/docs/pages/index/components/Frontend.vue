<script setup lang="ts">
const features = [
{
		icon: 'plugs-connected-duotone',
		title: 'App Store',
		text: 'Allow users to install apps from your own app store with just a few clicks.',
		link: '/framework/frontend/core/components/app-store'
	},
	{
		icon: 'lock-duotone',
		title: 'Auth',
		text: 'Drop in authentication system with login, register, forgot password, and more.',
		link: '/framework/frontend/core/components/auth/login'
	},
	{
		icon: 'chart-line-duotone',
		title: 'Chart',
		text: 'Build beautiful charts with ease using our pre-built charting component.',
		link: '/framework/frontend/core/components/common/chart'
	},
	{
		icon: 'keyboard-duotone',
		title: 'Form',
		text: 'Create forms with just a few lines of code. Supports validation, file uploads, and more.',
		link: '/framework/frontend/core/components/common/form'
	},
	{
		icon: 'square-duotone',
		title: 'Stats',
		text: 'Display stats in a beautiful way with our pre-built stats component.',
		link: '/framework/frontend/core/components/common/stats'
	},
	{
		icon: 'table-duotone',
		title: 'Table',
		text: 'Render fully functional tables with just a few lines of code.',
		link: '/framework/frontend/core/components/common/table'
	},
	{
		icon: 'upload-duotone',
		title: 'Upload',
		text: 'Give users a way to upload files to your app with our pre-built upload component.',
		link: '/framework/frontend/core/components/common/upload'
	},
	{
		icon: 'rectangle-duotone',
		title: 'Widget System',
		text: 'Create interactive dashboards with our pre-built widget system.',
		link: '/framework/frontend/core/components/common/widgets'
	},
]
</script>

<template>
	<div class="py-8">
		<div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl gap-4 sm:gap-y-8 flex flex-col">
			<div class="text-center flex flex-col items-center">
				<h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
					<span>Plug 'n' Play<br><span class="text-primary">Frontend Components</span></span>
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

