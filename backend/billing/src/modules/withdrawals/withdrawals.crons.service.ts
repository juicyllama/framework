import { Cron, CronExpression } from '@nestjs/schedule'
import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { CachePeriod, Logger, Modules } from '@juicyllama/utils'
import { Env } from '@juicyllama/utils'
import { SettingsService, CronRunner } from '@juicyllama/core'
import { PaymentMethodsService } from '../payment_methods/payment.methods.service'
import { Withdrawal } from './withdrawals.entity'
import { WithdrawalsService } from './withdrawals.service'
import { WithdrawalStatus } from './withdrawals.enums'
import { CRON_BILLING_WITHDRAWALS_SETTLE_DOMAIN } from './withdrawals.constants'

@Injectable()
export class WithdrawalsCronService {
	constructor(
		@Inject(forwardRef(() => PaymentMethodsService)) private readonly paymentMethodsService: PaymentMethodsService,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => SettingsService)) private readonly settingsService: SettingsService,
		@Inject(forwardRef(() => WithdrawalsService)) private readonly withdrawalsService: WithdrawalsService,
	) {}

	/**
	 * Takes a list of withdrawal requests and attempts to settle them
	 */
	@Cron(process.env.CRON_BILLING_WITHDRAWALS_SETTLE_FREQUENCY ?? CronExpression.EVERY_HOUR, {
		disabled: !process.env.CRON_BILLING_WITHDRAWALS_SETTLE,
	})
	async cronSyncOrders() {
		return await CronRunner(CRON_BILLING_WITHDRAWALS_SETTLE_DOMAIN, this.settleWithdrawals())
	}

	async settleWithdrawals() {
		const domain = CRON_BILLING_WITHDRAWALS_SETTLE_DOMAIN

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

		const withdrawals: Withdrawal[] = await this.withdrawalsService.findAll({
			where: {
				status: WithdrawalStatus.PENDING,
			},
		})

		this.logger.log(`[${domain}] ${withdrawals.length} Pending Withdrawals Found`)

		const withdrawalsPromises = []

		for (const withdrawal of withdrawals) {
			const promise = new Promise((res, rej) => {
				this.paymentMethodsService
					.remit(withdrawal.payment_method /*withdrawal.amount*/)
					.then(async remit => {
						if (remit) {
							await this.withdrawalsService.updateStatus(withdrawal, WithdrawalStatus.PROCESSING)
							this.logger.log(
								`[${domain}] Withdrawal #${withdrawal.withdrawal_id} send for processing`,
								withdrawal,
							)
						} else {
							await this.withdrawalsService.updateStatus(withdrawal, WithdrawalStatus.MANUAL)
							this.logger.log(
								`[${domain}] Withdrawal #${withdrawal.withdrawal_id} requires manual processing`,
								withdrawal,
							)
						}
						res(withdrawal.withdrawal_id)
					})
					.catch(e => {
						console.error(e)
						rej(e.message)
					})
			})
			withdrawalsPromises.push(promise)
		}
		const withdrawalsOutcomes = await Promise.allSettled(withdrawalsPromises)

		// Wrap-up and return results
		await this.settingsService.cronEnd(domain)

		return {
			withdrawals: {
				total: withdrawals.length,
				success: withdrawalsOutcomes.filter(o => o.status === 'fulfilled').length,
				failed: withdrawalsOutcomes.filter(o => o.status === 'rejected').length,
				failures: withdrawalsOutcomes.filter(o => o.status === 'rejected'),
			},
		}
	}
}
