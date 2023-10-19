import { UsersService } from '../modules/users/users.service'
import { User } from '../modules/users/users.entity'
import { Scaffold, ScaffoldDto } from '../test'
import { UsersModule } from '../modules/users/users.module'
import { crudBulkUpload } from './crudController'
import { UPLOAD_FIELDS, UPLOAD_DUPLICATE_FIELD } from '../modules/users/users.constants'
import { ImportMode, UploadType } from '../types/common'
import { Csv, File } from '@juicyllama/utils'
import { InsertResult } from 'typeorm'

const E = User
type T = User
const MODULE = UsersModule
const SERVICE = UsersService

const csv = new Csv()
const file = new File()

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

			const { csv_file, filePath, dirPath } = await csv.createTempCSVFileFromString(
				'first_name,last_name' + '\n' + 'Test,Test,test@test.com'
			)

			try{ 
				<InsertResult>await crudBulkUpload<T>({
					file: csv_file,
					fields: UPLOAD_FIELDS,
					dedup_field: UPLOAD_DUPLICATE_FIELD,
					upload_type: UploadType.CSV,
					import_mode: ImportMode.CREATE,
					service: scaffold.services.service,
				})
				expect(true).toEqual(false)
				
			} catch(e: any) {
				expect(e.message).toEqual(`Field 'email' doesn't have a default value`)
			}
			await file.unlink(filePath, dirPath)
		})

		it('Wrong number of field data', async () => {

			const { csv_file, filePath, dirPath } = await csv.createTempCSVFileFromString(
				'first_name,last_name,email' + '\n' + 'Test,Test'
			)

			try{ 
				<InsertResult>await crudBulkUpload<T>({
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
				expect(e.message).toEqual(`Invalid CSV file. Expected 3 columns, got undefined`)
			}
			await file.unlink(filePath, dirPath)
		})

	})

	describe('CSV', () => {
		describe('CSV File Uploads', () => {
			it('Upload 1 User', async () => {
				const { csv_file, filePath, dirPath } = await csv.createTempCSVFileFromString(
					'first_name,last_name,email' + '\n' + 'Test2,Test,test2@test.com'
				)
	
				const res = <InsertResult>await crudBulkUpload<T>(
					{
						file: csv_file,
						fields: UPLOAD_FIELDS,
						dedup_field: UPLOAD_DUPLICATE_FIELD,
						upload_type: UploadType.CSV,
						import_mode: ImportMode.CREATE,
						service: scaffold.services.service,
					}
				)
				await file.unlink(filePath, dirPath)
				expect(res.raw.affectedRows).toEqual(1)
				const users = await scaffold.services.service.findAll({})
				const lastUser = users.pop()
				expect(lastUser.first_name).toEqual('Test2')
				expect(lastUser.last_name).toEqual('Test')
				expect(lastUser.email).toEqual('test2@test.com')
			})
			
		})

		describe('CSV Raw Uploads', () => {

			it('Upload 1 User', async () => {
				const res = <InsertResult>await crudBulkUpload<T>(
					{
						raw: 'first_name,last_name,email' + '\n' + 'Test3,Test,test3@test.com',
						fields: UPLOAD_FIELDS,
						dedup_field: UPLOAD_DUPLICATE_FIELD,
						upload_type: UploadType.CSV,
						import_mode: ImportMode.CREATE,
						service: scaffold.services.service,
					}
				)
				expect(res.raw.affectedRows).toEqual(1)
				const users = await scaffold.services.service.findAll({})
				const lastUser = users.pop()
				expect(lastUser.first_name).toEqual('Test3')
				expect(lastUser.last_name).toEqual('Test')
				expect(lastUser.email).toEqual('test3@test.com')
			})

		})
	})


	describe('Mappers', () => {
		it('Without mappers', async () => {

			const { csv_file, filePath, dirPath } = await csv.createTempCSVFileFromString(
				'first_name,last_name,email' + '\n' + 'Test,Test,test@test.com'
			)

			const res = <InsertResult>await crudBulkUpload<T>(
				{
					file: csv_file,
					fields: UPLOAD_FIELDS,
					dedup_field: UPLOAD_DUPLICATE_FIELD,
					upload_type: UploadType.CSV,
					import_mode: ImportMode.CREATE,
					service: scaffold.services.service,
				}
			)
			await file.unlink(filePath, dirPath)
			expect(res.raw.affectedRows).toEqual(1)
			const users = await scaffold.services.service.findAll({})
			const lastUser = users.pop()
			expect(lastUser.first_name).toEqual('Test')
			expect(lastUser.last_name).toEqual('Test')
			expect(lastUser.email).toEqual('test@test.com')
		})

		it('With mappers', async () => {

			const { csv_file, filePath, dirPath } = await csv.createTempCSVFileFromString(
				'fname,lname,email' + '\n' + 'Test1,Test,test1@test.com'
			)

			const res = <InsertResult>await crudBulkUpload<T>(
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
			await file.unlink(filePath, dirPath)
			expect(res.raw.affectedRows).toEqual(1)
			const users = await scaffold.services.service.findAll({})
			const lastUser = users.pop()
			expect(lastUser.first_name).toEqual('Test1')
			expect(lastUser.last_name).toEqual('Test')
			expect(lastUser.email).toEqual('test1@test.com')
		})
	})
	
	afterAll(async () => {
		await scaffolding.down(E)
	})	
})
