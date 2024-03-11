import { InjectConfig } from '@juicyllama/core'
import { Api, Logger } from '@juicyllama/utils'
import { Inject, Injectable, forwardRef } from '@nestjs/common'
import querystring from 'querystring'
import { SemrushConfigDto } from '../../configs/semrush.config.dto'
import { ENDPOINT } from '../../utils/constants'
import { KeywordDifficultySearchParams } from '../../utils/intefaces'
import { parseTextData } from '../../utils/textToObj'

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
