import { User } from '@juicyllama/core'
import { PrimaryGeneratedColumn, Column, JoinColumn, Entity, Unique, ManyToOne } from 'typeorm'
import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common'
import { BaseEntity } from '@juicyllama/core'
import { IsString, IsNumber, IsDate } from 'class-validator'

@UseInterceptors(ClassSerializerInterceptor)
@Entity('social_activity')
@Unique('social_activity_unique', ['activity_identifier', 'user_id'])
export class Activity extends BaseEntity {
	@PrimaryGeneratedColumn()
	activity_id!: number

	@Column()
	@IsString()
	activity_identifier!: string

	@ManyToOne(() => User, (user: User) => user.user_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'user_id' })
	user?: User

	@Column()
	@IsNumber()
	user_id!: number

	@Column({
		type: 'json',
		nullable: true,
		default: null,
	})
	json: any

	@Column({
		nullable: true,
		default: 0,
	})
	@IsNumber()
	streak?: number

	@Column({ nullable: true, default: null })
	@IsDate()
	last_seen_at?: Date
}
