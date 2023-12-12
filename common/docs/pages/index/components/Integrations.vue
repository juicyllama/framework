<template>
	<div class="py-24 sm:py-32 dark bg-gray-900">
		<div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl gap-16 sm:gap-y-24 grid lg:grid-cols-2 lg:items-center">
			<div class="">
				<h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl"><span>Ship
						faster with<br><span class="text-primary">endless integrations</span></span></h2>
				<p class="mt-6 text-lg/8 text-gray-600 dark:text-gray-300"><span>Integrate with your favorite tools and
						services. Nuxt is built to be flexible and can be extended with a robust modules ecosystem. Connect your
						application with popular headless CMS, eCommerce, Database or UI/UX libraries with a single line of
						code.</span></p>
				<div class="mt-8 flex flex-wrap gap-x-3 gap-y-1.5">
					<a type="button"
						class="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-sm gap-x-2 px-3 py-2 shadow-sm text-white dark:text-gray-900 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-900 dark:bg-white dark:hover:bg-gray-100 dark:disabled:bg-white focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center"
						href="/modules">
						<Icon name="i-ph:puzzle-piece-duotone" class="flex-shrink-0 h-5 w-5" />
						<span class="">Explore Nuxt Modules</span>
					</a>
					<a type="button"
						class="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-sm gap-x-2 px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-700 dark:text-gray-200 bg-gray-50 hover:bg-gray-100 disabled:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700/50 dark:disabled:bg-gray-800 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center"
						href="/docs/guide/concepts/modules">
						<Icon name="i-ph:info-duotone" class="flex-shrink-0 h-5 w-5" />
						<span class="">Learn about Modules</span>
					</a>
				</div>
			</div>
			<div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 lg:grid-cols-5 gap-4 sm:gap-5 lg:gap-8">
				<a v-for="link in links" :key="link.link" :href="link.link" class="block lg:hover:scale-110 transition">
					<img :src="link.img" :alt="link.alt" loading="lazy" class="rounded-xl">
				</a>
			</div>
		</div>
	</div>
</template>

<script setup>
const links = [
	{
		link: '#',
		alt: 'Cloudflare',
		img: 'https://nuxt.com/assets/integrations/cloudflare.svg'
	},
	{
		link: '#',
		alt: 'Vercel',
		img: 'https://nuxt.com/assets/integrations/vercel.svg'
	},
	{
		link: '#',
		alt: 'Heroku',
		img: 'https://nuxt.com/assets/integrations/heroku.svg'
	},
	{
		link: '#',
		alt: 'Amplify',
		img: 'https://nuxt.com/assets/integrations/aws-amplify.svg'
	},
	{
		link: '#',
		alt: 'DigitalOcean',
		img: 'https://nuxt.com/assets/integrations/digitalocean.svg'
	},
	{
		link: '#', alt: 'test'
	},
	{
		link: '#', alt: 'test'
	},
	{
		link: '#', alt: 'test'
	},
	{
		link: '#', alt: 'test'
	},
	{
		link: '#', alt: 'test'
	},
	{
		link: '#', alt: 'test'
	},
	{
		link: '#', alt: 'test'
	},
	{
		link: '#', alt: 'test'
	},
	{
		link: '#', alt: 'test'
	},
	{
		link: '#', alt: 'test'
	},
	{
		link: '#', alt: 'test'
	},
	{
		link: '#', alt: 'test'
	},
	{
		link: '#', alt: 'test'
	},
	{
		link: '#', alt: 'test'
	},
	{
		link: '#', alt: 'test'
	}
]
</script>