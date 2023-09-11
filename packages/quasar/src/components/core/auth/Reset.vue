<script setup lang="ts">
import { reactive, ref } from 'vue'
import { UserStore } from '../../../store/user'
import AuthActions from '@/components/core/auth/Actions.vue'
import OTP from '@/components/core/auth/OTP.vue'
import PasswordCriteria from '@/components/core/auth/PasswordCriteria.vue'
import { validateEmail, isPasswordValid } from '../../../helpers/validators'
import type { ValidationPassword, AuthFormState } from '../../../helpers/validators'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const userStore = UserStore()

const router = useRouter()

const props = defineProps<{
	dense?: boolean
}>()

const state = reactive(<AuthFormState>{
	stage: 0,
	email: '',
	code: '',
	password: <ValidationPassword>{
		value: '',
		confirm: '',
		valid: {
			length: false,
			capital: false,
			number: false,
			symbol: false,
		},
		validated: false,
	},
})

const loading = ref(false)

async function login(state: AuthFormState) {
	loading.value = true
	const sent = await userStore.reset(state.email.trim())
	if (sent) {
		state.stage = 1
	}
	loading.value = false
}

async function processCode(code) {
	state.code = code
	const result = await userStore.resetCode(state.email.trim(), state.code)
	if (result) {
		state.stage = 2
	}
}

async function newEmail(state: AuthFormState) {
	loading.value = true
	const user = await userStore.resetComplete(state.email.trim(), state.code, state.password.value.trim(), $q)
	if (user?.user_id) {
		await router.push('/dashboard')
	}
	loading.value = false
}
</script>

<template>
	<div>
		<q-form autofocus @submit="login(state)" v-if="state.stage === 0">
			<slot name="header">
				<q-card-section>
					<div class="text-h6">Reset Password</div>
				</q-card-section>
				<q-separator inset />
			</slot>

			<q-card-section class="column q-gutter-md">
				<q-input
					:dense="props?.dense ?? false"
					name="email"
					label="Email *"
					v-model="state.email"
					:rules="[val => validateEmail(val) || 'Must be a valid email.']"
					autocomplete="email"></q-input>
			</q-card-section>

			<AuthActions submit_label="Reset Password" :loading="loading"></AuthActions>
		</q-form>
		<q-form autofocus v-else-if="state.stage === 1">
			<q-card-section>
				<div class="text-h6">Verify Account</div>
			</q-card-section>
			<q-separator inset />
			<q-card-section class="column q-mt-md">
				<OTP @complete="processCode"></OTP>
			</q-card-section>

			<q-card-section class="text-center q-pa-sm auth_action_link">
				<router-link to="#" @click="state.stage = 0"><p class="text-grey-6 q-mr-xs">Back</p></router-link>
			</q-card-section>
		</q-form>

		<q-form autofocus @submit="newEmail(state)" v-if="state.stage === 2">
			<q-card-section>
				<div class="text-h6">New Password</div>
			</q-card-section>
			<q-separator inset />
			<q-card-section class="column q-gutter-md">
				<q-input
					:dense="props?.dense ?? false"
					name="new-password"
					label="Password *"
					v-model="state.password.value"
					type="password"
					:rules="[val => isPasswordValid(state.password) || 'Password must meet all criteria.']"
					autocomplete="new-password">
				</q-input>

				<PasswordCriteria :show="true" lazy-rules="ondemand" :auth-form-state="state"></PasswordCriteria>

				<q-input
					:dense="props?.dense ?? false"
					label="Confirm Password *"
					v-model="state.password.confirm"
					:disable="!isPasswordValid(state.password)"
					type="password"
					:rules="[val => (val && val === state.password.value) || 'Must match password.']">
				</q-input>
			</q-card-section>

			<AuthActions submit_label="Update Password" :loading="loading"></AuthActions>
		</q-form>
	</div>
</template>

<style scoped></style>
