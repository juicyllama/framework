import { SupportedCurrencies } from '@juicyllama/utils'
import { AppIntegrationName, Scaffold, ScaffoldDto } from '@juicyllama/core'
import { MockPaymentMethodCCRequest } from '../../test/mocks'
import { ChargesService } from '../charges/charges.service'
import { BillingModule } from '../billing.module'
import { WalletService } from './wallet.service'
import { PaymentMethodsService } from '../payment_methods/payment.methods.service'
import { PaymentsService } from '../payments/payments.service'
import { PaymentMethod } from '../payment_methods/payment.methods.entity'
import { PaymentStatus, PaymentType } from '../payments/payments.enums'
import { Charge } from '../charges/charges.entity'
import { WalletCronService } from './wallet.crons.service'

const E = Charge
type T = Charge
const MODULE = BillingModule
const SERVICE = WalletCronService

describe('Wallet Cron', () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	//extra services for testing
	let chargesService: ChargesService
	let paymentsService: PaymentsService
	let paymentMethodsService: PaymentMethodsService
	let walletService: WalletService

	let payment_method: PaymentMethod

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)
		chargesService = scaffold.module.get<ChargesService>(ChargesService)
		paymentsService = scaffold.module.get<PaymentsService>(PaymentsService)
		paymentMethodsService = scaffold.module.get<PaymentMethodsService>(PaymentMethodsService)
		walletService = scaffold.module.get<WalletService>(WalletService)
	})

	describe('Settle Balance', () => {
		it('Setup payment method', async () => {
			payment_method = await paymentMethodsService.createPaymentMethod({
				paymentMethod: MockPaymentMethodCCRequest(scaffold.values.account),
			})
			expect(payment_method).toBeDefined()
			expect(payment_method.payment_method_id).toBeDefined()
		})

		it('Create negative balance', async () => {
			const charge = await chargesService.create({
				name: 'Test',
				description: 'Test Charge',
				account: scaffold.values.account,
				amount_total: 100,
				currency: SupportedCurrencies.USD,
				added_by: scaffold.values.owner,
			})
			expect(charge).toBeDefined()
			expect(charge.charge_id).toBeDefined()
		})

		it('Check the wallet is now at -100', async () => {
			const balance = await walletService.getBalance(scaffold.values.account, SupportedCurrencies.USD)
			expect(balance).toBeDefined()
			expect(Number(balance)).toBe(-100)
		})

		it('Run settle balance', async () => {
			const result = await scaffold.services.service.settleBalances()
			expect(result).toBeDefined()
			expect(result.rebill.total).toBeGreaterThan(0)
			expect(result.rebill.attempted).toBeGreaterThan(0)
			expect(result.rebill.no_payment_method).toBe(0)
		})

		it('Fake a payment success response', async () => {
			await paymentsService.paymentResponse({
				account_id: scaffold.values.account.account_id,
				app_integration_name: AppIntegrationName.mollie,
				app_payment_id: 123456,
				amount: 100,
				currency: SupportedCurrencies.USD,
				payment_status: PaymentStatus.success,
				payment_type: PaymentType.payment
			})
		})

		it('Check the wallet is now at zero', async () => {
			const balance = await walletService.getBalance(scaffold.values.account, SupportedCurrencies.USD)
			expect(balance).toBeDefined()
			expect(Number(balance)).toBe(0)
		})

		it('Run settle balance', async () => {
			const result = await scaffold.services.service.settleBalances()
			expect(result).toBeDefined()
			expect(result.rebill.total).toBe(0)
		})
	})

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
