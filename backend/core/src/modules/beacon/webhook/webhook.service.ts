import { Env, Logger } from '@juicyllama/utils'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Query } from '../../../utils/typeorm/Query'
import { BeaconMessageDto } from '../beacon.dto'
import { BeaconWebhook } from './webhook.entity'

type T = BeaconWebhook

@Injectable()
export class BeaconWebhookService {
	constructor(
		readonly query: Query<T>,
		@InjectRepository(BeaconWebhook) readonly repository: Repository<T>,
		private readonly logger: Logger,
	) {}

	async create(message: BeaconMessageDto): Promise<boolean | undefined> {
		const domain = 'utils::beacon::webhook::create'

		if (Env.IsTest()) {
			this.logger.verbose(`[${domain}] Skipping asd testing`)
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

		return
	}
}
