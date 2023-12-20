import { IsOptional, IsString } from 'class-validator'

export class AwsSesConfigDto {
	@IsString()
	@IsOptional()
	AWS_SES_JL_REGION = 'eu-west-2'

	@IsString()
	AWS_SES_JL_TEMPLATE_ARN: string
}
