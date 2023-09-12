import { EventSubscriber, EntitySubscriberInterface, InsertEvent, DataSource } from 'typeorm'
import { Charge } from './charges.entity'
import { Logger } from '@juicyllama/utils'
import { Wallet } from '../wallet/wallet.entity'

const logger = new Logger()

@EventSubscriber()
export class ChargesSubscriber implements EntitySubscriberInterface<Charge> {
	constructor(dataSource: DataSource) {
		try {
			dataSource.subscribers.push(this)
			logger.verbose(`ChargesSubscriber: Registered`)
		} catch (e) {
			logger.warn(`ChargesSubscriber Failed: ${e.message}`, e)
		}
	}
	listenTo() {
		return Charge
	}

	async afterInsert(event: InsertEvent<any>) {
		const domain = 'billing::ChargesSubscriber::afterInsert'

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
			? Number(last_transaction.balance) + Number(0 - Number(event.entity.amount_total))
			: Number(0 - Number(event.entity.amount_total))

		logger.verbose(
			`[${domain}] Wallet balance was ${
				last_transaction ? `${last_transaction?.balance} (wallet #${last_transaction.wallet_id})` : `0`
			} and is now --${Number(new_balance)}-- due to a charge of ${Number(event.entity.amount_total)} with ID #${
				event.entity.charge_id
			}`,
		)

		const value = {
			account_id: event.entity.account_id,
			debit_balance: event.entity.amount_total,
			charge: event.entity,
			balance: new_balance,
			currency: event.entity.currency,
		}

		const transaction = await event.manager.getRepository(Wallet).save(value)
		logger.log(`[${domain}] Wallet Debit Created`, transaction)
		return transaction
	}
}
