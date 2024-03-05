import { BaseService, Query } from '@juicyllama/core'
import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Tax } from './tax.entity'

const E = Tax
type T = Tax

@Injectable()
export class TaxService extends BaseService<T> {
	constructor(
		@Inject(forwardRef(() => Query)) readonly query: Query<T>,
		@InjectRepository(E) readonly repository: Repository<T>,
	) {
		super(query, repository)
	}

	async getTaxRate(seller_country_code: string, buyer_country_code: string): Promise<number> {
		const result = await super.findOne({
			where: {
				seller_country_code: seller_country_code,
				buyer_country_code: buyer_country_code,
			},
		})
		return result?.tax_percentage || 0
	}
}
