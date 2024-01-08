import { UsersService } from './users.service.js'
import { User } from './users.entity.js'
import { Scaffold, ScaffoldDto } from '../../test'
import { UsersModule } from './users.module.js'

const E = User
type T = User
const MODULE = UsersModule
const SERVICE = UsersService

describe('Users Service', () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)
	})

	describe('Read', () => {
		it('findOneByEmail', async () => {
			const result = await scaffold.services.service.findOneByEmail(scaffold.values.owner.email)
			expect(result).toBeDefined()
			expect(result.email).toEqual(scaffold.values.owner.email)
		})
	})

	describe('Validation', () => {
		it('validateUser', async () => {
			const result = await scaffold.services.service.validateUser(
				scaffold.values.owner.email,
				scaffold.values.owner_password,
			)
			expect(result).toBeDefined()
			expect(result.email).toEqual(scaffold.values.owner.email)
		})

		it('validateEmail', async () => {
			const result = await scaffold.services.service.validateEmail(scaffold.values.owner.email)
			expect(result).toBeDefined()
			expect(result.email).toEqual(scaffold.values.owner.email)
		})

		it('getValidatedUserByEmail', async () => {
			const result = await scaffold.services.service.getValidatedUserByEmail(scaffold.values.owner.email)
			expect(result).toBeDefined()
			expect(result.email).toEqual(scaffold.values.owner.email)
		})
	})

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
