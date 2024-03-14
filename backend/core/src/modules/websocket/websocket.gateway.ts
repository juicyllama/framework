import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'

@WebSocketGateway({ namespace: '/websockets' })
@UseGuards(WsJwtGuard)
export class WebsocketGateway {
	constructor(readonly logger: Logger) {}

	@WebSocketServer()
	server: Server<any, ServerToClientEvent>

	afterInit(client: any) {
		client.use(SocketAuthMiddleware() as any)
		this.logger.log('Websocket server initialized')
	}

	@SubscribeMessage('message')
	handleMessage(client: any, payload: any): string {
		return 'Hello world!'
	}
}
