import { Scaffold, ScaffoldDto, User } from '@juicyllama/core'
import { faker } from '@faker-js/faker'
import { CHAT_E, CHAT_T } from './chat.constants'
import { ChatService } from './chat.service'
import { ChatModule } from './chat.module'

/**
 * Tests focused on chat functionality
 */

describe('Social > Chat', () => {
	const scaffolding = new Scaffold<CHAT_T>()

	let scaffold: ScaffoldDto<CHAT_T>

	//extra veriables for testing
	let chat: CHAT_T
	let second_user: User

	beforeAll(async () => {
		scaffold = await scaffolding.up(ChatModule, ChatService)
	})

	describe('Setup chat', () => {
		it('Add a second user', async () => {
			second_user = await scaffold.services.usersService.create({
				first_name: faker.person.firstName(),
				last_name: faker.person.lastName(),
				email: faker.internet.email(),
			})
			expect(second_user).toBeDefined()
			expect(second_user.user_id).toBeDefined()
		})

		it('Start a chat', async () => {
			chat = await scaffold.services.service.create({
				users: [scaffold.values.owner, second_user],
			})
			expect(chat).toBeDefined()
			expect(chat.chat_id).toBeDefined()
		})
	})

	afterAll(async () => {
		await scaffolding.down(CHAT_E)
	})
})
