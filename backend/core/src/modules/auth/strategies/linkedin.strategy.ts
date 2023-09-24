import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-linkedin-oauth2'
import { UsersService } from '../../users/users.service.js'
import { Logger } from '@juicyllama/utils'

@Injectable()
export class LinkedinStrategy extends PassportStrategy(Strategy, 'linkedin') {
	constructor(@Inject(forwardRef(() => UsersService)) private usersService: UsersService) {
		super({
			clientID: process.env.LINKEDIN_KEY,
			clientSecret: process.env.LINKEDIN_SECRET,
			callbackURL: `${process.env.BASE_URL_APP}/login`,
			scope: ['r_emailaddress', 'r_liteprofile'],
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
