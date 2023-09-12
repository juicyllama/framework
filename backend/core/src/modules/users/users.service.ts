import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Logger, Security } from '@juicyllama/utils'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AccountService } from '../accounts/account.service'
import { AuthService } from '../auth/auth.service'
import { BaseService } from '../../helpers/baseService'
import { StorageService } from '../storage/storage.service'
import { StorageFileFormat, StorageFileType } from '../storage/storage.enums'
import { BeaconService } from '../beacon/beacon.service'
import { UserAvatarType, UserRole } from './users.enums'
import { Query } from '../../utils/typeorm/Query'
import { Account } from '../accounts/account.entity'
import { UsersHooks } from './users.hooks'
import { CreateUserDto } from './users.dto'
import { E, T } from './users.constants'

@Injectable()
export class UsersService extends BaseService<T> {
	constructor(
		@Inject(forwardRef(() => Query)) readonly query: Query<T>,
		@InjectRepository(E) readonly repository: Repository<T>,
		@Inject(forwardRef(() => Logger)) readonly logger: Logger,
		@Inject(forwardRef(() => AccountService)) readonly accountService: AccountService,
		@Inject(forwardRef(() => AuthService)) readonly authService: AuthService,
		@Inject(forwardRef(() => BeaconService)) readonly beaconService: BeaconService,
		@Inject(forwardRef(() => StorageService)) readonly storageService: StorageService,
		@Inject(forwardRef(() => UsersHooks)) readonly usersHooks: UsersHooks,
	) {
		super(query, repository, { beacon: beaconService })
	}

	async create(data: Partial<T>): Promise<T> {
		if (data.password) {
			data.password = Security.hashPassword(data.password)
		} else {
			data.password = Security.hashPassword('TMP_PASS_THAT_WONT_BE_USED')
		}

		const user = await this.repository.create(data)
		return await this.repository.save(user)
	}

	async invite(account: Account, newUser: CreateUserDto): Promise<T> {
		let user = await this.findOneByEmail(newUser.email)
		if (user) {
			const account_exists = user.accounts.find(a => a.account_id === account.account_id)
			if (!account_exists) {
				user.accounts.push(account)
				await this.usersHooks.account_added(account, user)
				user = await this.update(user)
				await this.authService.assignRole(user, account, UserRole.VIEWER)
			}
			return user
		} else {
			user = await this.create({
				...newUser,
				accounts: [account],
			})
			await this.usersHooks.invited(account, user)
			delete user.password
			return user
		}
	}

	async findOneByEmail(email: string) {
		return await super.findOne({ where: { email } })
	}

	async update(data: Partial<T>): Promise<T> {
		if (data.password) {
			data.password = Security.hashPassword(data.password)
		}

		await this.repository.save(data)
		return await this.query.findOneById(this.repository, data.user_id)
	}

	async uploadAvatar(user, file): Promise<T> {
		const result = await this.storageService.write(
			`users/${user.user_id}/avatar/${file.originalname}`,
			StorageFileType.PUBLIC,
			StorageFileFormat.Express_Multer_File,
			file,
		)
		if (result === null || result === void 0 ? void 0 : result.Location) {
			user = await this.query.update(this.repository, {
				user_id: user.user_id,
				avatar_type: UserAvatarType.IMAGE,
				avatar_image_url: result.Location,
			})
		}
		return user
	}

	async validateUser(email, pass): Promise<T> {
		const options = {
			where: {
				email: email,
				password: Security.hashPassword(pass),
			},
		}

		const user = await super.findOne(options)

		if (user) {
			delete user.password
		}

		return user
	}
	async validateEmail(email): Promise<T> {
		const where = {
			email: email,
			deleted_at: null,
		}
		const options = {
			where: where,
		}
		const user = await super.findOne(options)
		if (user) {
			delete user.password
		}
		return user
	}

	async getValidatedUserByEmail(email): Promise<T> {
		let user = await super.findOne({
			where: [{ email: email }],
		})
		this.authService.handleUserNotFoundException(user)
		user = await this.authService.processGodUser(user)
		if (user) {
			delete user.password
		}
		return user
	}
}
