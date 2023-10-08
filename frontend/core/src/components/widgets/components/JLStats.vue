<template>
    <JLStats {...props.config}/>
</template>
<script setup>
import { JLStats } from '@/index'

const props = defineProps({
	config: Object,
})
</script>
