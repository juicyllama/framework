import { Account, Scaffold, ScaffoldDto } from '@juicyllama/core'
import { AwsSnsModule } from './aws.sns.module'
import { AwsSnsService } from './aws.sns.service'

const MODULE = AwsSnsModule
const SERVICE = AwsSnsService
type T = Account
const E = Account

describe('AwsSnsService', () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)
	})

	describe('Send', () => {
		it('Send out an sms', async () => {
			const result = await scaffold.services.service.send({
				methods: {
					sms: true,
				},
				communication: {
					phone: '+34630146118',
				},
				markdown: `### Hello World`,
			})
			expect(result).toBeTruthy()
		})
	})

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
