import { forwardRef, Inject, Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction } from 'express'
import { Modules } from '@juicyllama/utils'
import { AuthService } from '../modules/auth/auth.service'
import { AccountService } from '../modules/accounts/account.service'

@Injectable()
export class MiddlewareAccountId implements NestMiddleware {
	constructor(
		@Inject(forwardRef(() => AccountService)) private readonly accountService: AccountService,
		@Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
	) {}

	async use(req: any, res: any, next: NextFunction) {
		const account_id =
			req?.headers && req.headers['account-id'] ? req.headers['account-id'] : req?.query?.account_id
		const user_id = req?.user?.user_id

		if (user_id && account_id) {
			await this.authService.check(req.user.user_id, account_id)

			let Bugsnag: any
			if (Modules.bugsnag.isInstalled) {
				Bugsnag = Modules.bugsnag.load()
				Bugsnag.addMetadata('account', await this.accountService.findById(req.query.account_id))
				Bugsnag.addMetadata('user', req.user)
			}
		}
		next()
	}
}
