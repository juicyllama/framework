import { registerAs } from '@nestjs/config'

export default registerAs(
	'awsRds',
	() =>
		<any>{
			AWS_RDS_JL_REGION: process.env.AWS_RDS_JL_REGION
		},
)
