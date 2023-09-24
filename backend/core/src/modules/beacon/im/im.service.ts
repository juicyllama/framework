import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { BeaconMessageDto } from '../beacon.dto.js'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import { Env, Logger, Modules } from '@juicyllama/utils'
import { LazyModuleLoader } from '@nestjs/core'
import { Query } from '../../../utils/typeorm/Query.js'
import { BeaconIm } from './im.entity.js'
import { AppIntegrationName } from '../../../types/index.js'
import { BeaconStatus } from '../beacon.enums.js'

@Injectable()
export class BeaconImService {
	constructor(
		@Inject(forwardRef(() => Query)) private readonly query: Query<BeaconIm>,
		@InjectRepository(BeaconIm) private readonly repository: Repository<BeaconIm>,
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => LazyModuleLoader)) private readonly lazyModuleLoader: LazyModuleLoader,
	) {}

	async create(message: BeaconMessageDto): Promise<boolean> {
		const domain = 'core::beacon::im::create'

		this.logger.debug(`[${domain}] Beacon IM`, message)

		if (Env.IsTest()) {
			this.logger.verbose(`[${domain}] Skipping as testing`)
			return
		}

		if (message.unique && (await this.query.findOne(this.repository, { where: { unique: message.unique } }))) {
			this.logger.log(`[${domain}] Skipping as message is already sent`)
			return
		}

		const im_data = {
			communication: message.communication,
			markdown: message.markdown,
			unique: message.unique,
		}

		const im = await this.query.create(this.repository, im_data)

		let service: any

		if (Modules.isInstalled('@juicyllama/app-slack')) {
			//@ts-ignore
			const { SlackModule, SlackService } = await import('@juicyllama/app-slack')

			try {
				const slackModule = await this.lazyModuleLoader.load(() => SlackModule)
				service = slackModule.get(SlackService)

				const slackMessage = {
					channel: message.communication.im.slack.channel,
					text: message.markdown,
					mrkdwn: message.markdown,
				}

				const result = await service.sendMessage(slackMessage)

				await this.update({
					im_id: im.im_id,
					app_integration_name: AppIntegrationName.slack,
					app_im_id: result.ts,
					status: BeaconStatus.SENT,
					sent_at: new Date(),
				})
				return true
			} catch (e: any) {
				this.logger.error(`[${domain}] ${e.message}`, e)
				await this.update({
					im_id: im.im_id,
					app_integration_name: AppIntegrationName.slack,
					status: BeaconStatus.ERROR,
				})
				return false
			}
		}

		if (!service) {
			this.logger.error(`No im app installed, options are: @juicyllama/app-slack`)
			return false
		}
	}

	async update(data: DeepPartial<BeaconIm>): Promise<BeaconIm> {
		return await this.query.update(this.repository, data)
	}
}

