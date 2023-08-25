import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common'
import { BeaconService } from '../beacon/beacon.service'
import { Account } from './account.entity'
import { Logger, SupportedCurrencies } from '@juicyllama/utils'
import { BaseService } from '../../helpers/baseService'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'
import { Query } from '../../utils/typeorm/Query'
import { StorageService } from '../storage/storage.service'
import { StorageFileFormat, StorageFileType } from '../storage/storage.enums'
import { AuthService } from '../auth/auth.service'
import { UsersService } from '../users/users.service'
import { UserRole } from '../users/users.enums'
import { OnboardAccountDto, OnboardAdditionalAccountDto, SuccessAccountDto } from './account.dto'
import { AccountHooks } from './account.hooks'
import { User } from '../users/users.entity'

const E = Account
type T = Account

@Injectable()
export class AccountService extends BaseService<T> {
	constructor(
		@Inject(forwardRef(() => Query)) readonly query: Query<T>,
		@InjectRepository(E) readonly repository: Repository<T>,
		@Inject(forwardRef(() => Logger)) readonly logger: Logger,
		@Inject(forwardRef(() => AuthService)) readonly authService: AuthService,
		@Inject(forwardRef(() => BeaconService)) readonly beaconService: BeaconService,
		@Inject(forwardRef(() => StorageService)) readonly storageService: StorageService,
		@Inject(forwardRef(() => UsersService)) readonly usersService: UsersService,
		@Inject(forwardRef(() => AccountHooks)) readonly accountHooks: AccountHooks,
	) {
		super(query, repository, { beacon: beaconService })
	}

	async create(data: DeepPartial<T>): Promise<T> {
		const domain = 'core::account::service::create'
		this.logger.warn(`[${domain}] Application needs to use onboard and not create`, data)
		throw new BadRequestException(`Use onboard instead of create`)
	}

	/**
	 * Creates a new account and owner or if exists assigns owner to new account
	 * @param data
	 */
	async onboard(data: OnboardAccountDto): Promise<SuccessAccountDto> {
		const domain = 'core::account::service::onboard'

		const account_data = {
			account_name: data.account_name,
			currency:
				data.currency ?? SupportedCurrencies[process.env.SYSTEM_DEFAULT_CURRENCY] ?? SupportedCurrencies.USD,
		}

		const account = await super.create(account_data)

		let user = await this.usersService.findOneByEmail(data.owners_email)

		if (!user) {
			const onboardOwner = {
				email: data.owners_email,
				password: data.owners_password,
				first_name: data.owners_first_name,
				last_name: data.owners_last_name,
				password_reset: false,
				accounts: [account],
			}
			user = await this.usersService.create(onboardOwner)
			user = await this.authService.assignRole(user, account, UserRole.OWNER)
			this.logger.debug(`[${domain}] New account owner created`, user)
		} else {
			this.logger.debug(`[${domain}] New account created by existing user`, user)
			user.accounts.push(account)
			user = await this.usersService.update(user)
			user = await this.authService.assignRole(user, account, UserRole.OWNER)
			await this.authService.clearUserAuthCache(user)
		}

		await this.accountHooks.Created(account, user)
		delete user.password

		return {
			account: account,
			owner: user,
		}
	}

	/**
	 * Creates an additional account for an existing user
	 * @param user
	 * @param data
	 */

	async onboardAdditional(user: User, data: OnboardAdditionalAccountDto): Promise<SuccessAccountDto> {
		const domain = 'core::account::service::onboardAdditional'

		const account_data = {
			account_name: data.account_name,
			currency:
				data.currency ?? SupportedCurrencies[process.env.SYSTEM_DEFAULT_CURRENCY] ?? SupportedCurrencies.USD,
		}

		const account = await super.create(account_data)

		this.logger.debug(`[${domain}] New account created by existing user`, {
			user: user,
			account: account,
		})

		user.accounts.push(account)
		user = await this.usersService.update(user)
		user = await this.authService.assignRole(user, account, UserRole.OWNER)
		await this.authService.clearUserAuthCache(user)

		await this.accountHooks.Created(account, user)
		delete user.password

		return {
			account: account,
			owner: user,
		}
	}

	async uploadAvatar(account: T, file: Express.Multer.File): Promise<T> {
		const result = await this.storageService.write(
			`accounts/${account.account_id}/avatar/${file.originalname}`,
			StorageFileType.PUBLIC,
			StorageFileFormat.Express_Multer_File,
			file,
		)

		if (result?.Location) {
			account.avatar_image_url = result.Location
			account = await super.update(account)
			return account
		}

		this.logger.error(`Error saving avatar`, {
			account: account,
			result: result,
		})
	}

	async transfer(account, old_owner, new_owner) {
		const new_owner_role = await this.authService.assignRole(new_owner, account, UserRole.OWNER)
		const old_owner_role = await this.authService.assignRole(old_owner, account, UserRole.ADMIN)
		return !!(new_owner_role.user_id && old_owner_role.user_id)
	}
	async getOwner(account) {
		const role = await this.authService.findOne({
			where: {
				account: {
					account_id: account.account_id,
				},
				role: UserRole.OWNER,
			},
		})
		return role.user
	}

	async remove(account: T): Promise<T> {
		return await super.remove(account)
	}
}
