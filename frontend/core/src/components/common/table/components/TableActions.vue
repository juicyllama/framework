<script setup lang="ts">
import { TableSchema } from '@/types/index.js'

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
			:name="`${props.tableSchema.icon?.type ?? 'fa-duotone'} ${
				props.tableSchema.icon?.icons?.edit ?? 'fa-pen'
			}`" />
	</a>

	<a href="#" @click="emit('delete', props.row)" v-if="props.tableSchema.show.delete_record">
		<q-icon
			class="JLIcon JLIconDelete"
			:name="`${props.tableSchema.icon?.type ?? 'fa-duotone'} ${
				props.tableSchema.icon?.icons?.delete ?? 'fa-trash'
			}`" />
	</a>
	<slot></slot>
</template>
