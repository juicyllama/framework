import { BeaconModule } from '../beacon.module'
import { Scaffold, ScaffoldDto } from '../../../test'
import { BeaconPushService } from './push.service'
import { BeaconPush } from './push.entity'
import { BeaconMessageDto } from '../beacon.dto'

const MODULE = BeaconModule
const SERVICE = BeaconPushService
type T = BeaconPush
const E = BeaconPush

describe('BeaconPushService', () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)
	})

	describe('create', () => {
		it('creates a BeaconPush record with the userId', async () => {
			const msg: BeaconMessageDto = {
				methods: {
					push: true,
				},
				communication: {
					event: 'test event',
					userId: scaffold.values.owner.user_id,
				},
				json: { body: '123' },
			}
			await scaffold.services.service.create(msg)
			const pushes = await scaffold.repository?.find({ where: { event: 'test event' }})
			expect(pushes?.length).toEqual(1)
			expect(pushes?.[0].data).toEqual({ body: '123' })
			expect(pushes?.[0].user_id).toEqual(scaffold.values.owner.user_id)
		})
	})

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
