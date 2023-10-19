<template>
	<JLChart v-bind="{ ...(props.config as any) }" />
</template>
<script setup lang="ts">
import JLChart from '@/index'

const props = defineProps({
	config: Object,
})
</script>
