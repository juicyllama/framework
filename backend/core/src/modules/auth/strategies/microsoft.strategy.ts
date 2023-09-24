import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { UsersService } from '../../users/users.service.js'
import { Strategy } from 'passport-microsoft'
import { Logger } from '@juicyllama/utils'

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
	constructor(@Inject(forwardRef(() => UsersService)) private usersService: UsersService) {
		super({
			clientID: process.env.MICROSOFT_APP_ID,
			clientSecret: process.env.MICROSOFT_APP_SECRET,
			callbackURL: `${process.env.BASE_URL_APP}/login`,
			scope: ['user.read'],
			tenant: 'common',
			authorizationURL: process.env.MICROSOFT_AUTHORIZATION_URL,
			tokenURL: process.env.MICROSOFT_TOKEN_URL,
		})
	}

	async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
		const logger = new Logger()
		const domain = 'Auth::MicrosoftStrategy::validate'
		logger.debug(domain, 'Validate Request', {
			accessToken: accessToken,
			refreshToken: refreshToken,
			profile: profile,
		})
		const { emails } = profile
		return await this.usersService.validateEmail(emails[0].value)
	}
}
