import { registerAs } from '@nestjs/config'

export default registerAs(
	'openai',
	() =>
		<any>{
			OPENAI_API_KEY: process.env.OPENAI_API_KEY,
		},
)
