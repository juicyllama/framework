import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Api, Logger } from '@juicyllama/utils'
import { WiseApiConfig, WiseApiUrl } from '../../config/wise.config'
import { ConfigService } from '@nestjs/config'
import { WiseWebhookDto } from './wise.webhooks.dto'

@Injectable()
export class WiseWebhooksService {
	constructor(
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => Api)) private readonly api: Api,
	) {}

	async getWebhooks() {
		const domain = 'app::wise::webhooks::service::getWebhooks'
		const URL = `${WiseApiUrl()}/v3/profiles/${this.configService.get<string>('wise.profileId')}/subscriptions`
		return await this.api.get(domain, URL, WiseApiConfig())
	}

	async createWebhook(webhook: WiseWebhookDto) {
		const domain = 'app::wise::webhooks::createWebhook'
		const URL = `${WiseApiUrl()}/v3/profiles/${this.configService.get<string>('wise.profileId')}/subscriptions`
		return await this.api.post(domain, URL, webhook, WiseApiConfig())
	}
}
