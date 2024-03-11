import { Account, BaseEntity, Tag, User } from '@juicyllama/core'
import { SupportedCurrencies } from '@juicyllama/utils'
import { IsArray, IsBoolean, IsEnum, IsNumber, IsString, MaxLength, MinLength } from 'class-validator'
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Invoice } from '../invoices/invoices.entity'

@Entity('billing_charges')
export class Charge extends BaseEntity {
	@PrimaryGeneratedColumn()
	@IsNumber()
	readonly charge_id!: number

	@ManyToOne(() => Account, account => account.account_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'account_id' })
	readonly account?: Account

	@Column()
	@IsNumber()
	account_id!: number

	@Column()
	@IsString()
	name!: string

	@Column({ default: null, nullable: true })
	@IsString()
	description!: string

	@Column('decimal', { precision: 20, scale: 10, default: 0 })
	@IsNumber()
	amount_subtotal?: number // amount before tax (used if tax > 0)

	@Column('decimal', { precision: 20, scale: 10, default: 0 })
	@IsNumber()
	amount_tax?: number

	@Column('decimal', { precision: 20, scale: 10 })
	@IsNumber()
	amount_total!: number // amount including tax

	@Column({ type: 'enum', enum: SupportedCurrencies })
	@IsEnum(SupportedCurrencies)
	@MinLength(3)
	@MaxLength(3)
	currency!: SupportedCurrencies

	@ManyToMany(() => Tag, tag => tag, { cascade: true })
	@JoinTable({
		name: 'billing_charges_tags',
		joinColumn: { name: 'charge_id', referencedColumnName: 'charge_id' },
		inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'tag_id' },
	})
	@IsArray()
	tags?: Tag[]

	@ManyToOne(() => Invoice, invoice => invoice.invoice_id)
	@JoinColumn({ name: 'invoice_id' })
	invoice?: Invoice

	@Column({ default: false })
	@IsBoolean()
	is_invoiced?: boolean

	@ManyToOne(() => User, user => user.user_id, {
		onDelete: 'SET NULL',
	})
	@JoinColumn({ name: 'added_by_user_id' })
	added_by?: User

	@Column({ default: null, nullable: true })
	@IsNumber()
	added_by_user_id?: number

	constructor(partial: Partial<Charge>) {
		super()
		Object.assign(this, partial)
	}
}
