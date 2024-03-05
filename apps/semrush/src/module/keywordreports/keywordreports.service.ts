import { Injectable, Inject, forwardRef } from '@nestjs/common'
import { Api, Logger } from '@juicyllama/utils'
import { ConfigService } from '@nestjs/config'
import { ENDPOINT } from '../../utils/constants'
import { parseTextData } from '../../utils/textToObj'
import querystring from 'querystring'
import { KeywordDifficultySearchParams } from '../../utils/intefaces'
import { SemrushConfigDto } from '../../configs/semrush.config.dto'
import { InjectConfig } from '@juicyllama/core'

@Injectable()
export class KeywordReportsService {
	private key: string | undefined

	constructor(
		@Inject(forwardRef(() => Api)) private readonly api: Api,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@InjectConfig(SemrushConfigDto) private readonly configService: SemrushConfigDto,
	) {
		this.key = this.configService.SEMRUSH_API_KEY
	}

	async getKeywordDifficulty(queryParams: Partial<KeywordDifficultySearchParams>) {
		const domain = 'app::semrush::keywordreports::getKeywordDifficulty'
		const qs = querystring.stringify(queryParams)
		try {
			const response = await this.api.get(domain, `${ENDPOINT}/?key=${this.key}&type=phrase_kdi&${qs}`)

			return parseTextData(response)
		} catch (err) {
			const e = err as Error
			this.logger.error(`[${domain}] Error finding offers: ${e.message}`, e)
			throw e
		}
	}
}
