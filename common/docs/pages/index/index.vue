<script setup lang="ts">
import Hero from './components/Hero.vue'
//import Sponsors from './components/Sponsors.vue'
import Features from './components/Features.vue'
import Integrations from './components/Integrations.vue'
import CTAs from './components/CTAs.vue'
import Reviews from './components/Reviews.vue'

useHead({
  title: 'Docs :: JuicyLlama Rapid Development Framework',
  meta: [
    { name: 'description', content: 'Developer portal for working with our open source framework' }
  ],
})
</script>


<template>
	<div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl gap-16 sm:gap-y-24 flex flex-col">
		<Hero class="mt-16" />
		<!--<Sponsors />-->
	</div>
	<CTAs />
	<div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl gap-16 sm:gap-y-24 flex flex-col">
		<Features />
	</div>
	<Integrations />
	<Reviews />
</template>

<style>
@import url("~/assets/css/main.css");
</style>