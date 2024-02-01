import { Injectable, Inject, forwardRef } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Api, Logger } from '@juicyllama/utils'
import { ENDPOINT } from '../../utils/constants'
import { parseTextData } from '../../utils/textToObj'
import querystring from 'querystring'
import { BacklinksParams } from '../../utils/intefaces'

@Injectable()
export class BacklinksService {
    private key: string | undefined

	constructor(
		@Inject(forwardRef(() => Api)) private readonly api: Api,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
	) {
        this.key = this.configService.get<string>('semrush.SEMRUSH_API_KEY');

    }

	async authorityScore(queryParams: Partial<BacklinksParams>) {
		const domain = 'app::semrush::backlinks::authorityScore'

		const qs = querystring.stringify(queryParams)

		try {
			const response = await this.api.get(
				domain,
				`${ENDPOINT}/analytics/v1/?key=${this.key}&type=backlinks_ascore_profile&${qs}`,
			)

			return parseTextData(response)
		} catch (err) {
			const e = err as Error
			this.logger.error(`[${domain}] Error finding offers: ${e.message}`, e)
			throw e
		}
	}
}
