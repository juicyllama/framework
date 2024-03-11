import { Scaffold, ScaffoldDto } from '../../test'
import { UserRole } from '../users/users.enums'
import { AuthModule } from './auth.module'
import { AuthService } from './auth.service'
import { UserAccount } from './user-account.entity'

const E = UserAccount
type T = UserAccount
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

	describe('processGodUser', () => {
		it('Should assign the OWNER role to a god user for all accounts', async () => {
			// Arrange
			const userAccount = await scaffold.services.service.findOne()
			const godUser = userAccount.user
			userAccount.role = UserRole.VIEWER
			userAccount.user.email = 'god@juicyllama.com'
			await scaffold.services.usersService.update(userAccount.user)
			await scaffold.repository?.save(userAccount)
			expect(await scaffold.services.service.isGodUser(godUser)).toBe(true);
			// Act
			const result = await scaffold.services.service.processGodUser(godUser);
			// Assert
			expect(result).toBeDefined();
			const userAccounts = await scaffold.services.service.findAll()
			expect(userAccounts.length).toEqual(1)
			expect(userAccounts[0].role).toBe(UserRole.OWNER);
		});
	});

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
