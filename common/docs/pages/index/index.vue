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
defineOgImage({
  component: 'Docs',
  title: 'JuicyLlama Rapid Development Framework',
  description: 'Developer portal for working with our fullstack open source framework'
})
</script>


<template>
	<Hero class="mt-16" />
	<CTAs />
	<Backend />
	<Apps />
	<Frontend />
</template>
