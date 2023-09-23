import { UserStore } from '../store/user.js'

export async function Logout() {
	const userStore = UserStore()
	await userStore.logout()
}
