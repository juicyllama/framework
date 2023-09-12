import { IsString, IsUrl } from 'class-validator'

export class APILayerConfigDto {
	@IsUrl()
	APILAYER_HOST: string

	@IsString()
	APILAYER_API_KEY: string
}
