import { Injectable } from '@nestjs/common'
import { PassportStrategy, AuthGuard } from '@nestjs/passport'
import { BearerStrategy } from 'passport-azure-ad'
import { defaultSSOString } from '../../../configs/sso.config.joi'

const AZURE_AD_CLIENT_ID = process.env.AZURE_AD_CLIENT_ID ?? defaultSSOString
const AZURE_AD_TENANT_ID = process.env.AZURE_AD_TENANT_ID ?? defaultSSOString

@Injectable()
export class AzureADStrategy extends PassportStrategy(BearerStrategy, 'azure-ad') {
	constructor() {
		super({
			identityMetadata: `https://login.microsoftonline.com/${AZURE_AD_TENANT_ID}/v2.0/.well-known/openid-configuration`,
			clientID: AZURE_AD_CLIENT_ID,
		})
	}

	async validate(data) {
		return data
	}
}

export const AzureADGuard = AuthGuard('azure-ad')
