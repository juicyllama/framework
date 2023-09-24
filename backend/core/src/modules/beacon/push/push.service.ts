import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { BeaconMessageDto } from '../beacon.dto.js'
import { BeaconPush } from './push.entity.js'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Env, Logger, Modules } from '@juicyllama/utils'
import { BeaconStatus } from '../beacon.enums.js'
import { ConfigService } from '@nestjs/config'
import { Query } from '../../../utils/typeorm/Query.js'

@Injectable()
export class BeaconPushService {
	constructor(
		@Inject(forwardRef(() => Query)) private readonly query: Query<BeaconPush>,
		@InjectRepository(BeaconPush) private readonly repository: Repository<BeaconPush>,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
	) {}

	async create(message: BeaconMessageDto): Promise<boolean> {
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

		if(!push){
			this.logger.error(`[${domain}] Failed to create push`, message)
			return false
		}

		let service: any
		let app_integration_name: string

		if (Modules.isInstalled('pusher')) {
			app_integration_name = 'pusher'
			service = require('pusher')

			if (
				!this.configService.get<string>('beacon.PUSHER_APP_ID') ||
				!this.configService.get<string>('beacon.PUSHER_APP_KEY') ||
				!this.configService.get<string>('beacon.PUSHER_APP_SECRET') ||
				!this.configService.get<string>('beacon.PUSHER_APP_CLUSTER') ||
				!this.configService.get<string>('beacon.PUSHER_CHANNEL')
			) {
				this.logger.warn(`[${domain}] Missing pusher config details`, {
					config: {
						app_id: this.configService.get<string>('beacon.PUSHER_APP_ID'),
						app_key: this.configService.get<string>('beacon.PUSHER_APP_KEY'),
						app_secret: '*********',
						app_cluster: this.configService.get<string>('beacon.PUSHER_APP_CLUSTER'),
						channel: this.configService.get<string>('beacon.PUSHER_CHANNEL'),
					},
				})
				return false
			}

			const pusher = new service({
				appId: this.configService.get<string>('beacon.PUSHER_APP_ID'),
				key: this.configService.get<string>('beacon.PUSHER_APP_KEY'),
				secret: this.configService.get<string>('beacon.PUSHER_APP_SECRET'),
				cluster: this.configService.get<string>('beacon.PUSHER_APP_CLUSTER'),
				useTLS: this.configService.get<string>('beacon.PUSHER_USE_TLS'),
			})

			pusher.trigger(
				this.configService.get<string>('beacon.PUSHER_CHANNEL'),
				message.communication.event,
				message.options?.skipJsonSave ? null : message.json ?? null,
			)

			this.logger.log(
				`[${domain}] Message Sent! Channel = ${this.configService.get<string>(
					'beacon.PUSHER_CHANNEL',
				)} | event = ${message.communication.event} | data = ${JSON.stringify(
					message.options?.skipJsonSave ? null : message.json ?? null,
				)}`,
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
