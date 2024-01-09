import { optionsSize } from './constants'
export const widgetClass = size => {
	if (size === optionsSize.SMALL) return 'col-6 col-md-3' // (3/12 on desktop / 6/12 mobile)
	if (size === optionsSize.MEDIUM) return 'col-12 col-md-6' // (6/12 on desktop / 12/12 mobile)
	if (size === optionsSize.LARGE) return 'col-12' //(12/12 on desktop / 12/12 mobile)
}
const keyPrefix = 'frontend::widgets'

export const getKey = (url: string, account_id?: number, user_id?: string) => {
	if (user_id) return `${keyPrefix}::${url}::${account_id}::user::${user_id}`
	return `${keyPrefix}::${url}::${account_id}`
}
