import { Json } from './Json'
import { File } from './File'
import { faker } from '@faker-js/faker'

const json = new Json()
const file = new File()

describe('JSON', () => {

	it('createTempJSONFileFromString', async () => {

		const first_name = faker.person.firstName()
		const last_name = faker.person.lastName()
		const email = faker.internet.email({firstName: first_name, lastName: last_name})
	
		const { filePath, dirPath } = await json.createTempJSONFileFromString(
			`[{ "first_name": "${first_name}", "last_name": "${last_name}", "email": "${email}"}]`
		)
		await file.unlink(filePath, dirPath)
		expect(filePath).toBeDefined()
	})

	it('parseJSONFile', async () => {
		const first_name = faker.person.firstName()
		const last_name = faker.person.lastName()
		const email = faker.internet.email({firstName: first_name, lastName: last_name})
	
		const { json_file, filePath, dirPath } = await json.createTempJSONFileFromString(
			`[{ "first_name": "${first_name}", "last_name": "${last_name}", "email": "${email}"}]`
		)

		const result = await json.parseJsonFile(json_file)
		await file.unlink(filePath, dirPath)
		expect(result).toBeDefined()
		expect(result[0]).toBeDefined()
		expect(result[0].first_name).toEqual(first_name)
	})

	it('parseJSONFile with mapped headers', async () => {

		const { json_file, filePath, dirPath } = await json.createTempJSONFileFromString(
			'[{ "name": "Tom", "type": "Cat"}, { "name": "Jerry", "type": "Mouse"}]'
		)

		const result = await json.parseJsonFile(json_file, { type: 'animal' })
		await file.unlink(filePath, dirPath)

		expect(result).toBeDefined()
		expect(result[0]).toBeDefined()
		expect(result[0].name).toBeDefined()
		expect(result[0].type).not.toBeDefined()
		expect(result[0].animal).toBeDefined()
		expect(result[0].animal).toBe('Cat')
		expect(result[1]).toBeDefined()
		expect(result[0].name).toBeDefined()
		expect(result[1].type).not.toBeDefined()
		expect(result[1].animal).toBeDefined()
		expect(result[1].animal).toBe('Mouse')	
	})
})
