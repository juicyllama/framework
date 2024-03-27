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
			const pushes = await scaffold.repository?.find({ where: { event: 'test event' } })
			expect(pushes?.length).toEqual(1)
			expect(pushes?.[0].data).toEqual({ body: '123' })
			expect(pushes?.[0].user_id).toEqual(scaffold.values.owner.user_id)
		})

		it("doesn't create two BeaconPush records with same unique value and same user ID", async () => {
			const msg: BeaconMessageDto = {
				methods: {
					push: true,
				},
				communication: {
					event: 'test event 2',
					userId: scaffold.values.owner.user_id,
				},
				unique: 'unique',
			}
			await scaffold.services.service.create(msg)
			await scaffold.services.service.create(msg)
			const pushes = await scaffold.repository?.find({ where: { event: 'test event 2' } })
			expect(pushes?.length).toEqual(1)
		})

		it('creates two BeaconPush records with same unique value but two different users', async () => {
			const msg: BeaconMessageDto = {
				methods: {
					push: true,
				},
				communication: {
					event: 'test event 3',
				},
				unique: 'unique2',
			}
			await scaffold.services.service.create({
				...msg,
				communication: { ...msg.communication, userId: scaffold.values.owner.user_id },
			})
			await scaffold.services.service.create({
				...msg,
				communication: { ...msg.communication, userId: scaffold.values.owner.user_id + 1 },
			}) // not a real user
			const pushes = await scaffold.repository?.find({ where: { event: 'test event 3' } })
			expect(pushes?.length).toEqual(2)
		})

		it('creates two BeaconPush records with same unique value, one for all users and one for a specific user', async () => {
			const msg: BeaconMessageDto = {
				methods: {
					push: true,
				},
				communication: {
					event: 'test event 4',
				},
				unique: 'unique3',
			}
			await scaffold.services.service.create(msg)
			await scaffold.services.service.create({
				...msg,
				communication: { ...msg.communication, userId: scaffold.values.owner.user_id },
			})
			const pushes = await scaffold.repository?.find({ where: { event: 'test event 4' } })
			expect(pushes?.length).toEqual(2)
		})
	})

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
