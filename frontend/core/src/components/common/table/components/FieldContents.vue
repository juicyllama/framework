<script setup lang="ts">
import { TableColumn, TableExtraType } from '../../../../types'

const props = defineProps<{
	col: TableColumn
	row: any
}>()
</script>

<template>
	<span
		class="JLTableFieldHtml"
		v-if="props.col.extra?.type === TableExtraType.HTML"
		v-html="props.row[props.col.field]"></span>
	<span class="JLTableFieldBadge" v-else-if="props.col.extra?.type === TableExtraType.BADGE">
		<q-badge :color="props.col.extra.colors[props.row[props.col.field]]">{{ props.row[props.col.field] }}</q-badge>
	</span>
	<span class="JLTableFieldContent" v-else :class="`text-${props.col.align ?? 'right'}`">{{
		props.row[props.col.field]
	}}</span>
</template>
