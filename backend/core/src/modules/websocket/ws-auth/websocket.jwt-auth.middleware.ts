import { Socket } from 'socket.io'
import { WebsocketJwtAuthGuard } from './websocket.jwt-auth.guard'

export type SocketIOMiddleware = {
	(client: Socket, next: (err?: Error) => void): void
}

export const WebsocketJwtAuthMiddleware = (): SocketIOMiddleware => {
	return (client: Socket, next) => {
		try {
			WebsocketJwtAuthGuard.validateToken(client)
			console.log('WebsocketJwtAuthMiddleware')
			next()
		} catch (err) {
			console.log('WebsocketJwtAuthMiddleware error: ', err)
			next(err as Error)
		}
	}
}
