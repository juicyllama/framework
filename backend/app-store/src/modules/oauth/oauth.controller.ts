import { BadRequestException, Controller, forwardRef, Inject, Get, Query, Res, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AppsService } from '../apps.service'
import { AppStoreIntegrationName } from '../apps.enums'
import { ConfigService } from '@nestjs/config'
import { ApiOperation, ApiQuery } from '@nestjs/swagger'
import { oauthQueryMappers } from './oauth.mappers'
import { AuthService, AccountId } from '@juicyllama/core'

@ApiTags('Oauth')
@Controller('oauth')
export class OauthController {
	constructor(
		@Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
		@Inject(forwardRef(() => AppsService)) private readonly appsService: AppsService,
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
	) {}

	@ApiOperation({
		summary: 'Start Oauth flow',
		description:
			'Use this endpoint to kick off an Oauth flow for an app from a 3rd party service. Note: It will redirect the user to the frontend to authenticate and complete the flow.',
	})
	@ApiQuery({
		name: 'integration_name',
		enum: AppStoreIntegrationName,
		description: 'The integration name of the app you want to start the Oauth flow for.',
	})
	@Get('start')
	async start(
		@Req() req,
		@AccountId() account_id: number,
		@Res() res,
		@Query('integration_name') integration_name: AppStoreIntegrationName,
		@Query() query: any, //allow passthrough of query params
	): Promise<void> {
		await this.authService.check(req.user.user_id, account_id)

		const app = await this.appsService.findOne({
			where: {
				integration_name: integration_name,
			},
		})

		if (!app) {
			throw new BadRequestException(`No ${integration_name} app installed`)
		}

		query = oauthQueryMappers(query)

		const queryParams = new URLSearchParams(query)
		res.redirect(`${this.configService.get<string>('system.BASE_URL_APP')}/oauth/start?${queryParams}`)
		return
	}
}
