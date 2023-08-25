import { BadRequestException, Body, Controller, forwardRef, Inject, Post, Query, Req } from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import {
	AccountId,
	AccountService,
	AuthService,
	ReadManyDecorator,
	UserAuth,
	UserRole,
	UsersService,
} from '@juicyllama/core'
import { Logger, SupportedCurrencies } from '@juicyllama/utils'
import { WithdrawalsService } from './withdrawals.service'
import { WithdrawalRequestDto } from './withdrawals.dto'
import { Withdrawal } from './withdrawals.entity'
import { PaymentMethodsService } from '../payment_methods/payment.methods.service'
import { WalletService } from '../wallet/wallet.service'
import { FindOptionsWhere, In } from 'typeorm'
import { WithdrawalOrderBy, WithdrawalRelations, WithdrawalSelect } from './withdrawals.enums'
import { Query as JLQuery } from '@juicyllama/core/dist/utils/typeorm/Query'

const E = Withdrawal
type T = Withdrawal

@ApiTags('Withdrawals')
@UserAuth()
@Controller('billing/withdrawals')
export class WithdrawalsController {
	constructor(
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => AccountService)) private readonly accountService: AccountService,
		@Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
		@Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
		@Inject(forwardRef(() => PaymentMethodsService)) private readonly paymentMethodsService: PaymentMethodsService,
		@Inject(forwardRef(() => WalletService)) private readonly walletService: WalletService,
		@Inject(forwardRef(() => WithdrawalsService)) private readonly withdrawalsService: WithdrawalsService,
		@Inject(forwardRef(() => JLQuery)) private readonly query: JLQuery<T>,
	) {}

	@ApiOperation({
		summary: 'Request Withdrawal',
	})
	@Post()
	async create(@Req() req, @AccountId() account_id: number, @Body() data: WithdrawalRequestDto): Promise<T> {
		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])
		const account = await this.accountService.findById(account_id)

		const user = await this.usersService.findById(req.user.user_id)
		const payment_method = await this.paymentMethodsService.findOne({
			where: {
				payment_method_id: data.payment_method_id,
				account: {
					account_id: account_id,
				},
			},
		})

		if (!payment_method) {
			throw new BadRequestException(`Payment method ${data.payment_method_id} not found`)
		}

		const balance = await this.walletService.getBalance(account, payment_method.currency)
		if (balance < data.amount) {
			throw new BadRequestException(`Insufficient funds. ${payment_method.currency} balance is: ${balance}`)
		}

		return await this.withdrawalsService.create(
			{
				account: account,
				payment_method: payment_method,
				amount: data.amount,
				currency: payment_method.currency,
			},
			user,
		)
	}

	@ReadManyDecorator(E, WithdrawalSelect, WithdrawalOrderBy, WithdrawalRelations)
	@ApiQuery({
		name: 'currency',
		description: 'The currency you are requesting data for',
		type: String,
		required: false,
		example: SupportedCurrencies.USD,
	})
	async findAll(@Req() req, @Query() query, @AccountId() account_id: number): Promise<T[]> {
		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])

		const where: FindOptionsWhere<T>[] = [
			{
				account: {
					account_id: In([account_id]),
				},
				currency: query.currency ?? null,
			},
		]

		return await this.withdrawalsService.findAll(this.query.findOptions(query, where))
	}
}
