import { UserStore } from '../store/user'

export async function Logout() {
	const userStore = UserStore()
	await userStore.logout()
}
