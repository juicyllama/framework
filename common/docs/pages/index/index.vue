<script setup lang="ts">
import Hero from './components/Hero.vue'
import Backend from './components/Backend.vue'
import Frontend from './components/Frontend.vue'
import Apps from './components/Apps.vue'
import CTAs from './components/CTAs.vue'

useHead({
  title: 'Docs :: JuicyLlama Rapid Development Framework',
  meta: [
    { name: 'description', content: 'Developer portal for working with our open source framework' }
  ],
})
</script>


<template>
	<Hero class="mt-16" />
	<CTAs />
	<Backend />
	<Apps />
	<Frontend />
</template>

<style>
/* @import url("~/assets/css/tailwind.css"); */
@import url("~/assets/css/main.css");
</style>
