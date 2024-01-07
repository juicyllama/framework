import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Logger } from '@juicyllama/utils'
import _ from 'lodash'
const { isNil } = _

export const AccountId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest()

	const account_id = request.headers['account-id']

	if (!account_id || isNil(account_id)) {
		const logger = new Logger()
		logger.warn('[@AccountId Decorator] Missing required header value: account-id', request)
		console.table(request.headers)
		throw new BadRequestException('Missing required header value: account-id')
	}

	return Number(account_id)
})
