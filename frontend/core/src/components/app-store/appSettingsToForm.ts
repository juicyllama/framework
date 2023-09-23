import { FormField, AppInputType, App, FormFieldButtonType, FormFieldField, FormFieldType } from '@/types/index.js'

export function buildAppForm(
	app: App,
	connection?: {
		name?: string
		hide?: boolean
	},
): FormField[] {
	const fields = []

	fields.push({
		key: 'name',
		value: connection && connection.name ? connection.name : '',
		label: 'Connection Name',
		hint: 'A friendly name for your app connection.',
		field: connection && connection.hide ? FormFieldField.HIDDEN : FormFieldField.INPUT,
		type: FormFieldType.TEXT,
		required: true,
		loading: false,
	})

	for (const setting of app.settings) {
		const required =
			setting.input?.required ||
			setting.upload?.required ||
			setting.dropdown?.required ||
			setting.checkbox?.required

		const field = setting.input?.type === AppInputType.text ? FormFieldField.INPUT : null
		const type = setting.input?.type === AppInputType.text ? FormFieldType.TEXT : null

		fields.push({
			key: setting.key,
			value: '',
			label: setting.name,
			hint: setting.description,
			field: field,
			type: type,
			required: required,
			loading: false,
		})
	}

	fields.push({
		key: 'submit',
		label: 'Connect',
		field: FormFieldField.BUTTON,
		buttons: [
			{
				type: FormFieldButtonType.SUBMIT,
			},
		],
		color: 'primary',
		loading: false,
	})

	return fields
}
