<script setup lang="ts">
import { toRefs, computed, onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import type { ChartData, ChartOptions } from '../../../types/chart'
import { labelsDefaultStyle } from './defaults'
import LineChart from './components/LineChart.vue'
import BarChart from './components/BarChart.vue'
import PieChart from './components/PieChart.vue'
import GaugeChart from './components/GaugeChart.vue'
import { logger } from '../../../index'
import { LogSeverity } from '../../../types'
import { loadChart } from '../../../services/chart'

const props = defineProps<ChartOptions>()

const { type, displayLegend, title, displayTooltip } = toRefs(props)

const isLoading = ref<boolean>(true)
const isError = ref<boolean>(false)

const loadedData: Ref<ChartData> = ref({
	labels: [],
	datasets: [],
})

const extendedOptions = computed(() => {
	const legendSettings = displayLegend.value ? labelsDefaultStyle : { display: false }
	const titleSettings = title.value ? { text: title.value, display: true } : { display: false }
	const tooltipSettings = displayTooltip.value ? {} : { display: false }

	return {
		...props.options,
		plugins: {
			legend: legendSettings,
			title: titleSettings,
			tooltip: tooltipSettings,
			decimation: {
				enabled: true,
			},
		},
	}
})

const dataDetails = computed<ChartData>(() => {
	if (props.dataMapper) {
		return props.dataMapper(loadedData.value as any)
	}
	return loadedData.value
})

const comps = {
	line: LineChart,
	bar: BarChart,
	pie: PieChart,
	gauge: GaugeChart,
}

const getData = async () => {
	isLoading.value = true
	if (props.endpoint) {
		try {
			const dataLoadedFromAPI = await loadChart(props.endpoint)
			loadedData.value = <ChartData>(dataLoadedFromAPI.data as unknown)
		} catch {
			isError.value = true
		} finally {
			isLoading.value = false
		}
	} else {
		logger({ severity: LogSeverity.ERROR, message: `Missing 'endpoint' for data for chart with dynamicData=true` })
	}
}

onMounted(async () => {
	if (props.dynamicData) {
		await getData()
	} else {
		isLoading.value = false
		loadedData.value = <ChartData>(props.data as unknown)
	}
})
</script>


<template>
	<q-spinner v-if="isLoading" color="primary" size="3em" />
	<template v-else>
		<div v-if="isError">
			<q-icon size="15" class="ml-2" name="error" /> Failed to load
		</div>
		<component v-else :is="comps[type]" :data="dataDetails" :options="extendedOptions" />
	</template>
</template>
