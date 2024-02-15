<template>
  <ClientOnly>
    <embed type="text/html" :src="props.demo" width="100%" height="500">
  </ClientOnly>
</template>
<script setup lang="ts">

const props = defineProps({
	// code: String,
	demo: String,
})
</script>
