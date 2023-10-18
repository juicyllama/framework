import { UsersService } from '../../modules/users/users.service'
import { User } from '../../modules/users/users.entity'
import { Scaffold, ScaffoldDto } from '../../test'
import { UsersModule } from '../../modules/users/users.module'
import { ImportMode } from '../../types/common'
import { Csv } from '@juicyllama/utils'
import { UPLOAD_DUPLICATE_FIELD } from '../../modules/users/users.constants'
import { DeleteResult, InsertResult } from 'typeorm'

const E = User
type T = User
const MODULE = UsersModule
const SERVICE = UsersService
const csv = new Csv()

describe('Query Bulk', () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)
	})
	
	describe('CREATE', () => {
		it('Upload 1 User', async () => {
			const { unlink, file } = await csv.createTempCSVFileFromString(
				'first_name,last_name,email' + '\n' + 'Amy,Alsop,amy@email.com'
			)
			const data = await csv.parseCsvFile(file)
			const res = await scaffold.query.bulk(scaffold.repository, data, ImportMode.CREATE)
			await unlink()

			expect(res.raw.affectedRows).toEqual(1)
			const users = await scaffold.services.service.findAll({})
			const lastUser = users.pop()
			expect(lastUser.first_name).toEqual('Amy')
			expect(lastUser.last_name).toEqual('Alsop')
			expect(lastUser.email).toEqual('amy@email.com')
		})

		it(`Inserts two records`, async () => {
			const { file, unlink } = await csv.createTempCSVFileFromString(
				'first_name,last_name,email' + '\n' + 'Bob,Bow,bob@email.com' + '\n' + 'Claire,Cherry,claire@email.com'
			)
			const data = await csv.parseCsvFile(file)
				const res = await scaffold.query.bulk(scaffold.repository, data, ImportMode.CREATE)
				await unlink()
				expect(res.raw.affectedRows).toEqual(2)
				const users = await scaffold.services.service.findAll({})
				const lastUser = users.pop()
				expect(lastUser.first_name).toEqual('Claire')
				expect(lastUser.last_name).toEqual('Cherry')
				expect(lastUser.email).toEqual('claire@email.com')
		})

		it(`Inserts 0 records if duplicate is found`, async () => {
			const count = await scaffold.services.service.count()
			const { file, unlink } = await csv.createTempCSVFileFromString(
				'first_name,last_name,email' + '\n' + 'Amy,Alsop,amy@email.com'
			)
			const data = await csv.parseCsvFile(file)
			try{
				await scaffold.query.bulk(scaffold.repository, data, ImportMode.CREATE)
				expect(true).toEqual(false)
			}catch(e: any){
				expect(e.message).toMatch('Duplicate entry')
			}
			
			await unlink()
			const new_count = await scaffold.services.service.count()
			expect(new_count).toEqual(count)
		})

		it(`Inserts 0 records if duplicate is only 1 of many`, async () => {
			const count = await scaffold.services.service.count()
			const { file, unlink } = await csv.createTempCSVFileFromString(
				'first_name,last_name,email' + '\n' + 'Zoe,Zele,zoe@email.com' + '\n' + 'Amy,Alsop,amy@email.com' + '\n' + 'Darren,Dele,darren@email.com'
			)
			const data = await csv.parseCsvFile(file)
			try{
				await scaffold.query.bulk(scaffold.repository, data, ImportMode.CREATE)
				expect(true).toEqual(false)
			}catch(e: any){
				expect(e.message).toMatch('Duplicate entry')
			}
			
			await unlink()
			const new_count = await scaffold.services.service.count()
			expect(new_count).toEqual(count)
		})

	})

	describe('UPSERT', () => {
		it('Upload 1 User', async () => {
			const { unlink, file } = await csv.createTempCSVFileFromString(
				'first_name,email' + '\n' + 'Erin,erin@email.com'
			)
			const data = await csv.parseCsvFile(file)
			const res = await scaffold.query.bulk(scaffold.repository, data, ImportMode.UPSERT, UPLOAD_DUPLICATE_FIELD)
			await unlink()
			expect(res.raw.affectedRows).toEqual(1)
			const users = await scaffold.services.service.findAll({})
			const lastUser = users.pop()
			expect(lastUser.first_name).toEqual('Erin')
			expect(lastUser.email).toEqual('erin@email.com')
		})

		it(`Inserts two records`, async () => {
			const { file, unlink } = await csv.createTempCSVFileFromString(
				'first_name,email' + '\n' + 'Fred,fred@email.com' + '\n' + 'Gary,gary@email.com'
			)
			const data = await csv.parseCsvFile(file)
				const res = await scaffold.query.bulk(scaffold.repository, data, ImportMode.UPSERT, UPLOAD_DUPLICATE_FIELD)
				await unlink()
				expect(res.raw.affectedRows).toEqual(2)
				const users = await scaffold.services.service.findAll({})
				const lastUser = users.pop()
				expect(lastUser.first_name).toEqual('Gary')
				expect(lastUser.email).toEqual('gary@email.com')
		})

		it(`Inserts two records (data reversed)`, async () => {
			const { file, unlink } = await csv.createTempCSVFileFromString(
				'email,first_name' + '\n' + 'helen@email.com,Helen' + '\n' + 'isabel@email.com,Isabel'
			)
			const data = await csv.parseCsvFile(file)
				const res = await scaffold.query.bulk(scaffold.repository, data, ImportMode.UPSERT, UPLOAD_DUPLICATE_FIELD)
				await unlink()
				expect(res.raw.affectedRows).toEqual(2)
				const users = await scaffold.services.service.findAll({})
				const lastUser = users.pop()
				expect(lastUser.first_name).toEqual('Isabel')
				expect(lastUser.email).toEqual('isabel@email.com')
		})

		it(`Update record if duplicate found`, async () => {
			const count = await scaffold.services.service.count()
			const { file, unlink } = await csv.createTempCSVFileFromString(
				'first_name,email' + '\n' + 'Andy,amy@email.com'
			)
			const data = await csv.parseCsvFile(file)
			await scaffold.query.bulk(scaffold.repository, data, ImportMode.UPSERT, UPLOAD_DUPLICATE_FIELD)
			await unlink()	
			const user = await scaffold.services.service.findOne({
				where: {
					email: "amy@email.com"
				}
			})
			expect(user.first_name).toEqual('Andy')
			expect(user.last_name).toEqual('Alsop')
			expect(user.email).toEqual('amy@email.com')
			const new_count = await scaffold.services.service.count()
			expect(new_count).toEqual(count)
		})

		it(`Update records if duplicates are found`, async () => {
			const count = await scaffold.services.service.count()
			const { file, unlink } = await csv.createTempCSVFileFromString(
				'first_name,email' + '\n' + 'Amy,amy@email.com' + '\n' + 'Izzy,isabel@email.com'
			)
			const data = await csv.parseCsvFile(file)
			const res = await scaffold.query.bulk(scaffold.repository, data, ImportMode.UPSERT, UPLOAD_DUPLICATE_FIELD)
			await unlink()
			expect(res.raw.affectedRows).toEqual(4)
			expect(res.raw.info).toMatch('Records: 2  Duplicates: 2')
			const new_count = await scaffold.services.service.count()
			expect(new_count).toEqual(count)
			const user = await scaffold.services.service.findOne({
				where: {
					email: "amy@email.com"
				}
			})
			expect(user.first_name).toEqual('Amy')
			expect(user.email).toEqual('amy@email.com')
		})

		it(`Create if new and Update if duplicate`, async () => {
			const { file, unlink } = await csv.createTempCSVFileFromString(
				'first_name,email' + '\n' + 'Amie,amy@email.com' + '\n' + 'Jon,jon@email.com'
			)
			const data = await csv.parseCsvFile(file)
			const res = await scaffold.query.bulk(scaffold.repository, data, ImportMode.UPSERT, UPLOAD_DUPLICATE_FIELD)
	
			await unlink()
			expect(res.raw.affectedRows).toEqual(3)
			expect(res.raw.info).toMatch('Records: 2  Duplicates: 1')
			const users = await scaffold.services.service.findAll({})
			const lastUser = users.pop()
			expect(lastUser.first_name).toEqual('Jon')
			expect(lastUser.email).toEqual('jon@email.com')

			const user = await scaffold.services.service.findOne({
				where: {
					email: "amy@email.com"
				}
			})
			expect(user.first_name).toEqual('Amie')
			expect(user.email).toEqual('amy@email.com')
		})
	})

	describe('REPOPULATE', () => {
		it(`Repopulate table from new CSV file`, async () => {
			const count = await scaffold.services.service.count()	
			const { file, unlink } = await csv.createTempCSVFileFromString(
				'first_name,email' + '\n' + 'Andy,andy@email.com' + '\n' + 'Bob,bob@email.com' + '\n' + 'Claire,claire@email.com'
			)
			const data = await csv.parseCsvFile(file)
			const res = <InsertResult>await scaffold.query.bulk(scaffold.repository, data, ImportMode.REPOPULATE)
			await unlink()
			expect(res.raw.affectedRows).toEqual(3)
			expect(res.raw.info).toEqual('Records: 3  Duplicates: 0  Warnings: 0')
			const new_count = await scaffold.services.service.count()
			expect(new_count).toEqual(3)
			expect(new_count).toBeLessThan(count)
		})

	})

	describe('DELETE', () => {
		it(`Delete records`, async () => {
			const count = await scaffold.services.service.count()	
			const { file, unlink } = await csv.createTempCSVFileFromString(
				'first_name,email' + '\n' + 'Bob,bob@email.com' + '\n' + 'Claire,claire@email.com'
			)
			const data = await csv.parseCsvFile(file)
			const res = <DeleteResult>await scaffold.query.bulk(scaffold.repository, data, ImportMode.DELETE, UPLOAD_DUPLICATE_FIELD)
			await unlink()
			expect(res.affected).toEqual(2)
			const new_count = await scaffold.services.service.count()
			expect(new_count).toEqual(1)
			expect(new_count).toBeLessThan(count)
			const users = await scaffold.services.service.findAll({})
			const lastUser = users.pop()
			expect(lastUser.first_name).toEqual('Andy')
			expect(lastUser.email).toEqual('andy@email.com')
		})

	})

	afterAll(async () => {
		await scaffolding.down(E)
	})	
})