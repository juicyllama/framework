import { registerAs } from '@nestjs/config'

export default registerAs(
	'awsSes',
	() =>
		<any>{
			AWS_SES_JL_REGION: process.env.AWS_SES_JL_REGION,
			AWS_SES_JL_TEMPLATE_ARN: process.env.AWS_SES_JL_TEMPLATE_ARN,
		},
)
