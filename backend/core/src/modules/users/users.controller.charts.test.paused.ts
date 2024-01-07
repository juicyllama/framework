import { UsersModule } from './users.module.js'
import { MockUserRequest, Scaffold, ScaffoldDto, TestEndpoint } from '../../test'
import { User } from './users.entity.js'
import { METHOD } from '../../types'
import { ChartsPeriod, ChartsResponseDto } from '@juicyllama/utils'
import { UsersService } from './users.service.js'

const E = User
type T = User
const MODULE = UsersModule
const SERVICE = UsersService
const url = '/users'
const NAME = 'User'
let userService: UsersService

describe(`${NAME} Charts Endpoint`, () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)
		userService = <UsersService>scaffold.module.get(SERVICE)
	})

	async function testCharts(queryParams: Object = {}) {
		const result = await TestEndpoint<ChartsResponseDto>({
			type: METHOD.CHARTS,
			//@ts-ignore
			scaffold: scaffold,
			url: url,
			queryParams: {
				// search: scaffold.values.mock.first_name,
				fields: ['first_name'],
				...queryParams,
			},
		})
		return result
	}

	describe('Pie', () => {
		it('with a single record and single group field', async () => {
			const result = await testCharts()
			expect(result['datasets'].length).toEqual(1)
			expect(result['datasets'][0]['data']).toEqual([
				{
					count: '1',
					first_name: 'Owner',
				},
			])
		})

		it('with 3 records and single group field', async () => {
			const u1 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				first_name: 'Owner',
			})
			const u2 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				first_name: 'Alexa',
			})
			const result = await testCharts()
			await userService.purge(u1)
			await userService.purge(u2)
			expect(result['datasets'].length).toEqual(1)

			expect(result['datasets'][0]['data']).toEqual([
				{
					count: '2',
					first_name: 'Owner',
				},
				{
					count: '1',
					first_name: 'Alexa',
				},
			])
		})

		it('with 3 records and two group fields', async () => {
			const u1 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				first_name: 'Owner',
				last_name: 'User',
			})
			const u2 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				first_name: 'Alexa',
				last_name: 'User',
			})
			const result = await testCharts({
				fields: ['first_name', 'last_name'],
			})
			await userService.purge(u1)
			await userService.purge(u2)

			expect(result['datasets'].length).toEqual(2)

			expect(result['datasets'][0]['data']).toEqual([
				{
					count: '2',
					first_name: 'Owner',
				},
				{
					count: '1',
					first_name: 'Alexa',
				},
			])

			expect(result['datasets'][1]['data']).toEqual([
				{
					count: '3',
					last_name: 'User',
				},
			])
		})
	})

	describe('Line by day', () => {
		// return

		it('with a single record and no group field should return division by time_interval only', async () => {
			const u1 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				created_at: new Date('2023-08-07T14:33:00.000Z'),
				last_name: 'Test',
			})
			const result = await testCharts({
				fields: [],
				period: ChartsPeriod.DAY,
				search: 'Test',
			})

			await userService.purge(u1)
			expect(result['datasets'].length).toEqual(1)
			expect(result['datasets'][0]['data']).toEqual([
				{
					count: '1',
					time_interval: '2023-08-07T00:00:00.000Z',
				},
			])
		})

		it('with a single record and single group field', async () => {
			const u1 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				created_at: new Date('2023-08-07T14:33:00.000Z'),
				first_name: 'Test',
				last_name: 'Test',
			})
			const result = await testCharts({
				period: ChartsPeriod.DAY,
				search: 'Test',
			})
			await userService.purge(u1)
			expect(result['datasets'].length).toEqual(1)
			expect(result['datasets'][0]['data']).toEqual([
				{
					count: '1',
					first_name: 'Test',
					time_interval: '2023-08-07T00:00:00.000Z',
				},
			])
		})

		it('with 3 records and no group field', async () => {
			const u1 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				first_name: 'Owner',
				last_name: 'Test',
				created_at: new Date('2023-08-07T14:33:00.000Z'),
			})
			const u2 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				created_at: new Date('2023-08-09T14:33:00.000Z'),
				first_name: 'Alexa',
				last_name: 'Test',
			})
			const u3 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				created_at: new Date('2023-08-09T14:33:00.000Z'),
				first_name: 'Alexa',
				last_name: 'Test',
			})
			const result = await testCharts({ fields: [], period: ChartsPeriod.DAY, search: 'Test' })
			await userService.purge(u1)
			await userService.purge(u2)
			await userService.purge(u3)
			expect(result['datasets'].length).toEqual(1)
			expect(result['datasets'][0]['data']).toEqual([
				{
					count: '1',
					time_interval: '2023-08-07T00:00:00.000Z',
				},
				{
					count: '2',
					time_interval: '2023-08-09T00:00:00.000Z',
				},
			])
		})

		it('with 3 records and a single group field', async () => {
			const u1 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				first_name: 'Owner',
				last_name: 'Test',
				created_at: new Date('2023-08-07T14:33:00.000Z'),
			})
			const u2 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				created_at: new Date('2023-08-09T14:33:00.000Z'),
				first_name: 'Siri',
				last_name: 'Test',
			})
			const u3 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				created_at: new Date('2023-08-09T14:33:00.000Z'),
				first_name: 'Alexa',
				last_name: 'Test',
			})
			const result = await testCharts({ period: ChartsPeriod.DAY, search: 'Test' })
			await userService.purge(u1)
			await userService.purge(u2)
			await userService.purge(u3)

			expect(result['datasets'].length).toEqual(1)
			expect(result['datasets'][0]['data']).toEqual([
				{
					count: '1',
					first_name: 'Owner',
					time_interval: '2023-08-07T00:00:00.000Z',
				},
				{
					count: '1',
					first_name: 'Siri',
					time_interval: '2023-08-09T00:00:00.000Z',
				},
				{
					count: '1',
					first_name: 'Alexa',
					time_interval: '2023-08-09T00:00:00.000Z',
				},
			])
		})

		it('with 3 records and two group fields', async () => {
			const u1 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				first_name: 'Owner',
				last_name: 'Test',
				created_at: new Date('2023-08-07T14:33:00.000Z'),
			})
			const u2 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				created_at: new Date('2023-08-09T14:33:00.000Z'),
				first_name: 'Siri',
				last_name: 'Test',
			})
			const u3 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				created_at: new Date('2023-08-09T14:33:00.000Z'),
				first_name: 'Alexa',
				last_name: 'Test',
			})
			const result = await testCharts({
				fields: ['first_name', 'last_name'],
				period: ChartsPeriod.DAY,
				search: 'Test',
			})
			await userService.purge(u1)
			await userService.purge(u2)
			await userService.purge(u3)

			expect(result['datasets'].length).toEqual(2)
			expect(result['datasets'][0]['data']).toEqual([
				{
					count: '1',
					first_name: 'Owner',
					time_interval: '2023-08-07T00:00:00.000Z',
				},
				{
					count: '1',
					first_name: 'Siri',
					time_interval: '2023-08-09T00:00:00.000Z',
				},
				{
					count: '1',
					first_name: 'Alexa',
					time_interval: '2023-08-09T00:00:00.000Z',
				},
			])
			expect(result['datasets'][1]['data']).toEqual([
				{
					count: '1',
					last_name: 'Test',
					time_interval: '2023-08-07T00:00:00.000Z',
				},
				{
					count: '2',
					last_name: 'Test',
					time_interval: '2023-08-09T00:00:00.000Z',
				},
			])
		})
	})

	describe('Line', () => {
		it('with 4 records by 15 min', async () => {
			const u1 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				created_at: new Date('2023-08-07T14:33:00.000Z'),
				last_name: 'Test',
			})
			const u2 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				created_at: new Date('2023-08-07T14:44:00.000Z'),
				last_name: 'Test',
			})
			const u3 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				created_at: new Date('2023-08-07T14:49:00.000Z'),
				last_name: 'Test',
			})
			const u4 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				created_at: new Date('2023-08-07T14:57:00.000Z'),
				last_name: 'Test',
			})
			const result = await testCharts({
				fields: [],
				period: ChartsPeriod['15MIN'],
				search: 'Test',
			})
			await userService.purge(u1)
			await userService.purge(u2)
			await userService.purge(u3)
			await userService.purge(u4)

			expect(result['datasets'].length).toEqual(1)
			expect(result['datasets'][0]['data']).toEqual([
				{ count: '2', time_interval: '2023-08-07T14:30:00.000Z' },
				{ count: '2', time_interval: '2023-08-07T14:45:00.000Z' },
			])
		})

		it('with 4 records by 30 min', async () => {
			const u1 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				created_at: new Date('2023-08-07T14:33:00.000Z'),
				last_name: 'Test',
			})
			const u2 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				created_at: new Date('2023-08-07T14:49:00.000Z'),
				last_name: 'Test',
			})
			const u3 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				created_at: new Date('2023-08-07T14:02:00.000Z'),
				last_name: 'Test',
			})
			const u4 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				created_at: new Date('2023-08-07T14:27:00.000Z'),
				last_name: 'Test',
			})
			const result = await testCharts({
				fields: [],
				period: ChartsPeriod['30MIN'],
				search: 'Test',
			})
			await userService.purge(u1)
			await userService.purge(u2)
			await userService.purge(u3)
			await userService.purge(u4)

			expect(result['datasets'].length).toEqual(1)
			expect(result['datasets'][0]['data']).toEqual([
				{ count: '2', time_interval: '2023-08-07T14:30:00.000Z' },
				{ count: '2', time_interval: '2023-08-07T14:00:00.000Z' },
			])
		})

		it('with 4 records by hour', async () => {
			const u1 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				created_at: new Date('2023-08-07T14:33:00.000Z'),
				last_name: 'Test',
			})
			const u2 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				created_at: new Date('2023-08-07T14:49:00.000Z'),
				last_name: 'Test',
			})
			const u3 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				created_at: new Date('2023-08-07T15:02:00.000Z'),
				last_name: 'Test',
			})
			const u4 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				created_at: new Date('2023-08-07T15:27:00.000Z'),
				last_name: 'Test',
			})
			const result = await testCharts({
				fields: [],
				period: ChartsPeriod.HOUR,
				search: 'Test',
			})
			await userService.purge(u1)
			await userService.purge(u2)
			await userService.purge(u3)
			await userService.purge(u4)

			expect(result['datasets'].length).toEqual(1)
			expect(result['datasets'][0]['data']).toEqual([
				{ count: '2', time_interval: '2023-08-07T14:00:00.000Z' },
				{ count: '2', time_interval: '2023-08-07T15:00:00.000Z' },
			])
		})

		it('with 4 records by week', async () => {
			const u1 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				created_at: new Date('2020-01-01'),
			})
			const u2 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				created_at: new Date('2020-01-10'),
			})
			const u3 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				created_at: new Date('2020-01-10'),
			})
			const result = await testCharts({ fields: [], period: ChartsPeriod.WEEK })
			await userService.purge(u1)
			await userService.purge(u2)
			await userService.purge(u3)

			expect(result['datasets'].length).toEqual(1)
			expect(result['datasets'][0]['data'].length).toEqual(3)
		})

		it('with 3 records by month', async () => {
			const u1 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				created_at: new Date('2020-01-01'),
			})
			const u2 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				created_at: new Date('2020-01-03'),
			})
			const result = await testCharts({ fields: [], period: ChartsPeriod.MONTH })
			await userService.purge(u1)
			await userService.purge(u2)

			expect(result['datasets'].length).toEqual(1)
			const firstDayOfCurrentMonth = new Date()
			firstDayOfCurrentMonth.setDate(1)
			expect(result['datasets'][0]['data']).toEqual([
				{
					count: '1',
					time_interval: getChartsIsoDate(firstDayOfCurrentMonth).split('T')[0],
				},
				{
					count: '2',
					time_interval: '2020-01-01',
				},
			])
		})

		it('with 3 records by year', async () => {
			const u1 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				created_at: new Date('2020-01-01'),
			})
			const u2 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				created_at: new Date('2020-04-03'),
			})
			const result = await testCharts({ fields: [], period: ChartsPeriod.YEAR })
			await userService.purge(u1)
			await userService.purge(u2)

			expect(result['datasets'].length).toEqual(1)
			const firstDayOfCurrentYear = new Date()
			firstDayOfCurrentYear.setDate(1)
			firstDayOfCurrentYear.setMonth(0)
			expect(result['datasets'][0]['data']).toEqual([
				{
					count: '1',
					time_interval: getChartsIsoDate(firstDayOfCurrentYear).split('T')[0],
				},
				{
					count: '2',
					time_interval: '2020-01-01',
				},
			])
		})
	})

	describe('Search (with two search fields)', () => {
		it('no results', async () => {
			const result = await testCharts({
				search: 'notFound', // part of "Owner"
			})
			expect(result['datasets'].length).toEqual(1)
			expect(result['datasets'][0]['data'].length).toEqual(0)
		})

		it('results by first field', async () => {
			const result = await testCharts({
				search: 'Owne', // part of "Owner"
			})
			expect(result['datasets'].length).toEqual(1)
			expect(result['datasets'][0]['data'].length).toEqual(1)
		})

		it('results by second field', async () => {
			const result = await testCharts({
				search: 'ser', // part of "User"
			})
			expect(result['datasets'].length).toEqual(1)
			expect(result['datasets'][0]['data'].length).toEqual(1)
		})
	})

	describe('Filter by dates', () => {
		it('with no from or to, returns result', async () => {
			const u1 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				created_at: new Date('2023-02-01T00:00:00.000Z'),
				last_name: 'Test',
			})
			const result = await testCharts({
				search: 'Test',
			})
			await userService.purge(u1)
			expect(result['datasets'].length).toEqual(1)
			expect(result['datasets'][0]['data'].length).toEqual(1)
		})

		it('finds a record younger than "from"', async () => {
			const u1 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				created_at: new Date('2023-02-01T00:00:00.000Z'),
				last_name: 'Test',
			})
			const result = await testCharts({
				search: 'Test',
				from: '2023-01-01T00:00:00.000Z',
			})
			await userService.purge(u1)
			expect(result['datasets'].length).toEqual(1)
			expect(result['datasets'][0]['data'].length).toEqual(1)
		})

		it('ignores a record older than "from"', async () => {
			const u1 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				created_at: new Date('2023-02-01T00:00:00.000Z'),
				last_name: 'Test',
			})
			const result = await testCharts({
				search: 'Test',
				from: '2023-04-01T00:00:00.000Z',
			})
			await userService.purge(u1)
			expect(result['datasets'].length).toEqual(1)
			expect(result['datasets'][0]['data'].length).toEqual(0)
		})

		it('finds a record older than "to"', async () => {
			const u1 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				created_at: new Date('2023-02-01T00:00:00.000Z'),
				last_name: 'Test',
			})
			const result = await testCharts({
				search: 'Test',
				to: '2023-02-04T00:00:00.000Z',
			})
			await userService.purge(u1)
			expect(result['datasets'].length).toEqual(1)
			expect(result['datasets'][0]['data'].length).toEqual(1)
		})

		it('ignores a record younger than "to"', async () => {
			const u1 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				created_at: new Date('2023-02-01T00:00:00.000Z'),
				last_name: 'Test',
			})
			const result = await testCharts({
				search: 'Test',
				to: '2023-01-01T00:00:00.000Z',
			})
			await userService.purge(u1)
			expect(result['datasets'].length).toEqual(1)
			expect(result['datasets'][0]['data'].length).toEqual(0)
		})

		it('finds a record between "from" and "to"', async () => {
			const u1 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				created_at: new Date('2023-02-01T00:00:00.000Z'),
				last_name: 'Test',
			})
			const result = await testCharts({
				search: 'Test',
				from: '2023-01-01T00:00:00.000Z',
				to: '2023-03-01T00:00:00.000Z',
			})
			await userService.purge(u1)
			expect(result['datasets'].length).toEqual(1)
			expect(result['datasets'][0]['data'].length).toEqual(1)
		})

		it('ignores a record not between "from" and "to"', async () => {
			const u1 = await userService.create({
				...MockUserRequest(scaffold.values.account),
				created_at: new Date('2024-02-01T00:00:00.000Z'),
				last_name: 'Test',
			})
			const result = await testCharts({
				search: 'Test',
				from: '2023-01-01T00:00:00.000Z',
				to: '2023-03-01T00:00:00.000Z',
			})
			await userService.purge(u1)
			expect(result['datasets'].length).toEqual(1)
			expect(result['datasets'][0]['data'].length).toEqual(0)
		})
	})

	describe('Filter using RHS Colon syntax', () => {
		const testData = [
			{
				name: 'EQ',
				create: { last_name: 'TestName' },
				query: { last_name: 'EQ:TestName' },
				expected: 1,
			},
			{
				name: 'EQ with no matches',
				create: { last_name: 'TestName' },
				query: { last_name: 'EQ:WrongName' },
				expected: 0,
			},
			{
				name: '!EQ',
				create: { last_name: 'TestName' },
				query: { last_name: '!EQ:TestName' },
				expected: 1, // existing record
			},
			{
				name: '!EQ with no matches',
				create: { last_name: 'TestName' },
				query: { last_name: '!EQ:WrongName' },
				expected: 2, // existing record + new record
			},
			{
				name: 'GT',
				create: { last_name: 'TestName', created_at: '2021-02-01T00:00:00.000Z' },
				query: { last_name: 'EQ:TestName', created_at: 'GT:2020-02-01T00:00:00.000Z' },
				expected: 1,
			},
			// GT doesn't seem to work as expected with dates
			// {
			// 	name: "GT with exact match",
			// 	create: { last_name: 'TestName', created_at: '2021-02-01T00:00:00.000Z' },
			// 	query: { last_name: 'EQ:TestName', created_at: 'GT:2021-02-01T00:00:00.000Z' },
			// 	expected: 0,
			// },
			{
				name: 'GT with no matches',
				create: { last_name: 'TestName', created_at: '2021-02-01T00:00:00.000Z' },
				query: { last_name: 'EQ:TestName', created_at: 'GT:2022-02-01T00:00:00.000Z' },
				expected: 0,
			},
			{
				name: 'GTE',
				create: { last_name: 'TestName', created_at: '2021-02-01T00:00:00.000Z' },
				query: { last_name: 'EQ:TestName', created_at: 'GTE:2020-02-01T00:00:00.000Z' },
				expected: 1,
			},
			{
				name: 'GTE with exact match',
				create: { last_name: 'TestName', created_at: '2021-02-01T00:00:00.000Z' },
				query: { last_name: 'EQ:TestName', created_at: 'GTE:2021-02-01T00:00:00.000Z' },
				expected: 1,
			},
			{
				name: 'GTE with no matches',
				create: { last_name: 'TestName', created_at: '2021-02-01T00:00:00.000Z' },
				query: { last_name: 'EQ:TestName', created_at: 'GTE:2022-02-01T00:00:00.000Z' },
				expected: 0,
			},
			{
				name: 'LT',
				create: { last_name: 'TestName', created_at: '2021-02-01T00:00:00.000Z' },
				query: { last_name: 'EQ:TestName', created_at: 'LT:2022-02-01T00:00:00.000Z' },
				expected: 1,
			},
			{
				name: 'LT with exact matches',
				create: { last_name: 'TestName', created_at: '2021-02-01T00:00:00.000Z' },
				query: { last_name: 'EQ:TestName', created_at: 'LT:2021-02-01T00:00:00.000Z' },
				expected: 0,
			},
			{
				name: 'LT with no matches',
				create: { last_name: 'TestName', created_at: '2021-02-01T00:00:00.000Z' },
				query: { last_name: 'EQ:TestName', created_at: 'LT:2020-02-01T00:00:00.000Z' },
				expected: 0,
			},
			{
				name: 'LTE',
				create: { last_name: 'TestName', created_at: '2021-02-01T00:00:00.000Z' },
				query: { last_name: 'EQ:TestName', created_at: 'LTE:2022-02-01T00:00:00.000Z' },
				expected: 1,
			},
			// LTE doesn't seem to work as expected with dates
			// {
			// 	name: "LTE with exact matches",
			// 	create: { last_name: 'TestName', created_at: '2021-02-01T00:00:00.000Z' },
			// 	query: { last_name: 'EQ:TestName', created_at: 'LTE:2021-02-01T00:00:00.000Z' },
			// 	expected: 1,
			// },
			{
				name: 'LTE with no matches',
				create: { last_name: 'TestName', created_at: '2021-02-01T00:00:00.000Z' },
				query: { last_name: 'EQ:TestName', created_at: 'LTE:2020-02-01T00:00:00.000Z' },
				expected: 0,
			},
			{
				name: 'Overloading operators: Overloading operators: GT and LT',
				create: { last_name: 'TestName', created_at: '2021-02-01T00:00:00.000Z' },
				query: {
					last_name: 'EQ:TestName',
					created_at: ['GT:2020-02-01T00:00:00.000Z', 'LT:2022-01-01T00:00:00.000Z'],
				},
				expected: 1,
			},
			{
				name: 'Overloading operators: GT and LT with no matches',
				create: { last_name: 'TestName', created_at: '2023-02-01T00:00:00.000Z' },
				query: {
					last_name: 'EQ:TestName',
					created_at: ['GT:2020-02-01T00:00:00.000Z', 'LT:2022-01-01T00:00:00.000Z'],
				},
				expected: 0,
			},
			{
				name: 'Overloading operators: GT and LT with no matches #2',
				create: { last_name: 'TestName', created_at: '2019-02-01T00:00:00.000Z' },
				query: {
					last_name: 'EQ:TestName',
					created_at: ['GT:2020-02-01T00:00:00.000Z', 'LT:2022-01-01T00:00:00.000Z'],
				},
				expected: 0,
			},
			{
				name: 'Overloading operators: GT, GTE and LT',
				create: { last_name: 'TestName', created_at: '2021-02-01T00:00:00.000Z' },
				query: {
					last_name: 'EQ:TestName',
					created_at: [
						'GT:2020-02-01T00:00:00.000Z',
						'GTE:2020-02-01T00:00:00.000Z',
						'LT:2022-01-01T00:00:00.000Z',
					],
				},
				expected: 1,
			},
			{
				name: 'Overloading operators: GT, GTE and LT with no matches',
				create: { last_name: 'TestName', created_at: '2023-02-01T00:00:00.000Z' },
				query: {
					last_name: 'EQ:TestName',
					created_at: [
						'GT:2020-02-01T00:00:00.000Z',
						'GTE:2020-02-01T00:00:00.000Z',
						'LT:2022-01-01T00:00:00.000Z',
					],
				},
				expected: 0,
			},
			{
				name: 'Overloading operators: GT, GTE and LT with no matches #2',
				create: { last_name: 'TestName', created_at: '2019-02-01T00:00:00.000Z' },
				query: {
					last_name: 'EQ:TestName',
					created_at: [
						'GT:2020-02-01T00:00:00.000Z',
						'GTE:2020-02-01T00:00:00.000Z',
						'LT:2022-01-01T00:00:00.000Z',
					],
				},
				expected: 0,
			},
			{
				name: 'NULL',
				create: { last_name: null },
				query: { last_name: 'NULL' },
				expected: 1,
			},
			{
				name: 'NULL with no matches',
				create: { last_name: 'notNull' },
				query: { last_name: 'NULL' },
				expected: 0,
			},
			{
				name: '!NULL',
				create: { last_name: null },
				query: { last_name: '!NULL' },
				expected: 1, // existing record
			},
			{
				name: '!NULL with no matches',
				create: { last_name: 'notNull' },
				query: { last_name: '!NULL' },
				expected: 2, // existing record and newly created one
			},
		]
		testData.forEach(({ name, create, query, expected }) => {
			it(name, async () => {
				// @ts-ignore
				const u1 = await userService.create({
					...MockUserRequest(scaffold.values.account),
					...create,
				})
				const result = await testCharts({
					...query,
				})
				await userService.purge(u1)
				expect(result['datasets'].length).toEqual(1)
				expect(result['datasets'][0]['data'].length).toEqual(expected)
			})
		})
	})

	afterAll(async () => {
		await scaffolding.down(E)
	})
})

function getChartsIsoDate(date?: Date) {
	function pad(num) {
		var norm = Math.floor(Math.abs(num))
		return (norm < 10 ? '0' : '') + norm
	}

	date ||= new Date() // gets current date
	return (
		date.getFullYear() +
		'-' +
		pad(date.getMonth() + 1) +
		'-' +
		pad(date.getDate()) +
		'T' +
		'00' +
		':' +
		'00' +
		':' +
		'00' +
		'.' +
		'000' +
		'Z'
	)
}
