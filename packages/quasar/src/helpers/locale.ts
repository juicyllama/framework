import { getCountry } from '@juicyllama/utils'

export function userCountry() {
	let country = window.localStorage.getItem('user_country') ? window.localStorage.getItem('user_country') : null

	if (country) {
		return country
	}

	country = getCountry().toLowerCase()
	window.localStorage.setItem('user_country', country)
	return country
}
