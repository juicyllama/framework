import { Injectable } from '@nestjs/common'
import { PassportStrategy, AuthGuard } from '@nestjs/passport'
import { BearerStrategy, IBearerStrategyOption } from 'passport-azure-ad'
import { defaultSSOString } from '../../../configs/sso.config.joi'

const AZURE_AD_CLIENT_ID = process.env.AZURE_AD_CLIENT_ID ?? defaultSSOString
const AZURE_AD_TENANT_ID = process.env.AZURE_AD_TENANT_ID ?? defaultSSOString

@Injectable()
export class AzureADStrategy extends PassportStrategy(BearerStrategy, 'azure-ad') {
	constructor() {
		super({
		  clientID: process.env.AZURE_AD_CLIENT_ID,
		  clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
		  identityMetadata: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/v2.0/.well-known/openid-configuration`,
		  responseType: 'code',
		  responseMode: 'query',
		  redirectUrl: process.env.AZURE_AD_REDIRECT_URI,
		  allowHttpForRedirectUrl: true, // Set to false in production
		  scope: ['openid', 'profile', 'email'],
		  passReqToCallback: false,
		  loggingLevel: 'info',
		});
	  }
	
	  async validate(response: any, done: Function) {
		// Extract user information from the Azure AD response
		const user = {
		  ...response,
		  // additional user processing if needed
		};
		done(null, user);
	  }
}

export const AzureADGuard = AuthGuard('azure-ad')
