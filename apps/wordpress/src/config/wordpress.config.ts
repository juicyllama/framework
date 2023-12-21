import { registerAs } from '@nestjs/config'
import { WordpressConfigDto } from './wordpress.config.dto'
import { RawAxiosRequestConfig } from 'axios'

export default registerAs(
	'wordpress',
	() =>
		<any>{
			WORDPRESS_URL: process.env.WORDPRESS_URL,
			WORDPRESS_USERNAME: process.env.WORDPRESS_USERNAME,
			WORDPRESS_APPLICATION_PASSWORD: process.env.WORDPRESS_APPLICATION_PASSWORD,
		},
)

export function getWordpressUrl(config: WordpressConfigDto): string {
	return config?.WORDPRESS_URL ?? process.env.WORDPRESS_URL
}

export function getWordpressUsername(config: WordpressConfigDto): string {
	return config?.WORDPRESS_USERNAME ?? process.env.WORDPRESS_USERNAME
}

export function getWordpressApplicationPassword(config: WordpressConfigDto): string {
	return config?.WORDPRESS_APPLICATION_PASSWORD ?? process.env.WORDPRESS_APPLICATION_PASSWORD
}

export function getWordpressAxiosConfig(config: WordpressConfigDto): RawAxiosRequestConfig {
	return {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Basic ${Buffer.from(
				getWordpressUsername(config) + ':' + getWordpressApplicationPassword(config),
			).toString('base64')}`,
		},
		timeout: process.env.SYSTEM_TIMEOUT ? Number(process.env.SYSTEM_TIMEOUT) : 10000,
		timeoutErrorMessage: 'Failed to connect to Wordpress website - operation timed out!',
	}
}
