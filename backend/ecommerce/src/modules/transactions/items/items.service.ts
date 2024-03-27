import { BeaconService, Query, BaseService } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Between } from 'typeorm'
import { TransactionItem } from './items.entity'

const E = TransactionItem
type T = TransactionItem

@Injectable()
export class TransactionItemsService extends BaseService<T> {
	constructor(
		@InjectRepository(E) readonly repository: Repository<T>,
		@Inject(Query) readonly query: Query<T>,
		@Inject(forwardRef(() => BeaconService)) readonly beaconService: BeaconService,
		@Inject(forwardRef(() => Logger)) readonly logger: Logger,
	) {
		super(query, repository, {
			beacon: beaconService,
		})
	}

	async getSkuSoldCount(sku_id: number, from: Date, to: Date): Promise<number> {
		const transactions = await super.findAll({
			relations: ['transaction', 'sku', 'bundle', 'bundle.bundleSkus'],
			where: [
				{
					transaction: {
						created_at: Between(from, to),
					},
					sku_id,
				},
				{
					transaction: {
						created_at: Between(from, to),
					},
					bundle: {
						bundleSkus: {
							sku_id,
						},
					},
				},
			],
		})

		let sold_count = 0

		for (const transaction of transactions) {
			if (transaction.sku_id === sku_id) {
				sold_count += transaction.quantity
			} else if (transaction.bundle?.bundleSkus) {
				transaction.bundle.bundleSkus.forEach(sku => {
					if (sku.sku_id === sku_id) {
						sold_count += (sku.quantity ?? 1) * transaction.quantity
					}
				})
			} else {
				this.logger.error(
					`[ecommerce::transactions::items::getSkuSoldCount] Transaction ${transaction.transaction_id} does not have a SKU or Bundle.bundleSkus`,
					transaction,
				)
			}
		}

		return sold_count
	}
}
