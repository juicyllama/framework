import { ButtonStyle } from './common/button'

export * from './common/index'

export interface DropdownOptions {
	value: string | number
	label: string
}

export interface Link {
	title: string
	caption: string
	icon: string
	link: string
}

export enum LogType {
	POSITIVE = 'positive',
	NEGATIVE = 'negative',
	WARNING = 'warning',
	INFO = 'info',
}

export enum LogSeverity {
	LOG = 'log',
	ERROR = 'error',
	WARN = 'warn',
	VERBOSE = 'verbose',
}

export interface FindOptions {
	limit?: string
	offset?: string
	order_by?: string
	order_by_type?: 'ASC' | 'DESC'
	relations?: string
	select?: string
	search?: string
	[key: string]: boolean | number | string // for abstracted filters
}

export interface StatsResponse {
	count?: number
	avg?: number
	sum?: number
}

export interface AvatarOptions {
	size?: string
	background_color?: string
	text_color?: string
}

export interface IconSettings {
	type?: string
	icons?: {
		[key: string]: string;
	}
}

export interface Icon {
	name?: string
	type?: string
	size?: string
	color?: string
	classes?: string
	hide?: boolean
	after?: boolean // if true, the button will be added after the label
}

export enum TablePosition {
	TOP_RIGHT,
	TOP_LEFT,
	AFTER_TABLE,
}

export interface CustomButton extends ButtonStyle {
	key?: string
	label?: string
	icon?: Icon
	action?: Function // a function to call when the button is clicked, output { data: formData, q: $q, schema: TableSchema | FormSchema, button: CustomButton }
}
