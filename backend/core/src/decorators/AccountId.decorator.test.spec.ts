import request from 'supertest'
import { Scaffold, ScaffoldDto } from '../test/scaffold'
import { User } from '../modules/users/users.entity'
import { UsersModule } from '../modules/users/users.module'
import { UsersService } from '../modules/users/users.service'

type T = User
const E = User
const MODULE = UsersModule
const SERVICE = UsersService

/**
 * These tests focus on the validation of the controller/data, not the actual adding of data, this is tested at: Query.file.bulkInsert.spec.ts
 */

describe('@AccountId() Tests', () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)
	})

	describe('@AccountId()', () => {
		it('account-id header property', async () => {
			try {
				const response = await request(scaffold.server)
					.get(`/users/${scaffold.values.owner.user_id}`)
					.set({
						Authorization: 'Bearer ' + scaffold.values.owner_access_token,
						'account-id': scaffold.values.account.account_id.toString(),
					})

				expect(response.body).toBeDefined()
				expect(response.body.user_id).toEqual(scaffold.values.owner.user_id)
			} catch (e) {
				console.error(e)
				expect(e).toMatch('error')
			}
		})

		it('fallback to first account found when no account-id passed', async () => {
			try {
				const response = await request(scaffold.server)
					.get(`/users/${scaffold.values.owner.user_id}`)
					.set({
						Authorization: 'Bearer ' + scaffold.values.owner_access_token,
					})
				expect(response.body).toBeDefined()
				expect(response.body.user_id).toEqual(scaffold.values.owner.user_id)
			} catch (e) {
				console.error(e)
				expect(e).toMatch('error')
			}
		})
	})

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
