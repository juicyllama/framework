import { UsersService } from '../modules/users/users.service'
import { User } from '../modules/users/users.entity'
import { Scaffold, ScaffoldDto } from '../test'
import { UsersModule } from '../modules/users/users.module'
import { crudBulkUpload } from './crudController'
import { UPLOAD_FIELDS, UPLOAD_DUPLICATE_FIELD } from '../modules/users/users.constants'
import { ImportMode, UploadType } from '../types/common'
import { Csv, File, Json } from '@juicyllama/utils'
import { faker } from '@faker-js/faker'

const E = User
type T = User
const MODULE = UsersModule
const SERVICE = UsersService

const csv = new Csv()
const file = new File()
const json = new Json()

/**
 * These tests focus on the validation of the controller/data, not the actual adding of data, this is tested at: Query.file.bulkInsert.spec.ts
*/


describe('Crud Bulk Upload Controller', () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)
	})

	describe('Invalid File Uploads', () => {
		it('Wrong number of field headings', async () => {

			const first_name = faker.person.firstName()
			const last_name = faker.person.lastName()
			const email = faker.internet.email({firstName: first_name, lastName: last_name})

			const { csv_file, filePath, dirPath } = await csv.createTempCSVFileFromString(
				`first_name,last_name\n${first_name},${last_name},${email}`
			)
			try{
				await file.unlink(filePath, dirPath)
			}catch(e: any){
				scaffold.services.logger.warn(e.message)
			}

			try{ 
				const res = await crudBulkUpload<T>({
					file: csv_file,
					fields: UPLOAD_FIELDS,
					dedup_field: UPLOAD_DUPLICATE_FIELD,
					upload_type: UploadType.CSV,
					import_mode: ImportMode.CREATE,
					service: scaffold.services.service,
				})

				expect(res.created).toEqual(0)
				
			} catch(e: any) {
				scaffold.services.logger.warn(e.message)
			}
		})

		it('Wrong number of field data', async () => {

			const first_name = faker.person.firstName()
			const last_name = faker.person.lastName()
			//const email = faker.internet.email({firstName: first_name, lastName: last_name})

			const { csv_file, filePath, dirPath } = await csv.createTempCSVFileFromString(
				`first_name,last_name,email\n${first_name},${last_name}`
			)
			try{
				await file.unlink(filePath, dirPath)
			}catch(e: any){
				scaffold.services.logger.warn(e.message)
			}

			try{ 
				await crudBulkUpload<T>({
					file: csv_file,
						fields: UPLOAD_FIELDS,
						dedup_field: UPLOAD_DUPLICATE_FIELD,
						upload_type: UploadType.CSV,
						import_mode: ImportMode.CREATE,
						service: scaffold.services.service,
					}
				)
				expect(true).toEqual(false)
				
			} catch(e: any) {
				expect(e.message).toEqual(`Invalid CSV file. Expected 3 columns, got 2`)
			}
		})

	})

	describe('CSV', () => {
		describe('CSV File Uploads', () => {
			it('Upload 1 User', async () => {
				const first_name = faker.person.firstName()
				const last_name = faker.person.lastName()
				const email = faker.internet.email({firstName: first_name, lastName: last_name})

				const { csv_file, filePath, dirPath } = await csv.createTempCSVFileFromString(
					`first_name,last_name,email\n${first_name},${last_name},${email}`
				)
				try{
					await file.unlink(filePath, dirPath)
				}catch(e: any){
					scaffold.services.logger.warn(e.message)
				}
	
				const res = await crudBulkUpload<T>(
					{
						file: csv_file,
						fields: UPLOAD_FIELDS,
						dedup_field: UPLOAD_DUPLICATE_FIELD,
						upload_type: UploadType.CSV,
						import_mode: ImportMode.CREATE,
						service: scaffold.services.service,
					}
				)
				expect(res.created).toEqual(1)
				const users = await scaffold.services.service.findAll({})
				const lastUser = users.pop()
				expect(lastUser.first_name).toEqual(first_name)
				expect(lastUser.last_name).toEqual(last_name)
				expect(lastUser.email).toEqual(email)
			})
			
		})

		describe('CSV Raw Uploads', () => {

			const first_name = faker.person.firstName()
			const last_name = faker.person.lastName()
			const email = faker.internet.email({firstName: first_name, lastName: last_name})

			const string = `first_name,last_name,email\n${first_name},${last_name},${email}`
		

			it('Upload 1 User', async () => {
				const res = await crudBulkUpload<T>(
					{
						raw: string,
						fields: UPLOAD_FIELDS,
						dedup_field: UPLOAD_DUPLICATE_FIELD,
						upload_type: UploadType.CSV,
						import_mode: ImportMode.CREATE,
						service: scaffold.services.service,
					}
				)
				expect(res.created).toEqual(1)
				const users = await scaffold.services.service.findAll({})
				const lastUser = users.pop()
				expect(lastUser.first_name).toEqual(first_name)
				expect(lastUser.last_name).toEqual(last_name)
				expect(lastUser.email).toEqual(email)
			})

		})
	})

	describe('JSON', () => {
		describe('JSON File Uploads', () => {
			it('Upload 1 User', async () => {

				const first_name = faker.person.firstName()
				const last_name = faker.person.lastName()
				const email = faker.internet.email({firstName: first_name, lastName: last_name})

				const { json_file, filePath, dirPath } = await json.createTempJSONFileFromString(
					`[{ "first_name": "${first_name}", "last_name": "${last_name}", "email": "${email}"}]`
				)
				try{
					await file.unlink(filePath, dirPath)
				}catch(e: any){
					scaffold.services.logger.warn(e.message)
				}
	
				const res = await crudBulkUpload<T>(
					{
						file: json_file,
						fields: UPLOAD_FIELDS,
						dedup_field: UPLOAD_DUPLICATE_FIELD,
						upload_type: UploadType.JSON,
						import_mode: ImportMode.CREATE,
						service: scaffold.services.service,
					}
				)
				expect(res.created).toEqual(1)
				const users = await scaffold.services.service.findAll({})
				const lastUser = users.pop()
				expect(lastUser.first_name).toEqual(first_name)
				expect(lastUser.last_name).toEqual(last_name)
				expect(lastUser.email).toEqual(email)
			})
			
		})

		describe('JSON Raw Uploads', () => {

			it('Upload 1 User', async () => {

				const first_name = faker.person.firstName()
				const last_name = faker.person.lastName()
				const email = faker.internet.email({firstName: first_name, lastName: last_name})

				const res = await crudBulkUpload<T>(
					{
						raw: [{ "first_name": first_name, "last_name": last_name, "email": email}],
						fields: UPLOAD_FIELDS,
						dedup_field: UPLOAD_DUPLICATE_FIELD,
						upload_type: UploadType.JSON,
						import_mode: ImportMode.CREATE,
						service: scaffold.services.service,
					}
				)
				expect(res.created).toEqual(1)
				const users = await scaffold.services.service.findAll({})
				const lastUser = users.pop()
				expect(lastUser.first_name).toEqual(first_name)
				expect(lastUser.last_name).toEqual(last_name)
				expect(lastUser.email).toEqual(email)
			})

		})
	})

	describe('Mappers', () => {
		it('Without mappers', async () => {

			const first_name = faker.person.firstName()
			const last_name = faker.person.lastName()
			const email = faker.internet.email({firstName: first_name, lastName: last_name})

			const { csv_file, filePath, dirPath } = await csv.createTempCSVFileFromString(
				`first_name,last_name,email\n${first_name},${last_name},${email}`
			)

			try{
				await file.unlink(filePath, dirPath)
			}catch(e: any){
				scaffold.services.logger.warn(e.message)
			}

			const res = await crudBulkUpload<T>(
				{
					file: csv_file,
					fields: UPLOAD_FIELDS,
					dedup_field: UPLOAD_DUPLICATE_FIELD,
					upload_type: UploadType.CSV,
					import_mode: ImportMode.CREATE,
					service: scaffold.services.service,
				}
			)
			expect(res.created).toEqual(1)
			const users = await scaffold.services.service.findAll({})
			const lastUser = users.pop()
			expect(lastUser.first_name).toEqual(first_name)
			expect(lastUser.last_name).toEqual(last_name)
			expect(lastUser.email).toEqual(email)
		})

		it('With mappers', async () => {


			const first_name = faker.person.firstName()
			const last_name = faker.person.lastName()
			const email = faker.internet.email({firstName: first_name, lastName: last_name})

			const { csv_file, filePath, dirPath } = await csv.createTempCSVFileFromString(
				`fname,lname,email\n${first_name},${last_name},${email}`
			)

			try{
				await file.unlink(filePath, dirPath)
			}catch(e: any){
				scaffold.services.logger.warn(e.message)
			}

			const res = await crudBulkUpload<T>(
				{
					file: csv_file,
					fields: UPLOAD_FIELDS,
					dedup_field: UPLOAD_DUPLICATE_FIELD,
					upload_type: UploadType.CSV,
					import_mode: ImportMode.CREATE,
					service: scaffold.services.service,
					mappers: {
						fname: 'first_name',
						lname: 'last_name',
					}
				}
			)
			expect(res.created).toEqual(1)
			const users = await scaffold.services.service.findAll({})
			const lastUser = users.pop()
			expect(lastUser.first_name).toEqual(first_name)
			expect(lastUser.last_name).toEqual(last_name)
			expect(lastUser.email).toEqual(email)
		})
	})
	
	afterAll(async () => {
		await scaffolding.down(E)
	})	
})
