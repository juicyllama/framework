import { SwaggerPropertyDecorator, SwaggerPropertyType } from '@juicyllama/core'
import { IsNumber, IsObject } from 'class-validator'
import { AppIntegrationStatus, AppScope } from '../apps.enums'

export class CreateInstalledAppDto {
	@SwaggerPropertyDecorator({
		type: SwaggerPropertyType.NUMBER,
		hidden: true,
		required: false,
	})
	installed_app_id?: number

	@SwaggerPropertyDecorator({
		type: SwaggerPropertyType.NUMBER,
		description: 'The app_id for the app you wish to connect',
		example: 1,
		required: true,
	})
	app_id?: number

	@SwaggerPropertyDecorator({
		type: SwaggerPropertyType.STRING,
		description: 'A name for the app connection',
		example: 'Virgins Amazon Seller Account',
		required: true,
	})
	name!: string

	@SwaggerPropertyDecorator({
		enum: AppScope,
		description: 'The application scope',
		example: AppScope.ACCOUNT,
		required: false,
	})
	scope?: AppScope

	@SwaggerPropertyDecorator({
		type: SwaggerPropertyType.OBJECT,
		description: 'The relevant key pair based on the apps settings',
		example: { key: 'pair' },
		required: false,
	})
	readonly settings?: any

	@SwaggerPropertyDecorator({
		enum: AppIntegrationStatus,
		description: 'The integration name',
		example: AppIntegrationStatus.CONNECTED,
		hidden: true,
		required: false,
	})
	integration_status!: AppIntegrationStatus

	@SwaggerPropertyDecorator({
		type: SwaggerPropertyType.BOOLEAN,
		description: 'If the application is active',
		example: true,
		required: false,
	})
	active?: boolean

	@SwaggerPropertyDecorator({
		type: SwaggerPropertyType.NUMBER,
		description: `The account_id for the new app (only required if scope is \`${AppScope.ACCOUNT}\`)`,
		example: 1,
		hidden: true,
		required: false,
	})
	account_id?: number
}

export class UpdateInstalledAppDto {
	@SwaggerPropertyDecorator({
		type: SwaggerPropertyType.STRING,
		description: 'A name for the app connection',
		example: 'Virgins Amazon Seller Account',
		required: true,
	})
	name!: string

	@SwaggerPropertyDecorator({
		enum: AppScope,
		description: 'The application scope',
		example: AppScope.ACCOUNT,
	})
	scope!: AppScope

	@SwaggerPropertyDecorator({
		type: SwaggerPropertyType.OBJECT,
		description: 'The relevant key pair based on the apps settings',
		example: { key: 'pair' },
	})
	readonly settings?: any
}

export class InstalledAppPreCheckDto {
	@SwaggerPropertyDecorator({
		type: SwaggerPropertyType.NUMBER,
		description: 'The app_id for the app you wish to do the precheck for',
		example: 1,
		required: true,
	})
	@IsNumber()
	app_id!: number

	@SwaggerPropertyDecorator({
		type: SwaggerPropertyType.OBJECT,
		description: 'The relevant key pair based on the apps settings',
		example: { key: 'pair' },
		required: true,
	})
	@IsObject()
	settings: any
}

export class preInstallCheckResponse {
	@SwaggerPropertyDecorator({
		type: SwaggerPropertyType.BOOLEAN,
		description: 'If the precheck was successful',
		example: true,
		required: true,
	})
	result!: boolean

	@SwaggerPropertyDecorator({
		type: SwaggerPropertyType.STRING,
		description: 'The error message if the precheck was unsuccessful',
		example: 'You already have a connected app for this shop',
		required: false,
	})
	error?: string
}
