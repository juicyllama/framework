import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { BaseEntity } from '@juicyllama/core'
import { IsArray, IsBoolean, IsEnum, IsString, MaxLength, MinLength } from 'class-validator'
import { AppCategory, AppIntegrationType, AppStoreIntegrationName } from './apps.enums'
import { AppSettingsDto } from './apps.dto'

@Entity('apps')
@Unique('apps_UNIQUE', ['integration_name'])
export class App extends BaseEntity {
	@PrimaryGeneratedColumn()
	app_id: number

	@IsString()
	@MinLength(2)
	@MaxLength(255)
	@Column()
	name: string

	@IsString()
	@MinLength(2)
	@MaxLength(255)
	@Column()
	url: string

	@IsEnum(AppIntegrationType)
	@Column()
	integration_type: AppIntegrationType

	@IsEnum(AppStoreIntegrationName)
	@Column()
	integration_name: AppStoreIntegrationName

	@IsEnum(AppCategory)
	@Column()
	category: AppCategory

	@IsString()
	@MinLength(4)
	@MaxLength(10)
	@Column({ default: null, nullable: true })
	hexcode?: string

	@Column({ default: true })
	@IsBoolean()
	active: boolean

	@Column({ default: false })
	@IsBoolean()
	hidden: boolean

	@IsArray()
	@Column({ type: 'json', default: null, nullable: true })
	settings?: AppSettingsDto[]

	constructor(partial: Partial<App>) {
		super()
		Object.assign(this, partial)
	}
}
