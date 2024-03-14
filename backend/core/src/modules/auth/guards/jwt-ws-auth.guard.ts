import { Logger } from '@juicyllama/utils'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { Observable } from 'rxjs'
import { JWT } from '../auth.constants'

@Injectable()
export class JwtWsAuthGuard implements CanActivate {
	constructor(
		readonly jwtService: JwtService,
		readonly logger: Logger,
	) {}
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		if (context.getType() !== 'ws') {
			return true
		}

		const client = context.switchToWs().getClient()
		JwtWsAuthGuard.validateToken(client)
		this.jwtService.verify(client, {
			secret: process.env.JWT_KEY,
		})
		return true
	}

	static validateToken(client: Socket): any {
		const { authorization } = client.handshake.headers
		const token: string = authorization.split(' ')[1]
		const payload = verify(token, JWT.SECRET)
		return payload
	}
}
