import { Logger } from '@juicyllama/utils'
import { Injectable } from '@nestjs/common'
import { Server } from 'socket.io'

type WebsocketServiceCtrl = {
	setUser: (userId: number, socketId: string) => void
	removeUser: (userId: number) => void
}

@Injectable()
export class WebsocketService {
	private server: Server | null = null
	private connectedUserSockets: Map<number, string> = new Map() // user_id -> socket_id

	constructor(private readonly logger: Logger) {}

	public setServer(server: Server): WebsocketServiceCtrl {
		this.server = server
		return {
			setUser: (userId: number, socketId: string) => {
				this.connectedUserSockets.set(userId, socketId)
				this.logger.debug(`User ${userId} connected with socketId ${socketId}`)
			},

			removeUser: (userId: number) => {
				this.connectedUserSockets.delete(userId)
				this.logger.debug(`User ${userId} disconnected`)
			},
		}
	}

	public emit(event: string, data: any, userId?: number) {
		if (!this.server) throw new Error('Server not initialized')
		if (userId) {
			const socketId = this.connectedUserSockets.get(userId)
			if (socketId) {
				this.logger.debug(`Emitting to user ${userId} with socketId ${socketId}`)
				this.server.to(socketId).emit(event, data)
			} else {
				this.logger.debug(
					`User ${userId} not connected. connectedUserSockets: ${Object.keys(this.connectedUserSockets)}`,
				)
			}
			return
		} else {
			this.server.emit(event, data)
		}
	}

	// public getServer(): Server {
	// 	if (!this.server) throw new Error('Server not initialized')
	// 	return this.server
	// }
}
