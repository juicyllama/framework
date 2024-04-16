import { forwardRef, Inject, Injectable, InternalServerErrorException } from '@nestjs/common'
import { Api, Logger } from '@juicyllama/utils'
import { filter, isNil, omitBy } from 'lodash'
import { amazonSellerConfig } from '../../config/amazon.seller.config'
import { InstalledApp, OauthService } from '@juicyllama/app-store'
import { AmazonSellerAppCredentialsDto } from '../../config/app.credentials.dto'
import { AmazonSellerMarketplaceDto } from '../amazon.seller.common.dto'
import MARKETPLACES from '../../config/_marketplaces.json'
import { AxiosRequestConfig } from 'axios'

@Injectable()
export class AmazonSellerAuthService {
	constructor(
		@Inject(forwardRef(() => Api)) private readonly api: Api,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => OauthService)) private readonly oauthService: OauthService,
	) {}

	url(installed_app: InstalledApp): string {
		installed_app.settings = <AmazonSellerAppCredentialsDto>installed_app.settings
		const result = <AmazonSellerMarketplaceDto[]>(
			filter(MARKETPLACES, { marketplaceId: installed_app.settings.MARKETPLACE_ID })
		)
		return result[0].api_url
	}

	host(installed_app: InstalledApp): string {
		installed_app.settings = <AmazonSellerAppCredentialsDto>installed_app.settings
		const result = <AmazonSellerMarketplaceDto[]>(
			filter(MARKETPLACES, { marketplaceId: installed_app.settings.MARKETPLACE_ID })
		)
		return result[0].api_endpoint
	}

	async config(installed_app: InstalledApp): Promise<AxiosRequestConfig> {
		const bearer_token = await this.accessToken(installed_app)

		if (!bearer_token) {
			throw new InternalServerErrorException(`No Bearer Token found`)
		}

		return {
			headers: {
				'Content-Type': 'application/json',
				host: this.host(installed_app),
				'x-amz-access-token': bearer_token,
				'x-amz-date': new Date().toISOString(),
				'user-agent': 'BUQ/1.0 (Language=Node/Latest;)',
			},
		}
	}

	async accessToken(installed_app: InstalledApp): Promise<string | undefined> {
		const domain = 'apps::amazon_seller::oauth::accessToken'

		installed_app.settings = <AmazonSellerAppCredentialsDto>installed_app.settings

		const oauth = await this.oauthService.findOne({ where: { installed_app_id: installed_app.installed_app_id } })

		if (!oauth) {
			this.logger.error(`[${domain}][Account App #${installed_app.installed_app_id}] No Oauth token found`)
			throw new InternalServerErrorException(`No Oauth token found`)
		}

		if (oauth.expires_at && oauth.expires_at < new Date()) {
			this.logger.debug(
				`[${domain}][Account App #${installed_app.installed_app_id}] OAuth expired renewing access token`,
			)

			const url = 'https://api.amazon.com/auth/o2/token'

			const data = {
				grant_type: 'refresh_token',
				refresh_token: oauth.refresh_token,
				client_id: amazonSellerConfig().CLIENT_ID,
				client_secret: amazonSellerConfig().CLIENT_SECRET,
			}

			const config = {
				headers: {
					'Content-Type': 'application/json',
				},
			}

			const response = await this.api.post(domain, url, data, config)

			const expires_at = new Date()
			expires_at.setSeconds(expires_at.getSeconds() + response.expires_in)

			const update = {
				refresh_token: response.refresh_token,
				access_token: response.access_token,
				expires_in: new Date(expires_at),
			}

			await this.oauthService.update(omitBy(update, isNil))
			return response.access_token
		}

		return oauth.access_token
	}

	// async interceptor (installed_app: InstalledApp) {

	// 	installed_app.settings = <AmazonSellerAppCredentialsDto>installed_app.settings
	// 	const result = <AmazonSellerMarketplaceDto[]>filter(MARKETPLACES, {marketplaceId: installed_app.settings.MARKETPLACE_ID})

	// 	return aws4Interceptor(
	// 		{
	// 			region: result[0].AWSRegion,
	// 			service: "execute-api",
	// 		},
	// 		{
	// 			accessKeyId: amazonSellerConfig().AMAZON_MARKETPLACE_ACCESS_KEY,
	// 			secretAccessKey: amazonSellerConfig().AMAZON_MARKETPLACE_SECRET,
	// 		}
	// 	);
	// }
}
