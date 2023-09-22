<script setup lang="ts">
import { Ref, ref } from 'vue'
import { TableSchema } from '@/types'

const props = defineProps<{
	tableSchema: TableSchema
	visibleColumns: string[]
}>()

const emit = defineEmits(['toggleColumn'])

const openColumnsFilter: Ref<boolean> = ref(false)
</script>

<template>
	<q-btn class="JLButton JLButtonTableColumns" @click="openColumnsFilter = !openColumnsFilter">
		<q-icon
			:name="`${props.tableSchema.icon?.type ?? 'fa-duotone'} ${
				props.tableSchema.icon?.icons?.columns ?? 'fa-line-columns'
			}`"
			size="medium"
			class="JLIcon JLIconColumns" />
		Columns
	</q-btn>

	<q-dialog v-model="openColumnsFilter">
		<q-card class="JLTableColumnFilterCard">
			<div v-for="col in props.tableSchema.schema" :key="col.field">
				<q-item v-bind="col" v-if="col.field !== 'action'">
					<q-item-section>
						<q-item-label>{{ col.label }}</q-item-label>
					</q-item-section>
					<q-item-section side>
						<q-toggle
							:model-value="props.visibleColumns?.includes(col.field)"
							@update:model-value="emit('toggleColumn', col.field)" />
					</q-item-section>
				</q-item>
			</div>
		</q-card>
	</q-dialog>
</template>
<style scoped>
.JLTableColumnFilterCard {
	width: 300px;
	max-width: 80vw;
}
</style>
