<script setup lang="ts">
import { reactive, ref } from 'vue'
import { UserStore } from '../../../store/user'
import AuthActions from './Actions.vue'
import { useRouter, useRoute, Router } from 'vue-router'
import type { AuthFormState } from '../../../helpers'
import { validateEmail, isPasswordValid, logger } from '../../../helpers'
import { goToLoginRedirect } from '../../../helpers'
import { useQuasar } from 'quasar'

import { Strings } from '@juicyllama/vue-utils'
import { completeGoogleLogin, completeLinkedInLogin } from '../../../services/auth'
import { FormViewSettings, LogSeverity, FormViewDesignSettings } from '../../../types'

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
	settings?: FormViewSettings
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

//if there is a prelogin redirect, redirect to it (useful for onboaridng flows, oauth etc)
if(userStore.getPreLoginRedirect){
	window.location.href = userStore.getPreLoginRedirect
}

if (route.query.code) {
	try {
		switch (localStorage.getItem('OAuthType')) {
			case 'google':
				await completeGoogleLogin(route.query, $q)
				break
			case 'linkedin':
				await completeLinkedInLogin(route.query, $q)
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

async function login(state: AuthFormState, router: Router) {
	loading.value = true
	state.email = state.email.trim()
	state.password.value = state.password.value.trim()
	const user = await userStore.login({ email: state.email, password: state.password.value }, $q, router)

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
	<q-form autofocus @submit="login(state, router)">
		<slot name="header">
			<q-card-section class="mobile-hide">
				<div class="text-h6">Login</div>
			</q-card-section>
			<q-separator inset />
		</slot>
		<q-card-section class="column auth-field-container">
			<q-input
				id="email"
				name="email"
				v-model="state.email"
				:rules="[val => validateEmail(val) || 'Must be a valid email.']"
				autocomplete="email"
				:label="!props.settings?.stack_label ? 'Email Address *' : null"
				:dense="props.settings?.dense"
				:counter="props.settings?.counter"
				:hide-bottom-space="props.settings?.hideBottomSpace"
				:lazy-rules="props.settings?.lazy_rules"
				:outlined="props.settings?.design === FormViewDesignSettings.OUTLINED"
				:filled="props.settings?.design === FormViewDesignSettings.FILLED"
				:standout="props.settings?.design === FormViewDesignSettings.STANDOUT"
				:borderless="props.settings?.design === FormViewDesignSettings.BORDERLESS"
				:rounded="props.settings?.design === FormViewDesignSettings.ROUNDED"
				:rounded-filled="props.settings?.design === FormViewDesignSettings.ROUNDED_FILLED"
				:rounded-outlined="props.settings?.design === FormViewDesignSettings.ROUNDED_OUTLINED"
				:rounded-standout="props.settings?.design === FormViewDesignSettings.ROUNDED_STANDOUT"
				:square="props.settings?.design === FormViewDesignSettings.SQUARE"
				:square-filled="props.settings?.design === FormViewDesignSettings.SQUARE_FILLED"
				:square-outlined="props.settings?.design === FormViewDesignSettings.SQUARE_OUTLINED"
				:square-standout="props.settings?.design === FormViewDesignSettings.SQUARE_STANDOUT"
				:no-error-icon="props.settings?.no_error_icon"
				>
			</q-input>
			<q-input
				name="password"
				v-model="state.password.value"
				:rules="[val => isPasswordValid(state.password) || 'Password must meet all criteria.']"
				id="password"
				autocomplete="current-password"
				:label="!props.settings?.stack_label ? 'Password *' : null"
				:dense="props.settings?.dense"
				:counter="props.settings?.counter"
				:hide-bottom-space="props.settings?.hideBottomSpace"
				:lazy-rules="props.settings?.lazy_rules"
				:outlined="props.settings?.design === FormViewDesignSettings.OUTLINED"
				:filled="props.settings?.design === FormViewDesignSettings.FILLED"
				:standout="props.settings?.design === FormViewDesignSettings.STANDOUT"
				:borderless="props.settings?.design === FormViewDesignSettings.BORDERLESS"
				:rounded="props.settings?.design === FormViewDesignSettings.ROUNDED"
				:rounded-filled="props.settings?.design === FormViewDesignSettings.ROUNDED_FILLED"
				:rounded-outlined="props.settings?.design === FormViewDesignSettings.ROUNDED_OUTLINED"
				:rounded-standout="props.settings?.design === FormViewDesignSettings.ROUNDED_STANDOUT"
				:square="props.settings?.design === FormViewDesignSettings.SQUARE"
				:square-filled="props.settings?.design === FormViewDesignSettings.SQUARE_FILLED"
				:square-outlined="props.settings?.design === FormViewDesignSettings.SQUARE_OUTLINED"
				:square-standout="props.settings?.design === FormViewDesignSettings.SQUARE_STANDOUT"
				:no-error-icon="props.settings?.no_error_icon"
				:type="state.password.hidden ? 'password' : 'text'"
				>
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
