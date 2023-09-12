import { registerAs } from '@nestjs/config'

export default registerAs(
	'google',
	() =>
		<any>{
			GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
		},
)
