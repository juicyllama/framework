import { faker } from '@faker-js/faker'
import { Csv, File, Json } from '@juicyllama/utils'
import { MockUserRequest, Scaffold, ScaffoldDto, TestEndpoint } from '../../test'
import { BulkUploadResponse, METHOD } from '../../types'
import { AuthService } from '../auth/auth.service'
import { User } from './users.entity'
import { UserRole } from './users.enums'
import { UsersModule } from './users.module'
import { UsersService } from './users.service'

const csv = new Csv()
const file = new File()
const json = new Json()


const E = User
type T = User
const MODULE = UsersModule
const SERVICE = UsersService
const url = '/users'
const NAME = 'User'
let userService: UsersService
let authService: AuthService
let user: User

describe(`${NAME} Endpoints`, () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)
		userService = <UsersService>scaffold.module.get(SERVICE)
		authService = <AuthService>scaffold.module.get(AuthService)
		user = await userService.create({
			...MockUserRequest(scaffold.values.account),
			first_name: 'Owner',
		})
	})

	async function testBulkUpload(first_name, last_name, email) {
		const { csv_file, filePath, dirPath } = await csv.createTempCSVFileFromString(
			`first_name,last_name,email\n${first_name},${last_name},${email}`
		)
		const res = await TestEndpoint<BulkUploadResponse>({
			type: METHOD.CREATE,
			//@ts-ignore
			scaffold: scaffold,
			url: `${url}/upload`,
			attach: {
				field: 'file',
				file: csv_file.path
			},
			skipResultCheck: true,
		})
		try {
			await file.unlink(filePath, dirPath)
		} catch (e: any) {
			scaffold.services.logger.warn(e.message)
		}
		return res;
	}

	describe('#bulkUpload', () => {
		it('creates a user', async () => {
			const first_name = faker.person.firstName()
			const last_name = faker.person.lastName()
			const email = faker.internet.email()

			const res = await testBulkUpload(first_name, last_name, email)
			expect(res.created).toEqual(1)
			const users = await scaffold.services.service.findAll({})
			const lastUser = users.pop()
			expect(lastUser.first_name).toEqual(first_name)
			expect(lastUser.last_name).toEqual(last_name)
			expect(lastUser.email).toEqual(email)

		})

		it('Adds newly created user to creating user\'s account with a VIEWER role', async () => {
			const first_name = faker.person.firstName()
			const last_name = faker.person.lastName()
			const email = faker.internet.email()

			const res = await testBulkUpload(first_name, last_name, email)
			expect(res.created).toEqual(1)
			const users = await scaffold.services.service.findAll({})
			const lastUser = users.pop()
			const account = lastUser.accounts?.find(a => a.account_id === scaffold.values.account.account_id)

			expect(account).toBeDefined()
			expect(account.account_id).toEqual(scaffold.values.account.account_id)
			const permission = <any>await authService.getRole(lastUser.user_id, scaffold.values.account.account_id)
			expect(permission).toBeDefined()
			expect(permission.role).toEqual(UserRole.VIEWER)
		})
	})

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
