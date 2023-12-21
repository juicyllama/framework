import { Tag } from '@juicyllama/core'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { IsString } from 'class-validator'

@Entity('apps_xero_cc_account_codes')
@Unique('apps_xero_cc_account_codes_UNIQUE', ['tag'])
export class XeroAccountCode {
	@PrimaryGeneratedColumn()
	readonly xero_account_code_id: number

	@ManyToOne(() => Tag, tag => tag.tag_id, { cascade: true })
	@JoinColumn({ name: 'tag_id' })
	tag: Tag

	@Column()
	@IsString()
	account_code: string

	//https://developer.xero.com/documentation/api/accounting/types#tax-types
	@Column({ default: 'NONE' })
	@IsString()
	tax_type: string

	constructor(partial: Partial<XeroAccountCode>) {
		Object.assign(this, partial)
	}
}
