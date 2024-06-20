<script setup lang="ts">
import Hero from './components/Hero.vue'
import Backend from './components/Backend.vue'
import Apps from './components/Apps.vue'
import CTAs from './components/CTAs.vue'

useHead({
  title: 'No-code, Low-code, Full-code automation experts :: JuicyLlama',
  meta: [
    { name: 'description', content: 'We enable businesses to fully automate and optimize any process with technology.' }
  ],
})
defineOgImage({
  component: 'Docs',
  title: 'No-code, Low-code, Full-code automation experts',
  description: 'We enable businesses to fully automate and optimize any process with technology',
})
</script>


<template>
	<Hero class="mt-16" />
	<CTAs />
	<Backend />
	<Apps />

</template>
