<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { googleLogin, linkedInLogin, microsoftLogin, azureLogin } from '@/services/auth'

const router = useRouter()
const route = useRoute()

const props = defineProps<{
	submit_label: string
	loading: boolean
	google?: boolean
	facebook?: boolean
	linkedin?: boolean
	adazure?: boolean
}>()

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const path: Ref<string> = ref()
const password: Ref<boolean> = ref()
const passwordless: Ref<boolean> = ref()
const reset: Ref<boolean> = ref()
const join: Ref<boolean> = ref()

function doGoogleLogin() {
	googleLogin(VITE_API_BASE_URL)
}
function doMicrosoftLogin() {
	microsoftLogin(VITE_API_BASE_URL)
}
function doLinkedinLogin() {
	linkedInLogin(VITE_API_BASE_URL)
}
function doAzureSso() {
	azureLogin(VITE_API_BASE_URL)
}

onMounted(async () => {
	await router.isReady()

	path.value = route.path
	password.value = path.value === '/login'
	passwordless.value = path.value === '/passwordless'
	reset.value = path.value === '/reset'
	join.value = path.value === '/join'
})
</script>

<template>
	<div class="auth_actions q-px-sm">
		<q-card-actions class="auth_action_card justify-between">
			<div class="auth_action_button">
				<q-btn
					class="button-primary"
					color="primary"
					type="submit"
					v-if="props.submit_label"
					:disabled="props.loading">
					<span v-if="props.loading">
						<q-spinner-dots color="white" size="1em" />
					</span>
					<span v-else>{{ props.submit_label }}</span>
				</q-btn>
			</div>

			<div class="auth_action_sso" v-if="password">
				<q-btn
					icon="fa-regular fa-key"
					class="q-mr-xs button-primary"
					@click="router.push('/passwordless')"
					v-if="!passwordless" />
				<q-btn icon="fa-regular fa-asterisk" class="q-mr-xs" @click="router.push('/login')" v-if="!password" />
				<q-btn icon="fa-brands fa-google" class="q-mr-xs" @click="doGoogleLogin" v-if="props.google" />
				<q-btn icon="fa-brands fa-microsoft" class="q-mr-xs" @click="doMicrosoftLogin" v-if="props.facebook" />
				<q-btn icon="fa-brands fa-linkedin" class="q-mr-xs" @click="doLinkedinLogin" v-if="props.linkedin" />
				<q-btn icon="fa-brands fa-windows" class="q-mr-xs" @click="doAzureSso" v-if="props.adazure" />
			</div>
			<div class="auth_action_link" v-if="reset || passwordless">
				<router-link to="/login"><a href="#">Back</a></router-link>
			</div>
			<div class="auth_action_link" v-if="join">
				<router-link to="/login"><a href="#">Login</a></router-link>
			</div>
		</q-card-actions>

		<q-card-section v-if="password" class="text-right q-pa-sm auth_action_link">
			<router-link to="/reset"><a href="#">Reset Password</a></router-link>
		</q-card-section>
	</div>
</template>

<style scoped></style>
