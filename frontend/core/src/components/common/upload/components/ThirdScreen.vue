<template>
	<q-card-section class="q-pt-none q-pb-none">
		<div class="text-weight-bold">
			You can define the field mappings. Set mappings to specify the correspondence between fields in the Source
			and fields in the Destination.
		</div>
	</q-card-section>
	<q-card-section>
		<!-- <q-select :options="tableOptions" v-model="selectedTable">
			<template v-slot:prepend>
				<q-icon name="table_view" />
			</template>
		</q-select> -->
		<q-table :columns="columns" :rows="rows" dense hide-bottom>
			<template v-slot:body="props">
				<q-tr>
					<q-td key="source" :props="props">
						{{ props.row.source }}
					</q-td>
					<q-td key="target" :props="props">
						<q-select dense :options="targetFieldOptions" v-model="props.row.target" />
					</q-td>
					<q-td key="primaryKey" :props="props">
						<q-checkbox v-model="props.row.primaryKey" />
					</q-td>
				</q-tr>
			</template>
		</q-table>
	</q-card-section>
</template>

<script setup lang="ts">

import { ref, onMounted, watch } from 'vue'
import { useUploaderStore } from '../../../../store/uploader'
import { QTableProps } from 'quasar'
import { getUploadFields } from '../../../../services/upload'

const store = useUploaderStore()

const columns: QTableProps['columns'] = [
	{
		name: 'source',
		align: 'left',
		label: 'Source Field',
		field: 'source',
		sortable: false,
	},
	{
		name: 'target',
		align: 'left',
		label: 'Target Field',
		field: 'target',
		sortable: false,
	},
	{
		name: 'primaryKey',
		align: 'left',
		label: 'Primary Key',
		field: 'primaryKey',
		sortable: false,
	},
]

// rows in the user-selected file
const rows = ref([])
const targetFieldOptions = ref([])

const dataMapper = data =>
	data.map(sourceRow => ({
		source: sourceRow,
		target: ref(''),
		primaryKey: ref(false),
	}))

watch(
	rows,
	val => {
		store.setFieldMappings(val)
	},
	{ deep: true },
)

const readCSVFileHeaders = () => {
	const file = store.getFile.file as File
	const reader = new FileReader()
	reader.onload = () => {
		const text = reader.result as string
		const headers = text
			.split('\n')[0]
			.split(',')
			.map(i => i.replace(/"/g, ''))
		rows.value = dataMapper(headers)
	}
	reader.readAsText(file)
}

const readJSONHeaders = () => {
	const file = store.getFile.file as File
	const reader = new FileReader()
	reader.onload = () => {
		const text = reader.result as string
		const headers = Object.keys(JSON.parse(text)[0])
		rows.value = dataMapper(headers)
	}
	reader.readAsText(file)
}

const readFileHeaders = () => {
	if (store.allowedFileType === 'CSV') {
		readCSVFileHeaders()
	} else if (store.allowedFileType === 'JSON') {
		readJSONHeaders()
	}
}

onMounted(() => {
	readFileHeaders()
	getUploadFields().then(res => {
		targetFieldOptions.value = res.data.map(field => ({
			label: field,
			value: field,
		}))
	})
})

//TODO: for the future case when multiple tables are supported
//		currently, only one table is supported
// const tableOptions = computed(() => store.getTables)
// const selectedTable = ref('')
</script>
