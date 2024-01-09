import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Account, AccountService, AuthService, BaseService, BeaconService, Query, User } from '@juicyllama/core'
import { Withdrawal } from './withdrawals.entity'
import { DeepPartial, Repository } from 'typeorm'
import { Logger, File, Strings } from '@juicyllama/utils'
import { WalletService } from '../wallet/wallet.service'
import { WithdrawalStatus } from './withdrawals.enums'

const E = Withdrawal
type T = Withdrawal

@Injectable()
export class WithdrawalsService extends BaseService<T> {
	constructor(
		@Inject(forwardRef(() => Query)) readonly query: Query<T>,
		@InjectRepository(E) readonly repository: Repository<T>,
		@Inject(forwardRef(() => AccountService)) private readonly accountService: AccountService,
		@Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => BeaconService)) readonly beaconService: BeaconService,
		@Inject(forwardRef(() => WalletService)) private readonly walletService: WalletService,
	) {
		super(query, repository, {
			beacon: beaconService,
		})
	}

	//@ts-ignore
	async create(data: DeepPartial<T>, user: User): Promise<T> {
		const balance = await this.walletService.getBalance(<Account>data.account, data.currency)

		if (balance < data.amount) {
			throw new BadRequestException('Insufficient funds')
		}

		const result = await super.create(data)
		await this.sendBeaconOnCreate(result, user)
		return result
	}

	async updateStatus(withdrawal: Withdrawal, status: WithdrawalStatus): Promise<Withdrawal> {
		await super.update({
			withdrawal_id: withdrawal.withdrawal_id,
			status: status,
		})
		withdrawal.status = status
		return withdrawal
	}

	async sendBeaconOnCreate(withdrawal: T, user: User): Promise<void> {
		if (!process.env.BEACON_BILLING_WITHDRAWAL_REQUEST) {
			return
		}

		const amount = new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: withdrawal.currency,
		}).format(withdrawal.amount)

		let markdown = ``

		if (File.exists(process.env.BEACON_BILLING_WITHDRAWAL_REQUEST + '/email.md')) {
			markdown = await File.read(process.env.BEACON_BILLING_WITHDRAWAL_REQUEST + '/email.md')
			markdown = Strings.replacer(markdown, {
				withdrawal: withdrawal,
				user: user,
				amount: amount,
			})
		} else {
			markdown = `A withdrawal request of ${amount} has been received and will be processed as soon as possible.`
		}

		await this.beaconService.notify({
			methods: {
				email: true,
			},
			communication: {
				email: {
					to: {
						name: user.first_name + ' ' + user.last_name,
						email: user.email,
					},
				},
			},
			subject: `Withdrawal received`,
			markdown: markdown,
			json: {
				withdrawal_id: withdrawal.withdrawal_id,
			},
		})
	}
}
