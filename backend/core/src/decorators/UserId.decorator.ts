import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Logger } from '@juicyllama/utils'
import { isNil } from 'lodash'

export const UserId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest()

	const user_id = request.headers['user-id']

	if (!user_id || isNil(user_id)) {
		const logger = new Logger()
		logger.warn('[@UserId Decorator] Missing required header value: user-id', request)
		console.table(request.headers)
		throw new BadRequestException('Missing required header value: user-id')
	}

	return Number(user_id)
})
