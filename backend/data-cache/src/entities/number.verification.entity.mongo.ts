import { Entity, ObjectId, ObjectIdColumn, Column, Unique } from 'typeorm'
import { IsBoolean, IsString } from 'class-validator'
import { BaseEntity } from '@juicyllama/core'

@Entity()
@Unique('number_verification_UNIQUE', ['number'])
export class NumberVerification extends BaseEntity {
	@ObjectIdColumn()
	id!: ObjectId

	@Column()
	@IsBoolean()
	valid!: boolean

	@Column()
	@IsString()
	carrier!: string

	@Column()
	@IsString()
	country_code!: string

	@Column()
	@IsString()
	country_name!: string

	@Column()
	@IsString()
	country_prefix!: string

	@Column()
	@IsString()
	international_format!: string

	@Column()
	@IsString()
	line_type!: string

	@Column()
	@IsString()
	local_format!: string

	@Column()
	@IsString()
	location!: string

	@Column()
	@IsString()
	number!: string
}
