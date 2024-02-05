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
import { useUploaderStore, UploadMode } from '../../../../store/uploader'

const store = useUploaderStore()

const options: Array<{ label: string, value: UploadMode }> = [
	{
		label: 'Append/Update: update records in the destination with matching records from source',
		value: UploadMode.UPSERT,
	},
	{
		label: 'Create: create new records in the destination from the source',
		value: UploadMode.CREATE,
	},
	{
		label: 'Delete: delete records in destination that match records in source',
		value: UploadMode.DELETE,
	},
	{
		label: 'Repopulate: delete all records in destination, repopulate from the source',
		value: UploadMode.REPOPULATE,
	},
]
const chosenImportMode = ref<UploadMode>(store.importMode || options[0].value)

watch(chosenImportMode, () => {
	store.setImportMode(chosenImportMode.value)
})
</script>

<style scoped></style>
