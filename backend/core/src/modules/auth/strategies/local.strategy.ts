import { Logger } from '@juicyllama/utils'
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { UsersService } from '../../users/users.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(
		private usersService: UsersService,
		private logger: Logger,
	) {
		super({ usernameField: 'email' })
	}

	async validate(email: string, pass: string): Promise<any> {
		const domain = 'utils::auth::login'
		this.logger.verbose(`[${domain}][${email}] Login request at ${new Date()}`)
		let user = await this.usersService.validateUser(email, pass)

		if (user) {
			if (user.password_reset) {
				this.logger.verbose(`[${domain}][${email}] Password requires changing`)
				throw new ForbiddenException('Password requires changing')
			}

			this.logger.verbose(`[${domain}][${email}] Login Successful`)
			return user
		}

		user = await this.usersService.validateEmail(email)

		if (user) {
			if (user.password_reset) {
				this.logger.verbose(`[${domain}][${email}] Password requires changing`)
				throw new ForbiddenException('Password requires changing')
			}
		}

		this.logger.verbose(`[${domain}][${email}] No user found`)
		throw new UnauthorizedException()
	}
}
