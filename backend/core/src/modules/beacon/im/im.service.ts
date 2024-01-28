import { Env, Logger, Modules } from '@juicyllama/utils'
import { Inject, Injectable } from '@nestjs/common'
import { LazyModuleLoader } from '@nestjs/core'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'
import { AppIntegrationName } from '../../../types'
import { Query } from '../../../utils/typeorm/Query'
import { BeaconMessageDto } from '../beacon.dto'
import { BeaconStatus } from '../beacon.enums'
import { BeaconIm } from './im.entity'

@Injectable()
export class BeaconImService {
	constructor(
		@Inject(Query) private readonly query: Query<BeaconIm>,
		@InjectRepository(BeaconIm) private readonly repository: Repository<BeaconIm>,
		private readonly logger: Logger,
		private readonly lazyModuleLoader: LazyModuleLoader,
	) {}

	async create(message: BeaconMessageDto): Promise<boolean | undefined> {
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

		if (Modules.slack.isInstalled) {
			const { SlackModule, SlackService } = await Modules.slack.load()

			try {
				const slackModule = await this.lazyModuleLoader.load(() => SlackModule)
				service = slackModule.get(SlackService)

				const slackMessage = {
					channel: message.communication?.im?.slack.channel,
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
