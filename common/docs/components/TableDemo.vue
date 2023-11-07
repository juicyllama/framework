<script setup>
import { JLTable,FormFieldField, FormFieldType } from '@juicyllama/frontend-core'
import {useQuasar} from 'quasar'

const $q = useQuasar()

const visibleColumns = ['first_name', 'user_id', 'last_name', 'user_email']
const is_admin = false

const options = {
    title: 'Users',
    name: 'Users',
    // event: `users_list`, // if using Pusher
    endpoint: `/users`, // if using REST API
    find: {
        limit: '10',
        offset: '0',
        order_by: 'first_name',
        order_by_type: 'ASC',
        select: ['user_id', 'first_name'].toString(),
        relations: '',
    },
    show: {
			add_record: true,
			update_inline: is_admin,
			update_record: is_admin,
			delete_record: true,
		},
    functions: {
			create: () => {},
			findOne: () => {},
			findAll: () => {},
            // (config) => {
            //     console.log(config)
            // },
			stats: () => {
                return [{
                    first_name: 'Total Users',
                    field: 100,
                    last_name: 'Total Users',
                }]
            },
            // (config) => {
            //     console.log(config)
            // },
			update:() => {},
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
				},
			},
            {
				align: 'left',
				label: 'Last Name',
				field: 'last_name',
                name: 'last_name',
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
				},
			},
            {
				align: 'left',
				label: 'Email',
				field: 'user_email',
                name: 'user_email',
				sortable: true,
				format: val => `${val ? Strings.capitalize(val) : ''}`,
				show: visibleColumns ? visibleColumns?.includes('user_email') : true,
				form: {
					key: 'user_email',
					field: FormFieldField.INPUT,
					type: FormFieldType.TEXT,
					required: false,
					add: true,
					edit: true,
				},
			},
    ],
}

</script>
<template>
    <JLTable :options="options" :visibleColumns="visibleColumns" />
</template>
