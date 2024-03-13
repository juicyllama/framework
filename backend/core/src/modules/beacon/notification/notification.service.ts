import { Logger } from '@juicyllama/utils'
import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService } from '../../../helpers'
import { Query } from '../../../utils/typeorm/Query'
import { AuthService } from '../../auth/auth.service'
import { User } from '../../users/users.entity'
import { UsersService } from '../../users/users.service'
import { BeaconMessageDto } from '../beacon.dto'
import { BeaconPushService } from '../push/push.service'
import { BeaconNotification } from './notification.entity'

const E = BeaconNotification
type T = BeaconNotification

@Injectable()
export class BeaconNotificationService extends BaseService<T> {
	constructor(
		@Inject(Query) readonly query: Query<T>,
		@InjectRepository(E) readonly repository: Repository<T>,
		private readonly logger: Logger,
		private readonly beaconPushService: BeaconPushService,
		@Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
		@Inject(forwardRef(() => UsersService))
		private readonly usersService: UsersService,
	) {
		super(query, repository)
	}

	async create(message: BeaconMessageDto): Promise<T> {
		const domain = 'utils::beacon::notification::create'

		this.logger.debug(`[${domain}] Beacon Notification`, message)

		const users: User[] = await this.usersService.findAll({
			where: {
				accounts: {
					account_id: message.account?.account_id,
				},
				//role: message.options?.roles ? In(message.options?.roles) : null, //TODO: make work
			},
		})

		if (message.unique) {
			const olderMsg = await this.query.findOne(this.repository, { where: { unique: message.unique } })
			if (olderMsg) {
				this.logger.log(`[${domain}] Skipping as message is already sent`)
				return olderMsg
			}
		}

		const notification = await super.create({
			account: message.account,
			users: users,
			subject: message.subject,
			markdown: message.markdown,
			unique: message.unique,
		})

		await this.beaconPushService.create({
			methods: {
				push: true,
			},
			communication: {
				event: `account_${message.account?.account_id}_beacon_notification`,
			},
		})

		return notification
	}
}
