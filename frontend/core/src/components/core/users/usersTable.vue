<script setup lang="ts">
import { usersTableSchema } from '../../../components/core/users/users.table.schema'
import { JLTable, IconSettings, userStore, FormSettings } from '../../../index'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const props = defineProps<{
	formSettings?: FormSettings
	visibleColumns: string[]
	icon: IconSettings
}>()
</script>

<template>
	<div id="JLUsersTable">
		<JLTable
			:options="usersTableSchema(userStore.isAdmin(router, route), props.icon, props.visibleColumns, props.formSettings)" />
	</div>
</template>

<style scoped></style>
