import { EventSubscriber, EntitySubscriberInterface, InsertEvent, DataSource } from 'typeorm'
import { Logger } from '@juicyllama/utils'
import { Wallet } from '../wallet/wallet.entity'
import { Payment } from './payments.entity'

const logger = new Logger()

@EventSubscriber()
export class PaymentsSubscriber implements EntitySubscriberInterface<Payment> {
	constructor(dataSource: DataSource) {
		try {
			dataSource.subscribers.push(this)
			logger.verbose(`PaymentsSubscriber: Registered`)
		} catch (e) {
			const error = e as Error
			logger.warn(`PaymentsSubscriber Failed: ${error.message}`, error)
		}
	}
	listenTo() {
		return Payment
	}

	async afterInsert(event: InsertEvent<any>) {
		const domain = 'billing::PaymentsSubscriber::afterInsert'

		const last_transaction = await event.manager.getRepository(Wallet).findOne({
			where: {
				account: {
					account_id: event.entity.account_id,
				},
				currency: event.entity.currency,
			},
			order: {
				created_at: 'DESC',
			},
		})

		const new_balance = last_transaction
			? Number(last_transaction.balance) + Number(event.entity.amount)
			: Number(event.entity.amount)

		logger.log(
			`[${domain}] Wallet balance was ${
				last_transaction ? `${last_transaction?.balance} (wallet #${last_transaction.wallet_id})` : `0`
			} and is now --${Number(new_balance)}-- due to a charge of ${Number(event.entity.amount)} with ID #${
				event.entity.charge_id
			}`,
		)

		const value = {
			account_id: event.entity.account_id,
			credit_balance: event.entity.amount,
			payment: event.entity,
			currency: event.entity.currency,
			balance: new_balance,
		}

		const transaction = await event.manager.getRepository(Wallet).save(value)
		logger.log(`[${domain}] Wallet Credit Created`, transaction)
		return transaction
	}
}
