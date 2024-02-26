import {
	App,
	FormFieldButtonType,
	FormFieldField,
	FormFieldType,
	FormField,
	AppInputType,
	ConnectAppOptions,
} from '../../types'
import _ from 'lodash'

export function buildAppForm(app: App, connectAppOptions: ConnectAppOptions): FormField[] {
	const fields = []

	fields.push({
		key: 'name',
		value:
			connectAppOptions.connection && connectAppOptions.connection.name ? connectAppOptions.connection.name : '',
		label: 'Connection Name',
		hint: 'A friendly name for your app connection.',
		field:
			connectAppOptions.connection && connectAppOptions.connection.hide
				? FormFieldField.HIDDEN
				: FormFieldField.INPUT,
		type: FormFieldType.TEXT,
		required: true,
		loading: false,
	})

	for (const setting of app.settings) {
		const override = connectAppOptions.overrides?.find(override => override.key === setting.key)

		const required =
			setting.input?.required ||
			setting.upload?.required ||
			setting.dropdown?.required ||
			setting.checkbox?.required

		let field = setting.input?.type === AppInputType.text ? FormFieldField.INPUT : null

		if (override?.hide === true || (_.isNil(override?.hide) && setting.hidden)) {
			field = FormFieldField.HIDDEN
		}

		let type = setting.input?.type === AppInputType.text ? FormFieldType.TEXT : null

		if (setting.private) {
			type = FormFieldType.PASSWORD
		}

		let value = ''

		if (override?.value) {
			value = override.value
		}

		fields.push({
			key: setting.key,
			value: value,
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
