import { Logger } from '@juicyllama/utils'
import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common'
import { isNil } from 'lodash'

const logger = new Logger()

export const AccountId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest()

	let account_id = request.headers['account-id']

	if (!account_id || isNil(account_id)) {
		logger.warn('[@AccountId Decorator] Missing reverting to first account in user auth object')
		account_id = request.user.account_ids[0]
	}

	if (!account_id || isNil(account_id)) {
		logger.warn('[@AccountId Decorator] Missing header / user value: account-id', request)
		console.table(request.headers)
		throw new BadRequestException('Missing value: account-id')
	}

	return Number(account_id)
})
