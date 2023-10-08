<template>
	<JLChart {...props.config}/>
</template>
<script setup>
import JLChart from '@/index'

const props = defineProps({
	config: Object,
})
</script>
