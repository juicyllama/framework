import {
	BadRequestException,
	ForbiddenException,
	forwardRef,
	ImATeapotException,
	Inject,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import {
	CachePeriod,
	Enums,
	Env,
	JLCache,
	Logger,
	File,
	Modules,
	OTP,
	Strings,
	SuccessResponseDto,
} from '@juicyllama/utils'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Like, Repository } from 'typeorm'
import { UsersService } from '../users/users.service'
import { Role } from './role.entity'
import { AccountService } from '../accounts/account.service'
import { SettingsService } from '../settings/settings.service'
import { JwtService } from '@nestjs/jwt'
import { Cache } from 'cache-manager'
import { BaseService } from '../../helpers'
import { Query } from '../../utils/typeorm/Query'
import { BeaconService } from '../beacon/beacon.service'
import { LoginResponseDto, ValidateCodeDto } from './dtos/login.dto'
import { AUTH_ACCOUNT_IDS, AUTH_ACCOUNT_ROLE, AUTH_CODE } from './auth.constants'
import { UserRole, UserRoleNum } from '../users/users.enums'
import { User } from '../users/users.entity'
import { Account } from '../accounts/account.entity'
import { CompletePasswordResetDto, InitiateResetPasswordDto } from './dtos/password.reset.dto'

const E = Role
type T = Role

@Injectable()
export class AuthService extends BaseService<T> {
	constructor(
		@Inject(forwardRef(() => Query)) readonly query: Query<T>,
		@InjectRepository(E) readonly repository: Repository<T>,
		@Inject(forwardRef(() => Logger)) readonly logger: Logger,
		@Inject(forwardRef(() => AccountService)) readonly accountService: AccountService,
		@Inject(forwardRef(() => BeaconService)) readonly beaconService: BeaconService,
		@Inject(forwardRef(() => SettingsService)) readonly settingsService: SettingsService,
		@Inject(forwardRef(() => UsersService)) readonly usersService: UsersService,
		@Inject(forwardRef(() => JwtService)) readonly jwtService: JwtService,
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
				role: role,
			})
		} else {
			userRole = await this.update({
				role_id: userRole.role_id,
				role: role,
			})
		}

		if (user.roles) {
			user.roles.push(userRole)
			user.roles = [...new Map(user.roles.map(item => [item['role_id'], item])).values()]
		} else {
			user.roles = [userRole]
		}

		user = await this.usersService.update(user)
		this.logger.debug(`[${domain}] User #${user.user_id} is now a ${role} of account #${account.account_id}!`)
		return user
	}

	async login(user: User) {
		const payload = await this.constructLoginPayload(user)
		if (!['development', 'test'].includes(Env.get())) {
			let Bugsnag
			if (Modules.bugsnag.isInstalled) {
				Bugsnag = await Modules.bugsnag.load()
				Bugsnag.setUser(user.user_id, user.email)
			}
		}
		user.last_login_at = new Date()
		delete user.password
		await this.usersService.update(user)
		return new LoginResponseDto(this.jwtService.sign(payload, { secret: process.env.JWT_KEY }))
	}
	async constructLoginPayload(user: User) {
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
	async completePasswordReset(data: CompletePasswordResetDto) {
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

		return new LoginResponseDto(
			this.jwtService.sign(await this.constructLoginPayload(user), { secret: process.env.JWT_KEY }),
		)
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
		const cache_key = JLCache.cacheKey(AUTH_CODE, { user_id: user.user_id })
		this.logger.log(`[CACHE][DELETE] ${cache_key}`)
		await this.cacheManager.del(cache_key)
		return new LoginResponseDto(
			this.jwtService.sign(await this.constructLoginPayload(user), { secret: process.env.JWT_KEY }),
		)
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
	async generateVerificationCodeAndSavetoRedis(user: User) {
		const verificationCode = OTP.generateVerificationCode(6)
		const cache_key = JLCache.cacheKey(AUTH_CODE, { user_id: user.user_id })
		this.logger.log(`[CACHE][SET] ${cache_key} = ${verificationCode}`)
		await this.cacheManager.set(cache_key, verificationCode, CachePeriod.TWENTY)
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
		const GOD_DOMAINS = await this.settingsService.findValue('GOD_DOMAINS')
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
	async getRole(user_id: number, account_id: number) {
		return await this.repository.findOne({
			where: {
				user: {
					user_id: user_id,
				},
				account: {
					account_id: account_id,
				},
			},
		})
	}
	async getRoles(user_id: number) {
		return await this.repository.find({
			where: {
				user: {
					user_id: user_id,
				},
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

	referrerCheck(referrer: string | URL, allowed: string | string[], domain: any) {
		if (Env.IsProd()) {
			if (!referrer) {
				this.logger.warn(`[${domain}] No referrer found`, {
					NODE_ENV: process.env.NODE_ENV,
					allowed: allowed,
				})
				throw new UnauthorizedException()
			}
			const referrer_url = new URL(referrer)
			
			if(allowed instanceof Array) {
				if (!allowed.includes(referrer_url.origin)) {
					this.logger.error(`[${domain}] Referrer does not match`, {
						referrer: referrer_url,
						allowed: allowed,
						NODE_ENV: process.env.NODE_ENV,
					})
					throw new UnauthorizedException()
				}
			} else {
				if (referrer_url.origin !== allowed) {
					this.logger.error(`[${domain}] Referrer does not match`, {
						referrer: referrer_url,
						allowed: allowed,
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
			const roles = []
			for (const account of user.accounts) {
				roles.push({
					user_id: user.user_id,
					account_id: account.account_id,
					role: UserRole.OWNER,
				})
			}
			user.roles = roles
		}
		return user
	}
}
