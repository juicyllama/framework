import { IsString } from 'class-validator'

export class ApilayerConfigDto {
	@IsString()
	APILAYER_API_KEY: string
}
