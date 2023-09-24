<script setup lang="ts">
import { computed, reactive, ref, watch, Ref } from 'vue'
import { logger } from '@/helpers'
import { default as JLForm } from '../../form/Form.vue'
import { SearchFilter, ColumnsFilter, CustomButtons } from './index'
import {
	TablePosition,
	LogSeverity,
	TableOptions,
	TableSchema,
	FormField,
	FormFieldButtonType,
	FormFieldField,
} from '@/types'
import { useQuasar } from 'quasar'
import FieldContents from '@/components/common/table/components/FieldContents.vue'
import TableActions from '@/components/common/table/components/TableActions.vue'
import { useRouter } from 'vue-router'
import { Strings } from '@juicyllama/vue-utils'

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
])

const $q = useQuasar()
const router = useRouter()

const filter: Ref<string> = ref(props.search || '')
const createRecord: Ref<boolean> = ref(false)
const editRecord: Ref<boolean> = ref(false)
let formFields: FormField[] = reactive(buildFormFromTableSchema())
const editPrimaryKey: Ref<number> = ref(null)

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
</script>

<template>
	<div id="JLTable" class="JLTable">
		<q-table
			:title="props.tableSchema.title ?? ''"
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

					<SearchFilter
						v-if="!loading && props.tableSchema?.show?.search_filter?.position === TablePosition.TOP_LEFT"
						:search="filter"
						:table-schema="props.tableSchema"
						@searchUpdated="searchUpdated" />
				</div>
			</template>

			<template v-slot:top-right v-if="props.tableSchema.show?.table_actions !== false">
				<div class="JLTableTopRight">
					<SearchFilter
						v-if="!loading && props.tableSchema?.show?.search_filter?.position === TablePosition.TOP_RIGHT"
						:search="filter"
						:table-schema="props.tableSchema"
						@searchUpdated="searchUpdated" />

					<ColumnsFilter
						v-if="!loading && props.tableSchema?.show?.column_filter"
						:table-schema="props.tableSchema"
						@toggle-column="switchColumn"
						:visible-columns="JLToQColumns.map(col => col.name)" />

					<q-btn class="JLButton JLTableAddRecord" v-if="props.tableSchema.show.add_record" @click="addItem">
						<q-icon
							:name="`${props.tableSchema.icon?.type ?? 'fa-duotone'} ${
								props.tableSchema.icon?.icons?.add ?? 'fa-square-plus'
							}`"
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
						:class="
							JLToQColumns.map(col => col.name).includes(col.field)
								? 'JLTableRowColVisible'
								: 'JLTableRowColHide'
						">
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
