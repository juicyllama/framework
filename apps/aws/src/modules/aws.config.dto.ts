import { IsOptional, IsString } from 'class-validator'

export class AwsConfigDto {
	@IsString()
	@IsOptional()
	AWS_JL_REGION = 'eu-west-2'

	@IsString()
	AWS_JL_ACCESS_KEY_ID: string

	@IsString()
	AWS_JL_SECRET_KEY_ID: string
}
