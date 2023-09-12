import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Api, Logger, Env } from '@juicyllama/utils'
import { ConfigService } from '@nestjs/config'
import { MONGODB, Query } from '@juicyllama/core'
import { NumberVerification } from './number.verification.entity.mongo'
import * as dailcodes from '../../assets/codes.json'
import mock from './mock'

type T = NumberVerification
const endpoint = 'https://api.apilayer.com/number_verification'
@Injectable()
export class NumberVerificationService {
	constructor(
		@Inject(forwardRef(() => Api)) private readonly api: Api,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => Query)) private readonly query: Query<T>,
		@InjectRepository(NumberVerification, MONGODB) private readonly repository: Repository<T>,
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
	) {}

	async verify(phone_number: string, iso2?: string): Promise<T> {
		const domain = 'app::apilayer::number_verification::validate'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return mock
		}

		phone_number = phone_number.replace(/\D/g, '') // remove all non-digits

		if (iso2 && !phone_number.startsWith(dailcodes[iso2])) {
			phone_number = `${dailcodes[iso2]}${phone_number}`
		}

		const result = await this.query.findOne(this.repository, {
			where: {
				number: phone_number,
			},
		})

		if (result) {
			const cachedDate = new Date()
			cachedDate.setDate(cachedDate.getDate() - 365)

			// if the number is cached and is not older than cachedDate
			if (cachedDate < result.created_at) {
				this.logger.debug(`[${domain}] Result found in the data lake`)
				return result
			}
		}

		this.logger.debug(`[${domain}] Result not found in the data lake or is outdated, calling API`)

		const config = {
			headers: {
				apikey: this.configService.get<string>('apilayer.apikey'),
			},
		}

		const url = `${endpoint}/validate?number=${phone_number}`

		const api_result = <T>await this.api.get(domain, url, config)

		const numberVerification = await this.query.create(this.repository, {
			...api_result,
			number: phone_number,
		})
		this.logger.debug(`[${domain}] Result added into the data lake, calling API`, numberVerification)
		return numberVerification
	}
}
