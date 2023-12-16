<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { UserStore } from '../../../store/user'
import { default as JLForm } from '../../common/form/Form.vue'
import { useQuasar } from 'quasar'
import { FormField, FormFieldButtonType, FormFieldField, FormFieldType, FormViewSettings } from '../../../types/form'
import { defaultFormSettings } from '../../../components/common/form/defaults'

const userStore = UserStore()
const $q = useQuasar()

const props = defineProps<{
	formSettings?: FormViewSettings
}>()

const form: FormField[] = reactive([])

const loaded = ref<boolean>(false)

function createForm() {
	form.push(
		{
			key: 'first_name',
			value: userStore.user.first_name,
			label: 'First Name',
			field: FormFieldField.INPUT,
			type: FormFieldType.TEXT,
			required: true,
			settings: props?.formSettings?? defaultFormSettings,
			loading: false,
			size: {
				tablet: 6,
				desktop: 6,
			},
		},
		{
			key: 'last_name',
			value: userStore.user.last_name,
			label: 'Last Name',
			field: FormFieldField.INPUT,
			type: FormFieldType.TEXT,
			required: true,
			settings: props?.formSettings?? defaultFormSettings,
			loading: false,
			size: {
				tablet: 6,
				desktop: 6,
			},
		},
		{
			key: 'email',
			value: userStore.user.email,
			label: 'Email Address',
			field: FormFieldField.INPUT,
			type: FormFieldType.EMAIL,
			required: true,
			settings: props?.formSettings?? defaultFormSettings,
			loading: false,
		},
		{
			key: 'submit',
			label: 'Update Profile',
			field: FormFieldField.BUTTON,
			settings: props?.formSettings?? defaultFormSettings,
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
	return await userStore.updateOwnProfile(form, $q)
}

onMounted(async () => {
	createForm()
})
</script>

<template>
	<div id="JLUserProfile">
		<JLForm
			:options="{ type: 'edit', fields: form, name: 'user' }"
			v-if="loaded"
			@submitted-form="submittedForm"></JLForm>
	</div>
</template>

<style scoped></style>
