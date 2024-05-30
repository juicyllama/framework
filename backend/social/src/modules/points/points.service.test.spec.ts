import { Scaffold, ScaffoldDto } from '@juicyllama/core'
import { POINTS_E as E, POINTS_T as T } from './points.constants'
import { PointsModule } from './points.module'
import { PointsService } from './points.service'

describe('Social > Points', () => {
	const scaffolding = new Scaffold<T>()

	let scaffold: ScaffoldDto<T>

	beforeAll(async () => {
		scaffold = await scaffolding.up(PointsModule, PointsService)
	})

	describe('Add Points', () => {
		it('100 Points', async () => {
			const points = await scaffold.services.service.addPoints({
				points_identifier: 'TEST',
				user_id: scaffold.values.owner.user_id,
				points: 100,
				log: 'Test',
			})
			expect(points).toBeDefined()
			expect(points.points).toBe(100)
		})
	})

	describe('Subtract Points', () => {
		it('50 Points', async () => {
			const points = await scaffold.services.service.subtractPoints({
				points_identifier: 'TEST',
				user_id: scaffold.values.owner.user_id,
				points: 50,
				log: 'Test',
			})
			expect(points).toBeDefined()
			expect(points.points).toBe(50)
		})
	})

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
