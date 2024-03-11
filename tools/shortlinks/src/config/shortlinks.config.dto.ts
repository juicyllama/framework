import { IsString } from 'class-validator'

export class ShortlinksConfigDto {
	@IsString()
	BASE_URL_SHORTLINKS!: string
}
