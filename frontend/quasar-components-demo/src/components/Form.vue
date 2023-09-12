<template>
    <JLForm
			:options="{ type: 'edit', fields: form, name: 'account' }"
			v-if="loaded"
			@submitted-form="submittedForm"></JLForm>
</template>

<script setup lang="ts">
/*
    USE BRANCH: dev/jlform-add-multyselect
**/
import { onMounted, reactive, ref } from 'vue'
import { JLForm, FormFieldField, FormFieldType, FormFieldButtonType } from '../../../quasar' // @juicyllama/quasar
// import type { FormField, FormFieldButtonType, FormFieldField, FormFieldType, FormSettings } from '../../../quasar'
import { useQuasar } from 'quasar'
// import { AccountStore } from '../../../store/account'
// import { UserStore } from '../../../store/auth'
// import countries from '../../../assets/json/countries.json'
// import { FormField, FormFieldButtonType, FormFieldField, FormFieldType, FormSettings } from '../../../types/form'
// import { defaultFormSettings } from '@/components/common/form/defaults'

// const accountStore = AccountStore()
// const userStore = UserStore()
const $q = useQuasar()

const props = defineProps<{
	formSettings?: FormSettings
}>()

const form: FormField[] = reactive([])

const loaded = ref<boolean>(false)

const countries = [
        'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
      ].map(i => ({
        label: i,
        value: i,
        key: i
      }))

function createForm() {
	form.push(
		{
			key: 'account_name',
			value: 'Mikhail',
			label: 'Account Name',
			field: FormFieldField.INPUT,
			type: FormFieldType.TEXT,
			required: true,
			settings: {},
			loading: false,
		},
		{
			key: 'country_multiple',
			value: ['Google'],
			dropdown: countries,
			// dropdown: [{
			// 		value: 'CONTENT',
			// 		label: 'Blog Automation',
			// 	},{
			// 		value: 'SMS',
			// 		label: 'SMS Marketing',
			// 	}],
			label: 'country_multiple',
            multiple: true,
			field: FormFieldField.DROPDOWN,
			required: false,
			size: {
				tablet: 6,
				desktop: 6,
			},
			settings: {},
			loading: false,
		},
        {
			key: 'country single',
			value: '',
			dropdown: countries,
			label: 'Country single',
			field: FormFieldField.DROPDOWN,
			required: false,
			size: {
				tablet: 6,
				desktop: 6,
			},
			settings: {},
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
    console.log(form)
	//return await accountStore.update(form, $q)
}

onMounted(async () => {
	createForm()
})
</script>
