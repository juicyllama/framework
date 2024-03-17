import {
	CachePeriod,
	Enums,
	Env,
	File,
	JLCache,
	Logger,
	Modules,
	OTP,
	Strings,
	SuccessResponseDto,
} from '@juicyllama/utils'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import {
	BadRequestException,
	ForbiddenException,
	ImATeapotException,
	Inject,
	Injectable,
	NotFoundException,
	UnauthorizedException,
	forwardRef,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Cache } from 'cache-manager'
import { pick } from 'lodash'
import { In, Like, Repository } from 'typeorm'
import { BaseService } from '../../helpers'
import { Query } from '../../utils/typeorm/Query'
import { Account } from '../accounts/account.entity'
import { UserAccount } from './user-account.entity'
import { AccountService } from '../accounts/account.service'
import { BeaconService } from '../beacon/beacon.service'
import { SettingsService } from '../settings/settings.service'
import { User } from '../users/users.entity'
import { UserRole, UserRoleNum } from '../users/users.enums'
import { UsersService } from '../users/users.service'
import {
	AUTH_ACCOUNT_IDS,
	AUTH_ACCOUNT_ROLE,
	AUTH_CODE,
	DEFAULT_ACCESS_TOKEN_EXPIRY_MINUTES,
	DEFAULT_REFRESH_TOKEN_EXPIRY_DAYS,
} from './auth.constants'
import { ValidateCodeDto } from './dtos/login.dto'
import { CompletePasswordResetDto, InitiateResetPasswordDto } from './dtos/password.reset.dto'

const E = UserAccount
type T = UserAccount

type LoginPayload = {
	email: string
	user_id: number
	account_ids: number[]
}

@Injectable()
export class AuthService extends BaseService<T> {
	constructor(
		@Inject(Query) readonly query: Query<T>,
		@InjectRepository(E) readonly repository: Repository<T>,
		readonly logger: Logger,
		@Inject(forwardRef(() => AccountService)) readonly accountService: AccountService,
		@Inject(forwardRef(() => BeaconService))
		readonly beaconService: BeaconService,
		readonly settingsService: SettingsService,
		@Inject(forwardRef(() => UsersService)) readonly usersService: UsersService,
		readonly jwtService: JwtService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
	) {
		super(query, repository, { beacon: beaconService })
	}

	async assignRole(user: User, account: Account, role: UserRole): Promise<User> {
		const domain = 'core::auth::service::assignRole'

		let userRole = await this.getRole(user.user_id, account.account_id)

		if (!userRole) {
			userRole = await this.create({
				user_id: user.user_id,
				account_id: account.account_id,
				role,
			})
		} else {
			userRole.role = role
			userRole = await this.repository.save(userRole)
		}

		this.logger.debug(`[${domain}] User #${user.user_id} is now a ${role} of account #${account.account_id}!`)
		return user
	}

	async getAccessToken(user: User) {
		return this.jwtService.sign(await this.constructLoginPayload(user), { secret: process.env.JWT_KEY })
	}

	async createRefreshToken(user: User | LoginPayload) {
		const payload = user instanceof User ? await this.constructLoginPayload(user) : user
		const cleanedPayload = pick(payload, ['email', 'user_id', 'account_ids'])
		if (!process.env.JWT_REFRESH_KEY) {
			throw new Error('JWT_REFRESH_KEY not found')
		}
		return this.jwtService.sign(cleanedPayload, {
			secret: process.env.JWT_REFRESH_KEY,
			expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRY_DAYS || DEFAULT_REFRESH_TOKEN_EXPIRY_DAYS}d`,
		})
	}

	decodeRefreshToken(token: string): LoginPayload {
		if (!process.env.JWT_REFRESH_KEY) {
			throw new Error('JWT_REFRESH_KEY not found')
		}
		try {
			return this.jwtService.verify(token, {
				secret: process.env.JWT_REFRESH_KEY,
			})
		} catch (error) {
			throw new UnauthorizedException('Invalid refresh token')
		}
	}

	/**
	 * @param user
	 * @returns JWT access token
	 */
	async login(user: User | LoginPayload): Promise<string> {
		const payload = user instanceof User ? await this.constructLoginPayload(user) : user
		if (!['development', 'test'].includes(Env.get())) {
			let Bugsnag
			if (Modules.bugsnag.isInstalled) {
				Bugsnag = await Modules.bugsnag.load()
				Bugsnag.setUser(user.user_id, user.email)
			}
		}
		if (!process.env.JWT_KEY) {
			throw new Error('JWT_KEY not found')
		}
		await this.usersService.update({ user_id: user.user_id, last_login_at: new Date() })
		const cleanedPayload = pick(payload, ['email', 'user_id', 'account_ids'])
		return this.jwtService.sign(cleanedPayload, {
			secret: process.env.JWT_KEY,
			expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRY_MINUTES || DEFAULT_ACCESS_TOKEN_EXPIRY_MINUTES}m`,
		})
	}

	async constructLoginPayload(user: User): Promise<LoginPayload> {
		if (!user.accounts) {
			throw new ImATeapotException(`Missing accounts on login payload, go grab a cuppa while you seek help!`)
		}
		return {
			email: user.email,
			user_id: user.user_id,
			account_ids: await this.getAccountIds(user),
		}
	}
	async initiatePasswordReset(data: InitiateResetPasswordDto) {
		const user = await this.usersService.findOneByEmail(data.email)
		this.handleUserNotFoundException(user)
		const code = await this.generateVerificationCodeAndSavetoRedis(user)
		if (!code) {
			throw new BadRequestException(`Failed to generate verification code`)
		}
		await this.sendVerificationCode(user, <string>code)
		return !!user.user_id
	}

	/**
	 * @param data
	 * @returns JWT access token
	 */
	async completePasswordReset(data: CompletePasswordResetDto): Promise<string> {
		const user = await this.usersService.findOneByEmail(data.email)
		this.handleUserNotFoundException(user)
		const verificationCode = await this.getValidationCode(user)
		if (verificationCode && this.verificationCodeIsInvalid(verificationCode, data.code)) {
			throw new BadRequestException(
				'',
				'Your verification code is invalid or expired, please generate a new verification code',
			)
		}
		user.password = data.password
		user.password_reset = false

		await this.usersService.update(user)
		this.logger.log(`[CACHE][DELETE] USER_${user.user_id}_VALIDATION_CODE`)
		await this.cacheManager.del(`USER_${user.user_id}_VALIDATION_CODE`)

		return this.jwtService.sign(await this.constructLoginPayload(user), { secret: process.env.JWT_KEY })
	}
	async initiatePasswordlessLogin(data: InitiateResetPasswordDto) {
		const user = await this.usersService.findOneByEmail(data.email)
		this.handleUserNotFoundException(user)
		const code = await this.generateVerificationCodeAndSavetoRedis(user)
		if (!code) {
			throw new BadRequestException(`Failed to generate verification code`)
		}
		await this.sendLoginCode(user, <string>code)
		return !!user.user_id
	}
	async validateVerificationCode(data: ValidateCodeDto): Promise<SuccessResponseDto> {
		if (!data.email) {
			throw new BadRequestException('Email is required')
		}
		const user = await this.usersService.findOneByEmail(data.email)
		this.handleUserNotFoundException(user)
		const verificationCode = await this.getValidationCode(user)
		if (verificationCode && this.verificationCodeIsInvalid(verificationCode, data.code)) {
			throw new BadRequestException(
				'',
				'Your verification code is invalid or expired, please generate a new verification code',
			)
		}
		return {
			success: !!user.user_id,
		}
	}
	async getValidationCode(user: User): Promise<string | undefined> {
		const cache_key = JLCache.cacheKey(AUTH_CODE, { user_id: user.user_id })
		const result = await this.cacheManager.get<string>(cache_key)
		this.logger.log(`[CACHE][GET] ${cache_key} = `, result)
		return result
	}
	/**
	 * @param data
	 * @returns JWT access token
	 */
	async validateLoginCodeAndLogin(data: ValidateCodeDto) {
		const user = await this.usersService.findOneByEmail(data.email)
		this.handleUserNotFoundException(user)
		const verificationCode = await this.getValidationCode(user)
		if (verificationCode && this.verificationCodeIsInvalid(verificationCode, data.code)) {
			throw new BadRequestException(
				'',
				'Your login code is invalid or expired, please generate a new verification code',
			)
		}
		this.removeValidationCode(user)
		return this.jwtService.sign(await this.constructLoginPayload(user), { secret: process.env.JWT_KEY })
	}

	removeValidationCode(user: User): void {
		const cache_key = JLCache.cacheKey(AUTH_CODE, { user_id: user.user_id })
		this.logger.log(`[CACHE][DELETE] ${cache_key}`)
		this.cacheManager.del(cache_key)
	}

	handleUserNotFoundException(user: User) {
		if (!user) {
			throw new NotFoundException('User not found')
		}
	}
	verificationCodeIsInvalid(verificationCode: string, code: string) {
		return !verificationCode || !(code == verificationCode)
	}
	async sendVerificationCode(user: User, code: string) {
		const domain = 'accounts::auth::sendVerificationCode'

		if (!process.env.BEACON_USER_AUTH_VERIFICATION_CODE) {
			return
		}

		if (!user.first_name) {
			user.first_name = 'Hi there'
		}

		const subject = `🔑 Reset Password`

		let markdown = ``

		if (File.exists(process.env.BEACON_USER_AUTH_VERIFICATION_CODE + '/email.md')) {
			markdown = await File.read(process.env.BEACON_USER_AUTH_VERIFICATION_CODE + '/email.md')
			markdown = Strings.replacer(markdown, {
				user: user,
				code: code,
				hrefs: {
					cta: `${process.env.BASE_URL_APP}/password/reset?code=${code}`,
				},
				env: process.env,
			})
		} else {
			markdown = `Hi ${
				user.first_name ?? 'there'
			}, <br><br> You recently requested to reset the password for your ${Strings.capitalize(
				process.env.npm_package_name || 'package_name',
			)} account. Use the code below to change your password \n`
			markdown += `### ${code} \n`
			markdown += `If you did not request a password reset, please ignore this email. This password reset code is only valid for the next 20 minutes.`
		}

		const result = await this.beaconService.notify({
			subject: subject,
			methods: {
				email: true,
			},
			communication: {
				email: {
					to: {
						email: user.email,
						name: user.first_name ?? 'there',
					},
				},
			},
			markdown: markdown,
			json: {},
		})
		this.logger.log(`[${domain}] Email sent to ${user.email} with subject: ${subject}`, result)
	}
	async sendLoginCode(user: User, code: string) {
		const domain = 'accounts::auth::sendLoginCode'

		if (!process.env.BEACON_USER_AUTH_PASSWORDLESS_CODE) {
			return
		}

		if (!user.first_name) {
			user.first_name = 'Hi there'
		}

		const subject = `🔑 Login Code`
		let markdown = ``

		if (File.exists(process.env.BEACON_USER_AUTH_PASSWORDLESS_CODE + '/email.md')) {
			markdown = await File.read(process.env.BEACON_USER_AUTH_PASSWORDLESS_CODE + '/email.md')
			markdown = Strings.replacer(markdown, {
				user: user,
				code: code,
				hrefs: {
					cta: `${process.env.BASE_URL_APP}/passwordless?code=${code}`,
				},
				env: process.env,
			})
		} else {
			markdown = `Hi ${
				user.first_name ?? 'there'
			}, <br><br> You recently requested passwordless login for your ${Strings.capitalize(
				process.env.npm_package_name || 'package_name',
			)} account. Use the code below to login: \n`
			markdown += ` ### ${code} \n`
			markdown += `This login code is only valid for the next 20 minutes.`
		}

		const result = await this.beaconService.notify({
			methods: {
				email: true,
			},
			communication: {
				email: {
					to: {
						email: user.email,
						name: user.first_name ?? 'there',
					},
				},
			},
			subject: subject,
			markdown: markdown,
			json: {},
		})
		this.logger.log(`[${domain}] Email sent to ${user.email} with subject: ${subject}`, result)
	}
	async generateVerificationCodeAndSavetoRedis(user: User, cache_period?: CachePeriod) {
		const verificationCode = OTP.generateVerificationCode(6)
		const cache_key = JLCache.cacheKey(AUTH_CODE, { user_id: user.user_id })
		this.logger.log(`[CACHE][SET] ${cache_key} = ${verificationCode}`)
		await this.cacheManager.set(cache_key, verificationCode, cache_period ?? CachePeriod.TWENTY)
		return await this.cacheManager.get(cache_key)
	}
	async clearUserAuthCache(user: User) {
		let cache_key = JLCache.cacheKey(AUTH_ACCOUNT_IDS, { user_id: user.user_id })
		await this.cacheManager.del(cache_key)
		for (const account of user.accounts || []) {
			cache_key = JLCache.cacheKey(AUTH_ACCOUNT_ROLE, { user_id: user.user_id, account_id: account.account_id })
			await this.cacheManager.del(cache_key)
		}
	}

	async isGodUser(user: User): Promise<boolean> {
		let GOD_DOMAINS = await this.settingsService.findValue('GOD_DOMAINS')
		if (Env.IsTest()) {
			GOD_DOMAINS ||= []
			GOD_DOMAINS.push('juicyllama.com')
		}
		return !!(GOD_DOMAINS && GOD_DOMAINS.includes(user.email.split('@')[1]))
	}

	async getGodUsers(): Promise<User[]> {
		const GOD_DOMAINS = await this.settingsService.findValue('GOD_DOMAINS')
		return await this.usersService.findAll({
			where: {
				email: In(GOD_DOMAINS.map((d: string) => Like(`%${d}`))),
			},
		})
	}

	async getAccountIds(user: User): Promise<number[]> {
		if (await this.isGodUser(user)) {
			const accounts = await this.accountService.findAll({
				take: 99999999,
			})
			return accounts.map(a => a.account_id)
		}
		const cache_key = JLCache.cacheKey(AUTH_ACCOUNT_IDS, { user_id: user.user_id })

		if (Env.useCache()) {
			const result = <number[]>await this.cacheManager.get(cache_key)
			if (result) {
				return result
			}
		}

		if (!user || !user.accounts || user.accounts.length === 0) {
			throw new UnauthorizedException(`No accounts found for user #${user.user_id}`)
		}

		const account_ids = user.accounts.map(a => a.account_id)
		if (Env.useCache()) {
			await this.cacheManager.set(cache_key, account_ids, CachePeriod.DAY)
		}
		return account_ids
	}
	async getUserRole(user_id: number, account_id: number): Promise<UserRole> {
		const cache_key = JLCache.cacheKey(AUTH_ACCOUNT_ROLE, { user_id: user_id, account_id: account_id })
		if (Env.useCache()) {
			const result = await this.cacheManager.get(cache_key)
			if (result) {
				return <UserRole>result
			}
		}
		const user = await this.usersService.findById(user_id)

		if (await this.isGodUser(user)) {
			if (Env.useCache()) {
				await this.cacheManager.set(cache_key, UserRole.OWNER, CachePeriod.DAY)
			}
			return UserRole.OWNER
		}
		if (account_id) {
			const permission = await this.getRole(user_id, account_id)
			if (permission) {
				if (Env.useCache()) {
					await this.cacheManager.set(cache_key, permission.role, CachePeriod.DAY)
				}
				return permission.role
			}
		}
		let role_value = UserRoleNum.VIEWER
		const permissions = await this.getRoles(user_id)
		if (!permissions) {
			if (Env.useCache()) {
				await this.cacheManager.set(cache_key, UserRoleNum.VIEWER, CachePeriod.DAY)
			}
			return UserRole.VIEWER
		}
		for (const permission of permissions) {
			if (UserRoleNum[permission.role] > role_value) role_value = UserRoleNum[permission.role]
		}
		const user_role = UserRole[<keyof typeof UserRole>Enums.getKeyName(UserRoleNum, role_value)]
		if (Env.useCache()) {
			await this.cacheManager.set(cache_key, user_role, CachePeriod.DAY)
		}
		return user_role
	}
	async getRole(user_id: number, account_id: number): Promise<UserAccount | null> {
		return await this.repository.findOne({
			where: {
				user_id,
				account_id,
			},
		})
	}
	async getRoles(user_id: number): Promise<UserAccount[]> {
		return await this.repository.find({
			where: {
				user_id,
			},
		})
	}

	async check(user_id: number, account_id: number, roles?: UserRole[]) {
		if (account_id) {
			const user = await this.usersService.findById(user_id)

			const user_account_ids = await this.getAccountIds(user)

			if (!user_account_ids.includes(account_id)) {
				this.logger.warn(`Permission denied`, {
					user_account_ids: user_account_ids,
					account_id: account_id,
					user_id: user_id,
					roles: roles,
				})

				await this.clearUserAuthCache(user)
				throw new UnauthorizedException(`User does not have access to account_id #${account_id}`)
			}
		}
		if (roles) {
			const role = await this.getUserRole(user_id, account_id)
			if (!roles.includes(role)) {
				throw new ForbiddenException(`${role} role does not have access to this endpoint`)
			}
		}
	}

	referrerCheck(referrer: string | URL, allowed: string | string[] | URL | URL[], domain?: any) {
		if (!domain) {
			domain = 'auth::service::referrerCheck'
		}

		if (!Env.IsDev()) {
			if (!referrer) {
				this.logger.warn(`[${domain}] No referrer found`, {
					NODE_ENV: process.env.NODE_ENV,
					allowed: allowed,
				})
				throw new UnauthorizedException()
			}

			const referrer_url = this.getHostFromUrlOrString(referrer)

			if (allowed instanceof Array) {
				const allowed_urls: string[] = []

				for (const a of allowed) {
					const a_url = this.getHostFromUrlOrString(a)
					allowed_urls.push(a_url)
					if (a_url === referrer_url) return true
				}

				this.logger.error(`[${domain}] Referrer does not match`, {
					referrer_url,
					allowed_urls,
					NODE_ENV: process.env.NODE_ENV,
				})
				throw new UnauthorizedException()
			} else {
				const allowed_url = this.getHostFromUrlOrString(allowed)

				if (referrer_url !== allowed_url) {
					this.logger.error(`[${domain}] Referrer does not match`, {
						referrer_url,
						allowed_url,
						NODE_ENV: process.env.NODE_ENV,
					})
					throw new UnauthorizedException()
				}
			}
		}
		return true
	}
	async processGodUser(user: User) {
		if (await this.isGodUser(user)) {
			user.accounts = await this.accountService.findAll({
				take: 99999999,
			})
			for (const account of user.accounts) {
				await this.assignRole(user, account, UserRole.OWNER)
			}
		}
		return user
	}

	getHostFromUrlOrString(url: string | URL): string {
		if (url instanceof URL) {
			return url.host
		}

		const temp = new URL(url)
		if (!temp?.host) {
			return url.replace(/\//g, '')
		}
		return temp.host
	}
}
