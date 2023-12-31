import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Api, Logger, Env } from '@juicyllama/utils'
import { ConfigService } from '@nestjs/config'
import * as mock from '../../../../types/click/clicks.mock.json'
import { EverflowClick } from '../../../../types/click/everflow.click.dto'
import { EverflowAffiliateReportingClicksBody } from './everflow.affiliate.reporting.clicks.dto'
import { everflowConfigDto } from '../../../../config/everflow.config.dto'
import { getEverflowAxiosConfig } from '../../../../config/everflow.config'

const ENDPOINT = `https://api.eflow.team/v1/affiliates/reporting/clicks/stream`

@Injectable()
export class EverflowAffiliateReportingClicksService {
	constructor(
		@Inject(forwardRef(() => Api)) private readonly api: Api,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
	) {}

	async findAll(options: {
		arguments: EverflowAffiliateReportingClicksBody
		config?: everflowConfigDto
	}): Promise<EverflowClick[]> {
		const domain = 'app::everflow::affiliate::reporting::clicks::findAll'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return mock.clicks
		}

		if (!options.arguments.timezone_id) {
			options.arguments.timezone_id = 67 //UTC
		}

		try {
			return await this.api.post(domain, ENDPOINT, options.arguments, getEverflowAxiosConfig(options.config))
		} catch (e) {
			this.logger.error(`[${domain}] Error finding clicks: ${e.message}`, e)
		}
	}
}
