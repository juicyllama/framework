import { Scaffold, ScaffoldDto } from '@juicyllama/core'
import { SupportedCurrencies } from '@juicyllama/utils'
import { MockSubscriptionRequest } from '../../test/mocks'
import { BillingModule } from '../billing.module'
import { Charge } from '../charges/charges.entity'
import { ChargesService } from '../charges/charges.service'
import { InvoicesService } from '../invoices/invoices.service'
import { WalletService } from '../wallet/wallet.service'
import { SubscriptionsCronService } from './subscriptions.crons.service'
import { SubscriptionsService } from './subscriptions.service'

const E = Charge
type T = Charge
const MODULE = BillingModule
const SERVICE = SubscriptionsCronService

describe('Subscriptions Cron', () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	//extra services for testing
	let chargesService: ChargesService
	let invoicesService: InvoicesService
	let subscriptionService: SubscriptionsService
	let walletService: WalletService

	let charge: Charge

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)

		chargesService = scaffold.module.get<ChargesService>(ChargesService)
		invoicesService = scaffold.module.get<InvoicesService>(InvoicesService)
		subscriptionService = scaffold.module.get<SubscriptionsService>(SubscriptionsService)
		walletService = scaffold.module.get<WalletService>(WalletService)
	})

	describe('Rebill', () => {
		it('Create overdue rebill', async () => {
			const subscription = MockSubscriptionRequest(scaffold.values.account, scaffold.values.owner)
			const time_machine = new Date()
			time_machine.setDate(time_machine.getDate() - 1)
			subscription.next_rebill_at = time_machine
			const rebill = await subscriptionService.create(subscription)
			expect(rebill).toBeDefined()
			expect(rebill.subscription_id).toBeDefined()
		})

		it('Run rebill cron', async () => {
			const result = await scaffold.services.service.rebill()
			expect(result).toBeDefined()
			expect(result.subscriptions.success).toBeGreaterThan(0)
			expect(result.subscriptions.failed).toEqual(0)
		})

		it('Check charge was created', async () => {
			charge = await chargesService.findOne({
				where: { account: { account_id: scaffold.values.account.account_id } },
			})
			expect(charge).toBeDefined()
			expect(charge.charge_id).toBeDefined()
			expect(Number(charge.amount_total)).toBeGreaterThan(0)
		})

		it('Check the wallet was debited', async () => {
			const balance = await walletService.getBalance(scaffold.values.account, SupportedCurrencies.USD)
			expect(balance).toBeDefined()
			expect(Number(balance)).toBe(0 - charge.amount_total)
		})
	})

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
