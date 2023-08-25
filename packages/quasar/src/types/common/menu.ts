export interface Menu {
	items: MenuItems[]
	expand?: {
		default_closed?: boolean
		hide_expand_icon?: boolean
	}
}

export interface MenuItems extends MenuItem {
	links?: MenuItem[]
}

export interface MenuItem {
	title: string
	link?: string
	caption?: string
	icon?: string
	border_color?: string
	clickable_disabled?: boolean
	disable?: boolean
}
