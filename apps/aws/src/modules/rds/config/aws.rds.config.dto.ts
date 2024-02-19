import { IsOptional, IsString } from 'class-validator'

export class AwsRdsConfigDto {
	@IsOptional()
	@IsString()
	AWS_RDS_JL_REGION = 'eu-west-2'
}
