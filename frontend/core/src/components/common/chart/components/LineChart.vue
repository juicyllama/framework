<template>
	<Line :data="props.data" :options="extendedProps" />
</template>

<script lang="ts" setup>
import type { ChartUISettings, ChartData } from '@/types/chart.js'

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js'
import { Line } from 'vue-chartjs'

const props = defineProps<{
	options: ChartUISettings
	data: ChartData
}>()

const extendedProps = {
	...props.options,
	borderRadius: 20,
	scales: {
		x: {
			display: false,
			grid: {
				drawTicks: false,
			},
		},
		y: {
			grid: {
				drawTicks: false,
			},
			display: false,
		},
	},
}

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)
</script>
