<template>
	<JLChart {...props.config}/>
</template>
<script setup lang="ts">
import JLChart from '@/index'

const props = defineProps({
	config: Object,
})
</script>
