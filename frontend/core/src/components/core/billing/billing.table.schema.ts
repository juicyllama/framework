import { BILLING_INVOICE_ENDPOINT, billingInvoiceService, IconSettings, TableSchema } from '../../../index'

export const invoicesTableSchema = (icon?: IconSettings, visibleColumns?: string[]): TableSchema => {
	return {
		title: 'Most recent invoices',
		name: 'recent_invoices',
		endpoint: BILLING_INVOICE_ENDPOINT,
		redirects: {
			click: '/invoice/${row.invoice_id}',
		},
		icon: icon,
		show: {
			clickable: true,
			add_record: false,
			update_inline: false,
			update_record: false,
			delete_record: false,
		},
		find: {
			limit: '5',
			offset: '0',
			order_by: 'created_at',
			order_by_type: 'DESC',
		},
		functions: {
			// @ts-ignore
			create: billingInvoiceService.create,
			// @ts-ignore
			findOne: billingInvoiceService.findOne,
			// @ts-ignore
			findAll: billingInvoiceService.findAll,
			// @ts-ignore
			stats: billingInvoiceService.stats,
			// @ts-ignore
			update: billingInvoiceService.update,
			// @ts-ignore
			delete: billingInvoiceService.delete,
		},
		schema: [
			{
				required: true,
				label: 'Invoice #',
				align: 'left',
				name: 'app_invoice_id',
				field: 'app_invoice_id',
				sortable: true,
				show: visibleColumns ? visibleColumns?.includes('app_invoice_id') : true,
				primary_key: true,
			},
			{
				align: 'left',
				label: 'Amount total',
				field: 'amount_total',
				name: 'amount_total',
				sortable: true,
				show: visibleColumns ? visibleColumns?.includes('amount_total') : true,
			},
			{
				align: 'left',
				label: 'Currency',
				field: 'currency',
				name: 'currency',
				sortable: true,
				show: visibleColumns ? visibleColumns?.includes('currency') : true,
			},
			{
				align: 'left',
				label: 'Created at',
				field: 'created_at',
				name: 'created_at',
				sortable: true,
				show: visibleColumns ? visibleColumns?.includes('created_at') : true,
			},
			{
				align: 'left',
				label: 'Paid',
				field: 'is_paid',
				name: 'is_paid',
				sortable: true,
				format: val => `${val ? 'Yes' : 'No'}`,
				show: visibleColumns ? visibleColumns?.includes('is_paid') : true,
			},
		],
	}
}
