import { Account } from '../../modules/accounts/account.entity'
import { Scaffold, ScaffoldDto } from '../../test'
import { faker } from '@faker-js/faker'
import { AccountService } from '../../modules/accounts/account.service'
import { AccountModule } from '../../modules/accounts/account.module'

type T = Account
const E = Account
const MODULE = AccountModule
const SERVICE = AccountService

describe('TypeORM query', () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)

		scaffold.values.mock = {
			account_name: faker.word.sample(),
		}
	})

	describe('Raw', () => {
		it('Perform a raw query', async () => {
			const SQL = `SELECT * FROM accounts`
			const result = await scaffold.query.raw(scaffold.repository, SQL)
			expect(result).toBeDefined()
			expect(result[0]).toBeDefined()
			expect(result[0].account_id).toBeDefined()
		})
	})

	describe('Create', () => {
		it('Perform a create query', async () => {
			const result = await scaffold.query.create(scaffold.repository, scaffold.values.mock)
			expect(result).toBeDefined()
			expect(result.account_id).toBeDefined()
			scaffold.values.record = result
		})
	})

	describe('FindOneById', () => {
		it('Perform a findOneById query', async () => {
			const result = await scaffold.query.findOneById(scaffold.repository, scaffold.values.account.account_id)
			expect(result).toBeDefined()
			expect(result.account_id).toBeDefined()
			expect(result.account_id).toEqual(scaffold.values.account.account_id)
		})

		it('Perform a findOneById scaffold.query with relations', async () => {
			const result = await scaffold.query.findOneById(scaffold.repository, scaffold.values.account.account_id, [
				'roles',
			])
			expect(result).toBeDefined()
			expect(result.account_id).toBeDefined()
			expect(result.account_id).toEqual(scaffold.values.account.account_id)
			expect(result.roles).toBeDefined()
			expect(result.roles[0]).toBeDefined()
		})
	})

	describe('FindOneByWhere', () => {
		it('Perform a findOneByWhere query', async () => {
			const result = await scaffold.query.findOneByWhere(scaffold.repository, {
				account_id: scaffold.values.account.account_id,
			})
			expect(result).toBeDefined()
			expect(result.account_id).toBeDefined()
			expect(result.account_id).toEqual(scaffold.values.account.account_id)
		})

		it('Perform a findOneByWhere scaffold.query with relations', async () => {
			const result = await scaffold.query.findOneByWhere(
				scaffold.repository,
				{ account_id: scaffold.values.account.account_id },
				{ relations: ['roles'] },
			)
			expect(result).toBeDefined()
			expect(result.account_id).toBeDefined()
			expect(result.account_id).toEqual(scaffold.values.account.account_id)
			expect(result.roles).toBeDefined()
			expect(result.roles[0]).toBeDefined()
		})
	})

	describe('FindOne', () => {
		it('Perform a findOne query', async () => {
			const result = await scaffold.query.findOne(scaffold.repository)
			expect(result).toBeDefined()
			expect(result.account_id).toBeDefined()
		})

		it('Perform a findOne scaffold.query with options', async () => {
			const result = await scaffold.query.findOne(scaffold.repository, {
				where: { account_id: scaffold.values.account.account_id },
			})
			expect(result).toBeDefined()
			expect(result.account_id).toBeDefined()
			expect(result.account_id).toEqual(scaffold.values.account.account_id)
		})

		it('Perform a findOne scaffold.query with options & relations', async () => {
			const result = await scaffold.query.findOne(scaffold.repository, {
				where: { account_id: scaffold.values.account.account_id },
				relations: ['roles'],
			})
			expect(result).toBeDefined()
			expect(result.account_id).toBeDefined()
			expect(result.account_id).toEqual(scaffold.values.account.account_id)
			expect(result.roles).toBeDefined()
			expect(result.roles[0]).toBeDefined()
		})
	})

	describe('FindAll', () => {
		it('Perform a findAll query', async () => {
			const result = await scaffold.query.findAll(scaffold.repository)
			expect(result).toBeDefined()
			expect(result[0]).toBeDefined()
			expect(result[0].account_id).toBeDefined()
		})

		it('Perform a findAll scaffold.query with options', async () => {
			const result = await scaffold.query.findAll(scaffold.repository, {
				where: { account_id: scaffold.values.account.account_id },
			})
			expect(result).toBeDefined()
			expect(result[0]).toBeDefined()
			expect(result[0].account_id).toBeDefined()
			expect(result[0].account_id).toEqual(scaffold.values.account.account_id)
		})

		it('Perform a findAll scaffold.query with relations', async () => {
			const result = await scaffold.query.findAll(scaffold.repository, { relations: ['roles'] })
			expect(result).toBeDefined()
			expect(result[0]).toBeDefined()
			expect(result[0].account_id).toBeDefined()
		})

		it('Perform a findAll scaffold.query with options & relations', async () => {
			const result = await scaffold.query.findAll(scaffold.repository, {
				where: { account_id: scaffold.values.account.account_id },
				relations: ['roles'],
			})
			expect(result).toBeDefined()
			expect(result[0]).toBeDefined()
			expect(result[0].account_id).toBeDefined()
			expect(result[0].roles).toBeDefined()
			expect(result[0].roles[0]).toBeDefined()
		})

		it('Filter out invalid select items', async () => {
			const result = await scaffold.query.findAll(scaffold.repository, {
				select: ['account_id', 'account_name', 'invalid_select_item'],
				where: { account_id: scaffold.values.account.account_id },
			})
			expect(result).toBeDefined()
			expect(result[0]).toBeDefined()
			expect(result[0].account_id).toBeDefined()
			expect(result[0].account_name).toBeDefined()
		})
	})

	describe('FindAll BuildWhere', () => {
		it('Perform a find with buildWhere account_id', async () => {
			const where = scaffold.query.buildWhere({
				repository: scaffold.repository,
				account_id: scaffold.values.account.account_id,
			})

			const result = await scaffold.query.findAll(scaffold.repository, { where: where })
			expect(result).toBeDefined()
			expect(result[0]).toBeDefined()
			expect(result[0].account_id).toBeDefined()
		})

		it('Perform a find with buildWhere account_id and query', async () => {
			const where = scaffold.query.buildWhere({
				repository: scaffold.repository,
				account_id: scaffold.values.account.account_id,
				query: {
					account_name: scaffold.values.account.account_name,
				},
			})

			const result = await scaffold.query.findAll(scaffold.repository, { where: where })
			expect(result).toBeDefined()
			expect(result[0]).toBeDefined()
			expect(result[0].account_id).toBeDefined()
			expect(result[0].account_name).toEqual(scaffold.values.account.account_name)
		})

		it('Perform a find with buildWhere account_id and search', async () => {
			const where = scaffold.query.buildWhere({
				repository: scaffold.repository,
				account_id: scaffold.values.account.account_id,
				query: {
					search: scaffold.values.account.account_name,
				},
				search_fields: ['account_name'],
			})

			const result = await scaffold.query.findAll(scaffold.repository, { where: where })
			expect(result).toBeDefined()
			expect(result[0]).toBeDefined()
			expect(result[0].account_id).toBeDefined()
			expect(result[0].account_name).toEqual(scaffold.values.account.account_name)
		})

		it('Perform a find with buildWhere account_id and two search fields', async () => {
			const where = scaffold.query.buildWhere({
				repository: scaffold.repository,
				account_id: scaffold.values.account.account_id,
				query: {
					search: scaffold.values.account.account_name,
				},
				search_fields: ['company_name', 'account_name'],
			})

			const result = await scaffold.query.findAll(scaffold.repository, { where: where })
			expect(result).toBeDefined()
			expect(result[0]).toBeDefined()
			expect(result[0].account_id).toBeDefined()
			expect(result[0].account_name).toEqual(scaffold.values.account.account_name)
		})


		it('Perform a find with buildWhere account_id and two search fields using partial query', async () => {
			const where = scaffold.query.buildWhere({
				repository: scaffold.repository,
				account_id: scaffold.values.account.account_id,
				query: {
					search: scaffold.values.account.account_name.substring(1, 4),
				},
				search_fields: ['company_name', 'account_name'],
			})

			const result = await scaffold.query.findAll(scaffold.repository, { where: where })
			expect(result).toBeDefined()
			expect(result[0]).toBeDefined()
			expect(result[0].account_id).toBeDefined()
			expect(result[0].account_name).toEqual(scaffold.values.account.account_name)
		})

		it('Perform a find with buildWhere account_id and scaffold.query value is false', async () => {
			await scaffold.query.update(scaffold.repository, {
				account_id: scaffold.values.account.account_id,
				onboarding_complete: false,
			})

			const where = scaffold.query.buildWhere({
				repository: scaffold.repository,
				account_id: scaffold.values.account.account_id,
				query: {
					onboarding_complete: false,
				},
			})

			const result = await scaffold.query.findAll(scaffold.repository, { where: where })
			expect(result).toBeDefined()
			expect(result[0]).toBeDefined()
			expect(result[0].account_id).toBeDefined()
			expect(result[0].account_name).toEqual(scaffold.values.account.account_name)
			expect(result[0].onboarding_complete).toEqual(false)
		})
	})

	describe('Update', () => {
		it('Perform a create query', async () => {
			const mockAccountUpdate = {
				account_id: scaffold.values.account.account_id,
				account_name: faker.word.sample(),
			}

			const result = await scaffold.query.update(scaffold.repository, mockAccountUpdate)
			expect(result).toBeDefined()
			expect(result.account_id).toEqual(mockAccountUpdate.account_id),
				expect(result.account_name).toEqual(mockAccountUpdate.account_name)
		})
	})

	describe('Stats', () => {
		it('Perform a count query', async () => {
			const result = await scaffold.query.count(scaffold.repository)
			expect(result).toBeDefined()
			expect(result).toBeGreaterThan(0)
		})

		it('Perform a count scaffold.query with options', async () => {
			const result = await scaffold.query.count(scaffold.repository, {
				where: { account_id: scaffold.values.account.account_id },
			})
			expect(result).toBeDefined()
			//expect(result).toEqual(1)
		})

		it('Perform a sum query', async () => {
			const result = await scaffold.query.sum(scaffold.repository, 'account_id', {
				where: { account_id: scaffold.values.account.account_id },
			})
			expect(result).toBeDefined()
			expect(result).toEqual(1)
		})

		it('Perform a avg query', async () => {
			const result = await scaffold.query.sum(scaffold.repository, 'account_id', {
				where: { account_id: scaffold.values.account.account_id },
			})
			expect(result).toBeDefined()
			expect(result).toEqual(1)
		})
	})

	describe('Lookups', () => {
		it('Perform a getPrimaryKey query', async () => {
			const result = scaffold.query.getPrimaryKey(scaffold.repository)
			expect(result).toEqual('account_id')
		})

		it('Perform a getTableName query', async () => {
			const result = scaffold.query.getTableName(scaffold.repository)
			expect(result).toEqual('accounts')
		})

		it('Perform a getRelations query', async () => {
			const result = scaffold.query.getRelations(scaffold.repository)
			expect(result).toBeDefined()
			expect(result['roles']).toEqual(true)
		})

		it('Perform a getEventName query', async () => {
			const result = scaffold.query.getEventName(scaffold.repository, <Account>scaffold.values.account)
			expect(result).toEqual('account_1_accounts')
		})
	})

	describe('Remove', () => {
		it('Perform a remove query', async () => {
			const result = await scaffold.query.remove(scaffold.repository, scaffold.values.record)
			expect(result).toBeDefined()
			expect(result.account_id).toEqual(scaffold.values.record.account_id)
		})
	})

	describe('Purge', () => {
		it('Perform a purge query', async () => {
			try {
				await scaffold.query.remove(scaffold.repository, scaffold.values.record)
			} catch (e) {
				console.error(e)
				expect(e).toEqual('error')
			}
		})
	})

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
