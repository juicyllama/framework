<script lang="ts" setup>
import { JLTable } from '../../../index'
import { TableSchema } from '../../../types'

defineProps({
	config: Object,
})
</script>


<template>
	<JLTable :options="config as TableSchema" />
</template>