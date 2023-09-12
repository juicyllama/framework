import { registerAs } from '@nestjs/config'

export default registerAs(
	'pexels',
	() =>
		<any>{
			PEXELS_API_KEY: process.env.PEXELS_API_KEY,
		},
)
