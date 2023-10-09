<template>
	<q-card-section class="q-pt-none q-pb-none">
		<div class="text-weight-bold">
			You can define the field mappings. Set mappings to specify the correspondence between fields in the Source
			and fields in the Destination.
		</div>
	</q-card-section>
	<q-card-section>
		<q-select :options="tableOptions" v-model="selectedTable">
			<template v-slot:prepend>
				<q-icon name="table_view" />
			</template>
		</q-select>
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
import { ref, watch, computed } from 'vue'
import { useUploaderStore } from '@/store/uploader'

const store = useUploaderStore()

const columns = [
	{
		name: 'source',
		label: 'Source Field',
		field: 'source',
		align: 'left',
	},
	{
		name: 'target',
		label: 'Target Field',
		align: 'left',
	},
	{
		name: 'primaryKey',
		label: 'Primary Key',
		align: 'left',
	},
]

// rows in the user-selected file
const rows = ref([
	// { source: 'test', target: ref(''), primaryKey: ref(false) },
])

const tableOptions = computed(() => store.getTables)
const selectedTable = ref('')
const targetFieldOptions = computed(() => store.getFieldsPerTable(selectedTable.value))
</script>
