import { CustomButton, FindOptions, IconSettings, TablePosition } from './common'
import { FormField } from './form'

export interface TableOptions {
	limit: number
	offset: number
}

export enum TableExtraType {
	BADGE,
	HTML,
}

export interface TableColumn {
	field: string
	label?: string
	primary_key?: boolean
	required?: boolean
	align?: 'left' | 'right' | 'center'
	sortable?: boolean
	format?: Function
	reformat?: Function //used to reformat on edit before sending to server
	show?: boolean //if to show on the table
	form?: FormField
	extra?: {
		type: TableExtraType
		colors?: object
	}
	//Used by Quasar Table
	name?: string
}

export interface TableCustomButton extends CustomButton {
	position?: TablePosition
}

export interface SearchFilterOptions {
	position: TablePosition
	placeholder?: string
	dark?: boolean
}

export interface TableSchema {
	title?: string //populated the top right of the table with the title
	name: string
	event?: string
	endpoint?: string
	icon?: IconSettings
	show?: {
		table_actions?: boolean
		table_header?: boolean
		table_footer?: boolean
		clickable?: boolean
		column_filter?: boolean
		search_filter?: SearchFilterOptions
		add_record?: boolean
		update_inline?: boolean
		update_record?: boolean
		delete_record?: boolean
		custom_buttons?: TableCustomButton[]
		confirm_delete?: boolean
		expandable?: boolean
		toggle_buttons?: {
			position: TablePosition
			options: { label: string; value: string; default: boolean }[]
		}[]
	}
	redirects?: {
		add?: string
		click?: string // you can include row params in the url for example "/edit/:${record_id}/${name.toUpperCase()}/${description}"
		edit?: string // you can include row params in the url for example "/edit/:${record_id}/${name.toUpperCase()}/${description}"
		delete?: string // you can include row params in the url for example "/edit/:${record_id}/${name.toUpperCase()}/${description}"
	}
	find?: FindOptions
	functions?: {
		create?: Function
		findOne?: Function
		findAll?: Function
		stats?: Function
		update?: Function
		delete?: Function
	}
	schema: TableColumn[]
	form?: {
		onAddFormLoad?: Function
		onEditFormLoad?: Function
	}
	style?: string
}

export interface IFilterType {
	label: string,
	method: string
}

export interface IFilter {
	label: string,
	type: string | IFilterType,
	value: string | number
}
