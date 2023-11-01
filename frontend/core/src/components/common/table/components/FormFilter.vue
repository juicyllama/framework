<template>
	<div class="flex justify-between items-center" :class="{column: $q.screen.lt.sm}">
		<q-select outlined class="q-my-sm input-width" v-model="filter.label" :options="labels" label="Field" :readonly="!withAddButton" />
		<q-select
		outlined
		class="q-my-sm input-width"
		:class="{'q-mx-md': !$q.screen.lt.sm}"
		v-model="filter.type"
		:options="FILTERS"
		label="Filter"
		/>
		<q-input
		v-if="!typeWithoutInput.includes(typeof filter.type === 'object' ? filter.type.method : '')"
		outlined
		label="Value"
		class="q-my-sm input-width"
		:class="{'q-mr-md': !$q.screen.lt.sm}"
		v-model="filter.value"
		:type="['GTE', 'LTE'].includes(typeof filter.type === 'object' ? filter.type.method : '') ? 'number' : 'text'"
		/>
		<q-btn color="primary" label="Add filter" @click="$emit('add')" :disable="!validator" v-if="withAddButton" />
		<q-btn color="deep-orange" icon="close" @click="$emit('remove', filter)" v-else />
	</div>
</template>

<script setup lang="ts">
import { IFilterType, IFilter } from '../../../../types/table'
interface Props {
	filter: IFilter,
	labels: string[],
	withAddButton?: boolean,
	validator?: boolean
}

defineEmits(['add', 'remove'])
const props = defineProps<Props>()

const typeWithoutInput = ['NULL', '!NULL']
const FILTERS: IFilterType[] = [
	{label: 'Greater than', method: 'GTE'},
	{label: 'Less than', method: 'LTE'},
	{label: 'Equals', method: 'EQ'},
	{label: 'Not equals', method: '!EQ'},
	{label: 'Is empty', method: 'NULL'},
	{label: 'Is present', method: '!NULL'},
]
</script>


<style scoped>
.input-width {
	width: 20%;
	flex: 1 1 auto;
}

@media (max-width: 599px) {
	.input-width {
		width: 100%;
	}
}
</style>
