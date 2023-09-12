import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { UsersService } from '../../users/users.service'
import { Strategy } from 'passport-microsoft'

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
		const { emails } = profile
		return await this.usersService.validateEmail(emails[0].value)
	}
}
