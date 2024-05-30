import { METHOD, Scaffold, ScaffoldDto, TestEndpoint } from '@juicyllama/core'
import { ACTIVITY_ENDPOINT, ACTIVITY_PRIMARY_KEY, ACTIVITY_E as E, ACTIVITY_T as T } from './activity.constants'
import { ActivityModule } from './activity.module'
import { ActivityService } from './activity.service'
import { Dates } from '@juicyllama/utils'

describe('Social > Activity', () => {
	const scaffolding = new Scaffold<T>()

	let scaffold: ScaffoldDto<T>
	let activity: T

	beforeAll(async () => {
		scaffold = await scaffolding.up(ActivityModule, ActivityService)
	})

	describe('Update', () => {
		it('Update last_seen_at', async () => {
			const last_seen_at = new Date()

			activity = <T>await TestEndpoint<T>({
				type: METHOD.PUT,
				data: {
					last_seen_at,
				},
				scaffold: scaffold,
				url: ACTIVITY_ENDPOINT + '/TEST',
				PRIMARY_KEY: ACTIVITY_PRIMARY_KEY,
			})
			expect(activity).toBeDefined()
			expect(activity.activity_id).toBeDefined()
			expect(Dates.format(<Date>activity.last_seen_at, 'YYYY-MM-DD HH:mm')).toBe(
				Dates.format(last_seen_at, 'YYYY-MM-DD HH:mm'),
			)
		})
	})

	describe('Streaks', () => {
		it('Get Activity', async () => {
			activity = <T>await TestEndpoint<T>({
				type: METHOD.GET,
				scaffold: scaffold,
				url: ACTIVITY_ENDPOINT + '/TEST',
				PRIMARY_KEY: ACTIVITY_PRIMARY_KEY,
			})
			expect(activity).toBeDefined()
			expect(activity.activity_id).toBeDefined()
			expect(activity.streak).toBe(0)
		})

		it('Increment Streak', async () => {
			activity = <T>await TestEndpoint<T>({
				type: METHOD.PATCH,
				data: {},
				scaffold: scaffold,
				url: ACTIVITY_ENDPOINT + '/streak/TEST',
				PRIMARY_KEY: ACTIVITY_PRIMARY_KEY,
			})
			expect(activity).toBeDefined()
			expect(activity.activity_id).toBeDefined()
			expect(activity.streak).toBe(1)
		})

		it('Increment Streak', async () => {
			activity = <T>await TestEndpoint<T>({
				type: METHOD.PATCH,
				data: {},
				scaffold: scaffold,
				url: ACTIVITY_ENDPOINT + '/streak/TEST',
				PRIMARY_KEY: ACTIVITY_PRIMARY_KEY,
			})
			expect(activity).toBeDefined()
			expect(activity.activity_id).toBeDefined()
			expect(activity.streak).toBe(2)
		})

		it('Reset Streak', async () => {
			activity = <T>await TestEndpoint<T>({
				type: METHOD.DELETE,
				data: {},
				scaffold: scaffold,
				url: ACTIVITY_ENDPOINT + '/streak/TEST',
				PRIMARY_KEY: ACTIVITY_PRIMARY_KEY,
			})
			expect(activity).toBeDefined()
			expect(activity.activity_id).toBeDefined()
			expect(activity.streak).toBe(0)
		})
	})

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
