<script lang="ts" setup>
// import {ref} from 'vue'
import { useQuasar } from 'quasar'
import { JLTable } from '@juicyllama/quasar'
import { FormFieldField, FormFieldType, FormSettings, IconSettings, TableExtraType, TableSchema, TableColumn } from '@juicyllama/quasar'

const defaultFormSettings = {
	field: {
		settings: {
			lazy_rules: 'ondemand',
			counter: false,
			outlined: false,
			dense: false,
			hideBottomSpace: true,
			color: null,
			no_error_icon: false,
			stack_label: true,
		},
	},
}

const Strings = {
    capitalize: (val) => val
}

const $q = useQuasar()

const visibleColumns = ['first_name', 'user_id']

interface TableSchemaWithVisibleCols extends TableSchema {
    visibleColumns: string[]
}

const usersTableSchema = (
	is_admin: boolean,
	icon?: IconSettings,
	visibleColumns?: string[],
	formSettings?: FormSettings,
): TableSchema => {
	// TimeAgo.addDefaultLocale(en)
	// const timeAgo = new TimeAgo('en-US')
	// const usersService = new UsersService()

    console.log(visibleColumns, formSettings)

	return {
		title: 'Users',
		name: 'Users',
		// event: `account_123_users`,
		endpoint: '/users',
		// endpoint: 'https://jsonplaceholder.typicode.com/users',
		icon: icon,
		show: {
			add_record: is_admin,
			update_inline: is_admin,
			update_record: is_admin,
			delete_record: is_admin,
		},
		find: {
			limit: '10',
			offset: '0',
			order_by: 'first_name',
			order_by_type: 'ASC',
			select: ['user_id', 'first_name'].toString(),
			relations: '',
		},
		functions: {
			// @ts-ignore
			create: () => {},
			// @ts-ignore
			findOne: () => {},
			// // @ts-ignore
			findAll: () => {},
			// // @ts-ignore
			stats: (config) => {
                console.log(config)
                // fetch(config.url)
            },
			// @ts-ignore
			update:() => {},
			// // @ts-ignore
			// delete: usersService.delete,
		},

		schema: [
			{
				required: true,
				label: 'User #',
				align: 'left',
                name: 'user_id',
				field: 'user_id',
				sortable: true,
				show: visibleColumns ? visibleColumns?.includes('user_id') : true,
				primary_key: true,
			},
			{
				align: 'left',
				label: 'First Name',
				field: 'first_name',
                name: 'first_name',
				sortable: true,
				format: val => `${val ? Strings.capitalize(val) : ''}`,
				show: visibleColumns ? visibleColumns?.includes('first_name') : true,
				form: {
					key: 'first_name',
					field: FormFieldField.INPUT,
					type: FormFieldType.TEXT,
					required: false,
					add: true,
					edit: true,
					// settings: formSettings?.field?.settings ?? defaultFormSettings.field.settings,
				},
			},
			// {
			// 	align: 'left',
			// 	label: 'Last Name',
			// 	field: 'last_name',
			// 	sortable: true,
			// 	format: val => `${val ? Strings.capitalize(val) : ''}`,
			// 	show: visibleColumns ? visibleColumns?.includes('last_name') : true,
			// 	form: {
			// 		key: 'last_name',
			// 		field: FormFieldField.INPUT,
			// 		type: FormFieldType.TEXT,
			// 		required: false,
			// 		add: true,
			// 		edit: true,
			// 		// settings: formSettings?.field?.settings ?? defaultFormSettings.field.settings,
			// 	},
			// },
			// {
			// 	align: 'left',
			// 	label: 'Email',
			// 	field: 'email',
			// 	sortable: true,
			// 	show: visibleColumns ? visibleColumns?.includes('email') : true,
			// 	form: {
			// 		key: 'email',
			// 		field: FormFieldField.INPUT,
			// 		type: FormFieldType.EMAIL,
			// 		required: true,
			// 		add: true,
			// 		edit: true,
			// 		// settings: formSettings?.field?.settings ?? defaultFormSettings.field.settings,
			// 	},
			// },
			// {
			// 	align: 'left',
			// 	label: 'Role',
			// 	field: 'role',
			// 	sortable: false,
			// 	format: val => (val ? (val === 'OWNER' ? 'ADMIN' : Strings.capitalize(val)) : ''),
			// 	show: visibleColumns ? visibleColumns?.includes('role') : true,
			// 	form: {
			// 		key: 'role',
			// 		field: FormFieldField.DROPDOWN,
			// 		dropdown: [
			// 			{ value: 'ADMIN', label: 'Admin' },
			// 			{ value: 'MEMBER', label: 'Member' },
			// 			{ value: 'VIEWER', label: 'Viewer' },
			// 		],
			// 		required: false,
			// 		edit: true,
			// 		// settings: formSettings?.field?.settings ?? defaultFormSettings.field.settings,
			// 	},
			// 	extra: {
			// 		type: TableExtraType.BADGE,
			// 		colors: { OWNER: 'green', ADMIN: 'purple', MEMBER: 'primary', VIEWER: 'orange' },
			// 	},
			// },
			// {
			// 	align: 'left',
			// 	label: 'Last Login',
			// 	field: 'last_login_at',
			// 	sortable: true,
			// 	format: val => `${val ? new Date(val) : 'Never'}`,
			// 	show: visibleColumns ? visibleColumns?.includes('last_login_at') : true,
			// },
		],
	}
}

const data = <{
	formSettings?: FormSettings
	visibleColumns: string[]
	icon: IconSettings
}>{
    icon: {
        type: 'user',
        icons: {
            add: 'plus'
        }
    },
    visibleColumns,
    formSettings: {}
}
</script>

<template>
    <JLTable :visibleColumns="visibleColumns" :options="usersTableSchema(true, data.icon, data.visibleColumns, data.formSettings)" />
</template>
