<script setup lang="ts">
import { ref, Ref } from 'vue'
import type { QVueGlobals } from 'quasar'
import { IconSettings } from '../../../types/common'
import { invoicesTableSchema } from './billing.table.schema'
import { JLTable } from '../../../components/common/table'
//import { JLChart } from '../../../components/common/chart'
//import { JLStats } from '../../../components/common/stats'
import { BILLING_INVOICE_ENDPOINT, billingInvoiceService } from '../../../services/billing/invoices'

const props = defineProps<{
	visibleColumns?: string[]
	iconSettings: IconSettings,
	q?: QVueGlobals
}>()

const invoice_count: Ref<number> = ref(0)

if(props.q) {
	props.q.loading.show({
		message: 'Loading Invoice Data...'
	})
}
	
invoice_count.value = await billingInvoiceService.stats({ method: 'COUNT' })

if(props.q) {
	props.q.loading.hide()
}

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

</script>
<template>
	<div class="JLPage JLPage--billing">
		<div v-if="invoice_count > 0">
			<v-row >
				<v-col xs="12" sm="6">
					<JLTable :visibleColumns="visibleColumns" :options="invoicesTableSchema(props.iconSettings, visibleColumns)">
						<template v-slot:custom-action="{ row }">
							<q-btn @click="onDownloadButtonClick(row)" color="primary">Download</q-btn>
						</template>
					</JLTable>
				</v-col>
				<!-- <v-col xs="12" sm="6">
					<JLChart
						:endpoint="`${BILLING_INVOICE_ENDPOINT}/stats?method=COUNT`"
						title="Invoice spend last 12 months"
						type="line"
						dynamic-data />
				</v-col> -->
			</v-row>
			<!-- <v-row>
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
		</v-row> -->
		</div>
		<div v-else>
			<p>No invoices found, check back later.</p>
		</div>
	</div>
</template>
