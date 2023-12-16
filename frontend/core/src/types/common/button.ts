export interface Button extends ButtonStyle {
	label?: string
}

export interface ButtonStyle {
	classes?: string
	color?: string
	text_color?: string
	size?: string
	outline?: boolean
	rounded?: boolean
	flat?: boolean
	unelevated?: boolean
	push?: boolean
	square?: boolean
	glossy?: boolean
	fab?: boolean
	fab_mini?: boolean
	padding?: string
	dense?: boolean
	round?: boolean
}