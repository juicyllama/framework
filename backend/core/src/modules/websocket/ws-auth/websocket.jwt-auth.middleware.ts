import { Socket } from 'socket.io'
import { WebsocketJwtAuthGuard } from './websocket.jwt-auth.guard'

export type SocketIOMiddleware = {
	(client: AuthSocket, next: (err?: Error) => void): void
}

export interface AuthSocket extends Socket {
	user: any
}

export const WebsocketJwtAuthMiddleware = (): SocketIOMiddleware => {
	return (client: AuthSocket, next) => {
		try {
			const payload = WebsocketJwtAuthGuard.validateToken(client)
			client.user = payload
			next()
		} catch (err) {
			next(err as Error)
		}
	}
}
