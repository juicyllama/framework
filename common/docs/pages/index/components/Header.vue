<template>
	<header
		class="bg-background/75 backdrop-blur border-b border-gray-200 dark:border-gray-800 -mb-px sticky top-0 z-50 lg:mb-0 lg:border-0">
		<div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex items-center justify-between gap-3 h-16">
			<div class="lg:flex-1 flex items-center gap-1.5">
				<HeaderLogo />
			</div>
			<ul class="items-center gap-x-8 hidden lg:flex">
				<li class="relative" v-for="link in links" :key="link.label">
					<a class="text-sm/6 font-semibold flex items-center gap-1 hover:text-primary" :href="link.link">
						{{ link.label }}
					</a>
				</li>
			</ul>
			<div class="flex items-center justify-end lg:flex-1 gap-1.5">
				<div class="relative inline-flex">
					<a type="button"
						class="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-sm gap-x-1.5 px-2.5 py-1.5 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center"
						href="https://github.com/nuxt/nuxt" rel="noopener noreferrer" target="_blank">
						<span>Link</span>
					</a>
					<a type="button"
						class="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-sm gap-x-1.5 px-2.5 py-1.5 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center"
						href="https://github.com/nuxt/nuxt" rel="noopener noreferrer" target="_blank">
						<Icon name="bi:github" class="flex-shrink-0 h-5 w-5" aria-hidden="true" />
						<span>48.9K</span>
					</a>
				</div>
				<button type="button" @click="menuHalnder()"
					class="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-sm gap-x-1.5 p-1.5 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center lg:hidden"
					aria-label="Open Menu">
					<Icon :name="`i-ph:${mobMenu ? 'x' : 'list'}`" class="flex-shrink-0 h-5 w-5" aria-hidden="true" />
				</button>
			</div>
		</div>
	</header>
	<div class="px-4 sm:px-6 pt-3 pb-6 fixed z-30 bg-background w-full h-full" v-if="mobMenu">
		<nav class="space-y-3">
			<div class="space-y-3">
				<a v-for="item in links" :key="item.label" @click="menuHalnder()"
					class="flex items-center gap-1.5 group text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border-transparent hover:border-gray-500 dark:hover:border-gray-400"
					:href="item.link">{{ item.label }}</a>
			</div>
			<div class="h-full"></div>
		</nav>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import HeaderLogo from './HeaderLogo.vue'

const mobMenu = ref(false)

const menuHalnder = () => {
	mobMenu.value = !mobMenu.value
	if (mobMenu.value) {
		document.body.style.overflow = 'hidden'
	} else {
		document.body.style.overflow = ''
	}
}

const links = [
	{ label: 'Docs', link: '#' },
	{ label: 'Integrations', link: '#' },
	{ label: 'Templates', link: '#' },
	{ label: 'Showcase', link: '#' },
	{ label: 'Enterprise', link: '#' },
	{ label: 'Blog', link: '#' },
]
</script>