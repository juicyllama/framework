import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Logger } from '@juicyllama/utils'
//import { WiseGetTransactionsRequestDto } from './wise.statement.dto'

@Injectable()
export class WiseStatementService {
	constructor(@Inject(forwardRef(() => Logger)) private readonly logger: Logger) {}

	//async getTransactions(options: WiseGetTransactionsRequestDto) {
	// todo getTransactions() -> Mirror Mollie Payment
	//  get transactions for each balance in app_wise_balance table > last date/ID from app_wise_balance_transactions (see docs) and if exist, create transaction in app_wise_balance_transactions table
	//  match to payment_method billing > payment_method > findOne or throw error
	//  pass transaction to billing > payment > processPayment
	//}
}
