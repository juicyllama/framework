import { Scaffold, ScaffoldDto } from '../../test'
import { UserRole } from '../users/users.enums'
import { AuthModule } from './auth.module'
import { AuthService } from './auth.service'
import { Role } from './role.entity'

const E = Role
type T = Role
const MODULE = AuthModule
const SERVICE = AuthService

describe('Auth Service', () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)
	})

	describe('assignRole', () => {
		it('Change the role of a user', async () => {
			const result = await scaffold.services.service.assignRole(
				scaffold.values.owner,
				scaffold.values.account,
				UserRole.MEMBER,
			)
			expect(result).toBeDefined()
			expect(result.email).toBeDefined()
			const role = await scaffold.services.service.getRole(
				scaffold.values.owner.user_id,
				scaffold.values.account.account_id,
			)
			expect(role.role).toBe(UserRole.MEMBER)
		})
	})

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
