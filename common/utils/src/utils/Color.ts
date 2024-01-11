/*
 * This function is used to determine if a color is light or dark.
 */

export class Color {
	static lightOrDark(color: string): 'light' | 'dark' {
		let r: number, g: number, b: number

		// Check the format of the color, HEX or RGB?
		if (color.match(/^rgb/)) {
			// If HEX --> store the red, green, blue values in separate variables
			const match = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/)
			if (match) {
				r = Number(match[1])
				g = Number(match[2])
				b = Number(match[3])
			} else {
				throw new Error('Invalid color')
			}
		} else {
			// If RGB --> Convert it to HEX: http://gist.github.com/983661
			// @ts-ignore
			const hex = +('0x' + color.slice(1).replace(color.length < 5 && /./g, '$&$&'))

			r = hex >> 16
			g = (hex >> 8) & 255
			b = hex & 255
		}

		// HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
		const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b))

		// Using the HSP value, determine whether the color is light or dark
		if (hsp > 127.5) {
			return 'light'
		} else {
			return 'dark'
		}
	}
}
