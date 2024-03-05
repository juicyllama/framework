import { registerAs } from '@nestjs/config'

export default registerAs(
	'spyfu',
	() =>
		<any>{
			SPYFU_API_KEY: process.env.SPYFU_API_KEY,
		},
)
