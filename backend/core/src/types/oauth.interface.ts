export interface OauthInterface {
	access_token: string
	refresh_token: string
	token_type: string
	expires_at: Date
	state: string
	scope: string
}
