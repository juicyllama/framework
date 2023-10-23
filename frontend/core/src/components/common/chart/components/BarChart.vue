<template>
	<Bar :data="mappedFields" :options="extendedProps" />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { ChartUISettings, ChartData } from '../../../../types/chart'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Bar } from 'vue-chartjs'

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

const dataMapper = (data, field = 'total_price') => {
	const labels = []
	const datasets = []
	data.datasets.array.forEach(dataset => {
		labels.push(dataset.label)
		datasets.push({
			data: dataset.data.map(i => i[field]),
		})
	})
	return {
		labels,
		datasets,
	}
}

const mappedFields = computed<any>(() => dataMapper(props.data))

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
</script>
