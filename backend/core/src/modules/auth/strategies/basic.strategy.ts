import { BasicStrategy as Strategy } from 'passport-http'
import { PassportStrategy } from '@nestjs/passport'
import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersService } from '../../users/users.service.js'
import { Logger } from '@juicyllama/utils'

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
	constructor(@Inject(forwardRef(() => UsersService)) private usersService: UsersService) {
		super({
			usernameField: 'email',
			passReqToCallback: true,
		})
	}

	async validate(req: Request, email: string, pass: string): Promise<any> {
		const logger = new Logger()
		const domain = 'Auth::MicrosoftStrategy::validate'
		logger.debug(domain, 'Validate Request', {
			req: req,
			email: email
		})
		const user = await this.usersService.validateUser(email, pass)
		if (!user) {
			throw new UnauthorizedException()
		}
		return user
	}
}
