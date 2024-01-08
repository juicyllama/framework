import { Account } from '../../modules/accounts/account.entity.js'
import { Scaffold, ScaffoldDto } from '../../test'
import { AccountService } from '../../modules/accounts/account.service.js'
import { AccountModule } from '../../modules/accounts/account.module.js'

type T = Account
const E = Account
const MODULE = AccountModule
const SERVICE = AccountService

describe('TypeORM query findAll filtering RHS Colon syntax', () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)
		scaffold.values.mock = {
			account_name: 'TestFiltering',
			onboarding_step: 3,
		}
	})

	it('Create a record for testing', async () => {
		const result = await scaffold.query.create(scaffold.repository, scaffold.values.mock)
		expect(result).toBeDefined()
		expect(result.account_id).toBeDefined()
		scaffold.values.record = result
	})

	const testData = [
		{
			name: 'EQ',
			query: { account_name: 'EQ:TestFiltering' },
			expected: 1,
		},
		{
			name: 'EQ with no matches',
			query: { account_name: 'EQ:WrongName' },
			expected: 0,
		},
		{
			name: '!EQ',
			query: { account_name: '!EQ:TestFiltering' },
			expected: 1, // existing record
		},
		{
			name: '!EQ with no matches',
			query: { account_name: '!EQ:WrongName' },
			expected: 2, // existing record + new record
		},
		{
			name: 'GT',
			query: { account_name: 'EQ:TestFiltering', onboarding_step: 'GT:2' },
			expected: 1,
		},
		{
			name: 'GT with exact match',
			query: { account_name: 'EQ:TestFiltering', onboarding_step: 'GT:3' },
			expected: 0,
		},
		{
			name: 'GT with no matches',
			query: { account_name: 'EQ:TestFiltering', onboarding_step: 'GT:4' },
			expected: 0,
		},
		{
			name: 'GTE',
			query: { account_name: 'EQ:TestFiltering', onboarding_step: 'GTE:2' },
			expected: 1,
		},
		{
			name: 'GTE with exact match',
			query: { account_name: 'EQ:TestFiltering', onboarding_step: 'GTE:3' },
			expected: 1,
		},
		{
			name: 'GTE with no matches',
			query: { account_name: 'EQ:TestFiltering', onboarding_step: 'GTE:4' },
			expected: 0,
		},
		{
			name: 'LT',
			query: { account_name: 'EQ:TestFiltering', onboarding_step: 'LT:4' },
			expected: 1,
		},
		{
			name: 'LT with exact matches',
			query: { account_name: 'EQ:TestFiltering', onboarding_step: 'LT:3' },
			expected: 0,
		},
		{
			name: 'LT with no matches',
			query: { account_name: 'EQ:TestFiltering', onboarding_step: 'LT:2' },
			expected: 0,
		},
		{
			name: 'LTE',
			query: { account_name: 'EQ:TestFiltering', onboarding_step: 'LTE:4' },
			expected: 1,
		},
		{
			name: 'LTE with exact matches',
			query: { account_name: 'EQ:TestFiltering', onboarding_step: 'LTE:3' },
			expected: 1,
		},
		{
			name: 'LTE with no matches',
			query: { account_name: 'EQ:TestFiltering', onboarding_step: 'LTE:2' },
			expected: 0,
		},
		{
			name: 'Overloading operators: GT and LT',
			query: {
				account_name: 'EQ:TestFiltering',
				onboarding_step: ['GT:2', 'LT:4'],
			},
			expected: 1,
		},
		{
			name: 'Overloading operators: GT and LT with no matches',
			query: {
				account_name: 'EQ:TestFiltering',
				onboarding_step: ['GT:2', 'LT:3'],
			},
			expected: 0,
		},
		{
			name: 'Overloading operators: GT and LT with no matches #2',
			query: {
				account_name: 'EQ:TestFiltering',
				onboarding_step: ['GT:3', 'LT:4'],
			},
			expected: 0,
		},
		{
			name: 'Overloading operators: GT, GTE and LT',
			query: {
				account_name: 'EQ:TestFiltering',
				onboarding_step: ['GT:2', 'GTE:3', 'LT:5'],
			},
			expected: 1,
		},
		{
			name: 'Overloading operators: GT, GTE and LT with no matches',
			query: {
				account_name: 'EQ:TestFiltering',
				onboarding_step: ['GT:1', 'GTE:2', 'LT:3'],
			},
			expected: 0,
		},
		{
			name: 'Overloading operators: GT, GTE and LT with no matches #2',
			query: {
				account_name: 'EQ:TestFiltering',
				onboarding_step: ['GT:1', 'GTE:4', 'LT:4'],
			},
			expected: 0,
		},
		{
			name: 'NULL',
			query: { avatar_image_url: 'NULL' },
			expected: 2, // existing record and newly created one
		},
		{
			name: 'NULL with no matches',
			query: { account_name: 'NULL' },
			expected: 0,
		},
		{
			name: '!NULL',
			query: { account_name: '!NULL' },
			expected: 2, // existing record and newly created one
		},
		{
			name: '!NULL with no matches',
			query: { avatar_image_url: '!NULL' },
			expected: 0,
		},
		{
			name: 'EQ backward-compatibility',
			query: { account_name: 'TestFiltering' }, // no RHS syntax
			expected: 1,
		},
		{
			name: 'EQ backward-compatibility, no matches',
			query: { account_name: 'wrongName' }, // no RHS syntax
			expected: 0,
		},
	]

	testData.forEach(({ name, query, expected }) => {
		it(name, async () => {
			const where = scaffold.query.buildWhere({
				repository: scaffold.repository,
				// account_id: scaffold.values.account.account_id,
				query,
			})

			const result = await scaffold.query.findAll(scaffold.repository, { where: where })
			expect(result).toBeDefined()
			expect(result.length).toEqual(expected)
		})
	})

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
