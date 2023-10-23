export interface Oauth {
	readonly oauth_id: number
	installed_app_id: number
	access_token?: string
	refresh_token?: string
	token_type?: string
	state?: string
	scope?: string
	redirect_url?: string
	expires_at?: Date
}
