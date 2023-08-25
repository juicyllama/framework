import { registerAs } from '@nestjs/config'
import { wordpressConfigDto } from './wordpress.config.dto'
import * as process from 'process'
import { RawAxiosRequestConfig } from 'axios/index'

export default registerAs(
	'wordpress',
	() =>
		<any>{
			WORDPRESS_URL: process.env.WORDPRESS_URL,
			WORDPRESS_USERNAME: process.env.WORDPRESS_USERNAME,
			WORDPRESS_APPLICATION_PASSWORD: process.env.WORDPRESS_APPLICATION_PASSWORD,
		},
)

export function getWordpressUrl(config: wordpressConfigDto): string {
	return config?.WORDPRESS_URL ?? process.env.WORDPRESS_URL
}

export function getWordpressUsername(config: wordpressConfigDto): string {
	return config?.WORDPRESS_USERNAME ?? process.env.WORDPRESS_USERNAME
}

export function getWordpressApplicationPassword(config: wordpressConfigDto): string {
	return config?.WORDPRESS_APPLICATION_PASSWORD ?? process.env.WORDPRESS_APPLICATION_PASSWORD
}

export function getWordpressAxiosConfig(config: wordpressConfigDto): RawAxiosRequestConfig {
	return {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Basic ${Buffer.from(
				getWordpressUsername(config) + ':' + getWordpressApplicationPassword(config),
			).toString('base64')}`,
		},
	}
}
