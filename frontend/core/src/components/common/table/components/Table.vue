<script setup lang="ts">
import { Ref, ref, reactive, computed, watch } from 'vue'
import FieldContents from './FieldContents.vue'
import TableActions from './TableActions.vue'
import {
	FormField,
	FormFieldButtonType,
	FormFieldField,
	LogSeverity,
	TableOptions,
	TablePosition,
	TableSchema,
} from '../../../../types'
import { IFilter } from '../../../../types/table'
import { Strings } from '@juicyllama/vue-utils'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { default as JLForm } from '../../form/Form.vue'
import { ColumnsFilter, CustomButtons, TextSearchFilter } from './index'
import { logger } from '../../../../index'

const props = defineProps<{
	tableSchema: TableSchema
	rows?: any
	search?: string
	visibleColumns?: string[]
	totalRows?: number
	loading?: boolean
	loading_add?: boolean
	loading_edit?: boolean
	createdRecordSuccess?: Date
	editedRecordSuccess?: Date
	restart?: Date
}>()

const primaryKey: Ref<string> = ref(props.tableSchema.schema.find(col => col.primary_key).field)

const emit = defineEmits([
	'change',
	'switchColumn',
	'search',
	'addRecord',
	'updateRecord',
	'updateValue',
	'updateFormField',
	'deleteRecord',
	'pluginAction',
	'toggleButton',
	'advancedFilter',
])

const $q = useQuasar()
const router = useRouter()

const filter: Ref<string> = ref(props.search || '')
const createRecord: Ref<boolean> = ref(false)
const editRecord: Ref<boolean> = ref(false)
let formFields: FormField[] = reactive(buildFormFromTableSchema())
const editPrimaryKey: Ref<number> = ref(null)
const tableExpanded = ref(false)
const table_toggle: Ref<string> = ref(
	props.tableSchema?.show?.toggle_buttons?.[0]?.options?.find(button => button.default)?.value,
)

if (!props.tableSchema.find.order_by) {
	logger({ severity: LogSeverity.ERROR, message: 'You must pass a sort-column to the table' })
}

function pluginUpdated(data: any) {
	emit('pluginAction', data)
}

function sort(
	rows = props.rows,
	sortBy = props.tableSchema.find.order_by,
	descending = props.tableSchema.find.order_by_type === 'DESC' ? true : false,
) {
	const data = [...rows]

	if (sortBy) {
		data.sort((a, b) => {
			const x = descending ? b : a
			const y = descending ? a : b

			if (sortBy === primaryKey.value) {
				// string sort
				return x[sortBy] > y[sortBy] ? 1 : x[sortBy] < y[sortBy] ? -1 : 0
			} else {
				// numeric sort
				return parseFloat(x[sortBy]) - parseFloat(y[sortBy])
			}
		})
	}

	return data
}

const pagination = ref(
	props.tableSchema.show?.table_footer !== false
		? {
				sortBy: props.tableSchema.find.order_by,
				descending: props.tableSchema.find.order_by_type === 'DESC',
				page: Number(Number(props.tableSchema.find.offset) / Number(props.tableSchema.find.limit)),
				rowsPerPage: Number(props.tableSchema.find.limit),
				rowsNumber: props.totalRows,
		  }
		: null,
)

function buildFormFromTableSchema(): FormField[] {
	const formFields: FormField[] = []

	for (const col of props.tableSchema.schema) {
		if ((col.form?.add && !col.primary_key) || col.form?.edit) {
			formFields.push({
				key: col.field,
				label: col.label ?? col.field,
				required: col.required,
				...col.form,
			})
		}
	}

	formFields.push({
		key: 'submit',
		field: FormFieldField.BUTTON,
		buttons: [
			{
				type: FormFieldButtonType.SUBMIT,
			},
		],
		loading: props.loading_add,
	})

	return formFields
}

function onRequest(values: any) {
	const { page, rowsPerPage, sortBy, descending } = values.pagination
	const filter = values.filter

	if (filter && filter !== '') {
		emit('search', filter)
	}

	if (props.tableSchema.show?.table_footer !== false) {
		pagination.value.sortBy = sortBy
		pagination.value.descending = descending
		pagination.value.rowsPerPage = rowsPerPage
		pagination.value.page = page
	}

	emit('change', <TableOptions>{
		limit: rowsPerPage,
		offset: (page - 1) * rowsPerPage,
		order_by: pagination.value.sortBy,
		order_by_type: pagination.value.descending ? 'ASC' : 'DESC',
	})
}

function switchColumn(column: string) {
	emit('switchColumn', column)
}

function searchUpdated(value: string) {
	filter.value = value
	emit('search', value)
}

function addRecord(value: any) {
	emit('addRecord', value)
}

function addItem() {
	if (props.tableSchema.redirects?.add) {
		router.push(props.tableSchema.redirects.add)
		return
	}

	for (const f in formFields) {
		formFields[f].value = null
	}
	createRecord.value = true
}

function clickItem(row: any) {
	if (props.tableSchema.redirects?.click) {
		const redirect = Strings.replacer(props.tableSchema.redirects.click, row)
		router.push(redirect)
		return
	}

	editItem(row)
}

function editItem(row: any) {
	if (props.tableSchema.redirects?.edit) {
		const redirect = Strings.replacer(props.tableSchema.redirects.edit, row)
		router.push(redirect)
		return
	}

	for (const f in formFields) {
		formFields[f].value = props.tableSchema?.schema?.find(col => col.field === formFields[f].key)?.reformat
			? props.tableSchema.schema.find(col => col.field === formFields[f].key).reformat(row[formFields[f].key])
			: row[formFields[f].key]
	}
	editPrimaryKey.value = row[primaryKey.value]
	editRecord.value = true
}

function updateRecord(value: any) {
	emit('updateRecord', {
		[primaryKey.value]: editPrimaryKey.value,
		...value,
	})
}

function updateFormField(value: any) {
	emit('updateFormField', {
		[primaryKey.value]: editPrimaryKey.value,
		...value,
	})
}

const JLToQColumns = <any>computed(() => {
	const columns = props.tableSchema.schema.filter(col => {
		return props.visibleColumns?.includes(col.field)
	})

	for (const col in columns) {
		columns[col].name = columns[col].field
		delete columns[col].required
	}

	if (props.tableSchema.show?.delete_record || props.tableSchema.show?.update_record) {
		if (!columns.find(col => col.field === 'action')) {
			columns.push({
				field: 'action',
				label: 'Actions',
				sortable: false,
				show: true,
				align: 'center',
				name: 'action',
			})
		}
	}

	return columns
})

function toggleTableSize() {
	tableExpanded.value = !tableExpanded.value
	document.getElementById('aircraft-table')?.classList.toggle('expanded')
}

async function toggle_table(value: string) {
	table_toggle.value = value
	emit('toggleButton', value)
}

function deleteItem(row: any) {
	if (props.tableSchema.redirects?.delete) {
		const redirect = Strings.replacer(props.tableSchema.redirects.delete, row)
		router.push(redirect)
		return
	}
	emit('deleteRecord', row)
}

watch(
	() => props.totalRows,
	newValue => {
		pagination.value.rowsNumber = newValue
	},
)

watch(
	() => props.createdRecordSuccess,
	() => {
		createRecord.value = false
	},
)

watch(
	() => props.editedRecordSuccess,
	() => {
		editRecord.value = false
	},
)

watch(
	() => props.restart,
	() => {
		editRecord.value = false
		createRecord.value = false
	},
)

const advancedFilterDialog = ref<boolean>(false)
const labels = computed(() => JLToQColumns.value.map(el => el.label))
const activeLabels = computed<string[]>(() => activeFilters.value.map(el => el.label))

const activeFilters = ref<IFilter[]>([])

const perCollumnFilterQuery = computed<Array<string | number>[]>(() => {
	return activeFilters.value.map(el => {
		const item = JLToQColumns.value.find(i => i.label === el.label)
		const method: string = typeof el.type === 'object' ? el.type.method : ''
		if (item && ['NULL', '!NULL'].includes(method)) return [item.name, method]
		if (item) return [item.name, method, el.value]
		else return []
	})
})

const onClearFilters = () => {
	activeFilters.value = []
}

const onAddFilter = data => {
	activeFilters.value.push(data)
}

const onRemoveFilter = index => {
	activeFilters.value.splice(index, 1)
}

watch(
	() => props.restart,
	() => {
		emit('advancedFilter', perCollumnFilterQuery.value)
	},
)
</script>

<template>
	<div id="JLTable" class="JLTable">
		<TableFilterDialog
			v-model="advancedFilterDialog"
			:activeFilters="activeFilters"
			:labels="labels"
			@clear="onClearFilters"
			@add="onAddFilter"
			@remove="onRemoveFilter" />
		<q-table
			:title="props.tableSchema.title ?? ''"
			v-bind:style="props.tableSchema?.style"
			:rows="rows"
			:hide-header="props.tableSchema.show?.table_header === false"
			:hide-footer="props.tableSchema.show?.table_footer === false"
			:hide-pagination="props.tableSchema.show?.table_footer === false"
			:columns="JLToQColumns"
			:row-key="primaryKey"
			:sort-method="sort"
			:loading="loading"
			:visible-columns="JLToQColumns.map(col => col.name)"
			v-model:pagination="pagination"
			@request="onRequest">
			<template v-slot:header-cell="props">
				<q-th :props="props">
					{{ props.col.label }}
					<q-icon name="filter_alt" size="1.2em" color="red" v-if="activeLabels.includes(props.col.label)" />
				</q-th>
			</template>
			<template v-slot:top-left v-if="props.tableSchema.show?.table_actions !== false">
				<div class="JLTableTopLeft">
					<h5 class="JLTableTitle" v-if="props.tableSchema.title">{{ props.tableSchema.title }}</h5>

					<CustomButtons
						v-if="
							!loading &&
							props.tableSchema?.show?.custom_buttons?.filter(
								button => button.position === TablePosition.TOP_LEFT,
							).length
						"
						:schema="props.tableSchema"
						:buttons="
							props.tableSchema?.show?.custom_buttons?.filter(
								button => button.position === TablePosition.TOP_LEFT,
							)
						"
						:q="$q" />
					<div
						v-if="
							!loading &&
							props.tableSchema?.show?.toggle_buttons?.filter(
								button => button.position === TablePosition.TOP_LEFT,
							).length
						"
						style="width: 100%; z-index: 10">
						<q-btn-toggle
							v-for="toggle_button in props.tableSchema?.show?.toggle_buttons?.filter(
								button => button.position === TablePosition.TOP_LEFT,
							)"
							:key="toggle_button.position"
							class="map-filters-ground-air-toggle"
							:options="toggle_button.options"
							:size="'md'"
							style="font-size: 12px"
							rounded
							v-model="table_toggle"
							@update:model-value="toggle_table" />
					</div>

					<TextSearchFilter
						v-if="!loading && props.tableSchema?.show?.search_filter?.position === TablePosition.TOP_LEFT"
						:search="filter"
						:table-schema="props.tableSchema"
						@searchUpdated="searchUpdated" />
				</div>
			</template>

			<template v-slot:top-right v-if="props.tableSchema.show?.table_actions !== false">
				<div class="JLTableTopRight">
					<TextSearchFilter
						v-if="!loading && props.tableSchema?.show?.search_filter?.position === TablePosition.TOP_RIGHT"
						:search="filter"
						:table-schema="props.tableSchema"
						@searchUpdated="searchUpdated" />

					<q-btn
						v-if="!loading && props.tableSchema?.show?.advanced_filters"
						class="q-ml-sm"
						color="primary"
						:label="`Filters (${activeFilters.length})`"
						@click="advancedFilterDialog = true" />

					<div v-if="props.tableSchema?.show?.expandable">
						<div @click="toggleTableSize" style="cursor: pointer">
							<q-icon v-bind:name="!tableExpanded ? 'open_in_full' : 'aspect_ratio'" size="xs" />
						</div>
					</div>

					<ColumnsFilter
						v-if="!loading && props.tableSchema?.show?.column_filter"
						:table-schema="props.tableSchema"
						@toggle-column="switchColumn"
						:visible-columns="JLToQColumns.map(col => col.name)" />

					<q-btn class="JLButton JLTableAddRecord" v-if="props.tableSchema.show.add_record" @click="addItem">
						<q-icon
							:name="`${props.tableSchema.icon?.type} ${props.tableSchema.icon?.icons?.add ?? 'add_box'}`"
							size="medium"
							class="JLIcon JLIconAddRecord" />
						Add
						<!--{{ props.tableSchema.name }}-->
					</q-btn>

					<CustomButtons
						v-if="
							!loading &&
							props.tableSchema?.show?.custom_buttons?.filter(
								button => button.position === TablePosition.TOP_RIGHT,
							).length
						"
						:schema="props.tableSchema"
						:buttons="
							props.tableSchema?.show?.custom_buttons?.filter(
								button => button.position === TablePosition.TOP_RIGHT,
							)
						"
						:q="$q" />
				</div>
			</template>

			<template v-slot:no-data>
				<div v-if="loading" class="JLTableLoadingNoDataWrapper">
					<div v-for="col in JLToQColumns" :key="col.field" class="JLTableLoadingNoDataCol">
						<q-skeleton type="rect" class="JLTableLoadingNoDataSkeleton" />
					</div>
				</div>
			</template>

			<template v-slot:body="{ row }">
				<q-tr :style="props.tableSchema.show.clickable ? 'cursor: pointer;' : ''">
					<q-td
						v-for="col in JLToQColumns"
						:key="col.field"
						:class="[
							JLToQColumns.map(col => col.name).includes(col.field)
								? 'JLTableRowColVisible'
								: 'JLTableRowColHide',
							col.field === 'action' ? 'row justify-center' : '',
						]">
						<div v-if="loading">
							<q-skeleton type="rect" class="JLTableLoadingSkeleton" />
						</div>
						<div v-else class="JLTableRowColValue">
							<div v-if="props.tableSchema.show.update_inline && col.field !== 'action'">
								<FieldContents :col="col" :row="row" />

								<q-popup-edit
									v-model="row[col.field]"
									v-if="col.form?.edit"
									@before-show="() => (editPrimaryKey = row[primaryKey])">
									<JLForm
										:options="{
											type: 'edit',
											event: props.tableSchema.event,
											endpoint: props.tableSchema.endpoint,
											name: props.tableSchema.name,
											fields: [
												{
													...props.tableSchema.schema.find(field => field.field === col.field)
														.form,
													key: col.field,
													value: row[col.field],
													size: {
														desktop: 12,
														tablet: 12,
														mobile: 12,
													},
												},
											],
										}"
										@updatedField="updateRecord"
										@pluginInstalledApp="pluginUpdated"
										@pluginPhoneNumber="pluginUpdated" />
								</q-popup-edit>
							</div>
							<div v-else-if="col.field === 'action'" class="JLTableActions text-center">
								<TableActions
									:row="row"
									:table-schema="props.tableSchema"
									@edit="editItem"
									@delete="deleteItem">
									<slot name="custom-action"></slot>
								</TableActions>
							</div>
							<div v-else @click="props.tableSchema.show.clickable ? clickItem(row) : null">
								<FieldContents :col="col" :row="row" />
							</div>
						</div>
					</q-td>
				</q-tr>
			</template>
		</q-table>

		<q-dialog v-model="createRecord" id="JLTableAdd">
			<q-card class="JLTableAddEditCard">
				<q-card-section>
					<div class="text-h6">Add {{ props.tableSchema.name }}</div>
				</q-card-section>
				<div class="JLTableJLFormWrapper">
					<JLForm
						:options="{
							type: 'add',
							event: props.tableSchema.event,
							name: props.tableSchema.name,
							endpoint: props.tableSchema.endpoint,
							fields: formFields,
							onFormLoad: props.tableSchema.form?.onAddFormLoad,
						}"
						@submittedForm="addRecord"
						@pluginPhoneNumber="pluginUpdated"
						@pluginInstalledApp="pluginUpdated" />
				</div>
			</q-card>
		</q-dialog>

		<q-dialog v-model="editRecord" id="JLTableEdit">
			<q-card class="JLTableAddEditCard">
				<q-card-section>
					<div class="text-h6">Edit {{ props.tableSchema.name }}</div>
				</q-card-section>
				<div class="JLTableJLFormWrapper">
					<JLForm
						:options="{
							type: 'edit',
							event: props.tableSchema.event,
							endpoint: props.tableSchema.endpoint,
							name: props.tableSchema.name,
							fields: formFields,
							onFormLoad: props.tableSchema.form?.onEditFormLoad,
						}"
						@updateFormField="updateFormField"
						@submittedForm="updateRecord"
						@pluginPhoneNumber="pluginUpdated"
						@pluginInstalledApp="pluginUpdated" />
				</div>
			</q-card>
		</q-dialog>

		<CustomButtons
			v-if="
				!loading &&
				props.tableSchema?.show?.custom_buttons?.filter(button => button.position === TablePosition.AFTER_TABLE)
					.length
			"
			:schema="props.tableSchema"
			:buttons="
				props.tableSchema?.show?.custom_buttons?.filter(button => button.position === TablePosition.AFTER_TABLE)
			"
			:q="$q" />
	</div>
</template>

<style scoped>
.JLTableAddEditCard {
	width: 500px;
	max-width: 80vw;
}

.JLTableLoadingNoDataWrapper {
	display: flex;
	gap: 2rem;
	width: 100%;
}

.JLTableLoadingNoDataCol {
	display: flex;
	gap: 2rem;
	width: 100%;
}

.JLTableLoadingNoDataSkeleton {
	width: 100%;
	flex-shrink: 0;
}

.JLTableActions {
	display: flex;
	gap: 0.5rem;
}

.JLTableTopRight {
	display: flex;
	gap: 1rem;
	height: 1rem;
	justify-content: flex-end;
	align-items: center;
	align-content: center;
}
</style>
