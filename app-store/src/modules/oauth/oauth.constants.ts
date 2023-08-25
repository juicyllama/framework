import { Oauth } from './oauth.entity'
import { OAuthModule } from './oauth.module'
import { OauthService } from './oauth.service'

export const OAUTH_APP_E = Oauth
export type OAUTH_APP_T = Oauth
export const OAUTH_APP_NAME = 'oauth'
export const OAUTH_APP_PRIMARY_KEY = 'oauth_id'
export const OAUTH_APP_MODULE = OAuthModule
export const OAUTH_APP_SERVICE = OauthService
