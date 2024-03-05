import { IsString, IsUrl } from 'class-validator'

export class WordpressConfigDto {
	@IsUrl()
	WORDPRESS_URL!: string

	@IsString()
	WORDPRESS_USERNAME!: string

	@IsString()
	WORDPRESS_APPLICATION_PASSWORD!: string
}
