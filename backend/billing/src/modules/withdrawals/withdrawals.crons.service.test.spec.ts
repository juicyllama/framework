import { SupportedCurrencies } from '@juicyllama/utils'
import { Scaffold, ScaffoldDto } from '@juicyllama/core'
import {
	MockPaymentMethodBankRequest,
	MockPaymentRequest,
	MockWithdrawalRequest,
} from '../../test/mocks'
import { WithdrawalsCronService } from './withdrawals.crons.service'
import { PaymentsService } from '../payments/payments.service'
import { PaymentMethodsService } from '../payment_methods/payment.methods.service'
import { PaymentMethod } from '../payment_methods/payment.methods.entity'
import { WithdrawalsService } from './withdrawals.service'
import { Withdrawal } from './withdrawals.entity'
import { Charge } from '../charges/charges.entity'
import { BillingModule } from '../billing.module'
import { WalletService } from '../wallet/wallet.service'

const E = Charge
type T = Charge
const MODULE = BillingModule
const SERVICE = WithdrawalsCronService

describe('Withdrawals Cron', () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	//extra services for testing
	let paymentsService: PaymentsService
	let paymentMethodsService: PaymentMethodsService
	let withdrawalsService: WithdrawalsService
	let walletService: WalletService
	let payment_method: PaymentMethod

	let withdrawals: Withdrawal[]

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)

		paymentsService = scaffold.module.get<PaymentsService>(PaymentsService)
		paymentMethodsService = scaffold.module.get<PaymentMethodsService>(PaymentMethodsService)
		walletService = scaffold.module.get<WalletService>(WalletService)
		withdrawalsService = scaffold.module.get<WithdrawalsService>(WithdrawalsService)

		payment_method = await paymentMethodsService.createPaymentMethod({
			paymentMethod: MockPaymentMethodBankRequest(scaffold.values.account),
		})
	})

	describe('Generate', () => {
		it('Credit balance with lots of funds', async () => {
			await paymentsService.create(MockPaymentRequest(scaffold.values.account, 99999, 999999))
			const balance = await walletService.getBalance(scaffold.values.account, SupportedCurrencies.USD)
			expect(balance).toBeGreaterThan(99999)
		})

		it('Create some withdrawals', async () => {
			for (let j = 0; j < Math.floor(Math.random() * (10 - 1) + 1); j++) {
				await withdrawalsService.create(
					MockWithdrawalRequest(scaffold.values.account, payment_method),
					scaffold.values.owner,
				)
			}

			withdrawals = await withdrawalsService.findAll()
			expect(withdrawals.length).toBeGreaterThan(0)
		})
	})

	describe('Settle', () => {
		it('Run settle withdrawals cron #1', async () => {
			const result = await scaffold.services.service.settleWithdrawals()
			expect(result).toBeDefined()
			expect(result.withdrawals.total).toBeGreaterThan(0)
			expect(result.withdrawals.success).toBeGreaterThan(0)
			expect(result.withdrawals.failed).toEqual(0)
		})

		it('Run settle withdrawals cron #2', async () => {
			const result = await scaffold.services.service.settleWithdrawals()
			expect(result).toBeDefined()
			expect(result.withdrawals.total).toEqual(0)
			expect(result.withdrawals.success).toEqual(0)
			expect(result.withdrawals.failed).toEqual(0)
		})
	})

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
