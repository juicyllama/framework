<template>
  <ClientOnly v-if="!isMobile">
    <embed type="text/html" :src="props.demo" width="100%" height="500">
  </ClientOnly>
  <ClientOnly v-else>
    <div class="flex justify-center items-center">
      <a :href="props.demo" target="_blank" type="button" class="button-primary">Open on Stackblitz.com</a>
    </div>
  </ClientOnly>
</template>
<script setup lang="ts">

const props = defineProps({
	// code: String,
	demo: String,
})

const isMobile = ref(false);

onMounted(() => {
	updateWidth();
	window.addEventListener('resize', updateWidth);
});

const updateWidth = () => {
	isMobile.value = window.innerWidth <= 640;
};
</script>
