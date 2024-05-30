import { METHOD, Scaffold, ScaffoldDto, TestEndpoint } from '@juicyllama/core'
import { POINTS_ENDPOINT, POINTS_E as E, POINTS_T as T } from './points.constants'
import { PointsModule } from './points.module'
import { PointsService } from './points.service'
import { Points } from './points.entity'

describe('Social > Points', () => {
	const scaffolding = new Scaffold<T>()

	let scaffold: ScaffoldDto<T>
	let points: Points

	beforeAll(async () => {
		scaffold = await scaffolding.up(PointsModule, PointsService)
	})

	describe('Get Points', () => {
		it('No Points', async () => {
			points = <T>await TestEndpoint<T>({
				type: METHOD.GET,
				scaffold: scaffold,
				url: POINTS_ENDPOINT + '/TEST',
				skipResultCheck: true,
			})
			expect(points).toBeDefined()
			expect(points.points).toBeUndefined()
		})

		it('100 Points', async () => {
			await scaffold.services.service.create({
				points_identifier: 'TEST',
				user_id: scaffold.values.owner.user_id,
				points: 100,
			})

			points = <T>await TestEndpoint<T>({
				type: METHOD.GET,
				scaffold: scaffold,
				url: POINTS_ENDPOINT + '/TEST',
				skipResultCheck: true,
			})
			expect(points).toBeDefined()
			expect(points.points).toBe(100)
		})
	})

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
