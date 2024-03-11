import { AuthService, AccountId, AuthenticatedRequest } from '@juicyllama/core'
import { BadRequestException, Controller, Get, Query, Res, Req, forwardRef, Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { AppStoreIntegrationName } from '../apps.enums'
import { AppsService } from '../apps.service'
import { oauthQueryMappers } from './oauth.mappers'

@ApiTags('Oauth')
@Controller('oauth')
export class OauthController {
	constructor(
		@Inject(forwardRef(() => AuthService)) readonly authService: AuthService,
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
		@Req() req: AuthenticatedRequest,
		@AccountId() account_id: number,
		@Res() res: any,
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
