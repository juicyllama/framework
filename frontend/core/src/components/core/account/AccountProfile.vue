<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { default as JLForm } from '../../common/form/Form.vue'
import { useQuasar } from 'quasar'
import { AccountStore } from '../../../store/account'
import AccountAvatar from './AccountAvatar.vue'
import { UserStore } from '../../../store/user'
import { FormField, FormFieldButtonType, FormFieldField, FormFieldType, FormSettings } from '../../../types/form'
import { defaultFormSettings } from '../../../components/common/form/defaults'

const accountStore = AccountStore()
const userStore = UserStore()
const $q = useQuasar()

const props = defineProps<{
	formSettings?: FormSettings
}>()

const form: FormField[] = reactive([])

const loaded = ref<boolean>(false)

function createForm() {
	form.push(
		{
			key: 'account_name',
			value: accountStore.selected_account.account_name,
			label: 'Account Name',
			field: FormFieldField.INPUT,
			type: FormFieldType.TEXT,
			required: true,
			settings: props?.formSettings?.field?.settings ?? defaultFormSettings.field.settings,
			loading: false,
		},
		{
			key: 'company_name',
			value: accountStore.selected_account.company_name,
			label: 'Company Legal Name',
			field: FormFieldField.INPUT,
			type: FormFieldType.TEXT,
			required: false,
			settings: props?.formSettings?.field?.settings ?? defaultFormSettings.field.settings,
			loading: false,
		},
		{
			key: 'address_1',
			value: accountStore.selected_account.address_1,
			label: 'Address Line 1',
			field: FormFieldField.INPUT,
			type: FormFieldType.TEXT,
			required: false,
			settings: props?.formSettings?.field?.settings ?? defaultFormSettings.field.settings,
			loading: false,
		},
		{
			key: 'address_2',
			value: accountStore.selected_account.address_2,
			label: 'Address Line 2',
			field: FormFieldField.INPUT,
			type: FormFieldType.TEXT,
			required: false,
			settings: props?.formSettings?.field?.settings ?? defaultFormSettings.field.settings,
			loading: false,
		},
		{
			key: 'city',
			value: accountStore.selected_account.city,
			label: 'City',
			field: FormFieldField.INPUT,
			type: FormFieldType.TEXT,
			required: false,
			size: {
				tablet: 6,
				desktop: 6,
			},
			settings: props?.formSettings?.field?.settings ?? defaultFormSettings.field.settings,
			loading: false,
		},
		{
			key: 'postcode',
			value: accountStore.selected_account.postcode,
			label: 'Postcode',
			field: FormFieldField.INPUT,
			type: FormFieldType.TEXT,
			required: false,
			size: {
				tablet: 6,
				desktop: 6,
			},
			settings: props?.formSettings?.field?.settings ?? defaultFormSettings.field.settings,
			loading: false,
		},
		{
			key: 'state',
			value: accountStore.selected_account.state,
			label: 'County',
			field: FormFieldField.INPUT,
			type: FormFieldType.TEXT,
			required: false,
			size: {
				tablet: 6,
				desktop: 6,
			},
			settings: props?.formSettings?.field?.settings ?? defaultFormSettings.field.settings,
			loading: false,
		},
		{
			key: 'country',
			value: accountStore.selected_account.country,
			label: 'Country',
			default: 'US',
			field: FormFieldField.COUNTRY_DROPDOWN,
			required: false,
			size: {
				tablet: 6,
				desktop: 6,
			},
			settings: props?.formSettings?.field?.settings ?? defaultFormSettings.field.settings,
			loading: false,
		},
		{
			key: 'customer_service_name',
			value: accountStore.selected_account.customer_service_name,
			label: 'Customer Service Name',
			field: FormFieldField.INPUT,
			type: FormFieldType.TEXT,
			required: false,
			size: {
				tablet: 6,
				desktop: 6,
			},
			settings: props?.formSettings?.field?.settings ?? defaultFormSettings.field.settings,
			loading: false,
		},
		{
			key: 'customer_service_email',
			value: accountStore.selected_account.customer_service_email,
			label: 'Customer Service Email',
			field: FormFieldField.INPUT,
			type: FormFieldType.TEXT,
			required: false,
			size: {
				tablet: 6,
				desktop: 6,
			},
			settings: props?.formSettings?.field?.settings ?? defaultFormSettings.field.settings,
			loading: false,
		},
		{
			key: 'finance_email',
			value: accountStore.selected_account.finance_email,
			label: 'Finance Email',
			field: FormFieldField.INPUT,
			type: FormFieldType.TEXT,
			required: false,
			settings: props?.formSettings?.field?.settings ?? defaultFormSettings.field.settings,
			loading: false,
		},
		{
			key: 'submit',
			label: 'Update Account',
			field: FormFieldField.BUTTON,
			buttons: [
				{
					type: FormFieldButtonType.SUBMIT,
				},
			],
		},
	)

	loaded.value = true
}

async function submittedForm(form) {
	return await accountStore.update(form, $q)
}

onMounted(async () => {
	createForm()
})
</script>

<template>
	<div id="JLAccountsProfile">
		<AccountAvatar :click-to-edit="userStore.isAdmin()" size="80px" class="q-pb-lg" />
		<JLForm
			:options="{ type: 'edit', fields: form, name: 'account' }"
			v-if="loaded"
			@submitted-form="submittedForm"></JLForm>
	</div>
</template>

<style scoped></style>
