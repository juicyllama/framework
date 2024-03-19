import { INestApplication } from '@nestjs/common'
import { IoAdapter } from '@nestjs/platform-socket.io'
import { Test, TestingModule } from '@nestjs/testing'
import ioc, { Socket } from 'socket.io-client'
import * as jwt from 'jwt-simple'
import { WebsocketGateway } from './websocket.gateway'

describe('WebsocketGateway', () => {
	let gateway: WebsocketGateway
	let app: INestApplication
	let clientSocket: Socket
	let token: string

	beforeEach(async () => {
		if (!process.env.JWT_KEY) {
			throw new Error('JWT_KEY not found')
		}
		token = jwt.encode({ email: 'test@test.com', user_id: 1, account_ids: [] }, process.env.JWT_KEY)
		const module: TestingModule = await Test.createTestingModule({
			providers: [WebsocketGateway],
		}).compile()
		gateway = module.get<WebsocketGateway>(WebsocketGateway)
		app = module.createNestApplication()
	})

	afterEach(async () => {
		clientSocket?.disconnect()
		await app.close()
	})

	// it('should be defined', () => {
	// 	expect(gateway).toBeDefined()
	// })

	it(`should throw error with an invalid token`, async () => {
		await app.listen(8081)
		const clientSocket= ioc(`http://localhost:${8081}`, {
			extraHeaders: {
				authorization: `Bearer invalid_token`,
			},
		})
		const errorCall = async () => await awaitSocket(clientSocket, 1000)
		expect(errorCall).rejects.toThrow('Timeout')
	})


	it(`should connect with valid token`, async () => {
		await app.listen(8081)
		const clientSocket= ioc(`http://localhost:${8081}`, {
			extraHeaders: {
				authorization: `Bearer ${token}`,
			},
		})
		await awaitSocket(clientSocket, 1000)
		
		// clientSocket.send(
		// 	JSON.stringify({
		// 		event: 'push',
		// 		data: {
		// 			test: 'test',
		// 		},
		// 	}),
		// )
		// await new Promise<void>(resolve =>
		// 	clientSocket.on('message', data => {
		// 		expect(JSON.parse(data as any).data.test).toBe('test')
		// 		ws.close()
		// 		resolve()
		// 	}),
		// )
	})
})

async function awaitSocket(clientSocket: Socket, timeoutMs: number = 1000) {
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
