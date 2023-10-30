import { Website } from 'websites/websites.entity'
import { SandboxModule } from './sandbox.module'
import { Scaffold, ScaffoldDto } from '@juicyllama/core'

const MODULE = SandboxModule
type T = Website
const E = Website

describe(`Sandbox Fires Up`, () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE)
	})

	describe(`Does it boot?`, () => {
		it('Is the nest service running?', async () => {
			expect(scaffold.module).toBeDefined()
		})
	})

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
