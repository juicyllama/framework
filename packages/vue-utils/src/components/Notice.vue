<script setup lang="ts">
const props = defineProps<{
	type: 'success' | 'error' | 'warning' | 'info'
	message: string
}>()
</script>

<template>
	<div :class="`notice notice--${props.type}`">
		<p><span v-html="props.message"></span></p>
	</div>
</template>

<style scoped></style>
