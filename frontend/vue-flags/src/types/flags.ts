export enum FlagType {
	ROUND = 'round',
	SQUARE = 'square',
	RECTANGULAR = 'rectangular',
	HEXAGONAL = 'hexagonal',
	ROUNDED_SQUARE = 'rounded_square',
	ROUNDED_RECTANGLE = 'rounded_rectangle'
}

export interface FlagProps {
	country_code: string
	type?: FlagType
	classes?: string[]
	size?: {
		width: string
		height: string
	}
}
