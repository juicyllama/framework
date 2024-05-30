import { PrimaryGeneratedColumn, Column, JoinColumn, Entity, Unique, ManyToOne, OneToMany } from 'typeorm'
import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common'
import { BaseEntity } from '@juicyllama/core'
import { IsString, IsNumber } from 'class-validator'
import { User } from '@juicyllama/core'
import { PointLog } from './log/points.log.entity'

@UseInterceptors(ClassSerializerInterceptor)
@Entity('social_points')
@Unique('social_points_unique', ['points_identifier', 'user_id'])
export class Points extends BaseEntity {
	@PrimaryGeneratedColumn()
	points_id!: number

	@Column()
	@IsString()
	points_identifier!: string

	@ManyToOne(() => User, (user: User) => user.user_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'user_id' })
	user?: User

	@Column()
	@IsNumber()
	user_id!: number

	@Column({ default: 0 })
	@IsNumber()
	points!: number

	@OneToMany(() => PointLog, pointLog => pointLog.points)
	logs?: PointLog[]

	@Column({
		type: 'json',
		nullable: true,
		default: null,
	})
	json?: any
}
