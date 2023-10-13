<template>
	<JLChart {...config} />
</template>
<script setup lang="ts">
import JLChart from '@/index'

defineProps({
	config: Object,
})
</script>
