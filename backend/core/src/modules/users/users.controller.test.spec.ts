import * as fs from 'fs'
import * as path from 'path'
import { UsersModule } from './users.module'
import { MockUserRequest, Scaffold, ScaffoldDto, TestEndpoint } from '../../test'
import { User } from './users.entity'
import { METHOD } from '../../types'
import { UsersService } from './users.service'
import { UserRole } from './users.enums'
import { faker } from '@faker-js/faker'
import { Role } from '../auth/role.entity'

const E = User
type T = User
const MODULE = UsersModule
const SERVICE = UsersService
const url = '/users'
const NAME = 'User'
const PRIMARY_KEY = 'user_id'

describe(`${NAME} Endpoints`, () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)
		scaffold.values.mock = MockUserRequest(scaffold.values.account)
	})

	describe('Create', () => {
		it(`Create a new ${NAME}`, async () => {
			scaffold.values.record = await TestEndpoint<T>({
				type: METHOD.CREATE,
				scaffold: scaffold,
				url: url,
				PRIMARY_KEY: PRIMARY_KEY,
				data: scaffold.values.mock,
				emitCheckResultKeys: ['password'],
			})
		})
	})

	describe('Get, List, Stats & Search', () => {
		it(`Get ${NAME}`, async () => {
			await TestEndpoint<T>({
				type: METHOD.GET,
				scaffold: scaffold,
				url: `${url}/${scaffold.values.record[PRIMARY_KEY]}`,
				PRIMARY_KEY: PRIMARY_KEY,
				primaryKey: scaffold.values.record[PRIMARY_KEY],
			})
		})

		it(`List ${NAME}`, async () => {
			await TestEndpoint<T[]>({
				type: METHOD.LIST,
				//@ts-ignore
				scaffold: scaffold,
				url: url,
				PRIMARY_KEY: PRIMARY_KEY,
			})
		})

		it(`Count ${NAME}`, async () => {
			await TestEndpoint<T[]>({
				type: METHOD.COUNT,
				//@ts-ignore
				scaffold: scaffold,
				url: url,
			})
		})

		it('Search by first name', async () => {
			await TestEndpoint<T[]>({
				type: METHOD.LIST,
				//@ts-ignore
				scaffold: scaffold,
				url: url,
				PRIMARY_KEY: PRIMARY_KEY,
				queryParams: {
					search: scaffold.values.mock.first_name,
				},
			})
		})
	})

	describe('Update', () => {
		it(`Update ${NAME} `, async () => {
			await TestEndpoint<T>({
				type: METHOD.UPDATE,
				scaffold: scaffold,
				url: `${url}/${scaffold.values.record[PRIMARY_KEY]}`,
				PRIMARY_KEY: PRIMARY_KEY,
				data: {
					first_name: faker.person.firstName(),
				},
			})
		})

		it(`Update ${NAME} Role`, async () => {
			await TestEndpoint<Role>({
				type: METHOD.UPDATE,
				//@ts-ignore
				scaffold: scaffold,
				url: `${url}/${scaffold.values.record[PRIMARY_KEY]}/role`,
				PRIMARY_KEY: PRIMARY_KEY,
				data: {
					role: UserRole.ADMIN,
				},
				emitCheckResultKeys: ['role'],
			})

			const role = await scaffold.services.authService.getRole(
				scaffold.values.record[PRIMARY_KEY],
				scaffold.values.account.account_id,
			)
			expect(role.role).toEqual(UserRole.ADMIN)
		})
	})

	describe('Upload CSV', () => {
		it(`Inserts one record `, async () => {
			const { filePath, unlink } = await createTempFileFromString(
				`first_name,last_name,email
John,Snow,john@got.com`,
			)
			const res = await TestEndpoint<T>({
				type: METHOD.POST,
				scaffold: scaffold,
				url: `${url}/upload_csv`,
				attach: {
					field: 'file',
					file: filePath,
				},
				skipResultCheck: true,
			})
			await unlink()
			expect(res['affectedRows']).toEqual(1)
			const users = await scaffold.services.service.findAll({})
			const lastUser = users.pop()
			expect(lastUser.first_name).toEqual('John')
			expect(lastUser.last_name).toEqual('Snow')
			expect(lastUser.email).toEqual('john@got.com')
		})

		it(`Inserts two records`, async () => {
			const { filePath, unlink } = await createTempFileFromString(
				`first_name,last_name,email
Amy,Smith,amy@smith.com				
John1,Snow1,john@got1.com`,
			)
			const res = await TestEndpoint<T>({
				type: METHOD.POST,
				scaffold: scaffold,
				url: `${url}/upload_csv`,
				attach: {
					field: 'file',
					file: filePath,
				},
				skipResultCheck: true,
			})
			await unlink()
			console.log('resres', res)
			expect(res['affectedRows']).toEqual(2)
		})

		it(`Inserts 0 records if duplicate is found`, async () => {
			const { filePath, unlink } = await createTempFileFromString(
				`first_name,last_name,email
Amy,Smith,amy@smith.com				
John1,Snow1,john@got1.com`,
			)
			const usersCount = await scaffold.services.service.count({})
			const res = await TestEndpoint<T>({
				type: METHOD.POST,
				scaffold: scaffold,
				url: `${url}/upload_csv`,
				attach: {
					field: 'file',
					file: filePath,
				},
				skipResultCheck: true,
			})
			await unlink()
			const newUsersCount = await scaffold.services.service.count({})
			expect(res['statusCode']).toEqual(400)
			expect(res['message']).toMatch("Duplicate entry 'amy@smith.com")
			expect(newUsersCount).toEqual(usersCount)
		})
	})

	describe('Remove', () => {
		it(`Remove ${NAME}`, async () => {
			await TestEndpoint<T>({
				type: METHOD.DELETE,
				scaffold: scaffold,
				url: `${url}/${scaffold.values.record[PRIMARY_KEY]}`,
				PRIMARY_KEY: PRIMARY_KEY,
			})
		})
	})

	afterAll(async () => {
		await scaffolding.down(E)
	})
})

async function createTempFileFromString(content: string): Promise<{ filePath: string; unlink: () => Promise<void> }> {
	try {
		const tempDir = fs.mkdtempSync(path.join(fs.realpathSync('.'), 'temp-'))
		const tempFilePath = path.join(tempDir, 'temp-file.csv')
		await fs.promises.writeFile(tempFilePath, content, 'utf-8')
		return { filePath: tempFilePath, unlink: () => fs.promises.unlink(tempFilePath) }
	} catch (error) {
		throw new Error(`Error creating temporary file: ${error}`)
	}
}
