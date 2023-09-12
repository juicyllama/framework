export enum AppIntegrationType {
	API_KEY = 'API_KEY',
	OAUTH2 = 'OAUTH2',
	CREDENTIALS = 'CREDENTIALS',
}

export enum AppStoreIntegrationName {
	wordpress = 'wordpress',
}

export enum AppCategory {
	accounting = 'accounting',
	communication = 'communication',
	crm = 'crm',
	cms = 'cms',
	ecommerce = 'ecommerce',
	payments = 'payments',
}

export enum AppInputType {
	text = 'text',
	dropdown = 'dropdown',
}

export enum AppInputValidationType {
	String = 'String',
	url = 'url',
}

export interface AppInputValidationDto {
	readonly min?: number
	readonly max?: number
	readonly type: AppInputValidationType
}

export interface AppInputDto {
	readonly type: AppInputType
	readonly required?: boolean
	readonly validation?: AppInputValidationDto
}

export interface AppUploadDto {
	readonly accept?: boolean
	readonly required?: boolean
}

export interface AppDropdownDto {
	readonly options: object
	readonly required?: boolean
}

export interface AppCheckboxDto {
	readonly default: boolean
	readonly required?: boolean
}

export interface AppSettingsDto {
	readonly key: string
	readonly name: string
	readonly input?: AppInputDto
	readonly upload?: AppUploadDto
	readonly dropdown?: AppDropdownDto
	readonly checkbox?: AppCheckboxDto
	readonly private?: boolean
	readonly description?: string
}

export interface App {
	app_id: number
	name: string
	url: string
	integration_type: AppIntegrationType
	integration_name: AppStoreIntegrationName
	category: AppCategory
	hexcode?: string
	active: boolean
	hidden: boolean
	settings?: AppSettingsDto[]
}
