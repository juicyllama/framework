import {extraLinks, homeLink} from "../../config";

export const qrcodesTitle = 'JuicyLlama QR Code Tool'
const root = '/tools/qrcodes'

export const qrcodesNavbar = [
	homeLink,
		{
			text: 'Getting Started',
			link: root,
		},
		{
			text: 'Usage',
			link: root+'/usage',
		},
	...extraLinks,
	]
