import {
	AccountId,
	AccountService,
	AuthenticatedRequest,
	AuthService,
	Query as TQuery,
	ReadManyDecorator,
	UserAuth,
	UserRole,
} from '@juicyllama/core'
import { Controller, Get, Inject, Query, Req, forwardRef } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { IsNull } from 'typeorm'
import { BILLING_WALLET_E, BILLING_WALLET_NAME, BILLING_WALLET_T } from './wallet.constants'
import { GetBalanceResponseDto } from './wallet.dto'
import { WalletOrderBy, WalletRelations, WalletSelect } from './wallet.enums'
import { WalletService } from './wallet.service'

@ApiTags('Wallet')
@UserAuth()
@Controller('/billing/wallet')
export class WalletController {
	constructor(
		@Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
		@Inject(forwardRef(() => AccountService)) private readonly accountService: AccountService,
		@Inject(forwardRef(() => WalletService)) private readonly walletService: WalletService,
		@Inject(forwardRef(() => TQuery)) private readonly query: TQuery<BILLING_WALLET_T>,
	) {}

	@ApiOperation({ summary: 'Get Balance' })
	@ApiOkResponse({
		description: 'OK',
		type: Number,
	})
	@Get('balances')
	async getBalances(
		@Req() req: AuthenticatedRequest,
		@AccountId() account_id: number,
	): Promise<GetBalanceResponseDto[]> {
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
	async listAll(
		@Req() req: AuthenticatedRequest,
		@AccountId() account_id: number,
		@Query() query: any,
	): Promise<BILLING_WALLET_T[]> {
		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])

		const where = {
			account: { account_id: account_id },
			deleted_at: IsNull(),
		}

		return await this.walletService.listTransactions(this.query.findOptions(query, where))
	}
}
