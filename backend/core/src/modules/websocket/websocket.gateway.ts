import { Logger } from '@juicyllama/utils'
import { UseGuards } from '@nestjs/common'
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets'
import { Server } from 'socket.io'
import { WebsocketServerToClientDto } from './websocket.server-to-client.dto'
import { WebsocketJwtAuthGuard } from './ws-auth/websocket.jwt-auth.guard'
import { WebsocketJwtAuthMiddleware } from './ws-auth/websocket.jwt-auth.middleware'
import { WebsocketService } from './websocket.service'

@UseGuards(WebsocketJwtAuthGuard)
@WebSocketGateway({ cors: true })
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	websocketServiceCtrl: any

	constructor(
		private readonly logger: Logger,
		private websocketService: WebsocketService,
	) {}

	//@ts-ignore
	@WebSocketServer() server: Server<any, WebsocketServerToClientDto>

	afterInit(server: Server) {
		server.use(WebsocketJwtAuthMiddleware() as any)
		if (this.server) {
			this.logger.debug('Websocket server initialized')
			this.websocketServiceCtrl = this.websocketService.setServer(server)
		} else {
			throw new Error('Websocket server not initialized')
		}
	}

	handleConnection(client: any, ...args: any[]) {
		this.websocketServiceCtrl.setUser(client.user.user_id, client.id)
		this.logger.debug(
			`Client id: ${client.id} connected. user_id=${client.user.user_id}. Number of connected clients: ${this.server.sockets.sockets.size}`,
		)
	}

	handleDisconnect(client: any) {
		this.websocketServiceCtrl.removeUser(client.user.user_id)
		this.logger.debug(
			`Cliend id:${client.id} disconnected. user_id=${client.user.user_id}. Number of connected clients: ${this.server.sockets.sockets.size}`,
		)
	}

	@SubscribeMessage('message')
	handleMessage(client: any, payload: any): string {
		this.logger.log('handleMessage', payload)
		return 'Hello world!'
	}
}
