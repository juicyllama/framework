import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { Request } from 'express'
import { ACCESS_TOKEN_COOKIE_NAME } from '../auth.constants'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: Request) => {
					let token = null
					if (request) {
						if (request.headers.authorization) {
							// Check for Bearer token in Authorization header
							const bearerToken = request.headers.authorization.split(' ')[1]
							if (bearerToken) {
								token = bearerToken
							}
						}
						if (!token && request.headers.cookie) {
							// Manually parse the Cookie header
							token = request.headers.cookie
								.split(';')
								.reverse() // reverse to find the last cookie with the name
								.find(cookie => cookie.trim().startsWith(ACCESS_TOKEN_COOKIE_NAME + '='))
								?.split('=')[1]
						}
					}
					return token || null
				},
			]),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_KEY,
		})
	}

	async validate(payload: any) {
		return {
			email: payload.email,
			user_id: payload.user_id,
			account_ids: payload.account_ids,
		}
	}
}
