import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Api } from '@juicyllama/utils'
import { WiseApiConfig } from '../../config/wise.config'
import { WiseWebhookDto } from './wise.webhooks.dto'
import { InjectWiseUrl } from './wise.constants'

@Injectable()
export class WiseWebhooksService {
	constructor(
		@Inject(forwardRef(() => Api)) private readonly api: Api,
		@InjectWiseUrl() private readonly wiseUrl: string,
	) {}

	async getWebhooks() {
		const domain = 'app::wise::webhooks::service::getWebhooks'
		return await this.api.get(domain, this.wiseUrl, WiseApiConfig())
	}

	async createWebhook(webhook: WiseWebhookDto) {
		const domain = 'app::wise::webhooks::createWebhook'
		return await this.api.post(domain, this.wiseUrl, webhook, WiseApiConfig())
	}
}
