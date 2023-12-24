import { applyDecorators, UseGuards } from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiForbiddenResponse,
	ApiHeader,
	ApiNotFoundResponse,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'

export function UserAuth(options?: { skipAccountId?: boolean }) {
	const decorators = [ApiBearerAuth(), UseGuards(AuthGuard(['jwt', 'azure-ad']))]

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
