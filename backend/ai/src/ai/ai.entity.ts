import { AppIntegrationName, BaseEntity } from '@juicyllama/core'
import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common'
import { IsBoolean, IsEnum, IsString } from 'class-validator'
import { Expose } from 'class-transformer'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { AiSuccessType } from './ai.enums'

@UseInterceptors(ClassSerializerInterceptor)
@Entity('ai')
export class Ai extends BaseEntity {
	@PrimaryGeneratedColumn()
	readonly ai_id!: number

	//The value the user passes to Lana
	@IsString()
	@Column({ type: 'longtext' })
	request!: string

	//Is this a general AI question?
	@IsBoolean()
	@Column({ default: false, nullable: true })
	is_general?: boolean

	//Is this a SQL question?
	@IsBoolean()
	@Column({ default: false, nullable: true })
	is_sql?: boolean

	@IsEnum(AppIntegrationName)
	@Column({ default: false, nullable: true })
	app_integration_name?: AppIntegrationName

	//The response from the AI model
	@IsString()
	@Column({ type: 'longtext', default: null, nullable: true })
	response?: string

	//If SQL, what is the response form the query
	@IsString()
	@Column({ default: null, nullable: true })
	sql_result?: string

	//the natural language Q&A version of the SQL result
	@IsString()
	@Column({ type: 'longtext', default: null, nullable: true })
	sql_result_nl?: string

	//Manually added training data to help the model improve
	@IsString()
	@Column({ type: 'longtext', default: null, nullable: true })
	training_response?: string

	//Did the AI generate the correct answer?
	@IsEnum(AiSuccessType)
	@Column({ default: null, nullable: true })
	success?: AiSuccessType

	@IsString()
	@Column({ default: null, nullable: true })
	error_message?: string

	@Expose()
	get is_error(): boolean {
		return !!this.success && [AiSuccessType.ERROR, AiSuccessType.SQL_ERROR].includes(this.success)
	}

	constructor(partial: Partial<Ai>) {
		super()
		Object.assign(this, partial)
	}
}
