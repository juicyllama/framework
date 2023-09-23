/**
 * @jest-environment node
 */

import { Images } from './Images.js'

describe('Images', () => {
	it('Download Image', async () => {
		const result = await Images.downloadImage(
			'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
		)
		//const result = await Images.downloadImage('https://cdn.juicyllama.com/wp-content/uploads/2021/02/logo-35x35-primary.png')
		expect(result).toBeDefined()
	})
})
