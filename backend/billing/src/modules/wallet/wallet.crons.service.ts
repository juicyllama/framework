import { SettingsService, CronRunner } from '@juicyllama/core'
import { CachePeriod, Env, Logger, Modules } from '@juicyllama/utils'
import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { LessThan } from 'typeorm'
import { PaymentMethod } from '../payment_methods/payment.methods.entity'
import { PaymentMethodStatus } from '../payment_methods/payment.methods.enums'
import { PaymentMethodsService } from '../payment_methods/payment.methods.service'
import { CRON_BILLING_WALLET_SETTLE_BALANCES_DOMAIN } from './wallet.constants'
import { Wallet } from './wallet.entity'
import { WalletService } from './wallet.service'

@Injectable()
export class WalletCronService {
	constructor(
		private readonly paymentMethodsService: PaymentMethodsService,
		private readonly logger: Logger,
		private readonly settingsService: SettingsService,
		private readonly walletService: WalletService,
	) {}

	/**
	 * Takes a list of negative wallet values and attempts to charge for them
	 */

	@Cron(process.env.CRON_BILLING_WALLET_SETTLE_BALANCES_FREQUENCY ?? CronExpression.EVERY_10_MINUTES, {
		disabled: !process.env.CRON_BILLING_WALLET_SETTLE_BALANCES,
	})
	async cronSyncOrders() {
		return await CronRunner(CRON_BILLING_WALLET_SETTLE_BALANCES_DOMAIN, this.settleBalances())
	}

	async settleBalances() {
		const domain = CRON_BILLING_WALLET_SETTLE_BALANCES_DOMAIN

		if (Env.IsNotTest()) {
			let Bugsnag: any

			if (Modules.bugsnag.isInstalled) {
				Bugsnag = await Modules.bugsnag.load()
				Bugsnag.addMetadata('cron', {
					domain: domain,
				})
			}
		}

		if (!(await this.settingsService.cronCheck(domain, CachePeriod.HOUR))) {
			return
		}

		const wallets: Wallet[] = await this.walletService.findNegativeAccounts()

		this.logger.log(`[${domain}] ${wallets.length} Negative Balances Found`)

		let rebills_attempted = 0
		let rebills_no_payment_method = 0

		for (const wallet of wallets) {
			const payment_method: PaymentMethod = await this.paymentMethodsService.findOne({
				where: {
					account: {
						account_id: wallet.account_id,
					},
					currency: wallet.currency,
					can_charge: true,
					next_attempt_at: LessThan(new Date()),
					status: PaymentMethodStatus.active,
				},
			})

			if (!payment_method) {
				this.logger.log(
					`[${domain}] No active payment method found for account #${wallet.account_id} with currency ${wallet.currency}`,
				)
				rebills_no_payment_method++
				continue
			}

			this.logger.log(
				`[${domain}] Charge attempt #${(payment_method.attempts || 0) + 1} for account #${wallet.account_id}`,
			)
			await this.paymentMethodsService.charge(payment_method, Number(0 - wallet.balance))
			rebills_attempted++
		}

		// Wrap-up and return results
		await this.settingsService.cronEnd(domain)

		return {
			rebill: {
				total: wallets.length,
				attempted: rebills_attempted,
				no_payment_method: rebills_no_payment_method,
			},
		}
	}
}
