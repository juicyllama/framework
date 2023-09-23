<script setup lang="ts">
import { usersTableSchema } from './users.table.schema.js'
import { JLTable, IconSettings, userStore, FormSettings } from '@/index.js'

const props = defineProps<{
	formSettings?: FormSettings
	visibleColumns: string[]
	icon: IconSettings
}>()
</script>

<template>
	<div id="JLUsersTable">
		<JLTable
			:options="usersTableSchema(userStore.isAdmin(), props.icon, props.visibleColumns, props.formSettings)" />
	</div>
</template>

<style scoped></style>
