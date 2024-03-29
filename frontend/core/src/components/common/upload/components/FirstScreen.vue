<template>
	<!-- <q-dialog v-model="urlPrompt">
		<q-card style="min-width: 350px">
			<q-card-section>
				<div class="text-h6">URL:</div>
			</q-card-section>

			<q-card-section class="q-pt-none">
				<q-input dense v-model="urlInput" autofocus @keyup.enter="onUrlPromptSubmitted" />
			</q-card-section>

			<q-card-actions align="right" class="text-primary">
				<q-btn flat label="Cancel" v-close-popup />
				<q-btn flat label="Add URL" @click="onUrlPromptSubmitted" />
			</q-card-actions>
		</q-card>
	</q-dialog> -->

	<q-card-section class="q-pt-none q-pb-none">
		<div class="text-weight-bold">Please provide the file(s) and/or URL(s) to import. Max 10Mb.</div>
	</q-card-section>
	<q-card-section>
		<q-table
			flat
			bordered
			hide-bottom
			class="table"
			virtual-scroll
			:columns="columns"
			:rows="rows" />
		<div class="q-mt-sm">
			<q-file
				ref="fileChooser"
				:max-file-size="FILE_SIZE_LIMIT"
				:accept="computedAllowedFileType"
				class="hidden"
				v-model="file" />
			<q-btn no-caps label="Add File..." @click="onAddFileButtonClick" class="q-mr-lg" />
			<!-- <q-btn no-caps @click="onAddUrlButtonClick" label="Add URL..." /> -->
		</div>
	</q-card-section>
	<q-card-section>
		<q-select
			label="Encoding"
			disable
			style="max-width: 50%; min-width: 300px"
			:options="encodingOptions"
			v-model="selectedEncoding" />
	</q-card-section>
</template>

<script setup lang="ts">

import { ref, watch, computed } from 'vue'
import { QFile, QTableProps } from 'quasar'
import { useUploaderStore } from '../../../../store/uploader'
import { SourceType, SourceEntry } from '../../../../types/upload'
import { FILE_SIZE_LIMIT } from '../config'


const store = useUploaderStore()

const encodingOptions = ['[utf-8] Unicode (UTF-8)']
const selectedEncoding = ref<string>(encodingOptions[0])

const fileChooser = ref<QFile | null>()
const file = ref<File>(null)

const onAddFileButtonClick = () => {
	fileChooser.value?.pickFiles()
}

const computedAllowedFileType = computed(() => `.${store.allowedFileType}`)

// TODO: if we ever want to support URL uploads, we can use this code
/*
const urlPrompt = ref(false)
const urlInput = ref()
const onAddUrlButtonClick = () => {
	urlPrompt.value = true
}
const onUrlPromptSubmitted = () => {
	urlPrompt.value = false
	rows.value.push({ source: urlInput.value, type: SourceType.URL })
	urlInput.value = ''
}
*/

const columns: QTableProps['columns'] = [
	{
		name: 'source',
		align: 'left',
		label: 'Import Source',
		field: 'source',
		sortable: false,
	},
]

const rows = ref<SourceEntry[]>([])

watch(file, fileValue => {
	if (fileValue) {
		const file = { source: fileValue.name, file: fileValue, type: SourceType.FILE }
		rows.value = [file]
		store.setFile(file)
	}
})
</script>

<style scoped>
.table {
	max-height: 400px;
}
</style>
