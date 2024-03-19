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
import { WebsocketService } from '../../websocket/websocket.service'

@Injectable()
export class BeaconPushService {
	constructor(
		@Inject(Query) private readonly query: Query<BeaconPush>,
		@InjectRepository(BeaconPush) private readonly repository: Repository<BeaconPush>,
		private readonly logger: Logger,
		@InjectConfig(BeaconConfigDto) private readonly configService: BeaconConfigDto,
		readonly websocketService: WebsocketService,
	) {}

	async create(message: BeaconMessageDto): Promise<boolean | undefined> {
		const domain = 'utils::beacon::push::create'

		// if (Env.IsTest()) {
		// 	this.logger.verbose(`[${domain}] Skipping as testing`)
		// 	return true
		// }

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
			app_integration_name: 'websocket',
			status: BeaconStatus.SENT,
			pushed_at: new Date(),
		})

		
	}
}
