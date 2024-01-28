import { Env } from '@juicyllama/utils'
import { Injectable } from '@nestjs/common'
import { PassportStrategy, AuthGuard } from '@nestjs/passport'
import { BearerStrategy, IBearerStrategyOption } from 'passport-azure-ad'
import { defaultSSOString } from '../../../configs/sso.config.joi'
import { UsersService } from '../../users/users.service'
import { AZURE_AD } from '../auth.constants'

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
		validateIssuer: Env.IsProd(),
		passReqToCallback: false,
		loggingLevel: Env.IsProd() ? 'warn' : 'info',
	},
}

export const enableAzureADStrategy =
	process.env.AZURE_AD_CLIENT_ID && process.env.AZURE_AD_TENANT_ID && process.env.AZURE_AD_CLIENT_SECRET

@Injectable()
export class AzureADStrategy extends PassportStrategy(BearerStrategy, AZURE_AD) {
	constructor(private usersService: UsersService) {
		if (!enableAzureADStrategy) throw new Error('Azure AD is not enabled')
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
		} as IBearerStrategyOption)
	}

	async validate(payload: any) {
		return enableAzureADStrategy && payload['email'] && (await this.usersService.validateEmail(payload.email))
	}
}

export const AzureADGuard = AuthGuard(AZURE_AD)
