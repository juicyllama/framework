import { faker } from '@faker-js/faker'
import { AccountService } from './account.service'
import { MockAccountRequest } from '../../test'
import { Account } from './account.entity'
import { AccountModule } from './account.module'
import { Query } from '../../utils/typeorm/Query'
import { UsersService } from '../users/users.service'
import { UserRole } from '../users/users.enums'
import { UserDto } from '../users/users.dto'
import { AccountDto, SuccessAccountDto } from './account.dto'
import { Scaffold, ScaffoldDto } from '../../test'

const E = Account
type T = Account
const MODULE = AccountModule
const SERVICE = AccountService
let PRIMARY_KEY

describe('Account Service', () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	//variables for testing
	let record: AccountDto
	let owner: UserDto

	//extra services for testing
	let query: Query<T>
	let usersService: UsersService

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)

		query = scaffold.module.get<Query<T>>(Query)
		usersService = scaffold.module.get<UsersService>(UsersService)
		PRIMARY_KEY = query.getPrimaryKey(scaffold.services.service.repository)
	})

	describe('Onboard', () => {
		it('Onboard a new account and owner', async () => {
			const result = await scaffold.services.service.onboard(MockAccountRequest())
			expect(result).toBeDefined()
			expect(result.account).toBeDefined()
			expect(result.account[PRIMARY_KEY]).toBeDefined()
			expect(result.owner).toBeDefined()
			expect(result.owner.email).toBeDefined()
			record = result.account
			owner = result.owner
		})
	})

	describe('GetOwner', () => {
		it('Return the owner of the account', async () => {
			const result = await scaffold.services.service.getOwner(record)
			expect(result).toBeDefined()
			expect(result.email).toBeDefined()
		})
	})

	describe('Transfer', () => {
		it('Should transfer account to another', async () => {
			const mock = {
				email: faker.internet.email(),
				password: faker.internet.password(),
			}

			let newOwner = await usersService.create(mock)
			newOwner = await scaffold.services.authService.assignRole(newOwner, <Account>record, UserRole.ADMIN)
			await scaffold.services.service.transfer(record, owner, newOwner)

			const result = await scaffold.services.service.getOwner(record)
			expect(result.email).toBe(mock.email)
		})
	})

	describe('Onboard Additional Account', () => {
		let new_account: SuccessAccountDto

		it('We have 2 accounts to start', async () => {
			const init_count = await scaffold.services.service.count()
			expect(init_count).toBe(2)
		})

		it('Create an additional account', async () => {
			new_account = await scaffold.services.service.onboardAdditional(owner, {
				account_name: faker.word.sample(),
			})
			expect(new_account).toBeDefined()
			expect(new_account.account).toBeDefined()
			expect(new_account.account[PRIMARY_KEY]).toBeDefined()
			expect(new_account.owner).toBeDefined()
			expect(new_account.owner.email).toEqual(owner.email)
		})

		it('We now have 3 accounts', async () => {
			const init_count = await scaffold.services.service.count()
			expect(init_count).toBe(3)
		})

		it('Should delete additional account', async () => {
			try {
				await scaffold.services.service.remove(<Account>new_account.account)
			} catch (e) {
				expect(e).toBeUndefined()
			}
		})
	})

	describe('Delete', () => {
		it('Should delete existing record', async () => {
			try {
				await scaffold.services.service.remove(<Account>record)
			} catch (e) {
				expect(e).toBeUndefined()
			}
		})
	})

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
