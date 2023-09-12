import { registerAs } from '@nestjs/config'

export default registerAs(
	'scrapingbee',
	() =>
		<any>{
			SCRAPINGBEE_API_KEY: process.env.SCRAPINGBEE_API_KEY,
		},
)
