import { registerAs } from '@nestjs/config'

export default registerAs(
	'semrush',
	() =>
		<any>{
			SEMRUSH_API_KEY: process.env.SEMRUSH_API_KEY,
		},
)
