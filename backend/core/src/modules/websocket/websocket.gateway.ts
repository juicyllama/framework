import { Logger } from '@juicyllama/utils'
import { Injectable } from '@nestjs/common'
import { UseGuards } from '@nestjs/common'
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets'
// import { Server } from 'socket.io'
import { WebsocketJwtAuthGuard } from './ws-auth/websocket.jwt-auth.guard'
import { WebsocketServerToClientDto } from './websocket.server-to-client.dto'
import { WebsocketJwtAuthMiddleware } from './ws-auth/websocket.jwt-auth.middleware'
import { Socket, Server } from 'socket.io'

@UseGuards(WebsocketJwtAuthGuard)
@WebSocketGateway()
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	logger: Logger = new Logger()

	@WebSocketServer() server: Server<any, WebsocketServerToClientDto> | undefined = undefined

	afterInit(client: any) {
		client.use(WebsocketJwtAuthMiddleware() as any)
		this.logger.log('Websocket server initialized', this.server?.sockets.sockets, this.server?._opts)
		// this.server.emit('event', 'Hello world!')
	}

	handleConnection(client: any, ...args: any[]) {
		if (!this.server) {
			this.logger.error('Server is not initialized')
			return
		}
		const { sockets } = this.server.sockets

		this.logger.log(`Client id: ${client.id} connected`)
		this.logger.debug(`Number of connected clients: ${sockets.size}`)
	}

	handleDisconnect(client: any) {
		this.logger.log(`Cliend id:${client.id} disconnected`)
	}

	@SubscribeMessage('message')
	handleMessage(client: any, payload: any): string {
		this.logger.log('handleMessage', payload)
		return 'Hello world!'
	}
}
