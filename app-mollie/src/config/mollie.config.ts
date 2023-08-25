import { registerAs } from '@nestjs/config'

export default registerAs(
	'mollie',
	() =>
		<any>{
			MOLLIE_API_KEY: process.env.MOLLIE_API_KEY,
		},
)
