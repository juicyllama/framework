import { InjectConfig } from '@juicyllama/core'
import { Api, Logger } from '@juicyllama/utils'
import { Inject, Injectable, forwardRef } from '@nestjs/common'
import querystring from 'querystring'
import { SpyfuConfigDto } from '../../configs/spyfu.config.dto'
import { ENDPOINT } from '../../utils/constants'
import { IOrganicKombatKeywordResponse, OrganicKombatKeywordParams } from '../../utils/intefaces'

@Injectable()
export class KombatService {
	private key: string | undefined

	constructor(
		@Inject(forwardRef(() => Api)) private readonly api: Api,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@InjectConfig(SpyfuConfigDto) private readonly configService: SpyfuConfigDto,
	) {
		this.key = this.configService.SPYFU_API_KEY
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
