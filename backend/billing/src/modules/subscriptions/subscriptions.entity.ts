import { Account, BaseEntity, Tag, User } from '@juicyllama/core'
import { SubscriptionFrequency, SupportedCurrencies } from '@juicyllama/utils'
import { Expose } from 'class-transformer'
import { IsArray, IsDate, IsEnum, IsNumber, IsString, MaxLength, MinLength } from 'class-validator'
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'

@Entity('billing_subscriptions')
@Unique('billing_subscriptions_unique_key', ['account'])
export class Subscription extends BaseEntity {
	@PrimaryGeneratedColumn()
	@IsNumber()
	readonly subscription_id!: number

	@ManyToOne(() => Account, account => account, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'account_id' })
	readonly account?: Account

	@Column()
	@IsNumber()
	readonly account_id?: number

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

	@Column({ type: 'enum', enum: SubscriptionFrequency })
	@IsEnum(SubscriptionFrequency)
	frequency!: SubscriptionFrequency

	@ManyToMany(() => Tag, tag => tag, { cascade: true })
	@JoinTable({
		name: 'billing_subscriptions_tags',
		joinColumn: { name: 'subscription_id', referencedColumnName: 'subscription_id' },
		inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'tag_id' },
	})
	@IsArray()
	tags?: Tag[]

	@ManyToOne(() => User, user => user.user_id, {
		onDelete: 'SET NULL',
	})
	@JoinColumn({ name: 'added_by_user_id' })
	added_by?: User

	@Column({ default: null, nullable: true })
	@IsNumber()
	readonly added_by_user_id?: number

	@Column({ default: () => 'CURRENT_TIMESTAMP' })
	@IsDate()
	next_rebill_at?: Date

	@Column({ default: null, nullable: true })
	@IsDate()
	paused_at?: Date

	@Expose()
	get is_paused(): boolean {
		return !!this.paused_at
	}

	constructor(partial: Partial<Subscription>) {
		super()
		Object.assign(this, partial)
	}
}
