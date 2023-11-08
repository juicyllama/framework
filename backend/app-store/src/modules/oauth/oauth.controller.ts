import { BadRequestException, Controller, forwardRef, Inject, Get, Query, Res } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AppsService } from '../apps.service'
import { AppStoreIntegrationName } from '../apps.enums'
import { ConfigService } from '@nestjs/config'
import { ApiOperation, ApiQuery } from '@nestjs/swagger'

@ApiTags('Oauth')
@Controller('oauth')
export class OauthController {
	constructor(
		@Inject(forwardRef(() => AppsService)) private readonly appsService: AppsService,
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
	) {}


	@ApiOperation({
		summary: 'Start Oauth flow',
		description: 'Use this endpoint to kick off an Oauth flow for an app from a 3rd party service. Note: It will redirect the user to the frontend to authenticate and complete the flow.',
	})
	@ApiQuery({
		name: 'integration_name',
		enum: AppStoreIntegrationName,
		description: 'The integration name of the app you want to start the Oauth flow for.',
	})
	@Get('start')
	async start(
		@Res() res,
		@Query('integration_name') integration_name: AppStoreIntegrationName,
	): Promise<void> {

		const app = await this.appsService.findOne({
			where: {
				integration_name: integration_name,
			}
		})

		if (!app) {
			throw new BadRequestException(`No ${integration_name} app installed`)
		}

		res.redirect(`${this.configService.get<string>('system.BASE_URL_APP')}/oauth/start?app_id=${app.app_id}`)
		return
	}

}
