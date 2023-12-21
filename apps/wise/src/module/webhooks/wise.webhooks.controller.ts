import { Logger } from '@juicyllama/utils'
import { Body, Controller, Post } from '@nestjs/common'
import { ApiHideProperty } from '@nestjs/swagger'

@Controller('app/wise/webhook')
export class WiseWebhooksController {
	constructor(private readonly logger: Logger) {}

	@ApiHideProperty()
	@Post()
	async webhook(@Body() data: any): Promise<void> {
		const domain = 'app::wise::webhooks::controller::webhook'
		this.logger.log(`[${domain}] Request`, data)
	}
}
