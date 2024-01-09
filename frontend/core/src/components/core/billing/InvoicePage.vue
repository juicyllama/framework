<script setup lang="ts">
import { watchEffect, reactive, ref, Ref } from 'vue'
import { Invoice } from '../../../types'
import { billingInvoiceService } from '../../../services/billing';

const props = defineProps<{
	invoice_id: number
}>()

const data = reactive({
	invoiceData: null,
	loaded: false,
	error: false,
})

const invoice: Ref<Invoice> = ref(null)

watchEffect(async () => {

	invoice.value = await billingInvoiceService.findOne({
		record_id: props.invoice_id,
	})

	if(!invoice.value) {
		data.error = true
		return
	}

	data.loaded = true
})

//app_invoice_id, amount_total, amount_due, amount_paid, created_at, updated_at, paid_at, is_paid
</script>
<template>
	<template v-if="data.loaded">
		<section v-if="data.error">
			<q-icon size="15" class="ml-2" name="error" /> Failed to load invoice data.
		</section>
		<section v-else>
			<!-- main page content -->
			<h1>Invoice {{ props.invoice_id }}</h1>
			<q-list bordered separator>
				<q-item>
					<q-item-section>created_at: {{ data.invoiceData.created_at }}</q-item-section>
				</q-item>
				<q-item>
					<q-item-section>app_integration_name: {{ data.invoiceData.app_integration_name }}</q-item-section>
				</q-item>
				<q-item>
					<q-item-section>currency: {{ data.invoiceData.currency }}</q-item-section>
				</q-item>
				<q-item>
					<q-item-section>amount_total: {{ data.invoiceData.amount_total }}</q-item-section>
				</q-item>
			</q-list>
		</section>
	</template>
	<q-spinner v-else color="primary" size="3em" />
</template>
