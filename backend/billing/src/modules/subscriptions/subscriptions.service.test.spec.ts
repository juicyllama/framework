import { faker } from '@faker-js/faker'
import { Scaffold, ScaffoldDto } from '@juicyllama/core'
import { DeepPartial } from 'typeorm'
import { MockSubscriptionRequest } from '../../test/mocks'
import { Subscription } from './subscriptions.entity'
import { SubscriptionsModule } from './subscriptions.module'
import { SubscriptionsService } from './subscriptions.service'

const E = Subscription
type T = Subscription
const MODULE = SubscriptionsModule
const SERVICE = SubscriptionsService

describe('Subscription Service', () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	let subscription: Subscription
	let mock: DeepPartial<T>

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)
		mock = MockSubscriptionRequest(scaffold.values.account, scaffold.values.owner)
	})

	describe('Create', () => {
		it('Should create a new subscription', async () => {
			const result = await scaffold.services.service.create(mock)
			expect(result.name).toBe(mock.name)
		})
	})

	describe('Retrieve', () => {
		it('Should get all subscriptions', async () => {
			const result = await scaffold.services.service.findAll({
				where: {
					account: {
						account_id: mock.account?.account_id,
					},
				},
			})
			expect(result[0].name).toBe(mock.name)
			subscription = result[0]
		})

		it('Should get one subscription', async () => {
			const result = await scaffold.services.service.findOne({
				where: {
					account: {
						account_id: mock.account?.account_id,
					},
				},
			})
			expect(result.name).toBe(mock.name)
		})
	})

	describe('Update', () => {
		it('Should update existing subscription', async () => {
			mock.name = faker.person.fullName()
			await scaffold.services.service.update({ subscription_id: subscription.subscription_id, name: mock.name })
			const result = await scaffold.services.service.findById(subscription.subscription_id)
			expect(result.name).toBe(mock.name)
		})
	})

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
