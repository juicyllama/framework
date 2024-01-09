import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { BeaconMessageDto } from '../beacon.dto'
import { BeaconEmail } from './email.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import { Env, Logger, Modules } from '@juicyllama/utils'
import { LazyModuleLoader } from '@nestjs/core'
import { Query } from '../../../utils/typeorm/Query'
import { BeaconStatus } from '../beacon.enums'
import { AppIntegrationName } from '../../../types'

@Injectable()
export class BeaconEmailService {
	constructor(
		@Inject(forwardRef(() => Query)) private readonly query: Query<BeaconEmail>,
		@InjectRepository(BeaconEmail) private readonly repository: Repository<BeaconEmail>,
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => LazyModuleLoader)) private readonly lazyModuleLoader: LazyModuleLoader,
	) {}

	async create(message: BeaconMessageDto): Promise<boolean> {
		const domain = 'utils::beacon::email::create'

		this.logger.debug(`[${domain}] Beacon Email`, message)

		if (Env.IsTest()) {
			this.logger.verbose(`[${domain}] Skipping as testing`)
			return
		}

		if (!message.communication.email) {
			this.logger.error(`The message must include communication.email details`)
			return
		}
		if (!message.communication.email.from) {
			message.communication.email.from = {
				email: this.configService.get<string>('beacon.SYSTEM_EMAIL_ADDRESS'),
				name: this.configService.get<string>('beacon.SYSTEM_EMAIL_NAME'),
			}
		}

		if (message.unique && (await this.query.findOne(this.repository, { where: { unique: message.unique } }))) {
			this.logger.log(`[${domain}] Skipping as message is already sent`)
			return
		}

		const email_data = {
			communication: message.communication,
			subject: message.subject,
			markdown: message.markdown,
			cta: message.cta,
			unique: message.unique,
		}

		const email = await this.query.create(this.repository, email_data)

		let service: any

		if (Modules.aws.isInstalled) {
			const { AwsSesModule, AwsSesService } = await Modules.aws.load()

			try {
				const awsSesModule = await this.lazyModuleLoader.load(() => AwsSesModule)
				service = awsSesModule.get(AwsSesService)

				const result = await service.send(email)

				if (result) {
					await this.update(email.email_id, {
						app_integration_name: AppIntegrationName.aws,
						status: BeaconStatus.SENT,
						sent_at: new Date(),
					})
					return true
				} else {
					await this.update(email.email_id, {
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
			this.logger.error(`No email app installed, options are: ${Modules.aws.name}`)
			return false
		}
	}

	async update(email_id: number, data: DeepPartial<BeaconEmail>): Promise<BeaconEmail> {
		return await this.query.update(this.repository, {
			email_id: email_id,
			...data,
		})
	}
}
