import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from '../../../helpers'
import { Account } from '../../accounts/account.entity'

@Entity('beacon_webhooks')
export class BeaconWebhook extends BaseEntity {
	@PrimaryGeneratedColumn()
	readonly webhook_id!: number

	@ManyToOne(() => Account, account => account.account_id, { cascade: false })
	@JoinColumn({ name: 'account_id' })
	account!: Account

	@Column()
	address!: string

	@Column()
	topic!: string

	@Column({ type: 'boolean' })
	truncate!: boolean
}
