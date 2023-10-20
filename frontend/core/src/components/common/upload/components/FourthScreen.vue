<template>
	<q-card-section class="q-pt-none q-pb-none">
		<div class="text-weight-bold">Please select a desired import mode.</div>
	</q-card-section>
	<q-card-section>
		<p>Import mode:</p>
		<q-option-group :options="options" type="radio" v-model="chosenImportMode" />
	</q-card-section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useUploaderStore } from '@/store/uploader'

const store = useUploaderStore()

const options = [
	{ label: 'Append: add records to the destination table', value: 'append' },
	{
		label: 'Update: update records in the destination with matching records from source',
		value: 'UPSERT',
	},
	{
		label: 'Append/Update: if records exist in destination, update it. Otherwise, add it',
		value: 'CREATE',
	},
	{
		label: 'Delete: delete records in destination that match records in source',
		value: 'DELETE',
	},
	{
		label: 'Copy: delete all records in destination, repopulate from the source',
		value: 'REPOPULATE',
	},
]
const chosenImportMode = ref('CREATE')

watch(chosenImportMode, () => {
	store.setImportMode(chosenImportMode.value)
})
</script>

<style scoped></style>
