<script setup lang="ts">
import { ref } from 'vue'
import { BILLING_INVOICE_ENDPOINT, IconSettings } from '@/index.js'
import { StatsMethods } from '@juicyllama/utils'
import { invoicesTableSchema } from './billing.table.schema.js'

const props = defineProps<{
	visibleColumns: string[]
	icon: IconSettings
}>()

const onDownloadButtonClick = invoiceObject => {
	const url = `${BILLING_INVOICE_ENDPOINT}/files/${invoiceObject.invoice_id}`
	const fileName = `invoice${invoiceObject.invoice_id}`
	const req = new XMLHttpRequest()
	req.open('GET', url, true)
	req.responseType = 'blob'
	req.onload = function () {
		const blob = new Blob([req.response], { type: 'application/octetstream' })
		const url = window.URL || window.webkitURL
		const link = url.createObjectURL(blob)
		const a = document.createElement('a')
		a.setAttribute('download', fileName)
		a.setAttribute('href', link)
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
	}
	req.send()
}

const lastInvoiceData = ref({
	//TODO:
	// unable to find method to get LAST items in
	// https://github.com/juicyllama-npm/billing/blob/main/src/modules/invoices/invoices.service.ts
	// add StatsMethods.LIMIT ?
	endpoint: `${BILLING_INVOICE_ENDPOINT}/stats?method=${StatsMethods.AVG}`,
	dynamicData: true,
})
const avgInvoiceData = ref({
	endpoint: `${BILLING_INVOICE_ENDPOINT}/stats?method=${StatsMethods.AVG}`,
	dynamicData: true,
})
</script>
<template>
	<div class="JLPage JLPage--billing">
		<v-row>
			<v-col xs="12" sm="6">
				<JLTable :visibleColumns="visibleColumns" :options="invoicesTableSchema(props.icon, visibleColumns)">
					<template v-slot:custom-action="{ row }">
						<q-btn @click="onDownloadButtonClick(row)" color="primary">Download</q-btn>
					</template>
				</JLTable>
			</v-col>
			<v-col xs="12" sm="6">
				<JLChart
					:endpoint="`${BILLING_INVOICE_ENDPOINT}/stats?method=${StatsMethods.COUNT}`"
					title="Invoice spend last 12 months"
					dynamic-data />
			</v-col>
		</v-row>
		<v-row>
			<v-col xs="12" sm="6">
				<v-col>
					<h4>Last Invoice Total</h4>
					<JLStats v-bind="lastInvoiceData" />
				</v-col>
				<v-col>
					<h4>Average invoice amount</h4>
					<JLStats v-bind="avgInvoiceData" />
				</v-col>
			</v-col>
		</v-row>
	</div>
</template>
