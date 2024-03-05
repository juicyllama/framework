import { Injectable, Inject, forwardRef } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Api, Logger } from '@juicyllama/utils'
import { ENDPOINT } from '../../utils/constants'
import querystring from 'querystring'
import { IOrganicKombatKeywordResponse, OrganicKombatKeywordParams } from '../../utils/intefaces'

@Injectable()
export class KombatService {
	private key: string | undefined

	constructor(
		@Inject(forwardRef(() => Api)) private readonly api: Api,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
	) {
		this.key = this.configService.get<string>('spyfu.SPYFU_API_KEY')
	}

	async organicKeyword(queryParams: Partial<OrganicKombatKeywordParams>): Promise<IOrganicKombatKeywordResponse> {
		const domain = 'app::spyfu::kombat::organicKeyword'
		const qs = querystring.stringify(queryParams)

		try {
			const response = await this.api.get(
				domain,
				`${ENDPOINT}/keyword_api/v2/kombat/getCompetingSeoKeywords/?api_key=${this.key}&${qs}`,
				{},
			)

			return response
		} catch (err) {
			const e = err as Error
			this.logger.error(`[${domain}] Error finding offers: ${e.message}`, e)
			throw e
		}
	}
}
