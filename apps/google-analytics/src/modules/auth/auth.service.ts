import { v4 as uuidv4 } from 'uuid'

import { OAuth2Client, Credentials } from 'google-auth-library'
import { grpc } from 'google-gax'

import { Injectable } from '@nestjs/common'

import { GoogleAnalyticsApp } from '../google-analytics.app'
import { GoogleAnalyticsConfigDto } from '../config/google-analytics.config.dto'

@Injectable()
export class AuthService {
	private serviceClient: OAuth2Client

	public constructor(private readonly config: GoogleAnalyticsConfigDto) {
		this.serviceClient = this.createClient()
	}

	public createClient() {
		return new OAuth2Client(
			this.config.GA4_OAUTH_CLIENT_ID,
			this.config.GA4_OAUTH_CLIENT_SECRET,
			this.config.BASE_URL_API + GoogleAnalyticsApp.createRoute('/auth/callback'),
		)
	}

	public generateAuthUrl() {
		const state = this.generateState()

		const authUrl = this.serviceClient.generateAuthUrl({
			access_type: 'offline',
			scope: 'https://www.googleapis.com/auth/analytics.readonly',
			prompt: 'consent', // force to return refresh_token,
			state,
		})

		return { state, authUrl }
	}

	private generateState() {
		return uuidv4()
	}

	public async getTokensFromCallbackCode(code: string) {
		const { tokens } = await this.serviceClient.getToken(code)

		return tokens
	}

	public getAuthenticatedClient(tokens: Credentials) {
		const client = this.createClient()

		client.setCredentials(tokens)

		return client
	}

	public createDataClientCredentials(client: OAuth2Client) {
		const sslCredentials = grpc.credentials.createSsl()
		return grpc.credentials.combineChannelCredentials(
			sslCredentials,
			grpc.credentials.createFromGoogleCredential(client),
		)
	}
}
