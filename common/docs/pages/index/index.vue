<script setup>
import Hero from './components/Hero.vue'
import Sponsors from './components/Sponsors.vue'
import Features from './components/Features.vue'
import Integrations from './components/Integrations.vue'
import CodeExample from './components/content/CodeExample.vue'
import Reviews from './components/Reviews.vue'

// definePageMeta({
//    layout: 'clean'
// })
</script>


<template>
	<div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl gap-16 sm:gap-y-24 flex flex-col">
		<Hero class="mt-32" />
		<Sponsors />
	</div>
	<CodeExample />
	<div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl gap-16 sm:gap-y-24 flex flex-col">
		<Features />
	</div>
	<Integrations />
	<Reviews />
</template>

<style>
@import url("~/assets/css/main.css");
</style>