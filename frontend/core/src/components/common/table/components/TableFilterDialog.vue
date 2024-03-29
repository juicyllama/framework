<template>
	<q-dialog v-model="props.dialog">
		<q-card style="width: 700px; max-width: 80vw">
			<q-card-section class="app_border-top">
				<div class="text-h6">
					Filters <span>({{ activeFilters.length }})</span>
				</div>
			</q-card-section>

			<q-card-section>
				<FormFilter
					:filter="filterData"
					:labels="labels"
					with-add-button
					:validator="validator"
					@add="addFilter()" />
			</q-card-section>

			<q-card-section class="app_border-top" v-if="activeFilters.length">
				<div class="text-h6">Active filters</div>
				<ul class="q-pl-none">
					<li style="list-style-type: none" v-for="filter in activeFilters" :key="filter.label">
						<FormFilter :filter="filter" :labels="labels" @remove="removeFilter(filter)" />
					</li>
				</ul>
			</q-card-section>

			<q-card-actions align="between" class="bg-white text-teal app_border-top">
				<q-btn flat label="Clear all filters" @click="clear()" v-close-popup />
				<q-btn flat label="Apply" v-close-popup />
			</q-card-actions>
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import FormFilter from './FormFilter.vue'
import { IFilter } from '../../../../types/table'

const props = defineProps<{
	dialog: boolean
	labels: string[]
	activeFilters: IFilter[]
}>()

const emit = defineEmits(['add', 'remove', 'clear'])

const filterData = ref<IFilter>({
	label: '',
	type: '',
	value: '',
})

const clearFilterData = () => {
	filterData.value = {
		label: '',
		type: '',
		value: '',
	}
}

const clear = () => {
	clearFilterData()
	emit('clear')
}

const validator = computed(() => {
	if (typeof filterData.value.type !== 'object') return false
	if (['NULL', '!NULL'].includes(filterData.value.type?.method)) {
		return filterData.value.label && filterData.value.type ? true : false
	}
	return Object.values(filterData.value).every(el => el !== '')
})

const addFilter = () => {
	if (props.activeFilters.map(i => i.label).includes(filterData.value.label)) {
		return
	}
	emit('add', filterData.value)
	clearFilterData()
}

const getFilterIndex = (filter: IFilter): number =>
	props.activeFilters.findIndex(item => item.label === filter.label && item.value === filter.value)

const removeFilter = (filter: IFilter) => {
	const index: number = getFilterIndex(filter)
	emit('remove', index)
}
</script>
<style>
.app_border-top {
	border-top: 1px solid #0000001f;
}
</style>
