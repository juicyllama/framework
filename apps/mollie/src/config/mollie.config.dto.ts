import { IsString } from 'class-validator'

export class MollieConfigDto {
	@IsString()
	MOLLIE_API_KEY: string
}
