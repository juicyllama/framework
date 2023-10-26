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
	borderRadius: 5,
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
	const datasets = []
	let count = 0
	data.datasets.forEach(dataset => {
		if (count < dataset.data.length) {
			count = dataset.data.length
		}
		datasets.push({
			data: dataset.data.map(i => i[field]),
			label: dataset.label,
		})
	})

	const chartJSObject = {
		labels: Array(count).fill(data.datasets[0].label),
		datasets,
	}

	console.log(chartJSObject)

	return chartJSObject
}

const mappedFields = computed<any>(() => dataMapper(props.data))

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
</script>
