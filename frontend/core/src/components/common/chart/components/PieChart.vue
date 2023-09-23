<template>
	<Pie :data="props.data" :options="props.options" />
</template>

<script lang="ts" setup>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'
import type { ChartUISettings, ChartData } from '@/types/chart.js'
import 'chart.js/auto'

const props = defineProps<{
	options: ChartUISettings
	data: ChartData
}>()

ChartJS.register(ArcElement, Tooltip, Legend)
</script>
