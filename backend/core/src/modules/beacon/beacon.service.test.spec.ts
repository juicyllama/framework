import { BeaconService } from './beacon.service.js'
import { BeaconModule } from './beacon.module.js'
import { Scaffold, ScaffoldDto } from '../../test/index.js'
import { Account } from '../accounts/account.entity.js'

const MODULE = BeaconModule
const SERVICE = BeaconService
type T = Account
const E = Account

describe('BeaconService', () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)
	})

	describe('Notify', () => {
		it('Send out a beacon', async () => {
			await scaffold.services.service.notify({
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
		})
	})

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
