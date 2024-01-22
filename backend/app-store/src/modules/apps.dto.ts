import {
	IsArray,
	IsBoolean,
	IsEnum,
	IsNumber,
	IsObject,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator'
import {
	AppCategory,
	AppInputType,
	AppInputValidationType,
	AppIntegrationType,
	AppStoreIntegrationName,
} from './apps.enums'
import { SwaggerPropertyDecorator, SwaggerPropertyType } from '@juicyllama/core'

export class AppInputValidationDto {
	@IsNumber()
	@IsOptional()
	readonly min?: number

	@IsNumber()
	@IsOptional()
	readonly max?: number

	@IsEnum(AppInputValidationType)
	readonly type!: AppInputValidationType
}

export class AppDropdownDto {
	@IsArray()
	readonly options!: object

	@IsBoolean()
	@IsOptional()
	readonly required?: boolean
}

export class AppUploadDto {
	@IsString()
	@IsOptional()
	readonly accept?: boolean

	@IsBoolean()
	@IsOptional()
	readonly required?: boolean
}

export class AppCheckboxDto {
	@IsBoolean()
	@IsOptional()
	readonly default!: boolean

	@IsBoolean()
	@IsOptional()
	readonly required?: boolean
}

export class AppInputDto {
	@IsEnum(AppInputType)
	readonly type!: AppInputType

	@IsBoolean()
	@IsOptional()
	readonly required?: boolean

	@IsBoolean()
	@IsOptional()
	readonly validation?: AppInputValidationDto
}

export class AppSettingsDto {
	@IsString()
	@MinLength(2)
	@MaxLength(255)
	readonly key!: string

	@IsString()
	@MinLength(2)
	@MaxLength(255)
	readonly name!: string

	@IsObject()
	@MinLength(2)
	@MaxLength(255)
	@IsOptional()
	readonly input?: AppInputDto

	@IsObject()
	@MinLength(2)
	@MaxLength(255)
	@IsOptional()
	readonly upload?: AppUploadDto

	@IsObject()
	@MinLength(2)
	@MaxLength(255)
	@IsOptional()
	readonly dropdown?: AppDropdownDto

	@IsObject()
	@IsOptional()
	readonly checkbox?: AppCheckboxDto

	@IsBoolean()
	@IsOptional()
	readonly private?: boolean

	@IsBoolean()
	@IsOptional()
	readonly hidden?: boolean //don't show in the UI

	@IsString()
	@MaxLength(255)
	@IsOptional()
	readonly description?: string
}

export class AppDto {
	@SwaggerPropertyDecorator({
		type: SwaggerPropertyType.NUMBER,
		hidden: true,
		required: false,
	})
	app_id?: number

	@SwaggerPropertyDecorator({
		type: SwaggerPropertyType.STRING,
		description: 'Application name',
		example: 'Slack',
		required: true,
	})
	name!: string

	@SwaggerPropertyDecorator({
		type: SwaggerPropertyType.STRING,
		description: 'Application URL',
		example: 'https://slack.com',
		required: true,
	})
	url!: string

	@SwaggerPropertyDecorator({
		enum: AppIntegrationType,
		description: 'The integration type',
		example: AppIntegrationType.OAUTH2,
		required: false,
	})
	integration_type?: AppIntegrationType

	@SwaggerPropertyDecorator({
		enum: AppStoreIntegrationName,
		description: 'The app store integration name',
		example: AppStoreIntegrationName.wordpress,
		required: true,
	})
	integration_name!: AppStoreIntegrationName

	@SwaggerPropertyDecorator({
		enum: AppCategory,
		description: 'The application category',
		example: AppCategory.communication,
		required: true,
	})
	category!: AppCategory

	@SwaggerPropertyDecorator({
		type: SwaggerPropertyType.STRING,
		description: 'The application primary colour',
		example: '#4a154b',
		required: false,
	})
	hexcode?: string

	@SwaggerPropertyDecorator({
		type: SwaggerPropertyType.BOOLEAN,
		description: 'If the application is active',
		example: true,
		required: false,
	})
	active?: boolean

	@SwaggerPropertyDecorator({
		type: SwaggerPropertyType.BOOLEAN,
		description: 'If the application is hidden',
		example: false,
		hidden: true,
		required: false,
	})
	hidden?: boolean

	@SwaggerPropertyDecorator({
		type: SwaggerPropertyType.ARRAY,
		description: 'Required settings for the application',
		required: false,
	})
	readonly settings?: AppSettingsDto[]
}
