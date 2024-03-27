import { BeaconService, Query, BaseService } from '@juicyllama/core'
import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Stock } from './stock.entity'

const E = Stock
type T = Stock

@Injectable()
export class StockService extends BaseService<T> {
	constructor(
		@InjectRepository(E) readonly repository: Repository<T>,
		@Inject(Query) readonly query: Query<T>,
		@Inject(forwardRef(() => BeaconService)) readonly beaconService: BeaconService,
	) {
		super(query, repository, {
			beacon: beaconService,
		})
	}

	async getStockOnHand(sku_id: number): Promise<number> {
		const stock = await super.findAll({
			where: { sku_id },
		})

		let stock_count = 0

		stock.forEach(stock => {
			stock_count += stock.quantity
		})

		return stock_count
	}
}
