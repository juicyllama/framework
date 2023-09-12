import md5 from 'md5'

/**
 * Returns Gravatar based on Email
 * @param email String
 * @param size Int
 * @returns String
 */
export function gravatar(email: string, size: string) {
	const hash = gravatarHash(email)
	return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=https://${import.meta.env.VITE_APP_URL}/icon.png`
}

export function gravatarHash(email: string) {
	email = email.trim()
	email = email.toLowerCase()
	return md5(email)
}
