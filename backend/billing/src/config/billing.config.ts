import { registerAs } from '@nestjs/config'

export default registerAs(
	'billing',
	() =>
		<any>{
			BILLING_DEFAULT_PLAN: process.env.BILLING_DEFAULT_PLAN,
			BILLING_MINIMUM_CHARGE: process.env.BILLING_MINIMUM_CHARGE,
		},
)
