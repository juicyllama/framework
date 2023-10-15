import { optionsSize } from './constants'
export const widgetClass = size => {
	if (size === optionsSize.SMALL) return 'col-6 col-md-3' // (3/12 on desktop / 6/12 mobile)
	if (size === optionsSize.MEDIUM) return 'col-12 col-md-6' // (6/12 on desktop / 12/12 mobile)
	if (size === optionsSize.LARGE) return 'col-12' //(12/12 on desktop / 12/12 mobile)
}
