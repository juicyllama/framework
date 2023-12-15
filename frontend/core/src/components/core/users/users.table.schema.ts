import { FormFieldField, FormFieldType, FormViewSettings, IconSettings, TableExtraType, TableSchema } from '../../../types'
import { USERS_ENDPOINT, USERS_PUSHER_CHANNEL, UsersService } from '../../../services/users'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { accountStore } from '../../../index'
import { Strings } from '@juicyllama/vue-utils'
import { defaultFormSettings } from '../../../components/common/form/defaults'

export function usersTableSchema(
	is_admin: boolean,
	icon?: IconSettings,
	visibleColumns?: string[],
	formSettings?: FormViewSettings,
): TableSchema {
	TimeAgo.addDefaultLocale(en)
	const timeAgo = new TimeAgo('en-US')

	const usersService = new UsersService()

	return {
		title: 'Users',
		name: 'Users',
		event: Strings.replacer(USERS_PUSHER_CHANNEL, { account_id: accountStore.getAccountId }),
		endpoint: USERS_ENDPOINT,
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
			select: ['user_id', 'first_name', 'last_name', 'email', 'roles', 'last_login_at'].toString(),
			relations: '',
		},
		functions: {
			// @ts-ignore
			create: usersService.create,
			// @ts-ignore
			findOne: usersService.findOne,
			// @ts-ignore
			findAll: usersService.findAll,
			// @ts-ignore
			stats: usersService.stats,
			// @ts-ignore
			update: usersService.update,
			// @ts-ignore
			delete: usersService.delete,
		},
		schema: [
			{
				required: true,
				label: 'User #',
				align: 'left',
				field: 'user_id',
				sortable: true,
				show: visibleColumns ? visibleColumns?.includes('user_id') : true,
				primary_key: true,
			},
			{
				align: 'left',
				label: 'First Name',
				field: 'first_name',
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
					settings: formSettings ?? defaultFormSettings,
				},
			},
			{
				align: 'left',
				label: 'Last Name',
				field: 'last_name',
				sortable: true,
				format: val => `${val ? Strings.capitalize(val) : ''}`,
				show: visibleColumns ? visibleColumns?.includes('last_name') : true,
				form: {
					key: 'last_name',
					field: FormFieldField.INPUT,
					type: FormFieldType.TEXT,
					required: false,
					add: true,
					edit: true,
					settings: formSettings ?? defaultFormSettings,
				},
			},
			{
				align: 'left',
				label: 'Email',
				field: 'email',
				sortable: true,
				show: visibleColumns ? visibleColumns?.includes('email') : true,
				form: {
					key: 'email',
					field: FormFieldField.INPUT,
					type: FormFieldType.EMAIL,
					required: true,
					add: true,
					edit: true,
					settings: formSettings ?? defaultFormSettings,
				},
			},
			{
				align: 'left',
				label: 'Role',
				field: 'roles',
				sortable: false,
				show: visibleColumns ? visibleColumns?.includes('roles') : true,
				format: val => val[0].role,
				form: {
					key: 'role',
					field: FormFieldField.DROPDOWN,
					dropdown: [
						{ value: 'ADMIN', label: 'Admin' },
						{ value: 'MEMBER', label: 'Member' },
						{ value: 'VIEWER', label: 'Viewer' },
					],
					required: false,
					edit: true,
					settings: formSettings ?? defaultFormSettings,
				},
				extra: {
					type: TableExtraType.BADGE,
					colors: { OWNER: 'green', ADMIN: 'purple', MEMBER: 'primary', VIEWER: 'orange' },
				},
			},
			{
				align: 'left',
				label: 'Last Login',
				field: 'last_login_at',
				sortable: true,
				format: val => `${val ? timeAgo.format(new Date(val)) : 'Never'}`,
				show: visibleColumns ? visibleColumns?.includes('last_login_at') : true,
			},
		],
	}
}
