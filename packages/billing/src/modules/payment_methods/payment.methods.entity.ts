import { IsBoolean, IsDate, IsEnum, IsNumber, IsObject, IsString, MaxLength, MinLength } from 'class-validator'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Account, AppIntegrationName, BaseEntity } from '@juicyllama/core'
import { PaymentMethodBankTransferDetails, PaymentMethodCreditCardDetails } from './payment.methods.dtos'
import { PaymentMethodStatus, PaymentMethodType } from './payment.methods.enums'
import { SupportedCurrencies } from '@juicyllama/utils'

@Entity('billing_payment_methods')
export class PaymentMethod extends BaseEntity {
	@PrimaryGeneratedColumn()
	@IsNumber()
	readonly payment_method_id: number

	@ManyToOne(() => Account, account => account.account_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'account_id' })
	readonly account: Account

	@Column({ default: PaymentMethodType.creditcard })
	@IsEnum(PaymentMethodType)
	method: PaymentMethodType

	@Column({ type: 'json', default: null, nullable: true })
	@IsObject()
	details?: PaymentMethodCreditCardDetails | PaymentMethodBankTransferDetails

	@Column('varchar', { length: 3 })
	@IsEnum(SupportedCurrencies)
	@MinLength(3)
	@MaxLength(3)
	currency: SupportedCurrencies

	@Column({ default: false })
	@IsBoolean()
	can_send?: boolean

	@Column({ default: false })
	@IsBoolean()
	can_charge?: boolean

	@Column({ default: false })
	@IsBoolean()
	can_refund?: boolean

	@Column({ default: null, nullable: true })
	@IsEnum(AppIntegrationName)
	app_integration_name?: AppIntegrationName

	@Column({ default: null, nullable: true })
	@IsNumber()
	app_payment_method_id?: number

	@Column({ default: () => 'CURRENT_TIMESTAMP' })
	@IsDate()
	next_attempt_at?: Date

	@Column({ default: 0 })
	@IsNumber()
	attempts?: number

	@Column({ default: PaymentMethodStatus.pending })
	@IsEnum(PaymentMethodStatus)
	status?: PaymentMethodStatus

	@Column({ default: null, nullable: true })
	@IsString()
	redirect_url?: string

	constructor(partial: Partial<PaymentMethod>) {
		super()
		Object.assign(this, partial)
	}
}
