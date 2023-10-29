<template>
	<q-spinner v-if="isLoading" color="primary" size="3em" />
	<template v-else>
		<div v-if="isError">
			<q-icon size="15" class="ml-2" name="error" /> Failed to load
		</div>
		<div v-else class="JLStats__section">
			<p class="JLStats__section-title">{{ title }}</p>

			<Vue3autocounter
				v-if="isAnimation && value.signOnTheLeft"
				:startAmount="0"
				:endAmount="Number(value.value)"
				:duration="DURATION_SECONDS"
				:prefix="value.valueSign"
				decimalSeparator="."
				:decimals="2"
				:autoinit="true" />
			<Vue3autocounter
				v-if="isAnimation && !value.signOnTheLeft"
				:startAmount="0"
				:endAmount="Number(value.value)"
				:duration="DURATION_SECONDS"
				:suffix="value.valueSign"
				decimalSeparator="."
				:decimals="2"
				:autoinit="true" />
			<div v-else class="JLStats__section-value">{{ generateValueLine(value) }}</div>

			<div v-if="delta" class="JLStats__section-delta">{{ generateValueLine(delta) }}</div>
		</div>
	</template>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Vue3autocounter from 'vue3-autocounter'
import type { StatsDataSet } from '../../../types/stats'

import { logger } from '../../../index'
import { LogSeverity } from '../../../types'
import { loadStats } from '../../../services/stats'

const props = defineProps<StatsDataSet>()

const DURATION_SECONDS = ref(3)
const title = ref(props.title)
const delta = ref(props.delta)
const value = ref(props.value)
const isAnimation = ref(props.animated)
const isLoading = ref<boolean>(true)
const isError = ref<boolean>(false)

const generateValueLine = item => {
	if (!item) return
	if (item.signOnTheLeft) return `${item.valueMeasurement} ${item.valueSign}${item.value}`
	return `${item.valueMeasurement} ${item.value}${item.valueSign}`
}

const getData = async () => {
	isLoading.value = true
	if (props.endpoint) {
		try {
			const dataLoadedFromAPI = await loadStats(props.endpoint)
			const data = <StatsDataSet>(dataLoadedFromAPI.data as unknown)
			title.value = data.title
			value.value = data.value
			delta.value = data.delta
		} catch {
			isError.value = true
		} finally {
			isLoading.value = false
		}
	} else {
		logger({ severity: LogSeverity.ERROR, message: `Missing 'endpoint' for loading data for stats widget` })
	}
	isLoading.value = false
}

onMounted(async () => {
	if (props.dynamicData) {
		await getData()
	} else {
		isLoading.value = false
	}
})
</script>
<style scoped>
.JLStats {
	text-align: left;
}
.JLStats__section-value {
	font-size: 1.5em;
}
.JLStats__section-delta {
	font-size: 0.7em;
	opacity: 0.8;
}

.JLStats__section {
	padding: 20px;
	border-radius: 20px;
}
</style>
