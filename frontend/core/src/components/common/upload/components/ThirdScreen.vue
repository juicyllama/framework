<template>
	<q-card-section class="q-pt-none q-pb-none">
		<div class="text-weight-bold">
			You can define the field mappings. Set mappings to specify the correspondence between fields in the Source
			and fields in the Destination.
			<b>Choose a single Primary Key</b>

		</div>
	</q-card-section>
	<q-card-section>
		<!-- <q-select :options="tableOptions" v-model="selectedTable">
			<template v-slot:prepend>
				<q-icon name="table_view" />
			</template>
		</q-select> -->
		<q-table :columns="columns" :rows="rows" dense>
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

const dataMapper = (headers, columnsToPick) =>
	headers.map(sourceRow => ({
		source: sourceRow,
		target: ref(findBestMatch(sourceRow, columnsToPick)),
		primaryKey: ref(false),
	}))

/**
 * This function takes two parameters: a string str and an array of strings options.
 * It determines which option from the options array shares the longest substring with str, considering the case-insensitive comparison.
 * Both str and each option are normalized by converting them to lower case and replacing spaces with underscores.
 * The function then computes the length of the longest common substring between str and each option.
 * It iterates through the options, updating the bestMatch variable whenever it finds an option with a longer matching substring than the previous best.
 * The function returns the option with the longest matching substring or undefined if no matches are found.
 */
function findBestMatch(str: string, options: string[]): string | undefined {
	const normalize = (s: string) => s.toLowerCase().replace(/\s/g, '_');
	const normalizedStr = normalize(str);

	let bestMatch: string | undefined = undefined;
	let longestMatchLength = 0;

	for (const option of options) {
		const normalizedOption = normalize(option);
		let matchLength = 0;

		// Find the longest common substring length
		for (let i = 0; i < normalizedStr.length; i++) {
			for (let j = i; j < normalizedStr.length; j++) {
				const substring = normalizedStr.slice(i, j + 1);
				if (normalizedOption.includes(substring) && substring.length > matchLength) {
					matchLength = substring.length;
				}
			}
		}

		// Update the best match if the current option is better
		if (matchLength > longestMatchLength) {
			longestMatchLength = matchLength;
			bestMatch = option;
		}
	}

	return bestMatch;
}


watch(
	rows,
	val => {
		store.setFieldMappings(val)
	},
	{ deep: true },
)

const readCSVFileHeaders = (): Promise<string[]> => {
	const promise = new Promise<string[]>((resolve) => {
		const file = store.getFile.file as File
		const reader = new FileReader()
		reader.onload = () => {
			const text = reader.result as string
			const headers = text
				.split('\n')[0]
				.split(',')
				.map(i => i.replace(/"/g, ''))
			resolve(headers)
		}
		reader.readAsText(file)
	})
	return promise
}

const readJSONHeaders = (): Promise<string[]> => {
	const promise = new Promise<string[]>((resolve) => {
		const file = store.getFile.file as File
		const reader = new FileReader()
		reader.onload = () => {
			const text = reader.result as string
			const headers = Object.keys(JSON.parse(text)[0])
			resolve(headers)

		}
		reader.readAsText(file)
	})
	return promise
}

const readFileHeaders = async (): Promise<string[]> => {
	if (store.allowedFileType === 'CSV') {
		return await readCSVFileHeaders()
	} else if (store.allowedFileType === 'JSON') {
		return await readJSONHeaders()
	}
}

onMounted(async () => {
	let columnsToPick = store.columnsToPick;
	if (!columnsToPick) {
		const res = await getUploadFields()
		columnsToPick = res.data
	}
	columnsToPick = columnsToPick.map(column => column.trim())
	store.setFieldMappings(columnsToPick)
	let headers = await readFileHeaders()
	headers = headers.map(header => header.trim())
	rows.value = dataMapper(headers, columnsToPick)
	targetFieldOptions.value = [null, ...columnsToPick].map(field => ({
		label: field,
		value: field,
	}))
})

//TODO: for the future case when multiple tables are supported
//		currently, only one table is supported
// const tableOptions = computed(() => store.getTables)
// const selectedTable = ref('')
</script>
