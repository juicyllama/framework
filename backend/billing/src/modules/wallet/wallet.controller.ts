import { Controller, forwardRef, Get, Inject, Query, Req } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { IsNull } from 'typeorm'
import { WalletService } from './wallet.service'
import { AccountId, AccountService, AuthService, ReadManyDecorator, UserAuth, UserRole } from '@juicyllama/core'
import { WalletOrderBy, WalletRelations, WalletSelect } from './wallet.enums'
import { GetBalanceResponseDto } from './wallet.dto'
import { Query as JLQuery } from '@juicyllama/core/dist/utils/typeorm/Query'
import { BILLING_WALLET_E, BILLING_WALLET_NAME, BILLING_WALLET_T } from './wallet.constants'

@ApiTags('Wallet')
@UserAuth()
@Controller('/billing/wallet')
export class WalletController {
	constructor(
		@Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
		@Inject(forwardRef(() => AccountService)) private readonly accountService: AccountService,
		@Inject(forwardRef(() => WalletService)) private readonly walletService: WalletService,
		@Inject(forwardRef(() => JLQuery)) private readonly query: JLQuery<BILLING_WALLET_T>,
	) {}

	@ApiOperation({ summary: 'Get Balance' })
	@ApiOkResponse({
		description: 'OK',
		type: Number,
	})
	@Get('balances')
	async getBalances(@Req() req, @AccountId() account_id: number): Promise<GetBalanceResponseDto[]> {
		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])
		const account = await this.accountService.findById(account_id)
		return await this.walletService.getBalances(account)
	}

	@ReadManyDecorator({
		name: BILLING_WALLET_NAME,
		entity: BILLING_WALLET_E,
		selectEnum: WalletSelect,
		orderByEnum: WalletOrderBy,
		relationsEnum: WalletRelations,
	})
	async listAll(@Req() req, @AccountId() account_id: number, @Query() query: any): Promise<BILLING_WALLET_T[]> {
		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])

		const where = {
			account: { account_id: account_id },
			deleted_at: IsNull(),
		}

		return await this.walletService.listTransactions(this.query.findOptions(query, where))
	}
}
