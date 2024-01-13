import { Body, Controller, forwardRef, Inject, Post, Req } from '@nestjs/common'
import { ApiHideProperty } from '@nestjs/swagger'
import { Logger } from '@juicyllama/utils'

@Controller('app/wise/webhook')
export class WiseWebhooksController {
	constructor(@Inject(forwardRef(() => Logger)) private readonly logger: Logger) {}

	@ApiHideProperty()
	@Post()
	async webhook(@Req() req: AuthenticatedRequest, @Body() data: any): Promise<void> {
		const domain = 'app::wise::webhooks::controller::webhook'
		this.logger.log(`[${domain}] Request`, data)
	}
}
