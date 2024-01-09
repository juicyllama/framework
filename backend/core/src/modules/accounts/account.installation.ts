import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { Logger, Env, SupportedCurrencies } from '@juicyllama/utils'
import { AccountService } from './account.service'

@Injectable()
export class AccountInstallationService implements OnModuleInit {
	constructor(
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => AccountService)) private readonly accountService: AccountService,
	) {}

	async onModuleInit() {
		if (Env.IsDev()) {
			try {
				const account = await this.accountService.findOne()

				if (!account) {
					this.logger.log('Creating Default Account')

					const onboard = await this.accountService.onboard({
						account_name: 'Example Company Limited',
						currency: SupportedCurrencies.USD,
						owners_email: 'jon.doe@example.com',
						owners_password: 'S7r0#gP@$s', //Sha512: a90e9c1f773f85cbfcefe1a1bd1229aaaa253f47bc047705c4f3b9360f22de59958ed75aec01550bdd3a42ef97bfeb6488b67906cd2028c095041eadd4365576
						owners_first_name: 'Jon',
						owners_last_name: 'Doe',
					})

					this.logger.log(`Account #${onboard.account.account_id} Created`)
					this.logger.log(
						`User #${onboard.owner.user_id} Created, you can authenticate with ${onboard.owner.email} and S7r0#gP@$s`,
					)
				}
			} catch (e: any) {
				this.logger.error(e.message, e)
			}
		}
	}
}
