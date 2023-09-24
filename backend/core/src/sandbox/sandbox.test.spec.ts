import { SandboxModule } from './sandbox.module.js'
import { Scaffold, ScaffoldDto } from '../test/index.js'
import { Account } from '../modules/accounts/account.entity.js'

const MODULE = SandboxModule
type T = Account
const E = Account

describe(`Sandbox Fires Up`, () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>
	let mock: Partial<T>

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
