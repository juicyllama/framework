import {extraLinks, homeLink} from "../../config";

export const ecommerceTitle = 'JuicyLlama Ecommerce Module'
const root = '/backend/ecommerce'

export const ecommerceNavbar = [
	homeLink,
		{
			text: 'Getting Started',
			link: root,
		},
	...extraLinks,
	]
