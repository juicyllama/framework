import { CustomButton, DropdownOptions, Icon, IconSettings } from './common'
import { QVueGlobals } from 'quasar'
import { NoticeProps } from '@juicyllama/vue-utils'
import { ConnectAppOptions, InstalledApp } from '@/types/appstore'

export interface FormApiOptionsCreate {
	url: string
	data: any
	q?: QVueGlobals
}

export interface FormApiOptionsFindOne {
	url: string
	q?: QVueGlobals
	record_id?: number
}

export interface FormApiOptionsFindAll {
	url: string
	q?: QVueGlobals
	find?: any
}

export interface FormApiOptionsStats {
	url: string
	method: string
	q?: QVueGlobals
	find?: any
}

export interface FormApiOptionsUpdate {
	url: string
	data: any
	q?: QVueGlobals
	record_id?: number
}

export interface FormApiOptionsDelete {
	url: string
	q?: QVueGlobals
	record_id: number
}

export interface FormOutput {
	formData: any
	schema: FormSchema
	q?: QVueGlobals
}

export interface FormButtonPressed extends FormOutput {
	button: FormCustomButton
}

export enum FormFieldField {
	INPUT = 'input',
	TEXTAREA = 'textarea',
	DROPDOWN = 'dropdown',
	BUTTON = 'button',
	TOGGLE = 'toggle',
	DATE = 'date',
	TAGS = 'tags',
	PLUGIN = 'plugin', //used for custom plugins -> see the plugin field in the form
	COUNTRY_DROPDOWN = 'country_dropdown',
	HIDDEN = 'hidden',
}

export enum FormFieldPlugin {
	TELEPHONE = 'TELEPHONE',
	INSTALL_APP = 'INSTALL_APP',
	NOTICE = 'NOTICE',
}

export interface FormFieldPluginTelephoneOptions {
	type: FormFieldPlugin.TELEPHONE
	defaultCountry?: string
	dropdownOptions?: {
		dense: boolean
		outlined: boolean
		disable: boolean
		'lazy-rules': boolean | 'ondemand'
		'no-error-icon': boolean
		'emit-value': boolean
	}
}

export interface FormFieldPluginTelephoneResult {
	value: any
}

export interface FormFieldPluginInstallAppOptions extends ConnectAppOptions {
	type: FormFieldPlugin.INSTALL_APP
	button?: CustomButton
}

export interface FormFieldPluginInstallAppResult extends FormFieldPluginResult {
	installed_app: InstalledApp
}

export interface FormFieldPluginResult {
	field: FormField
	plugin: FormFieldPlugin
	formData: any
}

export enum FormFieldType {
	TEXT = 'text',
	TEXTAREA = 'textarea',
	PASSWORD = 'password',
	NUMBER = 'number',
	EMAIL = 'email',
}

export enum FormFieldButtonType {
	SUBMIT = 'submit',
	ACTION = 'action',
}

export interface FormFieldButtonStyles {
	outline?: boolean
	rounded?: boolean
	round?: boolean
	flat?: boolean
	unelevated?: boolean
}

export interface FormCustomButton extends CustomButton {
	type?: FormFieldButtonType
}

export interface FormViewSettings {
	lazy_rules?: any
	counter?: boolean
	outlined?: boolean
	dense?: boolean
	hideBottomSpace?: boolean
	color?: string
	no_error_icon?: boolean
	stack_label?: boolean
	icon?: Icon
	filled?: boolean
}

export interface FormSettings {
	field: {
		settings: FormViewSettings
	}
}

export interface FormField {
	pipeValidator?: Function
	size?: {
		mobile?: number
		tablet?: number
		desktop?: number
	}
	icon?: string
	icon_additional?: string
	required?: boolean
	disabled?: boolean
	key?: string
	value?: any
	default?: any
	label?: string
	placeholder?: string
	hint?: string
	multiple?: boolean
	field: FormFieldField
	type?: FormFieldType
	plugin?: FormFieldPlugin
	pluginOptions?: FormFieldPluginTelephoneOptions | FormFieldPluginInstallAppOptions | NoticeProps
	add?: boolean
	edit?: boolean
	dropdown?: DropdownOptions[]
	loading?: boolean
	buttons?: FormCustomButton[]
	settings?: FormViewSettings
}

export interface FormSchema {
	fields: FormField[]
	type?: 'add' | 'edit'
	event?: string
	name?: string
	endpoint?: string
	icons?: IconSettings
	onFormLoad?: Function
}
