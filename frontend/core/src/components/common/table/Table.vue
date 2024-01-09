<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue'
import { isEmpty, isNull, result } from 'lodash'
import { defineStore } from 'pinia'
import { useQuasar } from 'quasar'
import Table from '../../../components/common/table/components/Table.vue'
import { loadPusher } from '../../../plugins'
import { FindOptions, LogSeverity } from '../../../types'
import { logger, TableColumn, TableSchema } from '../../../index'
import { default as JLAreYouSure } from '../AreYouSure.vue'

const props = defineProps<{
	options: TableSchema
	restart?: Date
}>()

const emit = defineEmits([
	'change',
	'search',
	'addRecord',
	'updateRecord',
	'updateValue',
	'updateFormField',
	'deleteRecord',
	'pluginAction',
	'toggleButton',
])

const $q = useQuasar()
const primary_key = props.options.schema.find(col => col.primary_key).field

const loading = ref<boolean>(true)
const loading_add = ref<boolean>(false)
const loading_edit = ref<boolean>(false)
const total_rows = ref<number>(0)
const rows = ref<any[]>([])
const createdRecordSuccess = ref<Date>(undefined)
const editedRecordSuccess = ref<Date>(undefined)
const confirm: Ref<boolean> = ref(false)
const deleteRow: Ref<any> = ref(null)

const UseListStore = defineStore(`table_options_${props.options.event}`, {
	state: () => ({
		options: window.localStorage.getItem(`table_options_${props.options.event}`)
			? <FindOptions>JSON.parse(window.localStorage.getItem(`table_options_${props.options.event}`))
			: null,
		visible_columns: window.localStorage.getItem(`table_visible_columns_${props.options.event}`)
			? <string[]>JSON.parse(window.localStorage.getItem(`table_visible_columns_${props.options.event}`))
			: null,
	}),
	actions: {
		updateOptions(options: FindOptions) {
			this.$state.options = options
			window.localStorage.setItem(`table_options_${props.options.event}`, JSON.stringify(options))
		},
		updateVisibleColumns(visible_columns: string[]) {
			this.$state.visible_columns = visible_columns
			window.localStorage.setItem(`table_visible_columns_${props.options.event}`, JSON.stringify(visible_columns))
		},
	},
})

const useListStore = UseListStore()

async function subscribe() {
	await loadPusher(props.options.event, processTableChange)
}

function buildDefaults() {
	if (isNull(useListStore.options)) {
		useListStore.updateOptions({
			limit: props.options.find?.limit ?? '10',
			offset: props.options.find?.offset ?? '0',
			relations: props.options.find?.relations,
			order_by: props.options.find?.order_by ?? primary_key,
			order_by_type: props.options.find?.order_by_type ?? 'DESC',
			select: props.options.find?.select,
			search: '',
		})
	}

	if (isNull(useListStore.visible_columns) || isEmpty(useListStore.visible_columns)) {
		useListStore.updateVisibleColumns(props.options.schema.filter(col => col.show).map(col => col.field))
	}
}

async function getData() {
	loading.value = true
	if (props.options.functions.stats) {
		total_rows.value = await props.options.functions.stats({
			url: props.options.endpoint,
			method: 'COUNT',
			find: useListStore.options,
			q: $q,
		})
	} else {
		logger({ severity: LogSeverity.ERROR, message: `Missing count function for ${props.options.event} table` })
	}

	if (total_rows.value > 0) {
		const data = await props.options.functions.findAll({
			url: props.options.endpoint,
			find: useListStore.options,
			q: $q,
		})

		rows.value = formatFormData(data)
	} else {
		rows.value = []
	}

	loading.value = false
}

async function onAdvancedFilterChange(advancedFiltersValue: any) {
	if (total_rows.value > 0) {
		const data = await props.options.functions.findAll({
			url: props.options.endpoint,
			find: {
				...useListStore.options,
				advancedFiltersValue,
			},
			q: $q,
		})

		rows.value = formatFormData(data)
	} else {
		rows.value = []
	}

	loading.value = false
}

/**
 * Add, updates or deletes a single record in the table
 */

async function processTableChange(options: { data: any; action: 'CREATE' | 'UPDATE' | 'DELETE' | 'RELOAD' }) {
	switch (options.action) {
		case 'CREATE':
			const exists = rows.value.find(row => row[primary_key] === options.data[primary_key])
			if (!exists) {
				rows.value.push(formatFormData(options.data))
				total_rows.value++
			}
			return
		case 'UPDATE':
			for (const r in rows.value) {
				if (rows.value[r][primary_key] === options.data[primary_key]) {
					rows.value[r] = formatFormData(options.data)
				}
			}
			return
		case 'DELETE':
			for (const r in rows.value) {
				if (rows.value[r][primary_key] === options.data[primary_key]) {
					rows.value.splice(Number(r), 1)
					total_rows.value--
				}
			}
			return
		case 'RELOAD':
			await getData()
			return
	}
}

async function onChange(value) {
	useListStore.updateOptions({
		...useListStore.options,
		limit: value.limit,
		offset: value.offset ?? '0',
		order_by: value.order_by ?? primary_key,
		order_by_type: value.order_by_type ?? 'DESC',
	})
	emit('change', value)
	await getData()
}

async function switchColumn(value) {
	if (useListStore.visible_columns.includes(value)) {
		useListStore.updateVisibleColumns(useListStore.visible_columns.filter(col => col !== value))
	} else {
		useListStore.updateVisibleColumns([...useListStore.visible_columns, value])
	}
}

/**
 * Format data based on the schema and removes non-schema fields
 * @param data
 */

function formatFormData(data: any): any {
	if (Array.isArray(data)) {
		const newData = []
		for (const row in data) {
			const newRow = {}
			for (const [key, value] of Object.entries(data[row])) {
				if (props.options.schema.find(col => col.field === key)?.format) {
					newRow[key] = props.options.schema.find(col => col.field === key).format(value)
				} else {
					newRow[key] = value
				}
			}
			newData.push(newRow)
		}
		return newData
	} else {
		const newRow = {}
		for (const [key, value] of Object.entries(data)) {
			if (props.options.schema.find(col => col.field === key)?.format) {
				newRow[key] = props.options.schema.find(col => col.field === key).format(value)
			} else {
				newRow[key] = value
			}
		}
		return newRow
	}
}

async function addRecord(value: any) {
	logger({ severity: LogSeverity.VERBOSE, message: `Adding record`, table: value })

	loading_add.value = true

	const record = await props.options.functions.create({
		url: props.options.endpoint,
		data: value,
		q: $q,
	})
	createdRecordSuccess.value = new Date()
	await processTableChange({
		action: 'CREATE',
		data: record,
	})

	emit('addRecord', value)
	loading_add.value = false
}

async function searchUpdate(value: string) {
	useListStore.updateOptions({
		...useListStore.options,
		search: value,
	})
	emit('search', value)
	await getData()
}

async function tableToggled(value: string) {
	useListStore.updateOptions({
		...useListStore.options,
		toggleButton: value,
	})
	emit('toggleButton', value)
	await getData()
}

async function updateFormField(value: any) {
	logger({ severity: LogSeverity.VERBOSE, message: `Updated Form field`, table: value })
	emit('updateFormField', value)
}

async function updateRecord(value: any) {
	loading_edit.value = true

	if (!value[primary_key]) {
		logger({
			severity: LogSeverity.ERROR,
			message: `Missing primary key from request, should be: ${primary_key} `,
			object: value,
		})
		emit('updateRecord', value)
		return
	}

	await props.options.functions.update({
		url: props.options.endpoint,
		record_id: value[primary_key],
		data: value,
		q: $q,
	})
	editedRecordSuccess.value = new Date()
	loading_edit.value = false
}

async function updateValue(update: { row: any; column: TableColumn; value: any }) {
	const { row, column, value } = update

	await props.options.functions.update({
		url: props.options.endpoint,
		record_id: row[primary_key],
		data: value,
		q: $q,
	})

	for (const r in rows.value) {
		if (rows.value[r][primary_key] === row[primary_key]) {
			rows.value[r][column.field] = column.format ? column.format(result[column.field]) : value?.value ?? value
		}
	}
	emit('updateValue', update)
}

async function confirmedDeleteRecord() {
	const record = deleteRow.value

	await props.options.functions.delete({
		url: props.options.endpoint,
		record_id: record[primary_key],
		q: $q,
	})
	let r = 0
	for (const row of rows.value) {
		if (row[primary_key] === record[primary_key]) {
			rows.value.splice(Number(r), 1)
		}
		r++
	}
	total_rows.value--

	deleteRow.value = null
	confirm.value = false
}

async function deleteRecord(record: any) {
	deleteRow.value = record

	if (props.options.show.confirm_delete === false) {
		await confirmedDeleteRecord()
		return
	} else {
		confirm.value = true
	}
	emit('deleteRecord', record)
}

async function pluginAction(data: any) {
	logger({ severity: LogSeverity.VERBOSE, message: `Plugin action`, table: data })
	emit('pluginAction', data)
}

onMounted(async () => {
	await buildDefaults()
	await subscribe()
	await getData()
})
</script>

<template>
	<div id="JLTableWrapper">
		<Table
			class="JLTableWrapper"
			:tableSchema="props.options"
			:visible-columns="useListStore.visible_columns"
			:search="useListStore?.options?.search"
			:rows="rows"
			:total-rows="total_rows"
			:loading="loading"
			:loading_add="loading_add"
			:loading_edit="loading_edit"
			:created-record-success="createdRecordSuccess"
			:edited-record-success="editedRecordSuccess"
			:restart="props.restart"
			@change="onChange"
			@switchColumn="switchColumn"
			@search="searchUpdate"
			@addRecord="addRecord"
			@updateRecord="updateRecord"
			@updateFormField="updateFormField"
			@updateValue="updateValue"
			@deleteRecord="deleteRecord"
			@pluginAction="pluginAction"
			@toggleButton="tableToggled"
			@advancedFilter="onAdvancedFilterChange"></Table>

			<JLAreYouSure :confirm="confirm" @cancel="confirm = false" @proceed="confirmedDeleteRecord" :button_proceed="{label: 'Delete Record'}" :icon="{classes: 'JLIcon JLIconDelete', size: '1em', type: options.icon?.type, name: options.icon?.icons?.delete ?? 'delete' }" />


	</div>
</template>
<style scoped></style>
