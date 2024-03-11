import { Env, Logger, Modules } from '@juicyllama/utils'
import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import _ from 'lodash'
import { Repository } from 'typeorm'
import { Query } from '../../../utils/typeorm/Query'
import { BeaconMessageDto } from '../beacon.dto'
import { BeaconStatus } from '../beacon.enums'
import { BeaconPush } from './push.entity'
import { BeaconConfigDto } from '../../../configs/beacon.config.dto'
import { InjectConfig } from '../../config'

@Injectable()
export class BeaconPushService {
	constructor(
		@Inject(Query) private readonly query: Query<BeaconPush>,
		@InjectRepository(BeaconPush) private readonly repository: Repository<BeaconPush>,
		private readonly logger: Logger,
		@InjectConfig(BeaconConfigDto) private readonly configService: BeaconConfigDto,
	) {}

	async create(message: BeaconMessageDto): Promise<boolean | undefined> {
		const domain = 'utils::beacon::push::create'

		if (Env.IsTest()) {
			this.logger.verbose(`[${domain}] Skipping as testing`)
			return true
		}

		if (!message.communication.event) {
			this.logger.error(`The message must include communication.event details`)
			return false
		}

		if (message.unique && (await this.query.findOne(this.repository, { where: { unique: message.unique } }))) {
			this.logger.log(`[${domain}] Skipping as message is already sent`)
			return
		}

		const push = await this.query.create(this.repository, {
			event: message.communication.event,
			data: message.options?.skipJsonSave ? null : message.json ?? null,
			unique: message.unique,
		})

		if (!push) {
			this.logger.error(`[${domain}] Failed to create push`, message)
			return false
		}

		let service: any
		let app_integration_name: string

		if (Modules.pusher.isInstalled) {
			app_integration_name = 'pusher'
			service = await Modules.pusher.load()
			const configKeys: (keyof BeaconConfigDto)[] = [
				'PUSHER_APP_ID',
				'PUSHER_APP_KEY',
				'PUSHER_APP_SECRET',
				'PUSHER_APP_CLUSTER',
				'PUSHER_CHANNEL',
			]
			if (configKeys.find(key => _.isUndefined(this.configService[key]))) {
				this.logger.warn(`[${domain}] Missing pusher config details`, {
					config: {
						app_id: this.configService.PUSHER_APP_ID,
						app_key: this.configService.PUSHER_APP_KEY,
						app_secret: '*********',
						app_cluster: this.configService.PUSHER_APP_CLUSTER,
						channel: this.configService.PUSHER_CHANNEL,
					},
				})
				return false
			}

			const pusher = new service({
				appId: this.configService.PUSHER_APP_ID,
				key: this.configService.PUSHER_APP_KEY,
				secret: this.configService.PUSHER_APP_SECRET,
				cluster: this.configService.PUSHER_APP_CLUSTER,
				useTLS: this.configService.PUSHER_USE_TLS,
			})

			pusher.trigger(
				this.configService.PUSHER_CHANNEL,
				message.communication.event,
				message.options?.skipJsonSave ? null : message.json ?? null,
			)

			this.logger.log(
				`[${domain}] Message Sent! Channel = ${this.configService.PUSHER_CHANNEL} | event = ${
					message.communication.event
				} | data = ${JSON.stringify(message.options?.skipJsonSave ? null : message.json ?? null)}`,
			)

			await this.query.update(this.repository, {
				push_id: push.push_id,
				app_integration_name: app_integration_name,
				status: BeaconStatus.SENT,
				pushed_at: new Date(),
			})

			return true
		}

		if (!service) {
			this.logger.warn(`No push app installed`)
			return false
		}
	}
}
