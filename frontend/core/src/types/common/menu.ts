import { Button } from '@/types'

export interface Menu {
	items: MenuItems[]
	expand?: {
		default_closed?: boolean
		hide_expand_icon?: boolean
	}
	selected?: string
}

export interface MenuItems extends MenuItem {
	links?: MenuItem[]
}

export interface MenuItem {
	title: string
	link?: string // if you wish the menu item to redirect to a link
	function?: Function // if you wish the menu item to execute a function
	caption?: string
	icon?: string
	border_color?: string
	clickable_disabled?: boolean
	disable?: boolean
	key?: string
}

// This uses Quasar's Button Dropdown component https://quasar.dev/vue-components/button-dropdown/
export interface DropdownButtonMenu {
	menu: Menu
	button?: Button
	autoClose?: boolean
}