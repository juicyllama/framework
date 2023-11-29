import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { BeaconMessageDto } from '../beacon.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import { Env, Logger, Modules } from '@juicyllama/utils'
import { LazyModuleLoader } from '@nestjs/core'
import { Query } from '../../../utils/typeorm/Query'
import { BeaconSms } from './sms.entity'
import { AppIntegrationName } from '../../../types'
import { BeaconStatus } from '../beacon.enums'

@Injectable()
export class BeaconSmsService {
	constructor(
		@Inject(forwardRef(() => Query)) private readonly query: Query<BeaconSms>,
		@InjectRepository(BeaconSms) private readonly repository: Repository<BeaconSms>,
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => LazyModuleLoader)) private readonly lazyModuleLoader: LazyModuleLoader,
	) {}

	async create(message: BeaconMessageDto): Promise<boolean> {
		const domain = 'core::beacon::sms::create'

		this.logger.debug(`[${domain}] Beacon SMS`, message)

		if (Env.IsTest()) {
			this.logger.verbose(`[${domain}] Skipping as testing`)
			return
		}

		if (!message.communication.phone) {
			this.logger.error(`The message must include communication.phone number`)
			return
		}

		if (message.unique && (await this.query.findOne(this.repository, { where: { unique: message.unique } }))) {
			this.logger.log(`[${domain}] Skipping as message is already sent`)
			return
		}

		const sms_data = {
			communication: message.communication,
			markdown: message.markdown,
			unique: message.unique,
		}

		const sms = await this.query.create(this.repository, sms_data)

		let service: any

		if (Modules.aws.isInstalled) {
			//@ts-ignore
			const { AwsSnsModule, AwsSnsService } = await Modules.aws.load()

			try {
				const awsSnsModule = await this.lazyModuleLoader.load(() => AwsSnsModule)
				service = awsSnsModule.get(AwsSnsService)

				const result = await service.send(sms)

				if (result) {
					await this.update({
						sms_id: sms.sms_id,
						app_integration_name: AppIntegrationName.aws,
						status: BeaconStatus.SENT,
						sent_at: new Date(),
					})
					return true
				} else {
					await this.update({
						sms_id: sms.sms_id,
						app_integration_name: AppIntegrationName.aws,
						status: BeaconStatus.ERROR,
					})
					return false
				}
			} catch (e: any) {
				this.logger.error(`[${domain}] ${e.message}`, e)
				return false
			}
		}

		if (!service) {
			this.logger.error(`No email app installed, options are: @juicyllama/app-aws`)
			return false
		}
	}

	async update(data: DeepPartial<BeaconSms>): Promise<BeaconSms> {
		return await this.query.update(this.repository, data)
	}
}
