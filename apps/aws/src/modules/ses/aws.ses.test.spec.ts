import { AwsSesService } from './aws.ses.service'
import { AwsSesModule } from './aws.ses.module'
import { Account, Scaffold, ScaffoldDto } from '@juicyllama/core'

const MODULE = AwsSesModule
const SERVICE = AwsSesService
type T = Account
const E = Account

describe('AwsSesService', () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)
	})

	describe('Send', () => {
		it('Send out an email', async () => {
			const result = await scaffold.services.service.send({
				methods: {
					email: true,
				},
				subject: `🏗️ Testing: ${process.env.npm_package_name} @ ${process.env.npm_package_version}`,
				communication: {
					email: {
						from: {
							email: process.env.SYSTEM_EMAIL_ADDRESS,
							name: process.env.SYSTEM_EMAIL_NAME,
						},
						to: {
							email: process.env.SYSTEM_EMAIL_ADDRESS,
							name: process.env.SYSTEM_EMAIL_NAME,
						},
					},
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
