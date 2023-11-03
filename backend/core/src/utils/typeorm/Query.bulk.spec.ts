import { UsersService } from '../../modules/users/users.service'
import { User } from '../../modules/users/users.entity'
import { Scaffold, ScaffoldDto } from '../../test'
import { UsersModule } from '../../modules/users/users.module'
import { ImportMode } from '../../types/common'
import { Csv, File } from '@juicyllama/utils'
import { UPLOAD_DUPLICATE_FIELD } from '../../modules/users/users.constants'
import { faker } from '@faker-js/faker'

const E = User
type T = User
const MODULE = UsersModule
const SERVICE = UsersService
const csv = new Csv()
const file = new File()

describe('Query Bulk', () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)
	})
	
	let first_name_shared = faker.person.firstName()
	const last_name_shared = faker.person.lastName()
	const email_shared = faker.internet.email({firstName: first_name_shared, lastName: last_name_shared})

	let first_name_shared_2 = faker.person.firstName()
	const last_name_shared_2 = faker.person.lastName()
	const email_shared_2 = faker.internet.email({firstName: first_name_shared_2, lastName: last_name_shared_2})

	let first_name_shared_3 = faker.person.firstName()
	const last_name_shared_3 = faker.person.lastName()
	const email_shared_3 = faker.internet.email({firstName: first_name_shared_3, lastName: last_name_shared_3})

	describe('CREATE', () => {
		it('Upload 1 User', async () => {
	
			const { csv_file, filePath, dirPath } = await csv.createTempCSVFileFromString(
				`first_name,last_name,email\n${first_name_shared},${last_name_shared},${email_shared}`
			)

			const data = await csv.parseCsvFile(csv_file)
			try{
				await file.unlink(filePath, dirPath)
			}catch(e: any){
				scaffold.services.logger.warn(e.message)
			}
			const res = await scaffold.query.bulk(scaffold.repository, data, ImportMode.CREATE)
			expect(res.created).toEqual(1)
			const users = await scaffold.services.service.findAll({})
			const lastUser = users.pop()
			expect(lastUser.first_name).toEqual(first_name_shared)
			expect(lastUser.last_name).toEqual(last_name_shared)
			expect(lastUser.email).toEqual(email_shared)
		})

		it(`Inserts two records`, async () => {

			
			const first_name_1 = faker.person.firstName()
			const last_name_1 = faker.person.lastName()
			const email_1 = faker.internet.email({firstName: first_name_1, lastName: last_name_1})

			const { csv_file, filePath, dirPath } = await csv.createTempCSVFileFromString(
				`first_name,last_name,email\n${first_name_1},${last_name_1},${email_1}\n${first_name_shared_2},${last_name_shared_2},${email_shared_2}`
			)

			const data = await csv.parseCsvFile(csv_file)
			try{
				await file.unlink(filePath, dirPath)
			}catch(e: any){
				scaffold.services.logger.warn(e.message)
			}
				const res = await scaffold.query.bulk(scaffold.repository, data, ImportMode.CREATE)
				expect(res.created).toEqual(2)
				const users = await scaffold.services.service.findAll({})
				const lastUser = users.pop()
				expect(lastUser.first_name).toEqual(first_name_shared_2)
				expect(lastUser.last_name).toEqual(last_name_shared_2)
				expect(lastUser.email).toEqual(email_shared_2)
		})

		it(`Inserts on duplicate`, async () => {
			const count = await scaffold.services.service.count()
			const { csv_file, filePath, dirPath } = await csv.createTempCSVFileFromString(
				`first_name,last_name,email\n${first_name_shared},${last_name_shared},${email_shared}`
			)
			const data = await csv.parseCsvFile(csv_file)
			try{
				await file.unlink(filePath, dirPath)
			}catch(e: any){
				scaffold.services.logger.warn(e.message)
			}
			
			const res = await scaffold.query.bulk(scaffold.repository, data, ImportMode.CREATE)
			expect(res.created).toEqual(1)
			const new_count = await scaffold.services.service.count()
			expect(new_count).toEqual(count)
		})

		it(`Updates records even if duplicate found`, async () => {
			const count = await scaffold.services.service.count()

			const first_name_1 = faker.person.firstName()
			const last_name_1 = faker.person.lastName()
			const email_1 = faker.internet.email({firstName: first_name_1, lastName: last_name_1})

			const first_name_2 = faker.person.firstName()
			const last_name_2 = faker.person.lastName()
			const email_2 = faker.internet.email({firstName: first_name_2, lastName: last_name_2})


			const { csv_file, filePath, dirPath } = await csv.createTempCSVFileFromString(
				`first_name,last_name,email\n${first_name_1},${last_name_1},${email_1}\n${first_name_shared},${last_name_shared},${email_shared}\n${first_name_2},${last_name_2},${email_2}`
			)

			const data = await csv.parseCsvFile(csv_file)
			try{
				await file.unlink(filePath, dirPath)
			}catch(e: any){
				scaffold.services.logger.warn(e.message)
			}
		
			const res = await scaffold.query.bulk(scaffold.repository, data, ImportMode.CREATE)
			expect(res.created).toEqual(3)
		})

	})

	describe('UPSERT', () => {
		it('Upload 1 User', async () => {

			const first_name = faker.person.firstName()
			const last_name = faker.person.lastName()
			const email = faker.internet.email({firstName: first_name, lastName: last_name})

			const { csv_file, filePath, dirPath } = await csv.createTempCSVFileFromString(
				`first_name,last_name,email\n${first_name},${last_name},${email}`
			)

			const data = await csv.parseCsvFile(csv_file)
			try{
				await file.unlink(filePath, dirPath)
			}catch(e: any){
				scaffold.services.logger.warn(e.message)
			}
			const res = await scaffold.query.bulk(scaffold.repository, data, ImportMode.UPSERT, UPLOAD_DUPLICATE_FIELD)
			console.log(res)
			expect(res.created).toEqual(1)
			const users = await scaffold.services.service.findAll({})
			const lastUser = users.pop()
			expect(lastUser.first_name).toEqual(first_name)
			expect(lastUser.email).toEqual(email)
		})

		it(`Inserts two records`, async () => {
			const first_name_1 = faker.person.firstName()
			const last_name_1 = faker.person.lastName()
			const email_1 = faker.internet.email({firstName: first_name_1, lastName: last_name_1})

			const first_name_2 = faker.person.firstName()
			const last_name_2 = faker.person.lastName()
			const email_2 = faker.internet.email({firstName: first_name_2, lastName: last_name_2})

			const { csv_file, filePath, dirPath } = await csv.createTempCSVFileFromString(
				`first_name,last_name,email\n${first_name_1},${last_name_1},${email_1}\n${first_name_2},${last_name_2},${email_2}`
			)

			const data = await csv.parseCsvFile(csv_file)
			try{
				await file.unlink(filePath, dirPath)
			}catch(e: any){
				scaffold.services.logger.warn(e.message)
			}
				const res = await scaffold.query.bulk(scaffold.repository, data, ImportMode.UPSERT, UPLOAD_DUPLICATE_FIELD)
				console.log(res)
				expect(res.created).toEqual(2)
				const users = await scaffold.services.service.findAll({})
				const lastUser = users.pop()
				expect(lastUser.first_name).toEqual(first_name_2)
				expect(lastUser.email).toEqual(email_2)
		})

		it(`Inserts two records (data reversed)`, async () => {

			const first_name_1 = faker.person.firstName()
			const last_name_1 = faker.person.lastName()
			const email_1 = faker.internet.email({firstName: first_name_1, lastName: last_name_1})

			const first_name_2 = faker.person.firstName()
			const last_name_2 = faker.person.lastName()
			const email_2 = faker.internet.email({firstName: first_name_2, lastName: last_name_2})


			const { csv_file, filePath, dirPath } = await csv.createTempCSVFileFromString(
				`email,first_name\n${email_1},${first_name_1}\n${email_2},${first_name_2}`
			)
			const data = await csv.parseCsvFile(csv_file)
			try{
				await file.unlink(filePath, dirPath)
			}catch(e: any){
				scaffold.services.logger.warn(e.message)
			}
				const res = await scaffold.query.bulk(scaffold.repository, data, ImportMode.UPSERT, UPLOAD_DUPLICATE_FIELD)
				console.log(res)
				expect(res.created).toEqual(2)
				const users = await scaffold.services.service.findAll({})
				const lastUser = users.pop()
				expect(lastUser.first_name).toEqual(first_name_2)
				expect(lastUser.email).toEqual(email_2)
		})

		it(`Update record if duplicate found`, async () => {
			const count = await scaffold.services.service.count()
			first_name_shared = faker.person.firstName()
			const { csv_file, filePath, dirPath } = await csv.createTempCSVFileFromString(
				`first_name,email\n${first_name_shared},${email_shared}`
			)
			const data = await csv.parseCsvFile(csv_file)
			try{
				await file.unlink(filePath, dirPath)
			}catch(e: any){
				scaffold.services.logger.warn(e.message)
			}
			const res = await scaffold.query.bulk(scaffold.repository, data, ImportMode.UPSERT, UPLOAD_DUPLICATE_FIELD)	
console.log(res)
			const user = await scaffold.services.service.findOne({
				where: {
					email: email_shared
				}
			})
			expect(user.first_name).toEqual(first_name_shared)
			expect(user.last_name).toEqual(last_name_shared)
			expect(user.email).toEqual(email_shared)
			const new_count = await scaffold.services.service.count()
			expect(new_count).toEqual(count)
		})

		it(`Update records if duplicates are found`, async () => {

			first_name_shared = faker.person.firstName()
			first_name_shared_2 = faker.person.firstName()

			const count = await scaffold.services.service.count()
			const { csv_file, filePath, dirPath } = await csv.createTempCSVFileFromString(
				`first_name,email\n${first_name_shared},${email_shared}\n${first_name_shared_2},${email_shared_2}`
			)
			const data = await csv.parseCsvFile(csv_file)
			try{
				await file.unlink(filePath, dirPath)
			}catch(e: any){
				scaffold.services.logger.warn(e.message)
			}
			const res = await scaffold.query.bulk(scaffold.repository, data, ImportMode.UPSERT, UPLOAD_DUPLICATE_FIELD)
			console.log(res)
			expect(res.updated).toEqual(2)
			const new_count = await scaffold.services.service.count()
			expect(new_count).toEqual(count)
			const user = await scaffold.services.service.findOne({
				where: {
					email: email_shared
				}
			})
			expect(user.first_name).toEqual(first_name_shared)
			expect(user.email).toEqual(email_shared)
		})

		it(`Create if new and Update if duplicate`, async () => {

			first_name_shared = faker.person.firstName()
			const first_name = faker.person.firstName()
			const last_name = faker.person.lastName()
			const email = faker.internet.email({firstName: first_name, lastName: last_name})

			const { csv_file, filePath, dirPath } = await csv.createTempCSVFileFromString(
				`first_name,email\n${first_name_shared},${email_shared}\n${first_name},${email}`
			)
			const data = await csv.parseCsvFile(csv_file)
			try{
				await file.unlink(filePath, dirPath)
			}catch(e: any){
				scaffold.services.logger.warn(e.message)
			}
			const res = await scaffold.query.bulk(scaffold.repository, data, ImportMode.UPSERT, UPLOAD_DUPLICATE_FIELD)
			console.log(res)
			expect(res.created).toEqual(1)
			expect(res.updated).toEqual(1)
			const users = await scaffold.services.service.findAll({})
			const lastUser = users.pop()
			expect(lastUser.first_name).toEqual(first_name)
			expect(lastUser.email).toEqual(email)

			const user = await scaffold.services.service.findOne({
				where: {
					email: email_shared
				}
			})
			expect(user.first_name).toEqual(first_name_shared)
			expect(user.email).toEqual(email_shared)
		})
	})

	describe('REPOPULATE', () => {
		it(`Repopulate table from new CSV file`, async () => {
			const count = await scaffold.services.service.count()	
			const { csv_file, filePath, dirPath } = await csv.createTempCSVFileFromString(
				`first_name,email\n${first_name_shared},${email_shared}\n${first_name_shared_2},${email_shared_2}\n${first_name_shared_3},${email_shared_3}`
			)
			const data = await csv.parseCsvFile(csv_file)
			try{
				await file.unlink(filePath, dirPath)
			}catch(e: any){
				scaffold.services.logger.warn(e.message)
			}
			const res = await scaffold.query.bulk(scaffold.repository, data, ImportMode.REPOPULATE)
			expect(res.created).toEqual(3)
			const new_count = await scaffold.services.service.count()
			expect(new_count).toEqual(3)
			expect(new_count).toBeLessThan(count)
		})

	})

	describe('DELETE', () => {
		it(`Delete records`, async () => {
			const count = await scaffold.services.service.count()	
			const { csv_file, filePath, dirPath } = await csv.createTempCSVFileFromString(
				`first_name,email\n${first_name_shared_2},${email_shared_2}\n${first_name_shared_3},${email_shared_3}`
			)
			const data = await csv.parseCsvFile(csv_file)
			try{
				await file.unlink(filePath, dirPath)
			}catch(e: any){
				scaffold.services.logger.warn(e.message)
			}
			const res = await scaffold.query.bulk(scaffold.repository, data, ImportMode.DELETE, UPLOAD_DUPLICATE_FIELD)
			expect(res.deleted).toEqual(2)
			const new_count = await scaffold.services.service.count()
			expect(new_count).toEqual(1)
			expect(new_count).toBeLessThan(count)
			const users = await scaffold.services.service.findAll({})
			const lastUser = users.pop()
			expect(lastUser.first_name).toEqual(first_name_shared)
			expect(lastUser.email).toEqual(email_shared)
		})

	})

	afterAll(async () => {
		await scaffolding.down(E)
	})	
})