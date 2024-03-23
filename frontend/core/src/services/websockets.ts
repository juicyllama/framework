import { io, Socket } from 'socket.io-client'
import { logger } from '../helpers'
import { LogSeverity } from '../types'
import { refreshToken } from './auth'
import instance from '.'
import _ from 'lodash'

let socket: Socket | null = null
let connectionPromise: Promise<Socket> | null

export async function openWebsocket() {
	if (socket) {
		logger({ severity: LogSeverity.WARN, message: `[Websocket] Already open` })
		return
	}
	if (connectionPromise) {
		logger({ severity: LogSeverity.WARN, message: `[Websocket] Already connecting` })
		return
	}
	const baseURL = instance.defaults.baseURL
	const accessToken = await refreshToken() // Refresh the token
	if (_.isString(baseURL) && _.isString(accessToken)) {
		try {
			const _socket: Socket = io(baseURL, {
				extraHeaders: {
					Authorization: `Bearer ${accessToken}`,
				},
			})
			connectionPromise = new Promise<Socket>((resolve, reject) => {
				_socket.on('connect', () => {
					socket = _socket
					logger({ severity: LogSeverity.VERBOSE, message: `[Websocket] Connected` })
					resolve(_socket)
				})
				_socket.on('connect_error', error => {
					console.error('[Websocket] Connection error', error)
					logger({
						severity: LogSeverity.ERROR,
						message: `[Websocket] Connection error. msg=${error.message}`,
						object: error,
					})
					refreshToken().then(newToken => {
						logger({
							severity: LogSeverity.VERBOSE,
							message: `[Websocket] Reconnecting with new token`,
							object: error,
						})
						_socket.io.opts.extraHeaders.Authorization = `Bearer ${newToken}`
						_socket.connect()
					})
					reject(error)
				})
			})
			await connectionPromise
		} catch (error) {
			logger({ severity: LogSeverity.ERROR, message: `[Websocket] Failed to connect`, object: error })
			throw error
		}
	} else {
		logger({
			severity: LogSeverity.WARN,
			message: `[Websocket] Failed to obtain baseURL or access token`,
			object: { baseURL, accessToken: (accessToken || 'undefined').substring(0, 10) },
		})
		throw new Error('Failed to obtain access token')
	}
}

export function closeWebsocket() {
	if (socket) {
		socket.close()
		socket = null
		logger({ severity: LogSeverity.WARN, message: `[Websocket] Disconnected` })
	}
}

export async function subscribeWebsocket(event: string, listener: (data: any) => void): Promise<void> {
	if (!connectionPromise) {
		await openWebsocket()
	}
	if (!socket) {
		logger({
			severity: LogSeverity.VERBOSE,
			message: `[Websocket] Waiting for connection`,
		})
	}
	const _socket = await connectionPromise
	_socket.on(event, listener)
	logger({ severity: LogSeverity.VERBOSE, message: `[Websocket] Listening for events: ${event}` })
}

export async function unsubscribeWebsocket(event: string, listener?: (data: any) => void): Promise<void> {
	if (!socket) {
		logger({ severity: LogSeverity.ERROR, message: `[Websocket] Not open` })
		return
	}
	socket.off(event, listener)
	logger({ severity: LogSeverity.VERBOSE, message: `[Websocket] Unbind for events: ${event}` })
}
