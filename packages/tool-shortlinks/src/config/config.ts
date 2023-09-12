import { registerAs } from '@nestjs/config'

export default registerAs(
	'tools_shortlinks',
	() =>
		<any>{
			BASE_URL_SHORTLINKS: process.env.BASE_URL_SHORTLINKS,
		},
)
