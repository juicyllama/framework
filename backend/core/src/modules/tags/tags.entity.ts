import { IsDate, IsString, MaxLength, MinLength } from 'class-validator'
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

@Entity('tags')
@Unique('tag_UNIQUE', ['name'])
export class Tag {
	@PrimaryGeneratedColumn()
	@ApiProperty({ description: 'The tag ID', example: 1 })
	readonly tag_id: number

	@ApiProperty({ description: 'The name of your tag', example: 'TAG' })
	@Column()
	@IsString()
	@MinLength(1)
	@MaxLength(255)
	readonly name: string

	@CreateDateColumn()
	readonly created_at: Date

	@DeleteDateColumn()
	@IsDate()
	deleted_at: Date

	constructor(partial: Partial<Tag>) {
		Object.assign(this, partial)
	}
}
