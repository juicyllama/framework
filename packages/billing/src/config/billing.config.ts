import { registerAs } from '@nestjs/config'

export default registerAs(
	'billing',
	() =>
		<any>{
			BILLING_DEFAULT_PLAN: process.env.BILLING_DEFAULT_PLAN,
		},
)
