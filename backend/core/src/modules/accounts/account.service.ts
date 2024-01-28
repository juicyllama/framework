import { Logger, Random, SupportedCurrencies } from '@juicyllama/utils'
import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'
import { BaseService } from '../../helpers/baseService'
import { Query } from '../../utils/typeorm/Query'
import { AuthService } from '../auth/auth.service'
import { BeaconService } from '../beacon/beacon.service'
import { StorageFileFormat, StorageType } from '../storage/storage.enums'
import { StorageService } from '../storage/storage.service'
import { User } from '../users/users.entity'
import { UserRole } from '../users/users.enums'
import { UsersService } from '../users/users.service'
import { OnboardAccountDto, OnboardAdditionalAccountDto, SuccessAccountDto } from './account.dto'
import { Account } from './account.entity'
import { AccountHooks } from './account.hooks'

const E = Account
type T = Account

@Injectable()
export class AccountService extends BaseService<T> {
	constructor(
		@Inject(Query) readonly query: Query<T>,
		@InjectRepository(E) readonly repository: Repository<T>,
		readonly logger: Logger,
		@Inject(forwardRef(() => AuthService)) readonly authService: AuthService,
		readonly beaconService: BeaconService,
		readonly storageService: StorageService,
		@Inject(forwardRef(() => UsersService)) readonly usersService: UsersService,
		readonly accountHooks: AccountHooks,
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

		if (!data.account_name) {
			data.account_name = Random.Words(' ', 3, 'noun', 'capitalize')
		}

		const SYSTEM_DEFAULT_CURRENCY = <keyof typeof SupportedCurrencies>process.env.SYSTEM_DEFAULT_CURRENCY

		const account_data = {
			account_name: data.account_name,
			currency:
				data.currency ??
				(SYSTEM_DEFAULT_CURRENCY && SupportedCurrencies[SYSTEM_DEFAULT_CURRENCY]) ??
				SupportedCurrencies.USD,
		}

		const account = await super.create(account_data)

		let user = await this.usersService.findOneByEmail(data.owners_email)

		if (!user) {
			let password_reset = false

			if (!data.owners_password) {
				data.owners_password = Random.Password(16)
				password_reset = true
			}

			const onboardOwner = {
				email: data.owners_email,
				password: data.owners_password,
				first_name: data.owners_first_name,
				last_name: data.owners_last_name,
				password_reset: password_reset,
				accounts: [account],
			}
			user = await this.usersService.create(onboardOwner)
			user = await this.authService.assignRole(user, account, UserRole.OWNER)
			this.logger.debug(`[${domain}] New account owner created`, user)

			if (password_reset) {
				await this.accountHooks.TempPassowrd(user, data.owners_password)
				this.logger.debug(`[${domain}] Temporary password email to owner`)
			}
		} else {
			this.logger.debug(`[${domain}] New account created by existing user`, user)
			if (!user.accounts) {
				user.accounts = []
			}
			user.accounts.push(account)
			user = await this.usersService.update(user)
			user = await this.authService.assignRole(user, account, UserRole.OWNER)
			await this.authService.clearUserAuthCache(user)
		}

		await this.accountHooks.Created(account, user)

		const access_token = await this.authService.getAccessToken(user)

		delete user.password

		return {
			account: account,
			owner: user,
			access_token: access_token,
		}
	}

	/**
	 * Creates an additional account for an existing user
	 * @param user
	 * @param data
	 */

	async onboardAdditional(user: User, data: OnboardAdditionalAccountDto): Promise<SuccessAccountDto> {
		const domain = 'core::account::service::onboardAdditional'
		const SYSTEM_DEFAULT_CURRENCY = <keyof typeof SupportedCurrencies>process.env.SYSTEM_DEFAULT_CURRENCY

		const account_data = {
			account_name: data.account_name,
			currency:
				data.currency ??
				(SYSTEM_DEFAULT_CURRENCY && SupportedCurrencies[SYSTEM_DEFAULT_CURRENCY]) ??
				SupportedCurrencies.USD,
		}

		const account = await super.create(account_data)

		this.logger.debug(`[${domain}] New account created by existing user`, {
			user: user,
			account: account,
		})

		if (!user.accounts) {
			user.accounts = []
		}
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
		const result = await this.storageService.write({
			location: `accounts/${account.account_id}/avatar/${file.originalname}`,
			permissions: StorageType.PUBLIC,
			format: StorageFileFormat.Express_Multer_File,
			file: file,
		})

		if (result?.url) {
			account.avatar_image_url = result.url
			account = await super.update(account)
			return account
		}

		this.logger.error(`Error saving avatar`, {
			account: account,
			result: result,
		})
		throw new BadRequestException(`Error saving avatar`)
	}

	async transfer(account: Account, old_owner: User, new_owner: User) {
		const new_owner_role = await this.authService.assignRole(new_owner, account, UserRole.OWNER)
		const old_owner_role = await this.authService.assignRole(old_owner, account, UserRole.ADMIN)
		return !!(new_owner_role.user_id && old_owner_role.user_id)
	}
	async getOwner(account_id: number): Promise<User> {
		const role = await this.authService.findOne({
			where: {
				account_id: account_id,
				role: UserRole.OWNER,
			},
		})
		if (!role?.user) {
			throw new BadRequestException(`Account #${account_id} has no owner`)
		}
		return role.user
	}

	async remove(account: T): Promise<T> {
		return await super.remove(account)
	}
}
