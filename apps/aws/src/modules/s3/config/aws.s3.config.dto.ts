import { IsString, IsOptional } from 'class-validator'

export class AwsS3ConfigDto {
	@IsString()
	AWS_S3_JL_PUBLIC_BUCKET!: string

	@IsString()
	AWS_S3_JL_PRIVATE_BUCKET!: string

	@IsOptional()
	@IsString()
	AWS_S3_JL_REGION = 'eu-west-2'
}
