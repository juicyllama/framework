import { InjectConfig } from '@juicyllama/core'
import { Api, Logger, Env } from '@juicyllama/utils'
import { Injectable } from '@nestjs/common'
import * as dailcodes from '../../assets/codes.json'
import { ApilayerConfigDto } from '../../config/apilayer.config.dto'
import mock from './mock'
import { NumberVerification } from './number.verification.dto'

const endpoint = 'https://api.apilayer.com/number_verification'
@Injectable()
export class NumberVerificationService {
	constructor(
		private readonly api: Api,
		private readonly logger: Logger,
		@InjectConfig(ApilayerConfigDto) private readonly configService: ApilayerConfigDto,
	) {}

	async verify(phone_number: string, iso2?: string): Promise<NumberVerification> {
		const domain = 'app::apilayer::number_verification::validate'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return mock
		}

		phone_number = phone_number.replace(/\D/g, '') // remove all non-digits

		if (iso2 && !phone_number.startsWith(dailcodes[iso2 as keyof typeof dailcodes])) {
			phone_number = `${dailcodes[iso2 as keyof typeof dailcodes]}${phone_number}`
		}

		const config = {
			headers: {
				apikey: this.configService.APILAYER_API_KEY,
			},
		}

		const url = `${endpoint}/validate?number=${phone_number}`

		return await this.api.get(domain, url, config)
	}
}
