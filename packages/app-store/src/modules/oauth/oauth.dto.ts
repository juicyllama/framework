import { IsString, IsUrl } from 'class-validator'
import { AppIntegrationType } from '../apps.enums'

export class OAuthAuthorizeResponseDto {
	@IsString()
	type: AppIntegrationType.OAUTH2

	@IsUrl()
	redirect_url: string
}
