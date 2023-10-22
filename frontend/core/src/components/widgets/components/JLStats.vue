<template>
	<JLStats
		v-bind="{
			...(props.config as StatsDataSet),
		}" />
</template>
<script setup lang="ts">
import { JLStats } from '../../../index'
import type { StatsDataSet } from '../../../types'

const props = defineProps({
	config: Object,
})
</script>
