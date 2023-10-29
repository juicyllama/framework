<script setup lang="ts">
import { Ref, ref } from 'vue'
import { TableSchema } from '../../../../types/table'

const props = defineProps<{
	tableSchema: TableSchema
	search: string
}>()

const emit = defineEmits(['searchUpdated'])

const filter: Ref<string> = ref(props.search)
</script>

<template>
	<div class="JLTableSearch">
		<q-input
			class="JLInput"
			:dark="props.tableSchema.show.search_filter.dark ?? false"
			borderless
			v-model="filter"
			:placeholder="props.tableSchema.show.search_filter.placeholder ?? 'Search'"
			debounce="300"
			@blur="emit('searchUpdated', filter)"
			@keyup.enter="emit('searchUpdated', filter)">
			<template v-slot:append>
				<q-icon
					:name="`${props.tableSchema.icon?.type} ${
						props.tableSchema.icon?.icons?.search ?? 'search'
					}`"
					size="medium"
					class="JLIcon JLIconSearch" />
			</template>
		</q-input>
	</div>
</template>
<style scoped>
.JLTableSearch {
	height: 50px;
}
</style>
