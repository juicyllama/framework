<template>
	<JLTable {...props.config}/>
</template>

<script lang="ts" setup>
import { JLStats } from '@/index'

const props = defineProps({
	config: Object,
})
</script>
