import { applyDecorators, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
	ApiBearerAuth,
	ApiForbiddenResponse,
	ApiHeader,
	ApiNotFoundResponse,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { AZURE_AD, JWT } from '../modules/auth/auth.constants'

export function UserAuth(options?: { skipAccountId?: boolean }) {
	const decorators = [ApiBearerAuth()]

	if (process.env.AZURE_AD_CLIENT_ID && process.env.AZURE_AD_TENANT_ID && process.env.AZURE_AD_CLIENT_SECRET) {
		decorators.push(UseGuards(AuthGuard([JWT, AZURE_AD])))
	} else {
		decorators.push(UseGuards(AuthGuard(JWT)))
	}

	if (!options?.skipAccountId) {
		decorators.push(
			ApiHeader({
				name: 'account-id',
				description: 'The account you are acting for',
				required: true,
				example: 1,
			}),
		)
	}

	decorators.push(
		ApiUnauthorizedResponse({
			description: 'Authentication problem, check access token or account permissions',
		}),
	)

	decorators.push(
		ApiForbiddenResponse({
			description: 'User role does not have sufficient permissions to access this endpoint',
		}),
	)

	decorators.push(ApiNotFoundResponse({ description: 'Not Found' }))

	return applyDecorators(...decorators)
}
