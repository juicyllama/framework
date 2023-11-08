import { UserStore } from '../store/user'
import { useRouter } from 'vue-router'

export async function Logout(redirect: string) {
	const router = useRouter()
	const userStore = UserStore()
	await userStore.logout(router, redirect)
}
