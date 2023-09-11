/**
 * @jest-environment jsdom
 */

import { Modules } from './Modules'

describe('IsInstalled?', () => {
	it('Can we check if a module is installed', async () => {
		const dev = Modules.isInstalled('@juicyllama/dev')
		expect(dev).toBeTruthy()
	})

	it('Can we check if a module is not installed', async () => {
		const dev = Modules.isInstalled('@juicyllama/NOTdev')
		expect(dev).toBeFalsy()
	})
})
