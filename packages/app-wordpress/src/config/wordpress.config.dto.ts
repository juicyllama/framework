import { IsString, IsUrl } from 'class-validator'

export class wordpressConfigDto {
	@IsUrl()
	WORDPRESS_URL: string

	@IsString()
	WORDPRESS_USERNAME: string

	@IsString()
	WORDPRESS_APPLICATION_PASSWORD: string
}
