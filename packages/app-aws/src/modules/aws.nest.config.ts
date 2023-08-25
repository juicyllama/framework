import { registerAs } from '@nestjs/config'

export default registerAs(
	'aws',
	() =>
		<any>{
			AWS_JL_REGION: process.env.AWS_JL_REGION,
			AWS_JL_ACCESS_KEY_ID: process.env.AWS_JL_ACCESS_KEY_ID,
			AWS_JL_SECRET_KEY_ID: process.env.AWS_JL_SECRET_KEY_ID,
		},
)
