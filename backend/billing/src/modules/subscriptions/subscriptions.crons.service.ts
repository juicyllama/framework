import { Cron, CronExpression } from '@nestjs/schedule'
import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { CachePeriod, Logger, Modules } from '@juicyllama/utils'
import { LessThanOrEqual } from 'typeorm'
import { Env, Dates } from '@juicyllama/utils'
import { SubscriptionsService } from './subscriptions.service'
import { SettingsService, CronRunner } from '@juicyllama/core'
import { ChargesService } from '../charges/charges.service'
import { CRON_BILLING_SUBSCRIPTIONS_REBILL_DOMAIN } from './subscriptions.constants'

@Injectable()
export class SubscriptionsCronService {
	constructor(
		@Inject(forwardRef(() => ChargesService)) private readonly chargesService: ChargesService,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => SettingsService)) private readonly settingsService: SettingsService,
		@Inject(forwardRef(() => SubscriptionsService)) private readonly subscriptionsService: SubscriptionsService,
	) {}

	/**
	 * Generate charges for subscriptions which need re-billing
	 */

	@Cron(process.env.CRON_BILLING_SUBSCRIPTIONS_REBILL_FREQUENCY ?? CronExpression.EVERY_HOUR, {
		disabled: !process.env.CRON_BILLING_SUBSCRIPTIONS_REBILL,
	})
	async cronSyncOrders() {
		return await CronRunner(CRON_BILLING_SUBSCRIPTIONS_REBILL_DOMAIN, this.rebill())
	}

	async rebill() {
		const domain = CRON_BILLING_SUBSCRIPTIONS_REBILL_DOMAIN

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

		const subscriptions = await this.subscriptionsService.findAll({
			where: {
				next_rebill_at: LessThanOrEqual(new Date()),
			},
		})

		this.logger.log(`[${domain}] ${subscriptions.length} Subscriptions Found`)

		const subscriptionsPromises = []
		for (const subscription of subscriptions) {
			const promise = new Promise((res, rej) => {
				this.chargesService
					.create({
						account: subscription.account,
						amount_subtotal: subscription.amount_subtotal,
						amount_tax: subscription.amount_tax,
						amount_total: subscription.amount_total,
						currency: subscription.currency,
						tags: subscription.tags,
						name: subscription.name,
						description: subscription.description,
					})
					.then(() => {
						this.subscriptionsService.update({
							subscription_id: subscription.subscription_id,
							next_rebill_at: Dates.nextDate(subscription.frequency),
						})
						res(subscription.subscription_id)
					})
					.catch(e => {
						rej(e.message)
					})
			})
			subscriptionsPromises.push(promise)
			this.logger.log(`[${domain}] Subscription #${subscription.subscription_id}`, subscription)
		}
		const subscriptionsOutcomes = await Promise.allSettled(subscriptionsPromises)

		// Wrap-up and return results
		await this.settingsService.cronEnd(domain)

		return {
			subscriptions: {
				total: subscriptions.length,
				success: subscriptionsOutcomes.filter(o => o.status === 'fulfilled').length,
				failed: subscriptionsOutcomes.filter(o => o.status === 'rejected').length,
				failures: subscriptionsOutcomes.filter(o => o.status === 'rejected'),
			},
		}
	}
}
