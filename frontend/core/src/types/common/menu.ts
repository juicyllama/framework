import { Button, Icon } from '../../types'

export interface Menu {
	items: MenuItems[]
	mini?: boolean //if true, only show top level icons
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
	title?: string
	link?: string // if you wish the menu item to redirect to a link
	function?: Function // if you wish the menu item to execute a function
	caption?: string
	icon?: string | Icon
	border_color?: string
	clickable_disabled?: boolean
	disable?: boolean
	key?: string
	tooltip?: {
		anchor?: "top left" | "top middle" | "top right" | "top start" | "top end" | "center left" | "center middle" | "center right" | "center start" | "center end" | "bottom left" | "bottom middle" | "bottom right" | "bottom start" | "bottom end"
		self?: "top left" | "top middle" | "top right" | "top start" | "top end" | "center left" | "center middle" | "center right" | "center start" | "center end" | "bottom left" | "bottom middle" | "bottom right" | "bottom start" | "bottom end"
		classes?: string
	}
}

// This uses Quasar's Button Dropdown component https://quasar.dev/vue-components/button-dropdown/
export interface DropdownButtonMenu {
	menu: Menu
	button?: Button
	autoClose?: boolean
}
