import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm'
import { IsDate } from 'class-validator'

export class BaseEntity {
	@CreateDateColumn()
	@IsDate()
	created_at?: Date

	@UpdateDateColumn()
	@IsDate()
	updated_at?: Date

	@DeleteDateColumn()
	@IsDate()
	deleted_at?: Date
}
