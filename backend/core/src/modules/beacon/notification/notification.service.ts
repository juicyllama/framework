import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { BeaconNotification } from './notification.entity.js'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { Query } from '../../../utils/typeorm/Query.js'
import { BaseService } from '../../../helpers/index.js'
import { BeaconMessageDto } from '../beacon.dto.js'
import { Logger } from '@juicyllama/utils'
import { User } from '../../users/users.entity.js'
import { UsersService } from '../../users/users.service.js'
import { BeaconPushService } from '../push/push.service.js'
import { UserRole } from '../../users/users.enums.js'
import { AuthService } from '../../auth/auth.service.js'

const E = BeaconNotification
type T = BeaconNotification

@Injectable()
export class BeaconNotificationService extends BaseService<T> {
	constructor(
		@Inject(forwardRef(() => Query)) readonly query: Query<T>,
		@InjectRepository(E) readonly repository: Repository<T>,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => BeaconPushService)) private readonly beaconPushService: BeaconPushService,
		@Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
		@Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
	) {
		super(query, repository)
	}

	async create(message: BeaconMessageDto): Promise<T> {
		const domain = 'utils::beacon::notification::create'

		this.logger.debug(`[${domain}] Beacon Notification`, message)

		let users: User[] = await this.usersService.findAll({
			where: {
				roles: {
					account: {
						account_id: message.account.account_id,
					},
					role: message.options?.roles ? In(message.options?.roles) : null,
				},
			},
		})

		//If owner, add god users also
		if (message.options?.roles.includes(UserRole.OWNER)) {
			const god_users = await this.authService.getGodUsers()
			users = [...users, ...god_users]
		}

		if (message.unique && (await this.query.findOne(this.repository, { where: { unique: message.unique } }))) {
			this.logger.log(`[${domain}] Skipping as message is already sent`)
			return
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
				event: `account_${message.account.account_id}_beacon_notification`,
			},
		})

		return notification
	}
}
