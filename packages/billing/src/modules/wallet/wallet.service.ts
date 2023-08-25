import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions'
import { Wallet } from './wallet.entity'
import { Account, Query } from '@juicyllama/core'
import { GetBalanceResponseDto } from './wallet.dto'
import { SupportedCurrencies } from '@juicyllama/utils'

const E = Wallet
type T = Wallet

@Injectable()
export class WalletService {
	constructor(
		@Inject(forwardRef(() => Query)) private readonly query: Query<T>,
		@InjectRepository(E) private readonly repository: Repository<T>,
	) {}

	async getBalance(account: Account, currency: SupportedCurrencies): Promise<number> {
		const last_transaction = await this.query.findOne(this.repository, {
			where: {
				account: {
					account_id: account.account_id,
				},
				currency: currency,
			},
			order: {
				created_at: 'DESC',
			},
		})

		return last_transaction ? Number(last_transaction.balance) : 0
	}

	async getBalances(account: Account): Promise<GetBalanceResponseDto[]> {
		const currencies = await this.query.raw(
			this.repository,
			`SELECT DISTINCT currency FROM billing_wallet WHERE account_id = ${account.account_id}`,
		)

		const balances = []

		for (const currency of currencies) {
			const currency_balance = await this.getBalance(account, currency.currency)
			balances.push({
				currency: currency.currency,
				balance: currency_balance,
			})
		}

		return balances
	}

	async listTransactions(options?: FindManyOptions): Promise<T[]> {
		return await this.query.findAll(this.repository, options)
	}

	async findAll(options?: FindManyOptions): Promise<T[]> {
		return await this.query.findAll(this.repository, options)
	}

	async findNegativeAccounts(): Promise<Wallet[]> {
		const sql = `SELECT *
                     FROM billing_wallet
                              INNER JOIN
                          (SELECT MAX(wallet_id) as wallet_id FROM billing_wallet GROUP BY account_id, currency) last_balance
                          ON last_balance.wallet_id = billing_wallet.wallet_id
					WHERE billing_wallet.balance < 0;`
		return await this.query.raw(this.repository, sql)
	}
}
