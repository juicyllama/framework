import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Api, Logger, Env } from '@juicyllama/utils'
import { ConfigService } from '@nestjs/config'
import * as dailcodes from '../../assets/codes.json'
import mock from './mock'
import { NumberVerification } from './number.verification.dto'

const endpoint = 'https://api.apilayer.com/number_verification'
@Injectable()
export class NumberVerificationService {
	constructor(
		@Inject(forwardRef(() => Api)) private readonly api: Api,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
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
				apikey: this.configService.get<string>('apilayer.apikey'),
			},
		}

		const url = `${endpoint}/validate?number=${phone_number}`

		return await this.api.get(domain, url, config)
	}
}
