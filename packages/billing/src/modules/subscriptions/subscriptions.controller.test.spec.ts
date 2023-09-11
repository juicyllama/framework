import { Strings } from '@juicyllama/utils'
import { Subscription } from './subscriptions.entity'
import { SubscriptionsService } from './subscriptions.service'
import { METHOD, Scaffold, ScaffoldDto, TestEndpoint } from '@juicyllama/core'
import { MockSubscriptionRequest } from '../../test/mocks'
import { SubscriptionsModule } from './subscriptions.module'
import { DeepPartial } from 'typeorm'

const E = Subscription
type T = Subscription
const MODULE = SubscriptionsModule
const SERVICE = SubscriptionsService
const ENDPOINT_URL = `/billing/subscriptions`
const NAME = `subscription`
const PRIMARY_KEY = `subscription_id`

describe('Subscription Controller', () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	let mock: DeepPartial<T>
	let record: T
	let primaryKey: number

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)
		mock = MockSubscriptionRequest(scaffold.values.account, scaffold.values.owner)
		record = await scaffold.services.service.create(mock)
	})

	describe(`Retrieve ${Strings.plural(NAME)}`, () => {
		it(`Should get all ${Strings.plural(NAME)}`, async () => {
			await TestEndpoint<T>({
				type: METHOD.LIST,
				scaffold: scaffold,
				url: ENDPOINT_URL,
				PRIMARY_KEY,
			})
		})
	})

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
