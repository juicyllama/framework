import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { BasicStrategy as Strategy } from 'passport-http'
import { UsersService } from '../../users/users.service'

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
	constructor(private usersService: UsersService) {
		super({
			usernameField: 'email',
			passReqToCallback: true,
		})
	}

	async validate(req: Request, email: string, pass: string): Promise<any> {
		const user = await this.usersService.validateUser(email, pass)
		if (!user) {
			throw new UnauthorizedException()
		}
		return user
	}
}
