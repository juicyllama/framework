import { registerAs } from '@nestjs/config'

export default registerAs(
	'apilayer',
	() =>
		<any>{
			apikey: process.env.APILAYER_API_KEY,
		},
)
