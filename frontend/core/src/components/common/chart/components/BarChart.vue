<template>
	<Bar :data="props.data" :options="extendedProps" />
</template>

<script lang="ts" setup>
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
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
</script>
