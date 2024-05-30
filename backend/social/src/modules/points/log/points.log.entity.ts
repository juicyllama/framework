import { PrimaryGeneratedColumn, Column, JoinColumn, Entity, ManyToOne } from 'typeorm'
import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common'
import { BaseEntity } from '@juicyllama/core'
import { IsString, IsNumber } from 'class-validator'
import { Points } from '../points.entity'

@UseInterceptors(ClassSerializerInterceptor)
@Entity('social_points_log')
export class PointLog extends BaseEntity {
	@PrimaryGeneratedColumn()
	points_log_id!: number

	@ManyToOne(() => Points, (point: Points) => point.points_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'points_id' })
	points?: Points

	@Column()
	@IsNumber()
	points_id!: number

	@Column({ type: 'int', default: 0 })
	points_before!: number

	@Column({ type: 'int', default: 0 })
	points_change!: number

	@Column({ type: 'int', default: 0 })
	points_after!: number

	@Column()
	@IsString()
	log!: string
}
