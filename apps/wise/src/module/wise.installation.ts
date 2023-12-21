import { Env, Logger } from '@juicyllama/utils'
import { Injectable, OnModuleInit } from '@nestjs/common'
import { WiseWebhooksService } from './webhooks/wise.webhooks.service'

@Injectable()
export class WiseInstallationService implements OnModuleInit {
	constructor(
		private readonly webhooksService: WiseWebhooksService,
		private readonly logger: Logger,
	) {}

	async onModuleInit() {
		if (Env.IsProd()) {
			const webhooks = await this.webhooksService.getWebhooks()

			if (!webhooks.length) {
				this.logger.verbose(`Webhook needs installing for Wise`)

				await this.webhooksService.createWebhook({
					name: 'Read Transactions',
					trigger_on: 'balances#credit',
					delivery: {
						url: `${process.env.BASE_URL_API}/app/wise/webhook`,
						version: '2.0.0',
					},
				})
			}
		}
	}
}
