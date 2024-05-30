import { METHOD, MockUserRequest, Scaffold, ScaffoldDto, TestEndpoint, User, UsersService } from '@juicyllama/core'
import {
	CONNECTION_ENDPOINT,
	CONNECTION_PRIMARY_KEY,
	CONNECTION_E as E,
	CONNECTION_T as T,
} from './connection.constants'
import { ConnectionModule } from './connection.module'
import { ConnectionService } from './connection.service'
import { ConnectionType } from './connection.enums'

describe('Social > Connections', () => {
	const scaffolding = new Scaffold<T>()

	let scaffold: ScaffoldDto<T>
	let connection: T
	let connections: T[]
	let userService: UsersService

	//Testing users
	let homer: User

	beforeAll(async () => {
		scaffold = await scaffolding.up(ConnectionModule, ConnectionService)
		userService = <UsersService>scaffold.module.get(UsersService)

		homer = await userService.create({
			...MockUserRequest(scaffold.values.account),
			first_name: 'Homer',
			last_name: 'Simpson',
		})
	})

	describe('Get Connections', () => {
		it('No Connections', async () => {
			connections = <T[]>(<any>await TestEndpoint<T>({
				type: METHOD.GET,
				scaffold: scaffold,
				url: CONNECTION_ENDPOINT + '/TEST',
				skipResultCheck: true,
			}))
			expect(connections).toBeDefined()
			expect(connections.length).toBe(0)
		})
	})

	describe('Create Connections', () => {
		it('Single Connection', async () => {
			connection = <T>await TestEndpoint<T>({
				type: METHOD.POST,
				scaffold: scaffold,
				url: CONNECTION_ENDPOINT + '/TEST/' + homer.user_id,
				skipResultCheck: true,
			})
			expect(connection).toBeDefined()
			expect(connection.connection_id).toBeDefined()
			expect(connection.connection_user_id).toBe(homer.user_id)
			expect(connection.user_id).toBe(scaffold.values.owner.user_id)
		})

		it('Double Connection', async () => {
			//Create connection from homer to owner
			await scaffold.services.service.createConnection('TEST', homer.user_id, scaffold.values.owner.user_id)

			connections = <T[]>(<any>await TestEndpoint<T>({
				type: METHOD.GET,
				scaffold: scaffold,
				url: CONNECTION_ENDPOINT + '/TEST',
				skipResultCheck: true,
			}))
			expect(connections).toBeDefined()
			expect(connections.length).toBe(1)
			expect(connections[0].connection_user_id).toBe(homer.user_id)
			expect(connections[0].type).toBe(ConnectionType.FRIENDS)
		})
	})

	describe('Remove Connections', () => {
		it('Remove secondary side connection', async () => {
			await scaffold.services.service.deleteConnection('TEST', homer.user_id, scaffold.values.owner.user_id)

			connections = <T[]>(<any>await TestEndpoint<T>({
				type: METHOD.GET,
				scaffold: scaffold,
				url: CONNECTION_ENDPOINT + '/TEST',
				skipResultCheck: true,
			}))
			expect(connections).toBeDefined()
			expect(connections.length).toBe(1)
			expect(connections[0].connection_user_id).toBe(homer.user_id)
			expect(connections[0].type).toBe(ConnectionType.FOLLOW)
		})

		it('Remove primary side connection', async () => {
			await TestEndpoint<T>({
				type: METHOD.DELETE,
				scaffold: scaffold,
				url: CONNECTION_ENDPOINT + '/TEST/' + homer.user_id,
				skipResultCheck: true,
			})

			connections = <T[]>(<any>await TestEndpoint<T>({
				type: METHOD.GET,
				scaffold: scaffold,
				url: CONNECTION_ENDPOINT + '/TEST',
				skipResultCheck: true,
			}))
			expect(connections).toBeDefined()
			expect(connections.length).toBe(0)
		})
	})

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
