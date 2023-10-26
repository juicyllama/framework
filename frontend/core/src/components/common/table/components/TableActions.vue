<script setup lang="ts">
import { TableSchema } from '../../../../types'

const props = defineProps<{
	tableSchema: TableSchema
	row: any
}>()

const emit = defineEmits(['edit', 'delete'])
</script>
<template>
	<a href="#" @click="emit('edit', props.row)" v-if="props.tableSchema.show.update_record">
		<q-icon
			class="JLIcon JLIconUpdate"
			:name="`${props.tableSchema.icon?.type} ${
				props.tableSchema.icon?.icons?.edit ?? 'edit'
			}`" />
	</a>

	<a href="#" @click="emit('delete', props.row)" v-if="props.tableSchema.show.delete_record">
		<q-icon
			class="JLIcon JLIconDelete"
			:name="`${props.tableSchema.icon?.type} ${
				props.tableSchema.icon?.icons?.delete ?? 'delete'
			}`" />
	</a>
	<slot></slot>
</template>
