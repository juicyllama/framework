import { INestApplication } from '@nestjs/common'
import { IoAdapter } from '@nestjs/platform-socket.io'
import { Test, TestingModule } from '@nestjs/testing'
import ioc, { Socket } from 'socket.io-client'
import * as jwt from 'jwt-simple'
import { WebsocketGateway } from './websocket.gateway'
import { WebsocketService } from './websocket.service'
import { Logger } from '@juicyllama/utils'

const USER1 = { email: 'test@test.com', user_id: 1, account_ids: [] }
const USER2 = { email: 'test2@test.com', user_id: 2, account_ids: [] }

describe('WebsocketGateway', () => {
	let gateway: WebsocketGateway
	let service: WebsocketService
	let app: INestApplication
	let token: string
	let listenAndOpenSocket: any
	let clientSocket: Socket
	beforeEach(async () => {
		if (!process.env.JWT_KEY) {
			throw new Error('JWT_KEY not found')
		}
		token = jwt.encode(USER1, process.env.JWT_KEY)
		const module: TestingModule = await Test.createTestingModule({
			providers: [WebsocketGateway, WebsocketService, Logger],
		}).compile()
		gateway = module.get<WebsocketGateway>(WebsocketGateway)
		service = module.get<WebsocketService>(WebsocketService)
		app = module.createNestApplication()
		listenAndOpenSocket = async (authToken: string) => {
			await app.listen(8081)
			clientSocket = ioc(`http://localhost:${8081}`, {
				extraHeaders: {
					authorization: `Bearer ${authToken}`,
				},
			})
			await waitForSocket(clientSocket, 1000)
			// clientSocket.onAny((eventName, ...args) => {
			// 	console.log(`Received event: ${eventName}`)
			// 	console.log(`Arguments: ${args}`)
			// })
		}
	})

	afterEach(async () => {
		clientSocket?.disconnect()
		await app.close()
	})

	it('gateway should be defined', () => {
		expect(gateway).toBeDefined()
	})

	it(`should throw error with an invalid token`, async () => {
		expect(listenAndOpenSocket('invalid_token')).rejects.toThrow('Timeout')
	})

	it(`should connect with a valid token`, async () => {
		await listenAndOpenSocket(token)
	})

	it(`should send message to all users`, async () => {
		await listenAndOpenSocket(token)
		service.emit('testABC', { test: 'test123' })
		const event = await connectSocket(clientSocket, 'testABC')
		expect(event).toEqual({ test: 'test123' })
	})

	it(`should send message to specific user`, async () => {
		await listenAndOpenSocket(token)
		service.emit('testABC', { test: 'test123' }, 1)
		const event = await connectSocket(clientSocket, 'testABC')
		expect(event).toEqual({ test: 'test123' })
	})

	it(`should not send message to specific user if user is not connected`, async () => {
		await listenAndOpenSocket(token)
		service.emit('testABC', { test: 'test123' }, 2)
	})

	it(`A user should not receive message that was not sent to him`, async () => {
		await listenAndOpenSocket(token) // user 1

		// user 2
		const user2token = jwt.encode(USER2, process.env.JWT_KEY as string)
		const user2Socket = ioc(`http://localhost:${8081}`, {
			extraHeaders: {
				authorization: `Bearer ${user2token}`,
			},
		})
		await waitForSocket(user2Socket, 1000)

		const promises = [connectSocket(clientSocket, 'testABC', 1000), connectSocket(user2Socket, 'testABC', 1000)]
		service.emit('testABC', { test: 'test123' }, 2) // send to user 2
		const [eventUser1, eventUser2] = await Promise.all(promises)
		user2Socket.close()
		expect(eventUser1).toBeUndefined()
		expect(eventUser2).toBeDefined()
	})

	it(`A user should not receive message that was not sent to him (opposite case)`, async () => {
		await listenAndOpenSocket(token) // user 1

		// user 2
		const user2token = jwt.encode(USER2, process.env.JWT_KEY as string)
		const user2Socket = ioc(`http://localhost:${8081}`, {
			extraHeaders: {
				authorization: `Bearer ${user2token}`,
			},
		})
		await waitForSocket(user2Socket, 1000)

		const promises = [connectSocket(clientSocket, 'testABC', 1000), connectSocket(user2Socket, 'testABC', 1000)]
		service.emit('testABC', { test: 'test123' }, 1) // send to user 2
		const [eventUser1, eventUser2] = await Promise.all(promises)
		user2Socket.close()
		expect(eventUser1).toBeDefined()
		expect(eventUser2).toBeUndefined()
	})
})

// helpers

async function waitForSocket(clientSocket: Socket, timeoutMs: number = 1000) {
	return await new Promise((resolve, reject) => {
		let done = false
		setTimeout(() => {
			if (!done) {
				reject('Timeout')
			}
		}, timeoutMs)
		// @ts-ignore
		clientSocket.on('connect', () => {
			done = true
			resolve(1)
		})

		clientSocket.on('error', error => {
			console.error('An error occurred:', error)
			done = true
			reject(error)
		})

		clientSocket.on('disconnect', reason => {
			done = true
			reject(reason)
		})
	})
}

async function connectSocket(clientSocket: Socket, eventName: string, timeoutMs: number = 1000) {
	return await new Promise((resolve, reject) => {
		let done = false
		setTimeout(() => {
			if (!done) {
				resolve(undefined)
			}
		}, timeoutMs)
		clientSocket.on(eventName, data => {
			done = true
			resolve(data)
		})
	})
}
