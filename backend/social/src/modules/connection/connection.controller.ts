import { Controller, forwardRef, Inject, Param, Req, Get, Post, Delete } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import {
	Query as TQuery,
	AccountId,
	AuthService,
	UserAuth,
	BaseController,
	AuthenticatedRequest,
} from '@juicyllama/core'
import { ConnectionService } from './connection.service'
import { connectionConstants as constants, CONNECTION_T as T } from './connection.constants'

@ApiTags('Connection')
@UserAuth()
@Controller('social/connection/:connection_identifier')
export class ConnectionController extends BaseController<T> {
	constructor(
		@Inject(forwardRef(() => AuthService)) readonly authService: AuthService,
		@Inject(forwardRef(() => ConnectionService)) readonly service: ConnectionService,
		@Inject(forwardRef(() => TQuery)) readonly tQuery: TQuery<T>,
	) {
		super(service, tQuery, constants, {
			services: {
				authService,
			},
		})
	}

	@ApiOperation({ summary: 'Get Connections' })
	@Get()
	async getConnections(
		@Req() req: AuthenticatedRequest,
		@AccountId() account_id: number,
		@Param('connection_identifier') connection_identifier: string,
	): Promise<T[]> {
		await this.authService.check(req.user.user_id, account_id)

		return await this.service.findAll({
			where: [
				{
					connection_identifier,
					user_id: req.user.user_id,
				},
			],
		})
	}

	@ApiOperation({ summary: 'Create Connection' })
	@Post(':user_id')
	async createConnection(
		@Req() req: AuthenticatedRequest,
		@AccountId() account_id: number,
		@Param('connection_identifier') connection_identifier: string,
		@Param('user_id') user_id: number,
	): Promise<T> {
		await this.authService.check(req.user.user_id, account_id)
		return await this.service.createConnection(connection_identifier, req.user.user_id, user_id)
	}

	@ApiOperation({ summary: 'Delete Connection' })
	@Delete('/:user_id')
	async deleteConnection(
		@Req() req: AuthenticatedRequest,
		@AccountId() account_id: number,
		@Param('connection_identifier') connection_identifier: string,
		@Param('user_id') user_id: number,
	): Promise<void> {
		await this.authService.check(req.user.user_id, account_id)
		return await this.service.deleteConnection(connection_identifier, req.user.user_id, user_id)
	}
}
