import { Body, Controller, forwardRef, Inject, Param, Patch, Post, Req, UseGuards } from '@nestjs/common'
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
import { JwtAuthGuard } from '@juicyllama/core'
import { AiService } from './ai.service'
import { Ai } from './ai.entity'
import { AiChatRequest } from './ai.dto'
import { DeepPartial } from 'typeorm'

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
	constructor(@Inject(forwardRef(() => AiService)) private readonly aiService: AiService) {}

	@ApiOperation({ summary: 'Ask', description: 'Query public/general AI models' })
	@ApiOkResponse({
		description: 'OK',
		type: Ai,
	})
	@Post('ask')
	async ask(@Req() req, @Body() data: AiChatRequest): Promise<Ai> {
		return await this.aiService.chat(data)
	}

	// @ApiOperation({ summary: 'Ask', description: 'Query public/general AI models' })
	// @ApiOkResponse({
	// 	description: 'OK',
	// 	type: Ai,
	// })
	// @Post('sql')
	// async sql(@Req() req, @Body() data: AiSQLRequest): Promise<Ai> {
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
	async update(@Req() req, @Param('ai_id') ai_id: number, @Body() ai_data: DeepPartial<Ai>): Promise<Ai> {
		return await this.aiService.update({
			ai_id: ai_id,
			...ai_data,
		})
	}
}
