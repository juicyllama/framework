import { AuthService, JwtAuthGuard, AccountId, AuthenticatedRequest } from '@juicyllama/core'
import { Body, Controller, Param, Patch, Post, Req, UseGuards, forwardRef, Inject } from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { DeepPartial } from 'typeorm'
import { AiChatRequest } from './ai.dto'
import { Ai } from './ai.entity'
import { AiService } from './ai.service'

@ApiTags('Ai')
@Controller('ai')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse({
	description: 'Authentication problem, check access token or account permissions',
})
@ApiForbiddenResponse({
	description: 'User role does not have sufficient permissions to access this endpoint',
})
@ApiNotFoundResponse({ description: 'Not Found' })
export class AiController {
	constructor(
		@Inject(forwardRef(() => AiService)) private readonly aiService: AiService,
		@Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
	) {}

	@ApiOperation({ summary: 'Ask', description: 'Query public/general AI models' })
	@ApiOkResponse({
		description: 'OK',
		type: Ai,
	})
	@Post('ask')
	async ask(
		@Req() req: AuthenticatedRequest,
		@AccountId() account_id: number,
		@Body() data: AiChatRequest,
	): Promise<Ai> {
		await this.authService.check(req.user.user_id, account_id)
		return await this.aiService.chat(data)
	}

	// @ApiOperation({ summary: 'Ask', description: 'Query public/general AI models' })
	// @ApiOkResponse({
	// 	description: 'OK',
	// 	type: Ai,
	// })
	// @Post('sql')
	// async sql(@Req() req, @AccountId() account_id: number, @Body() data: AiSQLRequest): Promise<Ai> {
	//	await this.authService.check(req.user.user_id, account_id)
	// 	return await this.aiService.sql(data)
	// }

	@ApiOperation({
		summary: 'Update',
		description: 'Update a ai item, helpful for passing back learning data or feedback',
	})
	@ApiParam({
		name: 'ai_id',
		description: 'Specify the ai_id you wish to update',
		type: Number,
		required: true,
		example: 1,
	})
	@ApiOkResponse({
		description: 'OK',
		type: Ai,
	})
	@Patch('update/:ai_id')
	async update(
		@Req() req: AuthenticatedRequest,
		@AccountId() account_id: number,
		@Param('ai_id') ai_id: number,
		@Body() ai_data: DeepPartial<Ai>,
	): Promise<Ai> {
		await this.authService.check(req.user.user_id, account_id)
		return await this.aiService.update({
			ai_id: ai_id,
			...ai_data,
		})
	}
}
