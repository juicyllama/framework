<template>
	<JLStats :options="props.config" />
</template>
<script setup lang="ts">
import { JLStats } from '@/index'

const props = defineProps({
	config: Object,
})
</script>
