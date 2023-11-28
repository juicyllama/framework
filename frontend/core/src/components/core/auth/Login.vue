<script setup lang="ts">
import { reactive, ref } from 'vue'
import { UserStore } from '../../../store/user'
import AuthActions from './Actions.vue'
import { useRouter, useRoute } from 'vue-router'
import type { AuthFormState } from '../../../helpers'
import { validateEmail, isPasswordValid, logger } from '../../../helpers'
import { goToLoginRedirect } from '../../../helpers'
import { useQuasar } from 'quasar'

import { Strings } from '@juicyllama/vue-utils'
import { completeGoogleLogin, completeLinkedInLogin, completeMicrosoftLogin, completeAzureLogin } from '../../../services/auth'
import { LogSeverity } from '../../../types'

const $q = useQuasar()
const userStore = UserStore()
const router = useRouter()
const route = useRoute()

if($q.loading?.isActive){
	$q.loading.hide()
}

const props = defineProps<{
	google?: boolean
	facebook?: boolean
	adazure?: boolean
	linkedin?: boolean
	dense?: boolean
	lazy_rules?: boolean
	show_labels?: boolean
}>()

const state = reactive(<AuthFormState>{
	email: '',
	password: {
		value: '',
		valid: {
			length: false,
			capital: false,
			number: false,
			symbol: false,
		},
		validated: false,
		hidden: true,
	},
})

const loading = ref(false)

if (route.query.code) {
	try {
		switch (localStorage.getItem('OAuthType')) {
			case 'google':
				await completeGoogleLogin(route.query, $q)
				break
			case 'linkedin':
				await completeLinkedInLogin(route.query, $q)
				break
			case 'microsoft':
				await completeMicrosoftLogin(route.query, $q)
				break
			case 'azure_ad':
				await completeAzureLogin(route.query, $q)
				break
			default:
				new Error('OAuthType not found')
		}

		await redirect()
	} catch (e) {
		logger({
			severity: LogSeverity.ERROR,
			message: `${Strings.capitalize(localStorage.getItem('OAuthType'))} SSO failed, please try again`,
			q: $q,
			object: e,
		})
	}
}

async function login(state: AuthFormState) {
	loading.value = true
	state.email = state.email.trim()
	state.password.value = state.password.value.trim()
	const user = await userStore.login({ email: state.email, password: state.password.value }, $q)

	if (user?.user_id) {
		await redirect()
	}
	loading.value = false
}

async function redirect(){
	if(route?.query?.r){
		goToLoginRedirect(router, <string>route?.query?.r)
	}
	else{
		goToLoginRedirect(router)
	}
}

</script>

<template>
	<q-form autofocus @submit="login(state)">
		<slot name="header">
			<q-card-section class="mobile-hide">
				<div class="text-h6">Login</div>
			</q-card-section>
			<q-separator inset />
		</slot>
		<q-card-section class="column auth-field-container">
			<span v-if="show_labels" class="auth-field-input-label">Email</span>
			<q-input
				:dense="props?.dense ?? false"
				id="email"
				name="email"
				label="Email Address *"
				v-model="state.email"
				:rules="[val => validateEmail(val) || 'Must be a valid email.']"
				autocomplete="email"
				:lazy-rules="props?.lazy_rules ?? false">
			</q-input>
			<span v-if="show_labels" class="auth-field-input-label">Password</span>
			<q-input
				:dense="props?.dense ?? false"
				name="password"
				label="Password *"
				v-model="state.password.value"
				:rules="[val => isPasswordValid(state.password) || 'Password must meet all criteria.']"
				id="password"
				autocomplete="current-password"
				filled
				:lazy-rules="props?.lazy_rules ?? false"
				:type="state.password.hidden ? 'password' : 'text'">
				<template v-slot:append>
					<q-icon
						:name="state.password.hidden ? 'visibility' : 'visibility_off'"
						class="cursor-pointer"
						@click="state.password.hidden = !state.password.hidden"
						size="16px" />
				</template>
			</q-input>
		</q-card-section>
		<slot name="actions" :loading="loading">
			<AuthActions
				submit_label="Login"
				:loading="loading"
				:facebook="facebook"
				:adazure="adazure"
				:google="google"
				:linkedin="linkedin"></AuthActions>
		</slot>
	</q-form>
</template>

<style scoped></style>
