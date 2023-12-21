import { InjectConfig, OauthInterface } from '@juicyllama/core'
import { JLCache, Logger } from '@juicyllama/utils'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { XeroClient } from 'xero-node'
import { XeroConfigDto } from '../../config/xero.config.dto'

@Injectable()
export class AuthService {
	constructor(
		@InjectConfig(XeroConfigDto) private readonly config: XeroConfigDto,
		private readonly logger: Logger,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
	) {}

	async accessToken(): Promise<XeroClient> {
		const domain = 'apps::xero_cc::accessToken'

		const cache_key = JLCache.cacheKey(domain, {
			clientId: this.config.XERO_CC_CLIENT_ID,
		})

		const xero = new XeroClient({
			clientId: this.config.XERO_CC_CLIENT_ID,
			clientSecret: this.config.XERO_CC_CLIENT_SECRET,
			grantType: 'client_credentials',
		})

		await xero.initialize()

		const oauth = <OauthInterface>await this.cacheManager.get(cache_key)

		if (!oauth || !oauth.refresh_token) {
			const tokenSet = await xero.getClientCredentialsToken()

			const expires_at = new Date()
			expires_at.setSeconds(expires_at.getSeconds() + tokenSet.expires_in)

			await this.cacheManager.set(cache_key, <OauthInterface>{
				access_token: tokenSet.access_token,
				refresh_token: tokenSet.refresh_token,
				token_type: tokenSet.token_type,
				expires_at: expires_at,
				state: tokenSet.session_state,
				scope: tokenSet.scope,
			})

			return xero
		}

		if (oauth.expires_at < new Date()) {
			this.logger.debug(`[${domain}] OAuth expired renewing access token`)

			await xero.setTokenSet({
				access_token: oauth.access_token,
				refresh_token: oauth.refresh_token,
				token_type: oauth.token_type,
				session_state: oauth.state,
				scope: oauth.scope,
			})

			const validTokenSet = await xero.refreshToken()

			const expires_at = new Date()
			expires_at.setSeconds(expires_at.getSeconds() + validTokenSet.expires_in)

			await this.cacheManager.set(cache_key, <OauthInterface>{
				...oauth,
				refresh_token: validTokenSet.refresh_token,
				access_token: validTokenSet.access_token,
				expires_at: expires_at,
				state: validTokenSet.session_state,
			})

			return xero
		}

		await xero.setTokenSet({
			access_token: oauth.access_token,
			refresh_token: oauth.refresh_token,
			token_type: oauth.token_type,
			session_state: oauth.state,
			scope: oauth.scope,
		})

		return xero
	}
}
