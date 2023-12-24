import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { PassportStrategy, AuthGuard } from '@nestjs/passport'
import { BearerStrategy, IBearerStrategyOption } from 'passport-azure-ad'
import { defaultSSOString } from '../../../configs/sso.config.joi'
import { UsersService } from '../../..'

const AZURE_AD_CLIENT_ID = process.env.AZURE_AD_CLIENT_ID ?? defaultSSOString
const AZURE_AD_TENANT_ID = process.env.AZURE_AD_TENANT_ID ?? defaultSSOString
const AZURE_AD_EXPOSED_SCOPES = process.env.AZURE_AD_EXPOSED_SCOPES ?? defaultSSOString


const config = {
	credentials: {
		tenantID: AZURE_AD_TENANT_ID,
		clientID: AZURE_AD_CLIENT_ID,
		audience: AZURE_AD_CLIENT_ID,
	},
	metadata: {
		authority: 'login.microsoftonline.com',
		discovery: '.well-known/openid-configuration',
		version: 'v2.0',
	},
	settings: {
		validateIssuer: false,
		passReqToCallback: false,
		loggingLevel: 'warn',
	},
};


@Injectable()
export class AzureADStrategy extends PassportStrategy(BearerStrategy, 'azure-ad') {
	constructor(@Inject(forwardRef(() => UsersService)) private usersService: UsersService) {
		super({
			identityMetadata: `https://${config.metadata.authority}/${config.credentials.tenantID}/${config.metadata.version}/${config.metadata.discovery}`,
			issuer: `https://${config.metadata.authority}/${config.credentials.tenantID}/${config.metadata.version}`,
			clientID: config.credentials.clientID,
			audience: config.credentials.audience,
			validateIssuer: config.settings.validateIssuer,
			passReqToCallback: config.settings.passReqToCallback,
			loggingLevel: config.settings.loggingLevel,
			scope: AZURE_AD_EXPOSED_SCOPES.split(' '),
			loggingNoPII: false,
		} as IBearerStrategyOption);
	}

	async validate(payload: any) {
		return false; // await this.usersService.validateEmail(payload.email)
	}
}

export const AzureADGuard = AuthGuard('azure-ad')
