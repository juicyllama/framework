import { Entity, Unique, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common'
import { BaseEntity } from '@juicyllama/core'
import { IsString, IsNumber, IsEnum } from 'class-validator'
import { User } from '@juicyllama/core'
import { ConnectionType } from './connection.enums'

@UseInterceptors(ClassSerializerInterceptor)
@Entity('social_connections')
@Unique('social_connections_unique', ['connection_identifier', 'user_id', 'connection_user_id'], {})
export class Connection extends BaseEntity {
	@PrimaryGeneratedColumn()
	connection_id!: number

	@Column()
	@IsString()
	connection_identifier!: string

	@ManyToOne(() => User, (user: User) => user.user_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'user_id', foreignKeyConstraintName: 'fk_social_connections_user_id' })
	user?: User

	@Column()
	@IsNumber()
	user_id!: number

	@ManyToOne(() => User, (user: User) => user.user_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'user_id', foreignKeyConstraintName: 'fk_social_connections_connection_user' })
	connection_user?: User

	@Column()
	@IsNumber()
	connection_user_id!: number

	@Column({ type: 'enum', enum: ConnectionType })
	@IsEnum(ConnectionType)
	type!: ConnectionType

	@Column({
		type: 'json',
		nullable: true,
		default: null,
	})
	json: any
}
