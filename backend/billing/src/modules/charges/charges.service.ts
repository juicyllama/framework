import { BaseService, Query } from '@juicyllama/core'
import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'
import { Invoice } from '../invoices/invoices.entity'
import { Charge } from './charges.entity'

const E = Charge
type T = Charge

@Injectable()
export class ChargesService extends BaseService<T> {
	constructor(
		@Inject(forwardRef(() => Query)) readonly query: Query<T>,
		@InjectRepository(E) readonly repository: Repository<T>,
	) {
		super(query, repository)
	}

	async create(data: DeepPartial<T>): Promise<T> {
		return await super.create(data)
	}

	async update(): Promise<T> {
		throw new BadRequestException(`You can't update a charge. You can only create a new one.`)
	}

	async delete() {
		throw new BadRequestException(`You can't delete a charge. You must add a payment increase the balance.`)
	}

	async purge() {
		throw new BadRequestException(`You can't delete a charge. You must add a payment increase the balance.`)
	}

	async linkInvoice(charge_id: number, invoice: Invoice): Promise<T> {
		return await this.query.update(this.repository, {
			charge_id: charge_id,
			invoice: invoice,
			is_invoiced: true,
		})
	}
}
