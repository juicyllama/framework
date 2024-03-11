import { IsString, IsOptional } from 'class-validator'

export const defaultSSOString = 'TODO'

export class SSOConfigDto {
	@IsOptional()
	@IsString()
	FACEBOOK_APP_ID?: string = defaultSSOString

	@IsOptional()
	@IsString()
	FACEBOOK_APP_SECRET?: string = defaultSSOString

	@IsOptional()
	@IsString()
	GOOGLE_CLIENT_ID?: string = defaultSSOString

	@IsOptional()
	@IsString()
	GOOGLE_CLIENT_SECRET?: string = defaultSSOString

	@IsOptional()
	@IsString()
	AZURE_AD_CLIENT_ID?: string = defaultSSOString

	@IsOptional()
	@IsString()
	AZURE_AD_TENANT_ID?: string = defaultSSOString
}
